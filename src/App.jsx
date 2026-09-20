import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ScrollManager from "./components/ScrollManager.jsx";
import Home from "./pages/Home.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import NotFound from "./pages/NotFound.jsx";
import Admin from "./pages/Admin.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";

export default function App() {
  return (
    <>
      <ScrollManager />
      <Navbar />
      <main>
        <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/projects/:slug" element={<ProjectDetail />} />

  <Route path="/admin/login" element={<AdminLogin />} />

  <Route
    path="/admin"
    element={
      <AdminProtectedRoute>
        <Admin />
      </AdminProtectedRoute>
    }
  />

  <Route path="*" element={<NotFound />} />
</Routes>
      </main>
      <Footer />
    </>
  );
}