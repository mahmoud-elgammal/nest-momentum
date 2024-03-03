import React, { useState } from 'react';
import {
  Page,
  Card,
  Form,
  TextField,
  Button,
  Layout,
  FormLayout,
  Link,
} from '@shopify/polaris';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignupSubmit = () => {
    // Handle signup logic here
    console.log('Signup - Email:', email);
    console.log('Signup - Password:', password);
  };

  return (
    <Page
      title="Sign Up"
      subtitle="Create your account to access our premium features."
    >
      <Layout>
        <Layout.Section>
          <Card>
            <Form onSubmit={handleSignupSubmit}>
              <Layout.Section>
                <FormLayout>
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(value) => setEmail(value)}
                    autoComplete="false"
                  />
                  <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(value) => setPassword(value)}
                    autoComplete="false"
                  />
                  <Button variant="primary" submit fullWidth>
                    Create Account
                  </Button>
                </FormLayout>
              </Layout.Section>
            </Form>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <p>Already have an account?</p>
            <p>
              Log in{' '}
              <Link url="/login">
                <strong>here</strong>
              </Link>
              .
            </p>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default RegisterPage;
