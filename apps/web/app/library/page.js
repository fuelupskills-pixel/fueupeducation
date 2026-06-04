"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, BookOpen, Video, FileText, HelpCircle, Award, 
  ArrowLeft, ArrowRight, Settings, Database, SlidersHorizontal, Eye
} from 'lucide-react';
import Reader from '../../components/library/Reader';
import { API_URL } from '../config';

export default function NationalLibraryPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, books, videos, papers, notes
  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  // Loaded metadata lists
  const [boards, setBoards] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [libraryObjects, setLibraryObjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);

  // E-Reader active modal state
  const [activeBook, setActiveBook] = useState(null);

  // Load configuration and boards list on mount
  useEffect(() => {
    // Check if admin role is signed in
    const role = localStorage.getItem('fuelup_role');
    if (role === 'admin') {
      setIsAdmin(true);
    }

    // Fetch school boards list
    fetch(`${API_URL}/api/library/boards`)
      .then(res => res.json())
      .then(data => setBoards(data))
      .catch(() => setBoards([
        { id: 1, name: "CBSE" },
        { id: 2, name: "ICSE" },
        { id: 3, name: "NIOS" }
      ]));

    // Fetch default catalog items
    fetchCatalogItems();
  }, []);

  const mapTabToType = (tab) => {
    if (tab === 'books') return 'Book';
    if (tab === 'videos') return 'Video';
    if (tab === 'papers') return 'Question Paper';
    if (tab === 'notes') return 'Notes';
    return null;
  };

  const fetchCatalogItems = async () => {
    setLoading(true);
    try {
      if (activeTab === 'books') {
        const res = await fetch(`${API_URL}/api/library/books`);
        if (res.ok) setLibraryObjects(await res.json());
      } else if (activeTab === 'videos') {
        const res = await fetch(`${API_URL}/api/library/videos`);
        if (res.ok) setLibraryObjects(await res.json());
      } else if (activeTab === 'papers') {
        const res = await fetch(`${API_URL}/api/library/question-papers`);
        if (res.ok) setLibraryObjects(await res.json());
      } else if (activeTab === 'notes') {
        const res = await fetch(`${API_URL}/api/library/notes`);
        if (res.ok) setLibraryObjects(await res.json());
      } else if (activeTab === 'all') {
        const urls = [
          `${API_URL}/api/library/books`,
          `${API_URL}/api/library/videos`,
          `${API_URL}/api/library/question-papers`,
          `${API_URL}/api/library/notes`,
          `${API_URL}/api/library/research-papers`
        ];
        const responses = await Promise.all(urls.map(url => fetch(url).catch(() => null)));
        const dataArr = await Promise.all(responses.map(res => res && res.ok ? res.json() : []));
        const combined = dataArr.flat();
        setLibraryObjects(combined);
      }
    } catch (err) {
      console.warn("Failed fetching from library, falling back to mock catalog.", err);
      const mockItems = [
        {
          id: 101, title: "NCERT Mathematics Class 10", type: "Book", 
          url: "https://fuelup-cdn.education/books/ncert_math_class10.pdf",
          author: "NCERT", publisher: "NCERT India", license_type: "Creative Commons BY-NC 4.0",
          metadata_json: '{"language": "en", "pages": 298}'
        },
        {
          id: 102, title: "Real Numbers Concept Explainer", type: "Video",
          url: "https://www.youtube.com/embed/tgbNymZ7vqY",
          author: "Swayam Platform", publisher: "IIT Madras", license_type: "Open Access",
          metadata_json: '{"duration_minutes": 15}'
        },
        {
          id: 103, title: "CBSE Class 10 Mathematics Paper 2025", type: "Question Paper",
          url: "https://fuelup-cdn.education/papers/cbse_math_2025.pdf",
          author: "CBSE Board", publisher: "CBSE Exam Board", license_type: "Open Access",
          metadata_json: '{"year": 2025, "duration_hours": 3}'
        },
        {
          id: 104, title: "Real Numbers Quick Summary Notes", type: "Notes",
          url: "https://fuelup-cdn.education/notes/real_numbers_notes.pdf",
          author: "IGNOU", publisher: "IGNOU Open Repository", license_type: "CC-BY",
          metadata_json: '{"language": "hi", "summary": "वास्तविक संख्याओं की त्वरित समीक्षा"}'
        },
        {
          id: 105, title: "Analysis of Prime Number Distributions", type: "Research Paper",
          url: "https://fuelup-cdn.education/research/prime_dist.pdf",
          author: "Dr. R. Ramanujan", publisher: "IISc Journal", license_type: "UGC Open Access",
          metadata_json: '{"citations": 12, "year": 2024}'
        }
      ];
      if (activeTab === 'all') {
        setLibraryObjects(mockItems);
      } else {
        setLibraryObjects(mockItems.filter(item => item.type === mapTabToType(activeTab)));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      fetchCatalogItems();
      setSearchTriggered(false);
      return;
    }
    setLoading(true);
    setSearchTriggered(true);

    try {
      const response = await fetch(`${API_URL}/api/library/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: searchQuery,
          type: activeTab === 'all' ? null : mapTabToType(activeTab)
        })
      });

      if (response.ok) {
        const results = await response.json();
        setLibraryObjects(results);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Re-run search or fetch whenever activeTab modifies
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      fetchCatalogItems();
    }
  }, [activeTab]);

  // Local filtering for BOARD / UNIVERSITY and SUBJECT
  const filteredObjects = libraryObjects.filter((item) => {
    if (selectedBoard && !item.title.toLowerCase().includes(selectedBoard.toLowerCase()) && !item.publisher?.toLowerCase().includes(selectedBoard.toLowerCase())) {
      return false;
    }
    if (selectedSubject && !item.title.toLowerCase().includes(selectedSubject.toLowerCase()) && !item.metadata_json?.toLowerCase().includes(selectedSubject.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header navbar */}
      <header style={{ 
        background: 'var(--bg-secondary)', 
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/student" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600 }}>
            <ArrowLeft className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/fuelup-edu-assets/logo.png" alt="FuelUp Logo" style={{ height: '32px', marginRight: '8px' }} onError={(e) => { e.target.style.display = 'none'; }} />
            <h1 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.5px' }} className="gradient-text">National Knowledge Library</h1>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {isAdmin && (
              <Link href="/admin/library" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Settings className="w-4 h-4 text-purple-500" />
                <span>Admin Library</span>
              </Link>
            )}
            <Link href="/student" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
              Student Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner Search Bar section */}
      <section style={{
        background: 'radial-gradient(ellipse at top, rgba(139, 92, 246, 0.15), transparent 60%)',
        padding: '60px 24px 40px 24px',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="badge badge-purple" style={{ marginBottom: '16px' }}>Open Education OS</span>
          <h2 style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>
            India's AI-Powered Digital Library
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
            Instant search across CBSE, NCERT, IGNOU, state boards, UGC journals, and IIT/NIT open courses. Cover Class 1 to PhD.
          </p>

          {/* Search container */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search className="w-5 h-5 text-slate-500" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                placeholder="Ask AI (e.g. thermodynamics books, Class 10 math previous papers...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  color: '#FFF',
                  fontSize: '15px',
                  outline: 'none',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0 28px', borderRadius: '12px' }}>
              Search Library
            </button>
          </form>

          {/* Suggestion hints */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Try:</span>
            {[
              "thermodynamics books",
              "UPSC economics papers",
              "NCERT videos"
            ].map((s) => (
              <button 
                key={s} 
                type="button" 
                onClick={() => { setSearchQuery(s); handleSearch(); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
              >
                "{s}"
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Layout - Filters and Cards */}
      <main className="container" style={{ flex: 1, paddingBottom: '80px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Horizontal Navigation tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '10px' }}>
          {[
            { id: 'all', label: 'All Resources' },
            { id: 'books', label: 'Textbooks' },
            { id: 'videos', label: 'Video Lectures' },
            { id: 'papers', label: 'Question Papers' },
            { id: 'notes', label: 'Revision Notes' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                padding: '12px 18px',
                border: 'none',
                background: 'none',
                color: activeTab === item.id ? 'var(--accent-orange)' : 'var(--text-secondary)',
                borderBottom: activeTab === item.id ? '2px solid var(--accent-orange)' : 'none',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Content list Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '32px' }}>
          
          {/* Quick Hierarchy Sidebar filter panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SlidersHorizontal className="w-4 h-4 text-purple-500" />
                Library Filters
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Board dropdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>BOARD / UNIVERSITY</label>
                  <select 
                    value={selectedBoard}
                    onChange={(e) => setSelectedBoard(e.target.value)}
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      color: '#FFF',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  >
                    <option value="">All Boards</option>
                    {boards.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Subject dropdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>SUBJECT</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      color: '#FFF',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  >
                    <option value="">All Subjects</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Economics">Economics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Social Science">Social Science</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4, background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  Tip: Toggle AI search at the top or apply board filters on the left to narrow down learning objectives.
                </div>

              </div>
            </div>
          </div>

          {/* Catalog Listing */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Showing {filteredObjects.length} reference documents
              </span>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '3px solid rgba(255,255,255,0.05)',
                  borderTopColor: 'var(--accent-orange)',
                  animation: 'spin 1s linear infinite'
                }} />
                <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {filteredObjects.map((item) => (
                  <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className={`badge ${item.type === 'Book' ? 'badge-purple' : 'badge-orange'}`} style={{ fontSize: '10px' }}>
                          {item.type}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: 600 }}>{item.license_type || "CC Open License"}</span>
                      </div>
                      
                      <h4 style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.4, color: '#FFF' }}>{item.title}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Provided by: {item.author || "Public Domain Repository"}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                      {item.type === 'Book' || item.type === 'Notes' || item.type === 'Question Paper' ? (
                        <button 
                          onClick={() => setActiveBook(item)}
                          className="btn btn-primary" 
                          style={{ flex: 1, padding: '8px 12px', fontSize: '12px', justifyContent: 'center' }}
                        >
                          <BookOpen className="w-3.5 h-3.5" /> Read E-Book
                        </button>
                      ) : item.type === 'Video' ? (
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-primary" 
                          style={{ flex: 1, padding: '8px 12px', fontSize: '12px', justifyContent: 'center' }}
                        >
                          <Video className="w-3.5 h-3.5" /> Watch Video
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}

                {filteredObjects.length === 0 && (
                  <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '60px 24px', opacity: 0.5 }}>
                    <FileText className="w-12 h-12 text-slate-500" style={{ margin: '0 auto 12px auto' }} />
                    <h5 style={{ fontSize: '15px', fontWeight: 700 }}>No search results matched</h5>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Try another key word or reset search filters</p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Reader Modal overlay */}
      {activeBook && (
        <Reader activeBook={activeBook} onClose={() => setActiveBook(null)} />
      )}

    </div>
  );
}
