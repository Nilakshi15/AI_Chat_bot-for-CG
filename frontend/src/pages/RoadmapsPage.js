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

  if (generatedRoadmap) {
    return (
      <div data-testid="roadmap-view" className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-indigo-100 rounded-2xl">
                <Map className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-semibold text-zinc-900 mb-2">{generatedRoadmap.title}</h1>
                <p className="text-zinc-500">Your personalized learning roadmap</p>
              </div>
            </div>

            <div className="prose prose-zinc max-w-none">
              <div className="whitespace-pre-wrap text-zinc-700 leading-relaxed">
                {generatedRoadmap.content}
              </div>
            </div>
          </motion.div>
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
