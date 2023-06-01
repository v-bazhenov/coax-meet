from django.core import mail
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from authentication.models import User


class EmailVerificationTest(APITestCase):
    # endpoints needed

    register_url = reverse("auth:users-list")
    activate_url = reverse("auth:users-activation")
    login_url = reverse("auth:login")
    user_details_url = reverse("auth:users-me")
    resend_verification_url = reverse("auth:users-resend-activation")

    # user infofmation
    user_data = {
        "email": "test@example.com",
        "password": "verysecret",
        "first_name": "jon",
        "last_name": "doe",
    }

    login_data = {
        "email": "test@example.com",
        "password": "verysecret"
    }

    def setUp(self):
        self.user = User.objects.create_user(password='2314152x8', email='b@b.com', first_name='b', last_name='b')

    def test_register_with_email_verification(self):
        # register the new user
        response = self.client.post(self.register_url, self.user_data)

        # parse email to get uid and token
        email_lines = mail.outbox[0].body.splitlines()
        # you can print email to check it
        activation_link = [l for l in email_lines if "/activate/" in l][0]
        uid, token = activation_link.split("/")[-2:]

        # verify email
        data = {"uid": uid, "token": token}
        response = self.client.post(self.activate_url, data)

        # login to get the authentication token
        response = self.client.post(self.login_url, self.login_data)
        token = response.json()["access"]

        # set token in the header
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

        # get user details
        response = self.client.get(self.user_details_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['email'], self.user_data["email"])

    def test_user_list_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.register_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_resend_verification(self):
        # register the new user
        response = self.client.post(self.register_url, self.user_data)
        # expected response
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # resend the verification email
        data = {"email": self.user_data["email"]}
        response = self.client.post(self.resend_verification_url, data)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_resend_verification_wrong_email(self):
        # register the new user
        response = self.client.post(self.register_url, self.user_data)
        # expected response
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # resend the verification email but with WRONG email
        data = {"email": self.user_data["email"] + "_this_email_is_wrong"}
        response = self.client.post(self.resend_verification_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_activate_with_wrong_uid_token(self):
        # register the new user
        response = self.client.post(self.register_url, self.user_data)
        # expected response
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # verify the email with wrong data
        data = {"uid": "wrong-uid", "token": "wrong-token"}
        response = self.client.post(self.activate_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_str_method_user(self):
        self.assertEqual(str(self.user), self.user.email)


class PasswordResetTest(APITestCase):
    # endpoints needed
    register_url = reverse("auth:users-list")
    activate_url = reverse("auth:users-activation")
    login_url = reverse("auth:login")
    send_reset_password_email_url = reverse("auth:users-reset-password")
    confirm_reset_password_url = reverse("auth:users-reset-password-confirm")

    # user infofmation
    user_data = {
        "email": "test@example.com",
        "password": "verysecret",
        "first_name": "jon",
        "last_name": "doe",
    }
    login_data = {
        "email": "test@example.com",
        "password": "verysecret"
    }

    def test_reset_password(self):
        # register the new user
        response = self.client.post(self.register_url, self.user_data)

        # parse email to get uid and token
        email_lines = mail.outbox[0].body.splitlines()
        activation_link = [l for l in email_lines if "/activate/" in l][0]
        uid, token = activation_link.split("/")[-2:]

        # verify email
        data = {"uid": uid, "token": token}
        response = self.client.post(self.activate_url, data)

        # reset password
        data = {"email": self.user_data["email"]}
        response = self.client.post(self.send_reset_password_email_url, data)

        # parse reset-password email to get uid and token
        # it is a second email!
        email_lines = mail.outbox[1].body.splitlines()
        reset_link = [l for l in email_lines if "/reset_password/" in l][0]
        uid, token = activation_link.split("/")[-2:]

        # confirm reset password
        data = {"uid": uid, "token": token, "new_password": "new_verysecret"}
        response = self.client.post(self.confirm_reset_password_url, data)

        # login to get the authentication token with new password
        login_data = dict(self.login_data)
        login_data["password"] = "new_verysecret"
        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # login to get the authentication token with old password
        response = self.client.post(self.login_url, self.login_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_reset_password_inactive_user(self):
        # register the new user
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # reset password for inactive user
        data = {"email": self.user_data["email"]}
        response = self.client.post(self.send_reset_password_email_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # the email wasnt send
        self.assertEqual(len(mail.outbox), 1)

    def test_reset_password_wrong_email(self):
        data = {"email": "wrong@email.com"}
        response = self.client.post(self.send_reset_password_email_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # the email wasnt send
        self.assertEqual(len(mail.outbox), 0)


class CustomAccountManagerTest(APITestCase):
    user_data = {
        "email": "test@example.com",
        "password": "verysecret",
        "first_name": "jon",
        "last_name": "doe",
    }

    def test_create_superuser(self):
        user = User.objects.create_superuser(**self.user_data)
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        self.assertTrue(user.is_active)
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)
