import React, { Component } from 'react';
import { Formik, Form } from 'formik';
import { Redirect } from 'react-router-dom';

// Material UI components
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';

// Utility components, functions, constants, objects...
import {
  FormikUIField,
  registerValidationSchema,
  RouterUILink,
} from '../utilities';
import formStyles from './form_styles';
import axios from "axios";
import {BASE_API_URL} from "../utilities/CONSTANTS.jsx";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverErrors: '',
      showActivationMessage: false, // Add state variable for activation message
    };
    this.onSubmitRegisterForm = this.onSubmitRegisterForm.bind(this);
  }

  // Submission form
  onSubmitRegisterForm(data) {
    const { t } = this.props;
    const userData = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
    };
    const {
      printFeedback,
    } = this.props;

    // Sends post requests
    axios.post(`${BASE_API_URL}auth/users/`, userData)
      .then(() => {
        printFeedback({
          type: 'success',
          feedbackMsg: t('Please check your email and follow the instructions to activate your account.'),
        });

        this.setState({ showActivationMessage: true }); // Set showActivationMessage to true
      })
      .catch((error) => {

        // Server error is set to state to display down in component
        if (error.response) {
          this.setState({
            serverErrors: Object.values(error.response.data),
          });
        }
      });
  }

  render() {
    const { classes, t } = this.props;
    const { showActivationMessage } = this.state; // Get the value of showActivationMessage

    if (showActivationMessage) {
      return (
        <div className={classes.formPaper}>
          <Typography align="center" variant="h3">
            {t('We sent an activation email')}
          </Typography>
          <Typography align="center" variant="body1">
            {t(
              'Please check your email and follow the instructions to activate your account.'
            )}
          </Typography>
          <Redirect to="/" /> {/* Redirect to '/' */}
        </div>
      );
    }

    let initialValues = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmation: '',
    };
    return (
      <Paper className={classes.formPaper} elevation={3}>
        <Formik
          initialValues={initialValues}
          onSubmit={this.onSubmitRegisterForm}
          validationSchema={registerValidationSchema}
        >
          {({ dirty, isValid, errors, touched }) => (
            <Form>
              <Typography align="center" variant="h3">
                {t('Register')}
              </Typography>

              <div className={classes.fullName}>
                {/* First Name */}
                <FormikUIField
                  fullWidth
                  name="firstName"
                  label={t('First Name')}
                  type="text"
                  required
                  error={errors.firstName && touched.firstName}
                />

                {/* Last Name */}
                <FormikUIField
                  fullWidth
                  name="lastName"
                  label={t('Last Name')}
                  type="text"
                  required
                  error={errors.lastName && touched.lastName}
                />
              </div>

              {/* Email */}
              <FormikUIField
                name="email"
                label={t('Email')}
                type="email"
                fullWidth
                required
                error={errors.email && touched.email}
              />
              <FormikUIField
                name="password"
                label={t('Password')}
                type="password"
                fullWidth
                required
                error={errors.password && touched.password}
              />
              <FormHelperText>
                {t('Your password can’t be too similar to your other personal information.')}
              </FormHelperText>
              <FormHelperText>
                {t('Your password must contain at least 8 characters.')}
              </FormHelperText>
              <FormHelperText>
                {t('Your password can’t be a commonly used password.')}
              </FormHelperText>
              <FormHelperText>
                {t('Your password can’t be entirely numeric.')}
              </FormHelperText>

              {/* Password */}
              <FormikUIField
                name="confirmation"
                label={t('Confirm Password')}
                type="password"
                fullWidth
                required
                error={errors.confirmation && touched.confirmation}
              />
              <FormHelperText>
                {t('Enter the same password as before, for verification.')}
              </FormHelperText>
              {/* Server Errors */}
              {this.state.serverErrors
                ? this.state.serverErrors.map((error, index) => (
                    <FormHelperText key={index} error>
                      {error}
                    </FormHelperText>
                  ))
                : null}

              {/* Register Button */}
              <Button
                fullWidth
                className={classes.formButton}
                type="submit"
                variant="contained"
                color="primary"
                disabled={!dirty || !isValid}
              >
                {t('Register')}
              </Button>

              {/* Link to Login page */}
              <Typography display="block" variant="caption">
                {t('Already have an account?')}{' '}
                <RouterUILink linkTo="/login" innerText={t('Log in')} />
              </Typography>
            </Form>
          )}
        </Formik>
      </Paper>
    );
  }
}

export default withTranslation()(withStyles(formStyles)(Register));
