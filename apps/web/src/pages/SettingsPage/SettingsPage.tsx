import React, { useState } from 'react';
import {
  Page,
  Layout,
  Card,
  Form,
  TextField,
  Checkbox,
  Select,
  Button,
} from '@shopify/polaris';

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState('light');
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('********');

  const handleProfileUpdate = () => {
    // Handle profile update logic here
    console.log('Profile Updated - Email:', email);
    console.log('Profile Updated - Password:', password);
  };

  const handleSettingsUpdate = () => {
    // Handle settings update logic here
    console.log('Settings Updated - Notifications:', notifications);
    console.log('Settings Updated - Theme:', theme);
  };

  return (
    <Page title="Settings">
      <Layout>
        <Layout.Section>
          <Card>
            <Form onSubmit={handleProfileUpdate}>
              <Layout.Section>
                <div>
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
                  <Button variant="primary" submit>
                    Update Profile
                  </Button>
                </div>
              </Layout.Section>
            </Form>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <Form onSubmit={handleSettingsUpdate}>
              <Layout.Section>
                <div>
                  <Checkbox
                    label="Receive notifications"
                    checked={notifications}
                    onChange={() => setNotifications(!notifications)}
                  />
                  <Select
                    label="Theme"
                    options={[
                      { label: 'Light', value: 'light' },
                      { label: 'Dark', value: 'dark' },
                    ]}
                    value={theme}
                    onChange={(value) => setTheme(value)}
                  />
                  <Button variant="primary" submit>
                    Save General Settings
                  </Button>
                </div>
              </Layout.Section>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default SettingsPage;
