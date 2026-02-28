import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminLayout } from '../layouts/AdminLayout';
import { EmployeeLayout } from '../layouts/EmployeeLayout';
import LoginPage from '../pages/LoginPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminTaskList from '../pages/admin/AdminTaskList';
import AdminTaskReview from '../pages/admin/AdminTaskReview';
import AdminEmployeeList from '../pages/admin/AdminEmployeeList';
import AdminEmployeeDetail from '../pages/admin/AdminEmployeeDetail';
import AdminSkillMatrix from '../pages/admin/AdminSkillMatrix';
import AdminTeamView from '../pages/admin/AdminTeamView';
import AdminTechStack from '../pages/admin/AdminTechStack';
import AdminProfile from '../pages/admin/AdminProfile';
import TechStackMembers from '../pages/admin/TechStackMembers';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import EmployeeSubmitTask from '../pages/employee/EmployeeSubmitTask';
import EmployeeTaskHistory from '../pages/employee/EmployeeTaskHistory';
import EmployeeTaskDetail from '../pages/employee/EmployeeTaskDetail';
import EmployeeFeedback from '../pages/employee/EmployeeFeedback';
import EmployeeProfile from '../pages/employee/EmployeeProfile';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'tasks', element: <AdminTaskList /> },
      { path: 'tasks/:taskId', element: <AdminTaskReview /> },
      { path: 'employees', element: <AdminEmployeeList /> },
      { path: 'employees/:empId', element: <AdminEmployeeDetail /> },
      { path: 'teams', element: <AdminTeamView /> },
      { path: 'tech-stack', element: <AdminTechStack /> },
      { path: 'tech-stack-members', element: <TechStackMembers /> },
      { path: 'skill-matrix', element: <AdminSkillMatrix /> },
      { path: 'analytics', element: <AdminAnalytics /> },
      { path: 'profile', element: <AdminProfile /> },
    ],
  },
  {
    path: '/employee',
    element: (
      <ProtectedRoute allowedRole="employee">
        <EmployeeLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/employee/dashboard" replace /> },
      { path: 'dashboard', element: <EmployeeDashboard /> },
      { path: 'submit', element: <EmployeeSubmitTask /> },
      { path: 'tasks', element: <EmployeeTaskHistory /> },
      { path: 'tasks/:taskId', element: <EmployeeTaskDetail /> },
      { path: 'feedback', element: <EmployeeFeedback /> },
      { path: 'profile', element: <EmployeeProfile /> },
    ],
  },
]);
