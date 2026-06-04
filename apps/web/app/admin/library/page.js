"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Shield, Play, Settings, Database, 
  Check, X, FileText, AlertTriangle, CloudLightning, Loader
} from 'lucide-react';
import { API_URL } from '../../config';

export default function AdminLibraryPanel() {
  const router = useRouter();
  const [unapprovedItems, setUnapprovedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  // Crawler form state
  const [crawlerType, setCrawlerType] = useState('syllabus');
  const [crawlerName, setCrawlerName] = useState('CBSE');
  const [crawlerDetail, setCrawlerDetail] = useState('Class 10');
  const [crawlerStatus, setCrawlerStatus] = useState('');

  // Upload book form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Book');
  const [newUrl, setNewUrl] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newLicense, setNewLicense] = useState('CC-BY');
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('fuelup_role');
    if (role !== 'admin') {
      alert("Unauthorized Access. Admin credentials required.");
      router.push('/library');
      return;
    }
    setAuthorized(true);
    fetchQuarantined();
  }, []);

  const fetchQuarantined = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('fuelup_token');
      const response = await fetch(`${API_URL}/api/library/admin/unapproved`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUnapprovedItems(data);
      }
    } catch (err) {
      console.warn("Moderator API failed to load quarantined contents.");
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (id, action) => {
    try {
      const token = localStorage.getItem('fuelup_token');
      const response = await fetch(`${API_URL}/api/library/admin/moderate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          object_id: id,
          action: action
        })
      });

      if (response.ok) {
        alert(`Content successfully ${action}d.`);
        fetchQuarantined();
      } else {
        alert("Failed to moderate content. Check admin authorization.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const triggerCrawler = async (e) => {
    e.preventDefault();
    setCrawlerStatus('Queuing crawler task...');
    try {
      const token = localStorage.getItem('fuelup_token');
      const response = await fetch(`${API_URL}/api/library/crawlers/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: crawlerType,
          name: crawlerName,
          detail: crawlerDetail
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCrawlerStatus(`Task Dispatched successfully! ID: ${data.task_id}. (${data.status})`);
        fetchQuarantined();
      } else {
        setCrawlerStatus('Crawler trigger failed. Check permissions.');
      }
    } catch (err) {
      setCrawlerStatus('Crawler dispatch connection error.');
    }
  };

  const handleManualUpload = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) {
      alert("Please fill in the title and content URL.");
      return;
    }
    setUploadStatus('Publishing content parameters...');
    try {
      const token = localStorage.getItem('fuelup_token');
      const response = await fetch(`${API_URL}/api/library/admin/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTitle,
          type: newType,
          url: newUrl,
          author: newAuthor || "Staff Curator",
          license_type: newLicense
        })
      });

      if (response.ok) {
        setUploadStatus('Uploaded and published successfully!');
        setNewTitle('');
        setNewUrl('');
        setNewAuthor('');
        setTimeout(() => setUploadStatus(''), 3000);
      } else {
        setUploadStatus('Failed to upload. Verify admin token.');
      }
    } catch (err) {
      setUploadStatus('Manual upload connection error.');
    }
  };

  if (!authorized) {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', color: '#FFF', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Verifying administrator role access...
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
          <Link href="/library" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600 }}>
            <ArrowLeft className="w-5 h-5" />
            <span>Library Dashboard</span>
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield className="w-5 h-5 text-purple-500" />
            <h1 style={{ fontSize: '16px', fontWeight: 800 }}>Library Curation Control Center</h1>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--accent-orange)', fontWeight: 700 }}>
            ADMIN ACCESS ACTIVE
          </div>
        </div>
      </header>

      {/* Main Admin dashboard layouts */}
      <main className="container" style={{ flex: 1, padding: '40px 24px', display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '32px' }}>
        
        {/* Sidebar Controls - Crawler dispatch & Form submissions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Crawler trigger form */}
          <div className="card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CloudLightning className="w-4 h-4 text-orange-500" />
              Trigger Ingestion Crawlers
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Dispatch automated scraper agents to scan open-education syllabus and book repositories.
            </p>

            <form onSubmit={triggerCrawler} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>CRAWLER AGENT TYPE</label>
                <select 
                  value={crawlerType} 
                  onChange={(e) => setCrawlerType(e.target.value)}
                  style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: '#FFF', fontSize: '13px', outline: 'none' }}
                >
                  <option value="syllabus">Syllabus Discovery Agent</option>
                  <option value="books">Open Book Discovery Agent</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>BOARD OR SUBJECT KEY</label>
                <input 
                  type="text" 
                  value={crawlerName} 
                  onChange={(e) => setCrawlerName(e.target.value)}
                  placeholder="e.g. CBSE, Mathematics, IGNOU"
                  style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: '#FFF', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>CLASS / GRADE DETAIL</label>
                <input 
                  type="text" 
                  value={crawlerDetail} 
                  onChange={(e) => setCrawlerDetail(e.target.value)}
                  placeholder="e.g. Class 10, Grade 8, UG Core"
                  style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: '#FFF', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Dispatch Crawler Agent
              </button>

            </form>

            {crawlerStatus && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '11px',
                fontFamily: 'monospace',
                color: 'var(--text-secondary)',
                lineHeight: 1.4
              }}>
                {crawlerStatus}
              </div>
            )}
          </div>

          {/* Manually Upload Content Form */}
          <div className="card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database className="w-4 h-4 text-purple-500" />
              Upload Reference Content
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Manually publish textbooks, revision slides, notes, or YouTube video embeds directly.
            </p>

            <form onSubmit={handleManualUpload} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>RESOURCE TITLE</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. CBSE Class 10 Math Revision Sheets"
                  style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: '#FFF', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>RESOURCE TYPE</label>
                  <select 
                    value={newType} 
                    onChange={(e) => setNewType(e.target.value)}
                    style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: '#FFF', fontSize: '13px', outline: 'none' }}
                  >
                    <option value="Book">Textbook</option>
                    <option value="Video">Video Lecture</option>
                    <option value="Notes">Revision Notes</option>
                    <option value="Question Paper">Question Paper</option>
                    <option value="Research Paper">Research Paper</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>LICENSE TYPE</label>
                  <select 
                    value={newLicense} 
                    onChange={(e) => setNewLicense(e.target.value)}
                    style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: '#FFF', fontSize: '13px', outline: 'none' }}
                  >
                    <option value="CC-BY">CC-BY</option>
                    <option value="Public Domain">Public Domain</option>
                    <option value="Open Access">Open Access</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>CONTENT URL / EMBED LINK</label>
                <input 
                  type="text" 
                  value={newUrl} 
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="e.g. https://youtube.com/embed/... or S3 PDF URL"
                  style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: '#FFF', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>AUTHOR / INSTITUTION</label>
                <input 
                  type="text" 
                  value={newAuthor} 
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g. NCERT, Dr. Amit Roy"
                  style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: '#FFF', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Upload & Publish
              </button>
            </form>

            {uploadStatus && (
              <div style={{
                marginTop: '16px',
                padding: '10px',
                backgroundColor: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'var(--accent-green)',
                textAlign: 'center'
              }}>
                {uploadStatus}
              </div>
            )}
          </div>

        </div>

        {/* Content Ingestion Quarantine list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database className="w-4 h-4 text-purple-500" />
              Content Quarantine Pool
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Review discovered textbooks, journals, and syllabus guidelines. Approve CC/Public domain and reject copyright infringing files.
            </p>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                <Loader className="w-8 h-8 text-purple-500 animate-spin" />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {unapprovedItems.map((item) => (
                  <div key={item.id} style={{
                    padding: '16px',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span className="badge badge-purple" style={{ fontSize: '9px', width: 'fit-content' }}>{item.type}</span>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#FFF' }}>{item.title}</h4>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <span>Author: {item.author || "Unknown"}</span>
                        <span style={{ color: 'var(--accent-orange)' }}>License: {item.license_type}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleModerate(item.id, 'approve')}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: 'rgba(16,185,129,0.15)',
                          color: 'var(--accent-green)',
                          cursor: 'pointer'
                        }}
                        title="Approve Content"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      
                      <button 
                        onClick={() => handleModerate(item.id, 'reject')}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: 'rgba(239,68,68,0.15)',
                          color: '#F87171',
                          cursor: 'pointer'
                        }}
                        title="Reject Content"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {unapprovedItems.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px 12px', opacity: 0.5 }}>
                    <FileText className="w-10 h-10 text-slate-500" style={{ margin: '0 auto 8px auto' }} />
                    <span style={{ fontSize: '12px' }}>No items in the quarantine verification queue.</span>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}
