import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage, LoginPage, NotFound, RegisterPage } from './pages';
import Layout from './layout';
import { useUser } from './hooks';

const Router = () => {
  const { isAuthenticated, loaded } = useUser();

  if (!loaded) return <p>loading...</p>;

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <HomePage /> : <LoginPage />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default Router;
