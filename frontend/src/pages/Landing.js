import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, TrendingUp, Map, MessageCircle, ArrowRight, CheckCircle, Target, Award, Linkedin, Twitter, Github, Mail, BookOpen, Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Landing() {
  const navigate = useNavigate();
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
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#EFECE3'}}>
        <div className="font-medium" style={{color: '#4A70A9'}}>Loading...</div>
      </div>
    );
  }

  const features = [
    {
      icon: MessageCircle,
      title: "AI Career Mentor",
      description: "Have meaningful conversations with an intelligent AI mentor that understands your unique goals, interests, and challenges. Get personalized guidance 24/7.",
      detail: "Our AI mentor learns from millions of career paths to provide you with insights tailored to your situation.",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop"
    },
    {
      icon: Target,
      title: "Career Explorer",
      description: "Discover hundreds of career opportunities across tech, business, creative, healthcare, and more industries with detailed insights and requirements.",
      detail: "Explore salary ranges, growth potential, required skills, and day-to-day responsibilities for each career.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"
    },
    {
      icon: Map,
      title: "Learning Roadmaps",
      description: "Get comprehensive step-by-step learning paths with curated resources, timelines, and milestones designed specifically for your experience level.",
      detail: "Visual roadmaps break down complex skills into manageable phases with recommended courses and projects.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop"
    },
    {
      icon: CheckCircle,
      title: "Skill Assessment",
      description: "Take intelligent assessments to identify your current strengths, areas for improvement, and hidden talents you might not have discovered yet.",
      detail: "Receive detailed reports with actionable recommendations to accelerate your career growth.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop"
    },
    {
      icon: Lightbulb,
      title: "Smart Recommendations",
      description: "Our AI analyzes your profile, interests, skills, and market trends to suggest careers and opportunities you're most likely to excel in.",
      detail: "Get matched with roles based on personality, skills, market demand, and long-term growth potential.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop"
    },
    {
      icon: Award,
      title: "Progress Tracking",
      description: "Track your learning journey with visual progress indicators, achievement badges, and milestone celebrations as you advance toward your goals.",
      detail: "Stay motivated with gamified progress tracking and share your achievements with the community.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen" style={{backgroundColor: '#EFECE3'}}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b" style={{backgroundColor: '#EFECE3', borderColor: '#8FABD4'}}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{backgroundColor: '#4A70A9'}}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold" style={{color: '#000000'}}>AI Career Guidance</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:opacity-80 transition-opacity" style={{color: '#000000'}}>Features</a>
            <a href="#about" className="text-sm font-medium hover:opacity-80 transition-opacity" style={{color: '#000000'}}>About</a>
            <button
              onClick={handleGetStarted}
              className="px-6 py-2.5 rounded-xl text-white font-semibold hover:opacity-90 transition-all duration-300"
              style={{backgroundColor: '#4A70A9'}}
            >
              Sign In
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium mb-8" style={{backgroundColor: '#8FABD4', borderColor: '#4A70A9', color: '#000000'}}>
              <Sparkles className="w-4 h-4" />
              <span>Powered by Advanced AI Technology</span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-tight" style={{color: '#000000'}}>
              Shape Your Future
              <span className="block mt-3" style={{color: '#4A70A9'}}>
                With AI Mentorship
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed" style={{color: '#000000', opacity: 0.7}}>
              Get personalized career guidance, interactive skill roadmaps, and AI-powered 
              recommendations to discover your perfect career path
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                data-testid="get-started-btn"
                onClick={handleGetStarted}
                className="group px-10 py-5 rounded-2xl text-white text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                style={{backgroundColor: '#4A70A9'}}
              >
                <span className="flex items-center gap-3">
                  Start Free Today
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </button>
              <button
                data-testid="learn-more-btn"
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 rounded-2xl border-2 text-lg font-semibold hover:opacity-80 transition-all duration-300"
                style={{borderColor: '#4A70A9', color: '#4A70A9'}}
              >
                Explore Features
              </button>
            </div>

            <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm" style={{color: '#000000', opacity: 0.6}}>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" style={{color: '#4A70A9'}} />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" style={{color: '#8FABD4'}} />
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" style={{color: '#4A70A9'}} />
                <span>AI-Powered Insights</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{color: '#000000'}}>
                Everything You Need to Succeed
              </h2>
              <p className="text-xl max-w-3xl mx-auto" style={{color: '#000000', opacity: 0.7}}>
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
                  className="group relative bg-white border rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105"
                  style={{borderColor: '#8FABD4'}}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500" style={{backgroundColor: '#4A70A9'}}></div>
                  
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'}}></div>
                    
                    <div className="absolute top-4 right-4 w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" style={{backgroundColor: '#4A70A9'}}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  <div className="relative p-8">
                    <h3 className="text-2xl font-bold mb-4 transition-all duration-300" style={{color: '#000000'}}>
                      {feature.title}
                    </h3>
                    <p className="mb-4 leading-relaxed" style={{color: '#000000', opacity: 0.7}}>
                      {feature.description}
                    </p>
                    <div className="pt-4 border-t" style={{borderColor: '#8FABD4'}}>
                      <p className="text-sm italic" style={{color: '#000000', opacity: 0.5}}>
                        {feature.detail}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[3rem] p-16 md:p-20 text-center shadow-2xl"
            style={{backgroundColor: '#4A70A9'}}
          >
            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto leading-relaxed" style={{opacity: 0.9}}>
                Join thousands of students and professionals who have discovered their perfect career path with AI-powered guidance
              </p>
              <button
                data-testid="cta-get-started-btn"
                onClick={handleGetStarted}
                className="group px-12 py-6 rounded-2xl bg-white text-xl font-bold shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
                style={{color: '#4A70A9'}}
              >
                Get Started Now
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-16 px-6" style={{borderColor: '#8FABD4', backgroundColor: '#EFECE3'}}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{backgroundColor: '#4A70A9'}}>
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold block" style={{color: '#000000'}}>AI Career Guidance</span>
                  <span className="text-sm" style={{color: '#000000', opacity: 0.6}}>Platform</span>
                </div>
              </div>
              <p className="mb-6 max-w-md" style={{color: '#000000', opacity: 0.7}}>
                Empowering the next generation with AI-powered career guidance, personalized roadmaps, and intelligent mentorship.
              </p>
              <div className="flex gap-4">
                {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-lg border flex items-center justify-center hover:opacity-70 transition-all duration-300" style={{borderColor: '#8FABD4', backgroundColor: 'white'}}>
                    <Icon className="w-5 h-5" style={{color: '#4A70A9'}} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2" style={{color: '#000000'}}>
                <BookOpen className="w-5 h-5" style={{color: '#4A70A9'}} />
                Product
              </h3>
              <ul className="space-y-3">
                {['Features', 'Roadmaps', 'AI Mentor', 'Careers'].map(item => (
                  <li key={item}><a href="#" className="hover:opacity-70 transition-colors" style={{color: '#000000', opacity: 0.7}}>{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2" style={{color: '#000000'}}>
                <Sparkles className="w-5 h-5" style={{color: '#8FABD4'}} />
                Company
              </h3>
              <ul className="space-y-3">
                {['About Us', 'Blog', 'Careers', 'Contact'].map(item => (
                  <li key={item}><a href="#" className="hover:opacity-70 transition-colors" style={{color: '#000000', opacity: 0.7}}>{item}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4" style={{borderColor: '#8FABD4'}}>
            <p className="text-sm" style={{color: '#000000', opacity: 0.6}}>
              &copy; 2026 AI Career Guidance. Made by Team Visionary AI.
            </p>
            <div className="flex gap-6 text-sm" style={{color: '#000000', opacity: 0.6}}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                <a key={item} href="#" className="hover:opacity-70 transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}