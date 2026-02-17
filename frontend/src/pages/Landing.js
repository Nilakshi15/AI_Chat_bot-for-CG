import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, TrendingUp, Map, MessageCircle, ArrowRight, CheckCircle, Target, Award } from "lucide-react";
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
