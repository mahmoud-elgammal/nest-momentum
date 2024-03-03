import React, { useState } from 'react';
import { Page, Layout, Card, Form, TextField, Button } from '@shopify/polaris';

const ProfilePage = () => {
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('********');

  const handleProfileUpdate = () => {
    // Handle profile update logic here
    console.log('Profile Updated - Email:', email);
    console.log('Profile Updated - Password:', password);
  };

  return (
    <Page title="Profile Settings">
      <Layout>
        <Layout.Section>
          <Card>
            <Form onSubmit={handleProfileUpdate}>
              <Layout.Section>
                <Form onSubmit={() => {}}>
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(value) => setEmail(value)}
                    disabled
                    autoComplete="false"
                  />
                  <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(value) => setPassword(value)}
                    autoComplete="false"
                  />
                  <Button variant="primary" submit>
                    Update Profile
                  </Button>
                </Form>
              </Layout.Section>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ProfilePage;
