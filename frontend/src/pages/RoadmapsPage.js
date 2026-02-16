import { useState, useEffect } from "react";
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Map, Calendar, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function RoadmapsPage() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);

  const careerFromState = location.state?.career;

  useEffect(() => {
    if (careerFromState && location.pathname.includes('generate')) {
      generateRoadmap(careerFromState.title);
    } else {
      fetchRoadmaps();
    }
  }, [careerFromState]);

  const fetchRoadmaps = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/roadmap/list`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch roadmaps');
      const data = await response.json();
      setRoadmaps(data.roadmaps);
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      toast.error('Failed to load roadmaps');
    } finally {
      setLoading(false);
    }
  };

  const generateRoadmap = async (careerTitle) => {
    setGenerating(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/roadmap/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          career_title: careerTitle,
          experience_level: 'beginner'
        })
      });

      if (!response.ok) throw new Error('Failed to generate roadmap');
      const data = await response.json();
      setGeneratedRoadmap({ title: careerTitle, content: data.roadmap, id: data.roadmap_id });
      toast.success('Roadmap generated successfully!');
    } catch (error) {
      console.error('Error generating roadmap:', error);
      toast.error('Failed to generate roadmap');
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  if (generating) {
    return (
      <div data-testid="roadmap-generating" className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-semibold text-zinc-900 mb-2">Generating Your Roadmap</h2>
          <p className="text-zinc-500">Our AI mentor is creating a personalized learning path just for you...</p>
        </div>
      </div>
    );
  }

  // Parse roadmap content into steps
  const parseRoadmapSteps = (content) => {
    if (!content) return [];
    
    // Try to extract structured steps from AI response
    const steps = [];
    const lines = content.split('\n');
    let currentStep = null;
    
    lines.forEach(line => {
      const trimmed = line.trim();
      // Look for numbered steps or headers
      if (/^(Step\s+\d+|Phase\s+\d+|\d+\.|#\s*\d+)/i.test(trimmed)) {
        if (currentStep) steps.push(currentStep);
        currentStep = {
          title: trimmed.replace(/^(Step\s+\d+|Phase\s+\d+|\d+\.|#\s*\d+)[:\s-]*/i, ''),
          description: [],
          duration: '',
          skills: []
        };
      } else if (currentStep && trimmed) {
        // Check for duration
        if (/\d+\s*(week|month|day)/i.test(trimmed)) {
          currentStep.duration = trimmed.match(/\d+\s*(week|month|day)/i)[0];
        }
        // Check for skills (bullet points or comma-separated)
        if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
          currentStep.skills.push(trimmed.replace(/^[•\-*]\s*/, ''));
        } else {
          currentStep.description.push(trimmed);
        }
      }
    });
    
    if (currentStep) steps.push(currentStep);
    
    // If no structured steps found, create generic steps from paragraphs
    if (steps.length === 0) {
      const paragraphs = content.split('\n\n').filter(p => p.trim());
      paragraphs.slice(0, 6).forEach((para, idx) => {
        steps.push({
          title: `Phase ${idx + 1}`,
          description: [para.substring(0, 200) + '...'],
          duration: '',
          skills: []
        });
      });
    }
    
    return steps;
  };

  if (generatedRoadmap) {
    const steps = parseRoadmapSteps(generatedRoadmap.content);
    
    return (
      <div data-testid="roadmap-view" className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <button
            data-testid="back-to-roadmaps-btn"
            onClick={() => {
              setGeneratedRoadmap(null);
              navigate('/dashboard/roadmaps', { replace: true });
              fetchRoadmaps();
            }}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Roadmaps
          </button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-100 rounded-2xl">
                <Map className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-semibold text-zinc-900 mb-2">{generatedRoadmap.title}</h1>
                <p className="text-zinc-500">Your personalized learning roadmap</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-500">Total Phases</p>
                <p className="text-2xl font-bold text-indigo-600">{steps.length}</p>
              </div>
            </div>
          </motion.div>

          {/* Visual Timeline Roadmap */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 via-purple-200 to-pink-200"></div>
            
            {/* Steps */}
            <div className="space-y-6">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative pl-20"
                >
                  {/* Step number indicator */}
                  <div className="absolute left-0 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-indigo-100">
                    <span className="text-2xl font-bold text-indigo-600">{idx + 1}</span>
                  </div>
                  
                  {/* Step card */}
                  <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(99,102,241,0.15)] transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-zinc-900">{step.title}</h3>
                      {step.duration && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-lime-50 text-lime-700 text-sm rounded-full font-medium">
                          <Calendar className="w-4 h-4" />
                          {step.duration}
                        </span>
                      )}
                    </div>
                    
                    {step.description.length > 0 && (
                      <p className="text-zinc-600 mb-4 leading-relaxed">
                        {step.description.join(' ')}
                      </p>
                    )}
                    
                    {step.skills.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-zinc-500 mb-2">KEY SKILLS</p>
                        <div className="flex flex-wrap gap-2">
                          {step.skills.slice(0, 5).map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Completion indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: steps.length * 0.1 + 0.2 }}
              className="relative pl-20 mt-6"
            >
              <div className="absolute left-0 w-16 h-16 bg-gradient-to-br from-lime-400 to-lime-600 rounded-2xl shadow-lg flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="bg-gradient-to-br from-lime-50 to-indigo-50 rounded-3xl p-6 border-2 border-lime-200">
                <h3 className="text-xl font-semibold text-zinc-900 mb-2">🎉 Career Ready!</h3>
                <p className="text-zinc-600">Complete all phases to achieve your career goals</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent mb-4"></div>
          <p className="text-zinc-600">Loading roadmaps...</p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="roadmaps-page" className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-zinc-900 mb-2">Your Learning Roadmaps</h1>
          <p className="text-zinc-500 text-lg">Track your personalized career development paths</p>
        </div>

        {roadmaps.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
              <Map className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold text-zinc-900 mb-2">No Roadmaps Yet</h2>
            <p className="text-zinc-500 mb-6">Start exploring careers to generate your first roadmap</p>
            <button
              data-testid="explore-careers-btn"
              onClick={() => navigate('/dashboard/explore')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-medium shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200"
            >
              Explore Careers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmaps.map((roadmap, idx) => (
              <motion.div
                key={roadmap.roadmap_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                data-testid={`roadmap-card-${roadmap.roadmap_id}`}
                className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(99,102,241,0.15)] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => navigate(`/dashboard/roadmaps/${roadmap.roadmap_id}`)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <Map className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-zinc-900 mb-1">{roadmap.career_title}</h3>
                    <p className="text-sm text-zinc-500">{roadmap.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Calendar className="w-4 h-4" />
                  <span>Created {new Date(roadmap.created_at).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
