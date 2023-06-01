from celery import shared_task
from django.core.mail import EmailMessage


@shared_task
def send_text_mail(subject: str, text_content: str, from_email: str, to_mail: str) -> None:
    """ Task to send an email with given data """
    msg = EmailMessage(subject, text_content, from_email, to_mail)
    msg.send()
