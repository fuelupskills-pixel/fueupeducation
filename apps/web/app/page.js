"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Bot, Tv, BarChart2, Shield, ArrowRight, Zap, CheckCircle2, User, FileText, ChevronRight } from 'lucide-react';

export default function Home() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "AI Video Production",
      desc: "Autonomously script, record voiceovers, draw slides, and render fully finished subject-wise video lessons using automated agent workflows.",
      icon: <Tv className="w-6 h-6 text-orange-500" />,
      tag: "Agent Pipeline"
    },
    {
      title: "Interactive AI Tutor",
      desc: "Adaptive virtual tutors that answer student queries on demand, draft quick revision summaries, and generate contextual practice tests.",
      icon: <Bot className="w-6 h-6 text-purple-500" />,
      tag: "Deep Learning"
    },
    {
      title: "Creator Platform & Revenue",
      desc: "Robust onboarding portals for human educators to review AI scripts, submit video templates, track monthly views, and check analytics.",
      icon: <BarChart2 className="w-6 h-6 text-cyan-500" />,
      tag: "Creator Portal"
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Floating Header */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 50, 
        background: 'rgba(10, 9, 21, 0.8)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/fuelup-edu-assets/logo.png" alt="FuelUp Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
            <span style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px' }}>
              FUELUP<span style={{ color: 'var(--accent-orange)' }}>EDUCATION.COM</span>
            </span>
          </div>

          <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <a href="#features" style={{ fontSize: '15px', color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="nav-link">Features</a>
            <a href="#agents" style={{ fontSize: '15px', color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="nav-link">AI Agents</a>
            <Link href="/login" style={{ fontSize: '15px', color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="nav-link">Student Portal</Link>
            <Link href="/login" style={{ fontSize: '15px', color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="nav-link">Creator Console</Link>
            
            <Link href="/login" className="btn btn-primary">
              Launch Platform
              <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '100px 0 140px 0', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
          filter: 'blur(50px)'
        }} />

        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{ textAlign: 'left' }}>
            <span className="badge badge-purple" style={{ marginBottom: '24px' }}>Now live in production v1.0</span>
            
            <h1 style={{ 
              fontSize: '56px', 
              fontWeight: 800, 
              lineHeight: 1.1, 
              letterSpacing: '-1.5px', 
              marginBottom: '24px' 
            }}>
              Automating the Future of <br/>
              <span style={{ 
                background: 'linear-gradient(135deg, var(--accent-orange), #FFA384)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
              }}>Enterprise Education</span>
            </h1>

            <p style={{ 
              fontSize: '18px', 
              color: 'var(--text-secondary)', 
              lineHeight: 1.6, 
              marginBottom: '40px'
            }}>
              An autonomous, multi-agent AI framework executing curriculum design, content publishing, creator operations, and student engagement models.
            </p>

            <div style={{ display: 'flex', gap: '16px' }}>
              <Link href="/login" className="btn btn-primary animate-glow" style={{ padding: '14px 32px', fontSize: '16px' }}>
                Access Student Portal
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/register" className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: '16px' }}>
                Creator Onboarding
              </Link>
            </div>
          </div>

          {/* Original UI illustration */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img 
              src="/fuelup-edu-assets/fuelup-edu-assets-landingpage/group-37.png" 
              alt="FuelUp Illustration" 
              style={{ width: '100%', maxWidth: '480px', height: 'auto', objectFit: 'contain' }}
              className="animate-float"
            />
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" style={{ padding: '100px 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px' }}>Core Ecosystem Features</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Powering learning content lifecycle through fully containerized background pipelines.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px' }}>
            {features.map((feat, idx) => (
              <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '12px', 
                  background: 'rgba(255, 255, 255, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}>
                  {feat.icon}
                </div>
                <div>
                  <span className="badge badge-purple" style={{ fontSize: '10px' }}>{feat.tag}</span>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '8px 0' }}>{feat.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.5 }}>{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Autonomous Agent Workflow Diagram */}
      <section id="agents" style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <span className="badge badge-orange" style={{ marginBottom: '16px' }}>Workflow Orchestration</span>
              <h2 style={{ fontSize: '38px', fontWeight: 800, marginBottom: '24px', lineHeight: 1.2 }}>
                Orchestrated by Multi-Agent AI Hierarchy
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>
                Our systems communicate autonomously, delegating layout, quality verification, and code checking to distinct, specialized agent blocks.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  "Project Management Agent tracks schedules & roadmaps.",
                  "Architecture Analysis Agent verifies code quality & APIs.",
                  "Quality Control Agent automatically triggers regression suites.",
                  "Content Automation Agent manages FFmpeg processing."
                ].map((item, index) => (
                  <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <CheckCircle2 className="w-5 h-5 text-orange-500" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '15px', color: 'var(--text-primary)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Live Console Log */}
            <div className="card" style={{ 
              fontFamily: 'monospace', 
              fontSize: '13px', 
              color: 'var(--text-secondary)', 
              background: '#0F0E1F',
              borderColor: 'rgba(139, 92, 246, 0.2)',
              maxHeight: '400px',
              overflowY: 'auto',
              padding: '24px'
            }}>
              <div style={{ color: 'var(--accent-cyan)', marginBottom: '8px' }}>&gt; Initializing agent workflows...</div>
              <div style={{ color: 'var(--text-muted)' }}>[2026-05-27 15:00:00] [PM_AGENT] Assigned: Scripting task for topic "Solar System"</div>
              <div style={{ color: '#E0E7FF' }}>[2026-05-27 15:00:02] [CONTENT_AGENT] Generating syllabus modules... (Success)</div>
              <div style={{ color: '#E0E7FF' }}>[2026-05-27 15:00:05] [AUDIO_AGENT] Synthesizing speech narration... 4 clips completed</div>
              <div style={{ color: 'var(--accent-orange)' }}>[2026-05-27 15:00:12] [MEDIA_PROCESSOR] Invoking FFmpeg renderer (1920x1080)</div>
              <div style={{ color: 'var(--text-muted)' }}>[2026-05-27 15:00:15] [MEDIA_PROCESSOR] Slide rendering sequence completed.</div>
              <div style={{ color: 'var(--accent-green)' }}>[2026-05-27 15:00:18] [QC_AGENT] Verification result: 0 errors. Quality checked.</div>
              <div style={{ color: 'var(--accent-cyan)' }}>[2026-05-27 15:00:19] [SYSTEM] Publishing MP4 lecture to platform... Done.</div>
              <div style={{ color: 'var(--accent-green)', marginTop: '8px' }}>&gt; System Status: ACTIVE, WAITING FOR NEXT SPRINT</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer style={{ 
        marginTop: 'auto', 
        padding: '60px 0', 
        backgroundColor: '#07060E', 
        borderTop: '1px solid rgba(255,255,255,0.03)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/fuelup-edu-assets/logo.png" alt="FuelUp Logo" style={{ height: '30px', width: 'auto', objectFit: 'contain' }} />
            <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.5px' }}>
              FUELUP<span style={{ color: 'var(--accent-orange)' }}>EDUCATION.COM</span>
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <img src="/fuelup-edu-assets/fuelup-edu-assets-landingpage/facebook.svg" alt="Facebook" style={{ width: '20px', height: '20px', opacity: 0.6, cursor: 'pointer' }} />
            <img src="/fuelup-edu-assets/fuelup-edu-assets-landingpage/linkedin.svg" alt="LinkedIn" style={{ width: '20px', height: '20px', opacity: 0.6, cursor: 'pointer' }} />
            <img src="/fuelup-edu-assets/fuelup-edu-assets-landingpage/telegram-1.png" alt="Telegram" style={{ width: '20px', height: '20px', opacity: 0.6, cursor: 'pointer' }} />
            <img src="/fuelup-edu-assets/fuelup-edu-assets-landingpage/instagram.png" alt="Instagram" style={{ width: '20px', height: '20px', opacity: 0.6, cursor: 'pointer' }} />
            <img src="/fuelup-edu-assets/fuelup-edu-assets-landingpage/twitter.png" alt="Twitter" style={{ width: '20px', height: '20px', opacity: 0.6, cursor: 'pointer' }} />
            <img src="/fuelup-edu-assets/fuelup-edu-assets-landingpage/youtube.png" alt="YouTube" style={{ width: '20px', height: '20px', opacity: 0.6, cursor: 'pointer' }} />
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            © 2026 FuelUp Education. All rights reserved. Production ready and secure.
          </p>
        </div>
      </footer>

      {/* Global CSS Hover Styles Injection */}
      <style jsx global>{`
        .nav-link:hover {
          color: var(--accent-orange) !important;
        }
      `}</style>
    </div>
  );
}
