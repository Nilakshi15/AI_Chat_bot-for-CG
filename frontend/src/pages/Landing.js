import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, CheckCircle, MessageCircle, Target, Map, Award, Lightbulb, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
          credentials: 'include'
        });
        if (response.ok) {
          navigate('/dashboard');
        }
      } catch (error) {
        // Not authenticated
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleGetStarted = () => {
    const redirectUrl = window.location.origin + '/dashboard';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070A13]">
        <div className="text-[#7C3AED] font-medium">Loading...</div>
      </div>
    );
  }

  const features = [
    {
      icon: MessageCircle,
      title: "AI Career Mentor",
      description: "Have meaningful conversations with an intelligent AI mentor that understands your unique goals, interests, and challenges. Get personalized guidance 24/7.",
      detail: "Our AI mentor learns from millions of career paths to provide you with insights tailored to your situation.",
    },
    {
      icon: Target,
      title: "Career Explorer",
      description: "Discover hundreds of career opportunities across tech, business, creative, healthcare, and more industries with detailed insights and requirements.",
      detail: "Explore salary ranges, growth potential, required skills, and day-to-day responsibilities for each career.",
    },
    {
      icon: Map,
      title: "Learning Roadmaps",
      description: "Get comprehensive step-by-step learning paths with curated resources, timelines, and milestones designed specifically for your experience level.",
      detail: "Visual roadmaps break down complex skills into manageable phases with recommended courses and projects.",
    },
    {
      icon: CheckCircle,
      title: "Skill Assessment",
      description: "Take intelligent assessments to identify your current strengths, areas for improvement, and hidden talents you might not have discovered yet.",
      detail: "Receive detailed reports with actionable recommendations to accelerate your career growth.",
    },
    {
      icon: Lightbulb,
      title: "Smart Recommendations",
      description: "Our AI analyzes your profile, interests, skills, and market trends to suggest careers and opportunities you're most likely to excel in.",
      detail: "Get matched with roles based on personality, skills, market demand, and long-term growth potential.",
    },
    {
      icon: Award,
      title: "Progress Tracking",
      description: "Track your learning journey with visual progress indicators, achievement badges, and milestone celebrations as you advance toward your goals.",
      detail: "Stay motivated with gamified progress tracking and share your achievements with the community.",
    }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Gradient background blur effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600 rounded-full opacity-20 blur-[150px]"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600 rounded-full opacity-15 blur-[120px]"></div>

      {/* Floating Navbar */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-6">
        <nav className="glass-card rounded-full px-8 py-4 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">AI Career Guidance</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Features</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">About</a>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/10 transition-all"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-[#7C3AED]" />
              ) : (
                <Moon className="w-5 h-5 text-[#7C3AED]" />
              )}
            </button>
            <button
              onClick={handleGetStarted}
              className="btn-gradient px-6 py-2.5 rounded-full text-white font-semibold text-sm"
            >
              Sign In
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 text-[#7C3AED]" />
              <span className="text-gray-300">Powered by Advanced AI Technology</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
              <span className="text-white">AI Career Mentor</span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
              Ask me anything about careers, skills, and learning paths
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                data-testid="get-started-btn"
                onClick={handleGetStarted}
                className="btn-gradient px-10 py-4 rounded-xl text-white font-bold"
              >
                Get Started Free
              </button>
            </div>

            <p className="text-sm text-gray-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </p>
          </motion.div>

          {/* Right Content - AI Robot Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[600px] flex items-center justify-center">
              {/* Glow effect behind robot */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED] via-[#A78BFA] to-[#6D28D9] opacity-30 blur-[100px] rounded-full"></div>
              
              {/* Robot placeholder - you can replace with actual image */}
              <div className="relative z-10 floating-anim">
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-[#7C3AED]/20 to-[#A78BFA]/20 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                  <Sparkles className="w-32 h-32 text-[#A78BFA]" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Comprehensive AI-driven tools designed to guide your career journey from exploration to mastery
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card glow-hover rounded-3xl p-8 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-sm text-gray-500 italic">
                      {feature.detail}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-card rounded-[3rem] p-16 md:p-20 text-center relative overflow-hidden"
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/20 to-[#A78BFA]/20 rounded-[3rem]"></div>
            
            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of students and professionals who have discovered their perfect career path with AI-powered guidance
              </p>
              <button
                data-testid="cta-get-started-btn"
                onClick={handleGetStarted}
                className="btn-gradient px-12 py-6 rounded-2xl text-white text-xl font-bold inline-flex items-center gap-3"
              >
                Get Started Now
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-white block">AI Career Guidance</span>
                  <span className="text-sm text-gray-500">Platform</span>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering the next generation with AI-powered career guidance, personalized roadmaps, and intelligent mentorship.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-3">
                {['Features', 'Roadmaps', 'AI Mentor', 'Careers'].map(item => (
                  <li key={item}><a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-3">
                {['About Us', 'Blog', 'Careers', 'Contact'].map(item => (
                  <li key={item}><a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2026 AI Career Guidance. Made by Team Visionary AI.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
