import React from 'react';
import { Page, Layout, Card } from '@shopify/polaris';

const NotFoundPage = () => {
  return (
    <Page title="404 Not Found">
      <Layout>
        <Layout.Section>
          <Card>
            <p>Oops!</p>
            <p>The page you're looking for might be lost in space.</p>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default NotFoundPage;
