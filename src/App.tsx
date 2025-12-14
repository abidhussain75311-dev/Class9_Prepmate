
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReloadPrompt from './components/ReloadPrompt';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageSubjects from './pages/admin/ManageSubjects';
import ManageChapters from './pages/admin/ManageChapters';
import QuestionEditor from './pages/admin/QuestionEditor';
import StudentDashboard from './pages/student/StudentDashboard';
import ChapterSelect from './pages/student/ChapterSelect';
import MCQRunner from './pages/student/MCQRunner';
import SubjectiveView from './pages/student/SubjectiveView';
import Analytics from './pages/student/Analytics';
import AdminLogin from './pages/admin/AdminLogin';
import AdminSettings from './pages/admin/AdminSettings';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminLayout from './components/AdminLayout';
import LandingPage from './pages/LandingPage';
import StudentLogin from './pages/student/StudentLogin';
import StudentSignup from './pages/student/StudentSignup';

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          {/* Landing Page - Standalone */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/signup" element={<StudentSignup />} />

          {/* Main App Layout */}
          <Route element={<Layout />}>
            <Route path="student" element={<StudentDashboard />} />
            <Route path="student/analytics" element={<Analytics />} />
            <Route path="student/subjects/:subjectId" element={<ChapterSelect />} />
            <Route path="student/subjects/:subjectId/chapters/:chapterId/mcq" element={<MCQRunner />} />
            <Route path="student/subjects/:subjectId/chapters/:chapterId/subjective" element={<SubjectiveView />} />

            {/* Admin Login Route - Public */}
            <Route path="admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route path="admin" element={<ProtectedAdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="subjects" element={<ManageSubjects />} />
                <Route path="subjects/:subjectId" element={<ManageChapters />} />
                <Route path="subjects/:subjectId/chapters/:chapterId/questions" element={<QuestionEditor />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>
          </Route>
        </Routes>
        <ReloadPrompt />
      </Router>
    </DataProvider>
  );
}

export default App;
