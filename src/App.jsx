import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/lib/AuthContext';
import { queryClientInstance } from '@/lib/query-client';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import DealDetail from '@/pages/DealDetail';
import CategoryPage from '@/pages/CategoryPage';
import Admin from '@/pages/Admin';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Disclosure from '@/pages/Disclosure';

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth routes (no layout) */}
            <Route path="/login"           element={<Login />} />
            <Route path="/register"        element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password"  element={<ResetPassword />} />

            {/* App routes (with layout) */}
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/"              element={<Home />} />
                  <Route path="/deal/:id"       element={<DealDetail />} />
                  <Route path="/category/:slug" element={<CategoryPage />} />
                  <Route path="/admin"          element={<Admin />} />
                  <Route path="/disclosure"     element={<Disclosure />} />
                </Routes>
              </Layout>
            } />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
