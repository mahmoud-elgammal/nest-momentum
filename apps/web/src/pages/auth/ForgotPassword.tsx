import React, { useState } from 'react';
import { Card, Form, TextField, Button, Page } from '@shopify/polaris';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleForgotPassword = () => {
    // Send a reset password link to the provided email (you should implement this logic)
    // For demonstration purposes, just toggle emailSent state
    setEmailSent(true);
  };

  return (
    <Page title="Forgot Password">
      <Card>
        {emailSent ? (
          <p>Check your email for the password reset link.</p>
        ) : (
          <Form onSubmit={handleForgotPassword}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(value) => setEmail(value)}
              autoComplete="false"
            />
            <Button variant="primary" submit>
              Send Reset Link
            </Button>
          </Form>
        )}
      </Card>
    </Page>
  );
};

export default ForgotPassword;
