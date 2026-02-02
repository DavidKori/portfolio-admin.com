import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { UnreadProvider } from './context/unreadContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Loader from './components/Loader';
import './styles/global.css';
import './styles/theme.css';

// Lazy load components
const Landing = lazy(() => import('./auth/Landing'));
const Login = lazy(() => import('./auth/Login'));
const DashboardLayout = lazy(() => import('./dashboard/DashboardLayout'));
const DashboardHome = lazy(() => import('./dashboard/DashboardHome'));

// Section components
const Profile = lazy(() => import('./sections/Profile'));
const About = lazy(() => import('./sections/About'));
const Skills = lazy(() => import('./sections/Skills'));
const Projects = lazy(() => import('./sections/Projects'));
const Achievements = lazy(() => import('./sections/Achievements'));
const Education = lazy(() => import('./sections/Education'));
const Certifications = lazy(() => import('./sections/Certifications'));
const Experience = lazy(() => import('./sections/Experience'));
const Blogs = lazy(() => import('./sections/Blogs'));
const Testimonials = lazy(() => import('./sections/Testimonials'));
const Resume = lazy(() => import('./sections/Resume'));
const Contact = lazy(() => import('./sections/Contact'));
const SocialLinks = lazy(() => import('./sections/SocialLinks'));
const Messages = lazy(() => import('./sections/Messages'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <UnreadProvider>
          
            <Suspense fallback={<Loader fullscreen />}>

              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                
                {/* Protected dashboard routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardLayout/>
                  </ProtectedRoute>
                }>
                  <Route index element={<DashboardHome />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="about" element={<About />} />
                  <Route path="skills" element={<Skills />} />
                  <Route path="projects" element={<Projects />} />
                  <Route path="achievements" element={<Achievements />} />
                  <Route path="education" element={<Education />} />
                  <Route path="certifications" element={<Certifications />} />
                  <Route path="experience" element={<Experience />} />
                  <Route path="blogs" element={<Blogs />} />
                  <Route path="testimonials" element={<Testimonials />} />
                  <Route path="resume" element={<Resume />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="social-links" element={<SocialLinks />} />
                  <Route path="messages" element={<Messages />} />
                </Route>
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </UnreadProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
