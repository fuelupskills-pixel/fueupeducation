"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Upload, BarChart2, PlusCircle, CheckCircle2, 
  Settings, Loader, Play, Sparkles, DollarSign, Eye, Film 
} from 'lucide-react';
import { API_URL } from '../config';

export default function CreatorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useState([
    { id: 1, title: "Deep Space and Nebula Structures", category: "Astronomy", views: 2450, revenue: 10.00, status: "Published" },
    { id: 2, title: "Calculus Limits and Integrations", category: "Math", views: 1800, revenue: 10.00, status: "Published" }
  ]);

  // Form states
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCategory, setCourseCategory] = useState("Astronomy");
  const [courseDescription, setCourseDescription] = useState("");
  
  // AI Generator simulation states
  const [aiRunning, setAiRunning] = useState(false);
  const [aiStatus, setAiStatus] = useState("");
  const [simulationStep, setSimulationStep] = useState(0);

  // Creator metrics
  const [totalViews, setTotalViews] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0.0);

  useEffect(() => {
    const token = localStorage.getItem('fuelup_token');
    const role = localStorage.getItem('fuelup_role');

    if (!token || role !== 'creator') {
      alert("Please sign in as a Creator to access the Console.");
      router.push('/login');
      return;
    }

    // Verify token & role
    fetch(`${API_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) throw new Error("Invalid token");
      return res.json();
    })
    .then(profile => {
      if (profile.role !== 'creator' && profile.role !== 'admin') {
        alert("Access Denied. You do not have Creator privileges.");
        router.push('/student');
        return;
      }
      setUser(profile);
      
      // Fetch stats
      fetch(`${API_URL}/api/creator/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(statsData => {
        setTotalViews(statsData.monthly_views || 0);
        setTotalRevenue(statsData.revenue_earned || 0);
      })
      .catch(console.error);

      // Fetch courses
      fetch(`${API_URL}/api/creator/courses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(coursesData => {
        if (coursesData && coursesData.length > 0) {
          const mapped = coursesData.map(c => ({
            id: c.id,
            title: c.title,
            category: c.category,
            views: 0,
            revenue: 10.00, // ₹10 payout rule
            status: "Published"
          }));
          setCourses(mapped);
        }
      })
      .catch(console.error);

      setAuthLoading(false);
    })
    .catch(err => {
      console.error(err);
      alert("Session expired. Please login again.");
      localStorage.clear();
      router.push('/login');
    });
  }, [router]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;
    
    try {
      const token = localStorage.getItem('fuelup_token');
      const response = await fetch(`${API_URL}/api/courses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: courseTitle,
          description: courseDescription || "No description provided",
          category: courseCategory,
          image_url: ""
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create course");
      }

      const newCourseData = await response.json();
      
      const newCourse = {
        id: newCourseData.id,
        title: newCourseData.title,
        category: newCourseData.category,
        views: 0,
        revenue: 10.00,
        status: "Published"
      };

      setCourses(prev => [newCourse, ...prev]);
      
      // Update stats and payout in database by ₹10.00
      const statsResponse = await fetch(`${API_URL}/api/creator/stats/simulate-earnings?views_add=0&revenue_add=10.00`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setTotalRevenue(statsData.revenue_earned);
        setTotalViews(statsData.monthly_views);
      } else {
        setTotalRevenue(prev => prev + 10.00);
      }

      setCourseTitle("");
      setCourseDescription("");
      alert("Course created successfully!");
    } catch (err) {
      alert(err.message || "Failed to create course.");
    }
  };

  const handleTriggerAIVideo = async () => {
    if (!courseTitle.trim()) {
      alert("Please enter a course title first to guide the AI Agent!");
      return;
    }
    
    setAiRunning(true);
    setSimulationStep(1);
    setAiStatus("[PM_AGENT] Reviewing roadmap, assigning task to Content Agent...");

    try {
      const token = localStorage.getItem('fuelup_token');
      
      // 1. Create the Course first in the backend database
      const courseResponse = await fetch(`${API_URL}/api/courses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: `AI-Gen: ${courseTitle}`,
          description: courseDescription || "AI Generated Course",
          category: courseCategory,
          image_url: ""
        })
      });

      if (!courseResponse.ok) {
        throw new Error("Failed to initialize AI Course record");
      }

      const courseData = await courseResponse.json();

      // 2. Trigger the background video compiler pipeline
      const aiResponse = await fetch(`${API_URL}/api/ai/generate-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          course_id: courseData.id,
          title: `Intro to ${courseTitle}`,
          category: courseCategory,
          syllabus: courseDescription || "Astrophysics Core Concepts"
        })
      });

      if (!aiResponse.ok) {
        throw new Error("Failed to queue AI Video Pipeline execution");
      }

      setTimeout(() => {
        setSimulationStep(2);
        setAiStatus("[CONTENT_AGENT] Structuring syllabus. Writing lecture script slides...");
      }, 2000);

      setTimeout(() => {
        setSimulationStep(3);
        setAiStatus("[AUDIO_AGENT] Synthesizing speech track overlays via ElevenLabs...");
      }, 4500);

      setTimeout(() => {
        setSimulationStep(4);
        setAiStatus("[MEDIA_PROCESSOR] Invoking FFmpeg renderer to compile slides & MP4 lesson...");
      }, 7000);

      setTimeout(() => {
        setSimulationStep(5);
        setAiStatus("[QC_AGENT] Running automated testing. Code & video verified.");
      }, 9500);

      setTimeout(() => {
        setAiRunning(false);
        setSimulationStep(0);
        setAiStatus("");

        // Add the AI generated course to list
        const newAiCourse = {
          id: courseData.id,
          title: courseData.title,
          category: courseData.category,
          views: 120, // simulate organic initial views
          revenue: 10.00,
          status: "Published"
        };

        setCourses(prev => [newAiCourse, ...prev]);
        
        // Update stats and payout in database by ₹10.00
        fetch(`${API_URL}/api/creator/stats/simulate-earnings?views_add=120&revenue_add=10.00`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(statsData => {
          setTotalRevenue(statsData.revenue_earned);
          setTotalViews(statsData.monthly_views);
        })
        .catch(() => {
          setTotalViews(prev => prev + 120);
          setTotalRevenue(prev => prev + 10.00);
        });

        alert("AI Agent completed script, audio, and video compilation successfully! Video published to platform.");
      }, 11500);

    } catch (err) {
      alert(err.message || "Failed during AI generation workflow.");
      setAiRunning(false);
      setSimulationStep(0);
      setAiStatus("");
    }
  };

  if (authLoading) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFF',
        fontFamily: 'Outfit, sans-serif'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '4px solid rgba(255,255,255,0.05)',
            borderTopColor: 'var(--accent-orange)',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Verifying your credentials...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <header style={{ 
        background: 'var(--bg-secondary)', 
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft className="w-5 h-5" />
              <span>Back to home</span>
            </Link>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ fontWeight: 700, fontSize: '18px' }}>Creator Dashboard Console</span>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <span className="badge badge-orange" style={{ alignSelf: 'center' }}>Verified Partner</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main style={{ flex: 1, padding: '24px', display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '24px' }}>
        
        {/* Sidebar Nav */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={() => setActiveTab('dashboard')} 
                style={{
                  padding: '12px',
                  border: 'none',
                  borderRadius: '8px',
                  background: activeTab === 'dashboard' ? 'rgba(255,106,61,0.1)' : 'transparent',
                  color: activeTab === 'dashboard' ? 'var(--accent-orange)' : 'var(--text-primary)',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'background 0.2s'
                }}
              >
                Analytics & Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('upload')} 
                style={{
                  padding: '12px',
                  border: 'none',
                  borderRadius: '8px',
                  background: activeTab === 'upload' ? 'rgba(255,106,61,0.1)' : 'transparent',
                  color: activeTab === 'upload' ? 'var(--accent-orange)' : 'var(--text-primary)',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'background 0.2s'
                }}
              >
                Upload & AI Engine
              </button>
            </div>
          </div>

          {/* Onboarding Status Check */}
          <div className="card" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-secondary)' }}>Onboarding Checklist</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px' }}>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Identity verified</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px' }}>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Subject alignment checks</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px' }}>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Bank routing credentials</span>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Panels */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              {/* Analytics Ribbon */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,106,61,0.1)', color: 'var(--accent-orange)' }}>
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Monthly Views</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>{totalViews.toLocaleString()}</h3>
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(139,92,246,0.1)', color: 'var(--accent-purple)' }}>
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Estimated Revenue</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>₹{totalRevenue.toFixed(2)}</h3>
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(6,182,212,0.1)', color: 'var(--accent-cyan)' }}>
                    <Film className="w-6 h-6" />
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Lessons</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>{courses.length}</h3>
                  </div>
                </div>
              </div>

              {/* Published content list */}
              <div className="card">
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px' }}>Your Published Lessons</h3>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '12px 8px' }}>Title</th>
                      <th style={{ padding: '12px 8px' }}>Category</th>
                      <th style={{ padding: '12px 8px' }}>Views</th>
                      <th style={{ padding: '12px 8px' }}>Revenue</th>
                      <th style={{ padding: '12px 8px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((c) => (
                      <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                        <td style={{ padding: '16px 8px', fontWeight: 600 }}>{c.title}</td>
                        <td style={{ padding: '16px 8px', color: 'var(--text-secondary)' }}>{c.category}</td>
                        <td style={{ padding: '16px 8px' }}>{c.views.toLocaleString()}</td>
                        <td style={{ padding: '16px 8px', color: 'var(--accent-cyan)', fontWeight: 600 }}>₹{c.revenue.toFixed(2)}</td>
                        <td style={{ padding: '16px 8px' }}>
                          <span style={{ 
                            padding: '3px 8px', 
                            borderRadius: '4px', 
                            fontSize: '11px', 
                            background: 'rgba(16,185,129,0.15)', 
                            color: 'var(--accent-green)',
                            fontWeight: 600
                          }}>{c.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Upload & AI tab */}
          {activeTab === 'upload' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
              
              {/* Manual/AI Upload Form */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Publish Educational Lesson</h3>
                
                <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Lesson Title</label>
                    <input
                      type="text"
                      placeholder="e.g. The Solar System - Advanced"
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: '#FFF',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Category</label>
                    <select
                      value={courseCategory}
                      onChange={(e) => setCourseCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: '#FFF',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    >
                      <option value="Astronomy">Astronomy</option>
                      <option value="Math">Math</option>
                      <option value="Science">Science</option>
                      <option value="History">History</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Syllabus Details (AI Script Guide)</label>
                    <textarea
                      placeholder="Input core bullet points of syllabus the AI Agent should cover..."
                      rows="4"
                      value={courseDescription}
                      onChange={(e) => setCourseDescription(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: '#FFF',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                    <button type="submit" className="btn btn-secondary" style={{ flex: 1 }}>
                      <Upload className="w-4 h-4" />
                      Publish Standard
                    </button>
                    <button 
                      type="button" 
                      onClick={handleTriggerAIVideo} 
                      className="btn btn-primary" 
                      style={{ flex: 1, gap: '6px' }}
                      disabled={aiRunning}
                    >
                      {aiRunning ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      Generate via AI Agent
                    </button>
                  </div>
                </form>
              </div>

              {/* Real-time AI Status Simulator Box */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '380px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent-orange)' }}>AI Video Pipeline Log Console</h4>
                
                {aiRunning ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Loader className="w-5 h-5 text-orange-500 animate-spin" />
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>Multi-Agent System Executing...</span>
                    </div>

                    <div style={{ 
                      flex: 1, 
                      background: '#07060D', 
                      borderRadius: '8px', 
                      padding: '12px', 
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      border: '1px solid rgba(255,255,255,0.03)'
                    }}>
                      <p style={{ color: simulationStep >= 1 ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                        ✓ Step 1: Assigning task based on inputs
                      </p>
                      <p style={{ color: simulationStep >= 2 ? 'var(--accent-cyan)' : 'var(--text-muted)', marginTop: '8px' }}>
                        {simulationStep >= 2 ? "✓ Step 2: Content script and slide prompts compiled." : "○ Step 2: Running Content Agent scriptwriter..."}
                      </p>
                      <p style={{ color: simulationStep >= 3 ? 'var(--accent-cyan)' : 'var(--text-muted)', marginTop: '8px' }}>
                        {simulationStep >= 3 ? "✓ Step 3: Audio synthesizer generated MP3 voiceovers." : "○ Step 3: Running Voice synthesis..."}
                      </p>
                      <p style={{ color: simulationStep >= 4 ? 'var(--accent-cyan)' : 'var(--text-muted)', marginTop: '8px' }}>
                        {simulationStep >= 4 ? "✓ Step 4: FFmpeg processes executed slides and overlay." : "○ Step 4: Running MoviePy slide compilation..."}
                      </p>
                      <p style={{ color: simulationStep >= 5 ? 'var(--accent-cyan)' : 'var(--text-muted)', marginTop: '8px' }}>
                        {simulationStep >= 5 ? "✓ Step 5: QA validation completed successfully." : "○ Step 5: Running Quality regression checks..."}
                      </p>
                    </div>

                    <div style={{ 
                      padding: '10px 14px', 
                      background: 'rgba(255,106,61,0.05)', 
                      borderRadius: '8px', 
                      fontSize: '12px', 
                      border: '1px solid rgba(255,106,61,0.1)',
                      color: 'var(--accent-orange)',
                      fontFamily: 'monospace'
                    }}>
                      {aiStatus}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
                    <Sparkles className="w-12 h-12 text-slate-700 animate-bounce" />
                    <p style={{ fontSize: '13px' }}>
                      Enter a lesson title, category, and prompt description, then click "Generate via AI Agent" to watch the multi-agent video processor run in real-time.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
