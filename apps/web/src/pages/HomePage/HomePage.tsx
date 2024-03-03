import React, { useEffect, useState } from 'react';
import { Page, Layout, Card, Text } from '@shopify/polaris';
import { useUser } from '../../hooks';
import { fetcher } from '../../libs/fetcher.lib';

const HomePage = () => {
    const {user} = useUser();
    const [sessions, setSessions] = useState([])

  // const sessions = [
  //   { id: 1, device: 'Laptop', location: 'Home', lastActivity: '2024-03-01T12:30:00Z' },
  //   { id: 2, device: 'Mobile', location: 'Office', lastActivity: '2024-03-01T09:45:00Z' },
  // ];

  useEffect(()=> {
    fetcher('auth/sessions')
    .then(res => {
      setSessions(res.data)
    })
  },[])

  return (
    <Page title="Welcome">
      <Layout>
        <Layout.Section>
          <Card>
            <Layout.Section>
              <div>
                <h1>Welcome, {user?.firstName} {user?.lastName}!</h1>
                <p>Email: {user?.email}</p>
              </div>
            </Layout.Section>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <Text as='h2'>Current Sessions</Text>
            <Layout.Section>
              <ul>
                {sessions.map((session, i) => (
                  <li key={`session-${i}`}>
                    <strong>Device:</strong> {session.device}, <strong>Location:</strong> {session.location},{' '}
                    <strong>Last Activity:</strong> {new Date(session.lastActive).toLocaleString()}, {'   '}
                    {session.isCurrent && <strong>(You)</strong>}
                  </li>
                ))}
              </ul>
            </Layout.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default HomePage;
