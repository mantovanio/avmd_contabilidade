import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AuthLayout } from './components/auth/AuthLayout';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import Dashboard from './components/dashboard/Dashboard';
import { LeadDetails } from './components/leads/LeadDetails';
import { ServicosContabeis } from './components/servicos/ServicosContabeis';
import { AppLayout } from './components/layout/AppLayout';
import { KanbanBoard } from './components/kanban';
import './index.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={
            !user ? (
              <AuthLayout title="Bem-vindo de volta" subtitle="Acesse o painel AVMD Contábil">
                <LoginForm />
              </AuthLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            !user ? (
              <AuthLayout title="Criar Conta" subtitle="Comece a gerenciar seus leads hoje">
                <RegisterForm />
              </AuthLayout>
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={user ? <AppLayout><Dashboard /></AppLayout> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/kanban" 
          element={user ? <AppLayout><KanbanBoard /></AppLayout> : <Navigate to="/login" replace />} 
        />
        <Route
          path="/lead/:id"
          element={user ? <AppLayout><LeadDetails /></AppLayout> : <Navigate to="/login" replace />}
        />
        <Route
          path="/servicos"
          element={user ? <AppLayout><ServicosContabeis /></AppLayout> : <Navigate to="/login" replace />}
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
