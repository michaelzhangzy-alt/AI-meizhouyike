import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/layout/ScrollToTop';
import { useAuthStore } from './store/useAuthStore';
import { useWeChatShare } from './hooks/useWeChatShare';
import { PageLoader } from './components/PageLoader';

// Lazy Load Public Pages
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const News = React.lazy(() => import('./pages/News'));
const NewsDetail = React.lazy(() => import('./pages/NewsDetail'));
const CourseList = React.lazy(() => import('./pages/CourseList'));
const CourseDetail = React.lazy(() => import('./pages/CourseDetail'));
const WeeklyClass = React.lazy(() => import('./pages/WeeklyClass'));
const AiToolsHome = React.lazy(() => import('./features/ai-tools/pages/AiToolsHome'));
const AiToolDetail = React.lazy(() => import('./features/ai-tools/pages/AiToolDetail'));
const FortuneTeller = React.lazy(() => import('./features/ai-tools/components/tools/FortuneTeller').then(module => ({ default: module.FortuneTeller })));
const ConsoleUI = React.lazy(() => import('./components/console/ConsoleUI'));

// Lazy Load Layouts
const PublicLayout = React.lazy(() => import('./components/layout/PublicLayout').then(module => ({ default: module.PublicLayout })));
const AdminLayout = React.lazy(() => import('./components/layout/AdminLayout'));

// Lazy Load Admin Pages
const AdminLogin = React.lazy(() => import('./pages/admin/Login'));
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const Leads = React.lazy(() => import('./pages/admin/Leads'));
const MemberManagement = React.lazy(() => import('./pages/admin/MemberManagement'));
const Teachers = React.lazy(() => import('./pages/admin/Teachers'));
const TeacherEditor = React.lazy(() => import('./pages/admin/TeacherEditor'));
const Courses = React.lazy(() => import('./pages/admin/Courses'));
const CourseEditor = React.lazy(() => import('./pages/admin/CourseEditor'));
const Articles = React.lazy(() => import('./pages/admin/Articles'));
const ArticleEditor = React.lazy(() => import('./pages/admin/ArticleEditor'));
const ShareConfig = React.lazy(() => import('./pages/admin/ShareConfig'));
const SiteConfig = React.lazy(() => import('./pages/admin/SiteConfig'));

function AppContent() {
  const { initialize } = useAuthStore();
  useWeChatShare();

  useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Console UI Root */}
          <Route path="/" element={<ConsoleUI />} />

          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/weekly-class" element={<WeeklyClass />} />
            <Route path="/ai-tools" element={<AiToolsHome />} />
            <Route path="/ai-tools/fortune" element={<FortuneTeller />} />
            <Route path="/ai-tools/:slug" element={<AiToolDetail />} />
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
      </Suspense>
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
