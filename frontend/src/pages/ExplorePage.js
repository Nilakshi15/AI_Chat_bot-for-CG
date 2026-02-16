import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Sparkles, ArrowRight, Search } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function ExplorePage() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/careers/explore`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch careers');
      const data = await response.json();
      setCareers(data.careers);
    } catch (error) {
      console.error('Error fetching careers:', error);
      toast.error('Failed to load careers');
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", "Technology", "Business", "Creative", "Healthcare"];

  const filteredCareers = careers.filter(career => {
    const matchesSearch = career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         career.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || career.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleGenerateRoadmap = (career) => {
    navigate('/dashboard/roadmaps/generate', { state: { career } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent mb-4"></div>
          <p className="text-zinc-600">Loading careers...</p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="explore-page" className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-zinc-900 mb-2">Explore Careers</h1>
          <p className="text-zinc-500 text-lg">Discover opportunities across industries and find your perfect fit</p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              data-testid="career-search-input"
              type="text"
              placeholder="Search careers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                data-testid={`category-${category.toLowerCase()}`}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-white text-zinc-600 border border-zinc-200 hover:border-indigo-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Careers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career, idx) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              data-testid={`career-card-${career.id}`}
              className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(99,102,241,0.15)] transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full mb-3">
                    {career.category}
                  </span>
                  <h3 className="text-xl font-semibold text-zinc-900">{career.title}</h3>
                </div>
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>

              <p className="text-zinc-600 leading-relaxed mb-4 flex-1">{career.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-lime-600" />
                  <span className="text-zinc-500">Growth:</span>
                  <span className="font-medium text-zinc-900">{career.growth_potential}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-pink-600" />
                  <span className="text-zinc-500">Salary:</span>
                  <span className="font-medium text-zinc-900">{career.avg_salary}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-medium text-zinc-500 mb-2">KEY SKILLS</p>
                <div className="flex flex-wrap gap-2">
                  {career.skills.slice(0, 4).map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-zinc-50 text-zinc-700 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <button
                data-testid={`generate-roadmap-${career.id}`}
                onClick={() => handleGenerateRoadmap(career)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
              >
                Generate Roadmap
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {filteredCareers.length === 0 && (
          <div className="text-center py-16">
            <p className="text-zinc-500 text-lg">No careers found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
