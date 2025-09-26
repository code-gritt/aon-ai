import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./sections/Header.jsx";
import Hero from "./sections/Hero.jsx";
import Features from "./sections/Features.jsx";
import Pricing from "./sections/Pricing.jsx";
import Faq from "./sections/Faq.jsx";
import Testimonials from "./sections/Testimonial.jsx";
import Download from "./sections/Download.jsx";
import Footer from "./sections/Footer.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";

// Home Page Component
const Home = () => (
  <main className="overflow-hidden">
    <Header />
    <Hero />
    <Features />
    <Pricing />
    <Faq />
    <Testimonials />
    <Download />
    <Footer />
  </main>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </Router>
  );
};

export default App;
