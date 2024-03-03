import React from 'react';

import enTranslations from '@shopify/polaris/locales/en.json';
import { AppProvider } from '@shopify/polaris';

import Router from './Router';
import '@shopify/polaris/build/esm/styles.css';
import { UserProvider } from './context';

function App() {
  return (
    <UserProvider>
      <AppProvider i18n={enTranslations}>
        <Router />
      </AppProvider>
    </UserProvider>
  );
}

export default App;
