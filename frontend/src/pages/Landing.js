import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, TrendingUp, Map, MessageCircle, ArrowRight, CheckCircle, Target, Award, Linkedin, Twitter, Github, Mail, BookOpen, Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Landing() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
          credentials: 'include'
        });
        if (response.ok) {
          navigate('/dashboard');
        }
      } catch (error) {
        // Not authenticated, stay on landing
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleGetStarted = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/dashboard';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-indigo-600 font-medium">Loading...</div>
      </div>
    );
  }

  const features = [
    {
      icon: MessageCircle,
      title: "AI Career Mentor",
      description: "Have meaningful conversations with an intelligent AI mentor that understands your unique goals, interests, and challenges. Get personalized guidance 24/7.",
      detail: "Our AI mentor learns from millions of career paths to provide you with insights tailored to your situation.",
      gradient: "from-blue-500 to-cyan-500",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop"
    },
    {
      icon: Target,
      title: "Career Explorer",
      description: "Discover hundreds of career opportunities across tech, business, creative, healthcare, and more industries with detailed insights and requirements.",
      detail: "Explore salary ranges, growth potential, required skills, and day-to-day responsibilities for each career.",
      gradient: "from-purple-500 to-pink-500",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"
    },
    {
      icon: Map,
      title: "Learning Roadmaps",
      description: "Get comprehensive step-by-step learning paths with curated resources, timelines, and milestones designed specifically for your experience level.",
      detail: "Visual roadmaps break down complex skills into manageable phases with recommended courses and projects.",
      gradient: "from-orange-500 to-red-500",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop"
    },
    {
      icon: CheckCircle,
      title: "Skill Assessment",
      description: "Take intelligent assessments to identify your current strengths, areas for improvement, and hidden talents you might not have discovered yet.",
      detail: "Receive detailed reports with actionable recommendations to accelerate your career growth.",
      gradient: "from-emerald-500 to-teal-500",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop"
    },
    {
      icon: Lightbulb,
      title: "Smart Recommendations",
      description: "Our AI analyzes your profile, interests, skills, and market trends to suggest careers and opportunities you're most likely to excel in.",
      detail: "Get matched with roles based on personality, skills, market demand, and long-term growth potential.",
      gradient: "from-amber-500 to-yellow-500",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop"
    },
    {
      icon: Award,
      title: "Progress Tracking",
      description: "Track your learning journey with visual progress indicators, achievement badges, and milestone celebrations as you advance toward your goals.",
      detail: "Stay motivated with gamified progress tracking and share your achievements with the community.",
      gradient: "from-pink-500 to-rose-500",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header with glassmorphism */}
      <header className="relative z-50 border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Emergent</span>
              <p className="text-xs text-gray-400">AI Career Guidance</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Features</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">About</a>
            <button
              onClick={handleGetStarted}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              Sign In
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Floating badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>Powered by Advanced AI Technology</span>
            </div>

            {/* Main headline with gradient */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-tight">
              <span className="block text-white">Shape Your Future</span>
              <span className="block mt-3 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                With AI Mentorship
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Get personalized career guidance, interactive skill roadmaps, and AI-powered 
              recommendations to discover your perfect career path
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                data-testid="get-started-btn"
                onClick={handleGetStarted}
                className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white text-lg font-bold shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center gap-3">
                  Start Free Today
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </button>
              <button
                data-testid="learn-more-btn"
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white text-lg font-semibold hover:bg-white/20 transition-all duration-300"
              >
                Explore Features
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-purple-400" />
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-pink-400" />
                <span>AI-Powered Insights</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
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
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Comprehensive AI-driven tools designed to guide your career journey from exploration to mastery
              </p>
            </motion.div>
          </div>

          {/* Feature cards grid */}
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
                  className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-white/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Feature image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                    
                    {/* Icon badge */}
                    <div className={`absolute top-4 right-4 w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative p-8">
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm text-gray-400 italic">
                        {feature.detail}
                      </p>
                    </div>

                    {/* Glow effect on hover */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`}></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-purple-600 to-pink-600 rounded-[3rem] p-16 md:p-20 text-center shadow-2xl"
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of students and professionals who have discovered their perfect career path with AI-powered guidance
              </p>
              <button
                data-testid="cta-get-started-btn"
                onClick={handleGetStarted}
                className="group px-12 py-6 rounded-2xl bg-white text-purple-600 text-xl font-bold shadow-2xl hover:shadow-white/50 hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
              >
                Get Started Now
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-white/5 backdrop-blur-xl py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">Emergent</span>
                  <span className="text-sm text-gray-400">AI Career Guidance Platform</span>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering the next generation with AI-powered career guidance, personalized roadmaps, and intelligent mentorship.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300">
                  <Twitter className="w-5 h-5 text-gray-400" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300">
                  <Linkedin className="w-5 h-5 text-gray-400" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-pink-500/50 transition-all duration-300">
                  <Github className="w-5 h-5 text-gray-400" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300">
                  <Mail className="w-5 h-5 text-gray-400" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                Product
              </h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Roadmaps</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AI Mentor</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Company
              </h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              &copy; 2026 Emergent. All rights reserved. Powered by AI.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
          credentials: 'include'
        });
        if (response.ok) {
          navigate('/dashboard');
        }
      } catch (error) {
        // Not authenticated, stay on landing
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleGetStarted = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/dashboard';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-indigo-600 font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-b from-indigo-50/30 via-white to-purple-50/20 pointer-events-none"></div>
      
      {/* Header */}
      <header className="relative z-10 border-b border-zinc-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-zinc-900">Emergent</span>
          </div>
          <button
            onClick={handleGetStarted}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section - Centered & Clean */}
      <section className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Career Guidance</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 mb-6 leading-tight">
              Discover Your Career Path
              <span className="block mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                With AI Mentorship
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="text-lg md:text-xl text-zinc-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Get personalized career guidance, skill roadmaps, and learning paths powered by AI. 
              Start building your future today.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                data-testid="get-started-btn"
                onClick={handleGetStarted}
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                data-testid="learn-more-btn"
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-zinc-900 border-2 border-zinc-200 hover:border-zinc-300 px-8 py-4 rounded-xl font-semibold transition-all duration-200"
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Grid Layout */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
              Powerful AI-driven tools to guide your career journey from exploration to mastery
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MessageCircle,
                title: "AI Career Mentor",
                description: "Chat with an intelligent AI mentor that understands your goals and provides personalized guidance."
              },
              {
                icon: Target,
                title: "Career Explorer",
                description: "Discover career opportunities across tech, business, creative, and healthcare industries."
              },
              {
                icon: Map,
                title: "Learning Roadmaps",
                description: "Get step-by-step learning paths with curated resources and timelines tailored to you."
              },
              {
                icon: CheckCircle,
                title: "Skill Assessment",
                description: "Identify your strengths and growth areas with personalized skill recommendations."
              },
              {
                icon: Sparkles,
                title: "Smart Recommendations",
                description: "AI-powered career suggestions based on your interests, skills, and aspirations."
              },
              {
                icon: Award,
                title: "Progress Tracking",
                description: "Monitor your learning journey and celebrate milestones as you grow professionally."
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                  className="group bg-white border border-zinc-200 rounded-2xl p-8 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 mb-3">{feature.title}</h3>
                  <p className="text-zinc-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Large Rounded Gradient Banner */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl p-12 md:p-16 text-center shadow-2xl shadow-indigo-500/20"
          >
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to Shape Your Future?
              </h2>
              <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of students discovering their perfect career path with AI-powered guidance
              </p>
              <button
                data-testid="cta-get-started-btn"
                onClick={handleGetStarted}
                className="bg-white text-indigo-600 px-10 py-4 rounded-xl font-semibold hover:bg-indigo-50 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center gap-2"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-100 py-12 px-6 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-zinc-700">Emergent — AI Career Guidance</span>
            </div>
            <p className="text-sm text-zinc-500">
              &copy; 2026 Emergent. Powered by AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
