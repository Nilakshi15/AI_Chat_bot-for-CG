import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, TrendingUp, Map, MessageCircle, ArrowRight, CheckCircle } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <div className="text-indigo-600 font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1758812099689-e7a4e569b325?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMHNvZnQlMjBncmFkaWVudCUyMHNoYXBlJTIwM2QlMjBiYWNrZ3JvdW5kJTIwbWluaW1hbGlzdHxlbnwwfHx8fDE3NzEyMjcwMzN8MA&ixlib=rb-4.1.0&q=85"
            alt="Background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FAFAF9]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Your AI-Powered Career Guide</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Discover Your Dream Career Path
            </h1>

            <p className="text-base md:text-lg text-zinc-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Chat with your personal AI mentor to explore careers, build skills, and get customized learning roadmaps. 
              Start your journey to success today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                data-testid="get-started-btn"
                onClick={handleGetStarted}
                className="group bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-medium shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                data-testid="learn-more-btn"
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-indigo-900 border-2 border-indigo-100 hover:border-indigo-200 px-8 py-4 rounded-full font-medium hover:-translate-y-0.5 transition-all duration-200"
              >
                Learn More
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 max-w-5xl mx-auto"
          >
            <img
              src="https://images.unsplash.com/photo-1573878410167-308f26bc1e33?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHN0dWRlbnQlMjBjb25maWRlbnQlMjBsYXB0b3AlMjBicmlnaHQlMjBtb2Rlcm4lMjB3b3Jrc3BhY2V8ZW58MHx8fHwxNzcxMjI3MDMyfDA&ixlib=rb-4.1.0&q=85"
              alt="Student working"
              className="w-full rounded-3xl shadow-[0_20px_50px_rgb(99,102,241,0.15)]"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">Everything You Need to Succeed</h2>
            <p className="text-base md:text-lg text-zinc-500 max-w-2xl mx-auto">Powerful tools to guide your career journey from exploration to mastery</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <MessageCircle className="w-8 h-8" />,
                title: "AI Career Mentor",
                description: "Chat with an intelligent AI that understands your goals and provides personalized career guidance.",
                color: "indigo"
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Career Explorer",
                description: "Discover careers across tech, business, creative, and healthcare fields with detailed insights.",
                color: "purple"
              },
              {
                icon: <Map className="w-8 h-8" />,
                title: "Learning Roadmaps",
                description: "Get step-by-step learning paths with resources, skills, and timelines tailored to your level.",
                color: "pink"
              },
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: "Skill Assessment",
                description: "Identify your strengths and areas for growth with personalized skill recommendations.",
                color: "lime"
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "Smart Recommendations",
                description: "AI-powered suggestions based on your interests, skills, and career aspirations.",
                color: "indigo"
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Progress Tracking",
                description: "Monitor your learning journey and celebrate milestones as you advance your career.",
                color: "purple"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(99,102,241,0.15)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`text-${feature.color}-600 mb-4`}>{feature.icon}</div>
                <h3 className="text-2xl font-medium mb-3">{feature.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-12 md:p-16 text-white shadow-[0_20px_50px_rgb(99,102,241,0.25)]"
          >
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">Ready to Shape Your Future?</h2>
            <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students discovering their perfect career path with AI guidance
            </p>
            <button
              data-testid="cta-get-started-btn"
              onClick={handleGetStarted}
              className="bg-white text-indigo-600 px-8 py-4 rounded-full font-medium hover:bg-indigo-50 hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center gap-2"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto text-center text-zinc-500 text-sm">
          <p>&copy; 2026 AI Career Mentor. Powered by Emergent.</p>
        </div>
      </footer>
    </div>
  );
}
