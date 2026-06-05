"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus, Mail, Lock, User, Shield, Loader } from 'lucide-react';
import { API_URL } from '../config';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  // OTP Verification States
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill in all details.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/otp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
      });

      if (!response.ok) {
        throw new Error("Failed to send OTP code. Try checking backend server.");
      }

      setOtpSent(true);
      alert("Verification OTP sent! (Dev check: Read the code from your backend logs)");
    } catch (err) {
      alert(err.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      alert("Please enter the 6-digit OTP code.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/otp/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          otp: otpCode,
          name: name,
          role: role,
          password: password
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Incorrect or expired OTP verification code.');
      }

      const data = await response.json();
      
      // Save credentials and token
      localStorage.setItem('fuelup_token', data.access_token);
      localStorage.setItem('fuelup_role', role);
      localStorage.setItem('fuelup_email', email);
      localStorage.setItem('fuelup_name', name);

      alert("Email verified and account registered successfully!");
      if (role === "creator") {
        router.push("/creator");
      } else {
        router.push("/student");
      }
    } catch (err) {
      alert(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    if (!otpSent) {
      handleSendOTP();
    } else {
      handleVerifyAndRegister(e);
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
          <Link href="/" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
            <ArrowLeft className="w-5 h-5" />
            <span>Back to home</span>
          </Link>
          <img src="/fuelup-edu-assets/logo.png" alt="FuelUp Logo" style={{ height: '36px', width: 'auto' }} />
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div className="card" style={{ width: '100%', maxWidth: '460px', padding: '32px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>Create Account</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
              Join fuelupeducation.com platform
            </p>
          </div>

          <form onSubmit={onSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Name Input */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User className="w-5 h-5 text-slate-500" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Virat Kohli"
                  value={name}
                  disabled={otpSent}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 42px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '14px',
                    outline: 'none',
                    opacity: otpSent ? 0.6 : 1
                  }}
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail className="w-5 h-5 text-slate-500" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  placeholder="virat@domain.com"
                  value={email}
                  disabled={otpSent}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 42px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '14px',
                    outline: 'none',
                    opacity: otpSent ? 0.6 : 1
                  }}
                />
              </div>
            </div>

            {/* Role Tab Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>Workspace Profile</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'var(--bg-primary)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                {['student', 'creator'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    disabled={otpSent}
                    onClick={() => setRole(r)}
                    style={{
                      padding: '8px',
                      border: 'none',
                      borderRadius: '6px',
                      background: role === r ? 'var(--bg-tertiary)' : 'transparent',
                      color: role === r ? 'var(--accent-orange)' : 'var(--text-secondary)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '13px',
                      textTransform: 'capitalize',
                      transition: 'all 0.2s',
                      opacity: otpSent ? 0.6 : 1
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock className="w-5 h-5 text-slate-500" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  disabled={otpSent}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 42px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '14px',
                    outline: 'none',
                    opacity: otpSent ? 0.6 : 1
                  }}
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock className="w-5 h-5 text-slate-500" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  disabled={otpSent}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 42px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '14px',
                    outline: 'none',
                    opacity: otpSent ? 0.6 : 1
                  }}
                />
              </div>
            </div>

            {/* OTP Code Input (rendered when OTP is sent) */}
            {otpSent && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--accent-orange)', marginBottom: '6px', fontWeight: 600 }}>Enter Verification OTP</label>
                <div style={{ position: 'relative' }}>
                  <Shield className="w-5 h-5 text-slate-500" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 42px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: '#FFF',
                      fontSize: '14px',
                      outline: 'none',
                      letterSpacing: '4px',
                      fontWeight: 'bold'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary animate-glow" 
              style={{ width: '100%', marginTop: '10px', justifyContent: 'center', gap: '8px' }}
              disabled={loading}
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
              <span>{otpSent ? "Verify & Sign Up" : "Send Verification OTP"}</span>
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
            <Link href="/login" style={{ color: 'var(--accent-orange)', fontWeight: 600 }}>
              Sign In
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
