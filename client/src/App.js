import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FeaturePage from './pages/FeaturePage';
import AssessmentRunner from './pages/AssessmentRunner';
import AIHistory from './pages/AIHistory';
import AdvancedAITools from './pages/AdvancedAITools';
import Layout from './components/Layout';
import ReagentDepletionPlanner from './pages/ReagentDepletionPlanner';

import CodexCustomVizFeature from './pages/CodexCustomVizFeature';
import CodexOperationsFeature from './pages/CodexOperationsFeature';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/codex/custom-viz" element={<CodexCustomVizFeature />} />
        <Route path="/codex/operations" element={<CodexOperationsFeature />} />

          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="feature/:featureKey" element={<FeaturePage />} />
            <Route path="assessments/:id/take" element={<AssessmentRunner />} />
            <Route path="ai-history" element={<AIHistory />} />
            <Route path="advanced-ai" element={<AdvancedAITools />} />
            <Route path="reagent-depletion-planner" element={<ReagentDepletionPlanner />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
