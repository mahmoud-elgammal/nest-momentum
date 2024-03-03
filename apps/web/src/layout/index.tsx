import { React } from 'react';
import Header from './Header';

const Layout: React.FC<React.HTMLAttributes<unknown>> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;
