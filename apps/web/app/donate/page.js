"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, CreditCard, User, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

export default function DonatePage() {
  const [activeTab, setActiveTab] = useState(0); // 0: GIFT, 1: INFO, 2: PAYMENT, 3: SUCCESS
  const [giftAmount, setGiftAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const handleNextTab = () => {
    if (activeTab === 0) {
      setActiveTab(1);
    } else if (activeTab === 1) {
      if (!donorName || !donorEmail) {
        alert("Please fill in your name and email address.");
        return;
      }
      setActiveTab(2);
    } else if (activeTab === 2) {
      if (!cardNumber) {
        alert("Please enter your card credentials.");
        return;
      }
      setActiveTab(3);
    }
  };

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
            <span style={{ fontWeight: 700, fontSize: '18px' }}>FuelUp Social Impact</span>
          </div>
          <span className="badge badge-orange">Donate</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="container" style={{ flex: 1, padding: '40px 24px', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px', alignItems: 'center', maxWidth: '1000px' }}>
        
        {/* Left column: Impact description */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <span className="badge badge-purple" style={{ marginBottom: '12px' }}>NGO Support</span>
            <h1 style={{ fontSize: '38px', fontWeight: 800, lineHeight: 1.2 }}>FuelUp Education Donation</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, marginTop: '12px' }}>
              Every contribution powers open-source educational accessibility, hosting background translation APIs, and maintaining low-bandwidth video compilation runs for children globally.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: 'var(--accent-orange)' }} />
              <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>100% of donations fund infrastructure servers.</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: 'var(--accent-purple)' }} />
              <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Enables offline mobile syncing mechanisms.</span>
            </div>
          </div>
        </section>

        {/* Right column: Interactive multi-step form */}
        <section className="card" style={{ padding: '32px' }}>
          {activeTab < 3 ? (
            <>
              {/* Steps Headers */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>
                <div 
                  onClick={() => setActiveTab(0)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', color: activeTab === 0 ? 'var(--accent-orange)' : 'var(--text-secondary)' }}
                >
                  <Heart className="w-4 h-4" />
                  <span>YOUR GIFT</span>
                </div>
                <div 
                  onClick={() => setActiveTab(1)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', color: activeTab === 1 ? 'var(--accent-orange)' : 'var(--text-secondary)' }}
                >
                  <User className="w-4 h-4" />
                  <span>DONOR INFO</span>
                </div>
                <div 
                  onClick={() => setActiveTab(2)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', color: activeTab === 2 ? 'var(--accent-orange)' : 'var(--text-secondary)' }}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>PAYMENT</span>
                </div>
              </div>

              {/* Tab 0: Your Gift */}
              {activeTab === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Choose Donation Amount</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    {[10, 25, 50].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => { setGiftAmount(amt); setCustomAmount(""); }}
                        style={{
                          padding: '16px',
                          border: '1px solid',
                          borderRadius: '8px',
                          background: giftAmount === amt && !customAmount ? 'rgba(255,106,61,0.1)' : 'var(--bg-primary)',
                          borderColor: giftAmount === amt && !customAmount ? 'var(--accent-orange)' : 'var(--border-color)',
                          color: '#FFF',
                          fontWeight: 700,
                          fontSize: '18px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Or enter custom amount ($)</label>
                    <input
                      type="number"
                      placeholder="Custom Amount e.g. 100"
                      value={customAmount}
                      onChange={(e) => { setCustomAmount(e.target.value); setGiftAmount(e.target.value); }}
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
                </div>
              )}

              {/* Tab 1: Donor Information */}
              {activeTab === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Donor Information</h3>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Full Name</label>
                    <input
                      type="text"
                      placeholder="Rohit Sharma"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
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
                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Email Address</label>
                    <input
                      type="email"
                      placeholder="rohit@gmail.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
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
                </div>
              )}

              {/* Tab 2: Payment */}
              {activeTab === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Card Credentials</h3>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Card Number</label>
                    <input
                      type="text"
                      placeholder="4321 8876 5432 1098"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
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

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Expiration</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
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
                      <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>CVV</label>
                      <input
                        type="text"
                        placeholder="***"
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
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <button 
                onClick={handleNextTab} 
                className="btn btn-primary animate-glow" 
                style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            /* Success State */
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: 'rgba(16,185,129,0.1)', 
                marginInline: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 800 }}>Thank You, {donorName}!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5, marginTop: '8px' }}>
                Your gift of <strong>${giftAmount}</strong> has been received successfully. A receipt has been sent to {donorEmail}.
              </p>
              <Link href="/" className="btn btn-secondary" style={{ marginTop: '24px' }}>
                Return Home
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
