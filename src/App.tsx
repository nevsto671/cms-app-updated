import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NAICSCodes from './pages/NAICSCodes';
import PSCCodes from './pages/PSCCodes';
import SINCodes from './pages/SINCodes';
import SIC from './pages/SIC';
import ClassificationDashboard from './pages/ClassificationDashboard';
import CodeRelationships from './pages/CodeRelationships';
import Administration from './pages/Administration';
import Catalog from './pages/Catalog';
import WorkflowAllocator from './pages/WorkflowAllocator';
import MRAS from './pages/MRAS';
import FileCabinet from './pages/FileCabinet';
import DocTagCentral from './pages/DocTagCentral';
import ContractAdministration from './pages/ContractAdministration';
import PriceAnalysis from './pages/PriceAnalysis';
import { supabase } from './lib/supabase';
import './App.css';

function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Enhanced session check
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setIsAuthenticated(false);
          setLoading(false);
          navigate('/login');
          return;
        }

        if (!session) {
          setIsAuthenticated(false);
          setLoading(false);
          navigate('/login');
          return;
        }

        // Verify token is not close to expiration
        const tokenExpiry = new Date(session.expires_at! * 1000);
        const now = new Date();
        const timeUntilExpiry = tokenExpiry.getTime() - now.getTime();
        
        if (timeUntilExpiry < 5 * 60 * 1000) { // Less than 5 minutes until expiry
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            console.error('Session refresh failed:', refreshError);
            setIsAuthenticated(false);
            navigate('/login');
            return;
          }
        }

        setIsAuthenticated(true);
      } catch (err) {
        console.error('Session check failed:', err);
        setIsAuthenticated(false);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Enhanced auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED' || (event === 'TOKEN_REFRESHED' && !session)) {
        setIsAuthenticated(false);
        navigate('/login');
        await supabase.auth.signOut();
      } else if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1222] flex items-center justify-center">
        <div className="text-[#8B9CC8]">Loading...</div>
      </div>
    );
  }

  return children;
}

function App() {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Something went wrong</h2>
            <p className="mt-2 text-gray-600">Please refresh the page to try again</p>
          </div>
        </div>
      }
    >
      <Router>
        <AuthProvider>
          <Routes>
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/register"
              element={<Register />}
            />
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/classification-dashboard" element={<ClassificationDashboard />} />
                    <Route path="/workflow-allocator" element={<WorkflowAllocator />} />
                    <Route path="/naics-codes" element={<NAICSCodes />} />
                    <Route path="/psc-codes" element={<PSCCodes />} />
                    <Route path="/psc-codes/sic" element={<SIC />} />
                    <Route path="/sin-codes" element={<SINCodes />} />
                    <Route path="/code-relationships" element={<CodeRelationships />} />
                    <Route path="/administration" element={<Administration />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/mras" element={<MRAS />} />
                    <Route path="/file-cabinet" element={<FileCabinet />} />
                    <Route path="/doctag-central" element={<DocTagCentral />} />
                    <Route path="/contract-administration" element={<ContractAdministration />} />
                    <Route path="/price-analysis" element={<PriceAnalysis />} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;