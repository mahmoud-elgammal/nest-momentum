import React from 'react';
import { Page, Layout, Button } from '@shopify/polaris';
import { useUser } from '../hooks';
import { fetcher } from '../libs/fetcher.lib';
// import { HomeMajor, ProductsMajor } from '@shopify/polaris-icons';

const Header = () => {
  const { isAuthenticated } = useUser();

  const logout = async () => {
    await fetcher.get('auth/logout');
    window.location.href = '/';
  };

  return (
    <header>
      <Page>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Layout.Section>
            <Layout>
              <Layout.Section>Ora</Layout.Section>
            </Layout>
          </Layout.Section>
          <Layout.Section>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'end',
                columnGap: 18,
              }}
            >
              {isAuthenticated ? (
                <Button onClick={logout}>log out</Button>
              ) : (
                <>
                  <p>Login</p>
                  <p>Register</p>
                </>
              )}
            </div>
          </Layout.Section>
        </div>
      </Page>
    </header>
  );
};

export default Header;
