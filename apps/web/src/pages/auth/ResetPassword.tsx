import React, { useState } from 'react';
import { Card, Form, TextField, Button, Page } from '@shopify/polaris';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = () => {
    // Implement logic to reset the password (you should verify the reset token and update the password)
    console.log('Password Reset Successful');
  };

  return (
    <Page title="Reset Password">
      <Card>
        <Form onSubmit={handleResetPassword}>
          <TextField
            label="New Password"
            type="password"
            value={password}
            onChange={(value) => setPassword(value)}
            autoComplete="false"
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(value) => setConfirmPassword(value)}
            autoComplete="false"
          />
          <Button variant="primary" submit>
            Reset Password
          </Button>
        </Form>
      </Card>
    </Page>
  );
};

export default ResetPassword;
