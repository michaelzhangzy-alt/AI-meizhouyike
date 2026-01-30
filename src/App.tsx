
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import ScrollToTop from './components/layout/ScrollToTop';
import { PublicLayout } from './components/layout/PublicLayout';

// Admin Imports
import AdminLayout from './components/layout/AdminLayout';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Leads from './pages/admin/Leads';
import MemberManagement from './pages/admin/MemberManagement';
import Teachers from './pages/admin/Teachers';
import TeacherEditor from './pages/admin/TeacherEditor';
import Courses from './pages/admin/Courses';
import CourseEditor from './pages/admin/CourseEditor';
import Articles from './pages/admin/Articles';
import ArticleEditor from './pages/admin/ArticleEditor';
import ShareConfig from './pages/admin/ShareConfig';
import SiteConfig from './pages/admin/SiteConfig';
import { useAuthStore } from './store/useAuthStore';
import { useWeChatShare } from './hooks/useWeChatShare';

function AppContent() {
  const { initialize } = useAuthStore();
  useWeChatShare();

  useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/weekly-class" element={<CourseDetail />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="members" element={<MemberManagement />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="teachers/new" element={<TeacherEditor />} />
          <Route path="teachers/edit/:id" element={<TeacherEditor />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/new" element={<CourseEditor />} />
          <Route path="courses/edit/:id" element={<CourseEditor />} />
          <Route path="articles" element={<Articles />} />
          <Route path="articles/new" element={<ArticleEditor />} />
          <Route path="articles/edit/:id" element={<ArticleEditor />} />
          <Route path="share-config" element={<ShareConfig />} />
          <Route path="site-config" element={<SiteConfig />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
