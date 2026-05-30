"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, User, Calendar, MessageSquare } from 'lucide-react';

export default function BlogPage() {
  const blogPosts = [
    {
      title: "Mobile Prototyping - Best Practices in EdTech",
      desc: "How structured user-testing loops and simplified layouts speed up learner retention. Discover the framework behind our React Native app rebuild.",
      author: "Sara Williams",
      date: "March 5, 2026",
      readTime: "4 min read",
      category: "Design System"
    },
    {
      title: "Key to Create More Time: Auto-Generating Lectures",
      desc: "Exploring the computational pipelines that orchestrate content creation. How our Content Agent structures syllabus items dynamically.",
      author: "Amit Kumar",
      date: "May 20, 2026",
      readTime: "6 min read",
      category: "AI Pipelines"
    },
    {
      title: "Scale, Cache, and Run: Dockerized Platform Topology",
      desc: "A technical walkthrough on optimizing backend operations using PostgreSQL replication, Redis caches, and FastAPI connection pools.",
      author: "Dev Team",
      date: "May 26, 2026",
      readTime: "8 min read",
      category: "Infrastructure"
    }
  ];

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
            <span style={{ fontWeight: 700, fontSize: '18px' }}>FuelUp Knowledge Hub</span>
          </div>
          <span className="badge badge-purple">Resources</span>
        </div>
      </header>

      {/* Main Blog Body */}
      <main className="container" style={{ flex: 1, padding: '40px 24px', maxWidth: '1000px' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="badge badge-orange" style={{ marginBottom: '12px' }}>Knowledge Base</span>
          <h1 style={{ fontSize: '42px', fontWeight: 800 }}>Collaborative Prototyping Blog</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '16px' }}>
            Explore technical notes, developer guides, and educational insights from the FuelUp team.
          </p>
        </div>

        {/* Card Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {blogPosts.map((post, idx) => (
            <article 
              key={idx} 
              className="card" 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: '1.2fr 2fr', 
                gap: '24px',
                alignItems: 'center'
              }}
            >
              {/* Image Placeholder Box */}
              <div style={{ 
                height: '180px', 
                borderRadius: '8px', 
                background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(255,106,61,0.05))',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BookOpen className="w-10 h-10 text-orange-500" />
              </div>

              {/* Text Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <span className="badge badge-purple" style={{ fontSize: '10px' }}>{post.category}</span>
                  <h2 style={{ fontSize: '22px', fontWeight: 700, marginTop: '6px' }}>{post.title}</h2>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
                  {post.desc}
                </p>

                {/* Meta details */}
                <div style={{ 
                  display: 'flex', 
                  gap: '20px', 
                  fontSize: '12px', 
                  color: 'var(--text-muted)', 
                  borderTop: '1px solid rgba(255,255,255,0.03)',
                  paddingTop: '12px',
                  marginTop: '6px'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User className="w-3.5 h-3.5" />
                    {post.author}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
