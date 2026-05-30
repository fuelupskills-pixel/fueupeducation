import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  ScrollView, SafeAreaView, StatusBar, Alert 
} from 'react-native';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register' | 'dashboard'>('login');
  
  // Auth Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student"); // student or creator

  // OTP Form States
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Dashboard state
  const [markedCount, setMarkedCount] = useState(0);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all credentials.");
      return;
    }

    try {
      const details = {
        'username': email,
        'password': password
      };
      
      const formBody = Object.keys(details)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key as keyof typeof details]))
        .join('&');

      let response;
      try {
        response = await fetch('http://localhost:8000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: formBody
        });
      } catch (err) {
        // Fallback for Android Emulator
        response = await fetch('http://10.0.2.2:8000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: formBody
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Incorrect email or password');
      }

      const data = await response.json();
      
      let profileResponse;
      try {
        profileResponse = await fetch('http://localhost:8000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${data.access_token}` }
        });
      } catch (err) {
        // Fallback for Android Emulator
        profileResponse = await fetch('http://10.0.2.2:8000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${data.access_token}` }
        });
      }

      if (!profileResponse.ok) {
        throw new Error('Failed to retrieve user profile credentials');
      }

      const profile = await profileResponse.json();
      Alert.alert("Success", `Logged in successfully! Welcome, ${profile.name}`);
      setName(profile.name);
      setCurrentScreen('dashboard');
    } catch (err: any) {
      Alert.alert("Login Failed", err.message || "Unable to connect to authentication server.");
    }
  };

  const handleSendOTP = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address first.");
      return;
    }

    try {
      let response;
      const bodyPayload = JSON.stringify({ email: email });
      try {
        response = await fetch('http://localhost:8000/api/auth/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: bodyPayload
        });
      } catch (err) {
        response = await fetch('http://10.0.2.2:8000/api/auth/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: bodyPayload
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to send OTP code.");
      }

      setOtpSent(true);
      Alert.alert("Success", "OTP sent successfully! (Check backend terminal logs for the 6-digit code)");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to send OTP.");
    }
  };

  const handleVerifyOTP = async () => {
    if (!email.trim() || !otpCode.trim()) {
      Alert.alert("Error", "Please fill in email and OTP code.");
      return;
    }

    try {
      let response;
      const bodyPayload = JSON.stringify({
        email: email,
        otp: otpCode,
        role: role
      });
      try {
        response = await fetch('http://localhost:8000/api/auth/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: bodyPayload
        });
      } catch (err) {
        response = await fetch('http://10.0.2.2:8000/api/auth/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: bodyPayload
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Invalid or expired OTP");
      }

      const data = await response.json();
      
      let profileResponse;
      try {
        profileResponse = await fetch('http://localhost:8000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${data.access_token}` }
        });
      } catch (err) {
        profileResponse = await fetch('http://10.0.2.2:8000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${data.access_token}` }
        });
      }

      if (!profileResponse.ok) {
        throw new Error('Failed to retrieve user profile credentials');
      }

      const profile = await profileResponse.json();
      Alert.alert("Success", `Logged in successfully via OTP! Welcome, ${profile.name}`);
      setName(profile.name);
      setCurrentScreen('dashboard');
    } catch (err: any) {
      Alert.alert("Verification Failed", err.message || "OTP verification failed.");
    }
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all details.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const bodyPayload = JSON.stringify({
        name: name,
        email: email,
        password: password,
        role: role
      });

      let response;
      try {
        response = await fetch('http://localhost:8000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: bodyPayload
        });
      } catch (err) {
        // Fallback for Android Emulator
        response = await fetch('http://10.0.2.2:8000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: bodyPayload
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Email might already be registered.');
      }

      Alert.alert("Success", "Account created successfully! Please Sign In.");
      setCurrentScreen('login');
      setName("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      Alert.alert("Registration Failed", err.message || "Unable to register at this time.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Header Logo */}
        <View style={styles.header}>
          <Text style={styles.logoText}>FUELUP<Text style={styles.orangeText}>.MOBILE</Text></Text>
          <Text style={styles.subtitle}>fuelupeducation.com mobile platform</Text>
        </View>

        {/* Screen Switch Logic */}
        {currentScreen === 'login' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign In</Text>
            
            {/* Login Mode selector */}
            <Text style={styles.inputLabel}>Login Method</Text>
            <View style={styles.roleRow}>
              <TouchableOpacity 
                style={[styles.roleButton, loginMode === 'password' && styles.roleActive]} 
                onPress={() => { setLoginMode('password'); setOtpSent(false); }}
              >
                <Text style={[styles.roleBtnText, loginMode === 'password' && styles.roleActiveText]}>Password</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.roleButton, loginMode === 'otp' && styles.roleActive]} 
                onPress={() => setLoginMode('otp')}
              >
                <Text style={[styles.roleBtnText, loginMode === 'otp' && styles.roleActiveText]}>Email OTP</Text>
              </TouchableOpacity>
            </View>

            {/* Role Toggle selector */}
            <Text style={styles.inputLabel}>Workspace Profile</Text>
            <View style={styles.roleRow}>
              <TouchableOpacity 
                style={[styles.roleButton, role === 'student' && styles.roleActive]} 
                onPress={() => setRole('student')}
              >
                <Text style={[styles.roleBtnText, role === 'student' && styles.roleActiveText]}>Student</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.roleButton, role === 'creator' && styles.roleActive]} 
                onPress={() => setRole('creator')}
              >
                <Text style={[styles.roleBtnText, role === 'creator' && styles.roleActiveText]}>Creator</Text>
              </TouchableOpacity>
            </View>

            {/* Email Input */}
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={[styles.textInput, (loginMode === 'otp' && otpSent) && { opacity: 0.6 }]}
              placeholder="name@domain.com"
              placeholderTextColor="#64748B"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!(loginMode === 'otp' && otpSent)}
              value={email}
              onChangeText={setEmail}
            />

            {/* Password Input (Traditional Password Mode) */}
            {loginMode === 'password' && (
              <>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••"
                  placeholderTextColor="#64748B"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </>
            )}

            {/* OTP Code Input (Email OTP Mode && Sent) */}
            {loginMode === 'otp' && otpSent && (
              <>
                <Text style={[styles.inputLabel, { color: '#FF6A3D', fontWeight: 'bold' }]}>Enter 6-Digit OTP</Text>
                <TextInput
                  style={[styles.textInput, { letterSpacing: 4, fontWeight: 'bold', fontSize: 16 }]}
                  placeholder="123456"
                  placeholderTextColor="#64748B"
                  maxLength={6}
                  keyboardType="number-pad"
                  value={otpCode}
                  onChangeText={(text) => setOtpCode(text.replace(/\D/g, ""))}
                />
                <TouchableOpacity onPress={handleSendOTP} style={{ alignSelf: 'flex-end', marginTop: 8 }}>
                  <Text style={{ color: '#FF6A3D', fontSize: 12, fontWeight: '700' }}>Resend Code</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Submit Action Button */}
            <TouchableOpacity 
              style={styles.buttonPrimary} 
              onPress={() => {
                if (loginMode === 'password') {
                  handleLogin();
                } else {
                  if (!otpSent) {
                    handleSendOTP();
                  } else {
                    handleVerifyOTP();
                  }
                }
              }}
            >
              <Text style={styles.buttonText}>
                {loginMode === 'password' ? 'Sign In' : (otpSent ? 'Verify & Sign In' : 'Send OTP Code')}
              </Text>
            </TouchableOpacity>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => setCurrentScreen('register')}>
                <Text style={styles.linkText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentScreen === 'register' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Create Account</Text>

            {/* Full Name */}
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Virat Kohli"
              placeholderTextColor="#64748B"
              value={name}
              onChangeText={setName}
            />

            {/* Email */}
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.textInput}
              placeholder="virat@domain.com"
              placeholderTextColor="#64748B"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            {/* Role selection */}
            <View style={styles.roleRow}>
              <TouchableOpacity 
                style={[styles.roleButton, role === 'student' && styles.roleActive]} 
                onPress={() => setRole('student')}
              >
                <Text style={[styles.roleBtnText, role === 'student' && styles.roleActiveText]}>Student</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.roleButton, role === 'creator' && styles.roleActive]} 
                onPress={() => setRole('creator')}
              >
                <Text style={[styles.roleBtnText, role === 'creator' && styles.roleActiveText]}>Creator</Text>
              </TouchableOpacity>
            </View>

            {/* Password */}
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.textInput}
              placeholder="••••••••"
              placeholderTextColor="#64748B"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {/* Confirm Password */}
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={styles.textInput}
              placeholder="••••••••"
              placeholderTextColor="#64748B"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity style={styles.buttonPrimary} onPress={handleRegister}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => setCurrentScreen('login')}>
                <Text style={styles.linkText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentScreen === 'dashboard' && (
          <View style={styles.card}>
            <View style={styles.dashboardHeader}>
              <Text style={styles.cardTag}>WELCOME BACK {name ? name.toUpperCase() : ""}</Text>
              <TouchableOpacity onPress={() => { setCurrentScreen('login'); setMarkedCount(0); }}>
                <Text style={styles.logoutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.cardTitle}>The Solar System</Text>
            <Text style={styles.cardDesc}>
              Access dynamic structures, automated video lectures, study guides, and track your progress offline.
            </Text>

            <View style={styles.divider} />

            <View style={styles.attendanceBox}>
              <Text style={styles.attendanceTitle}>Mobile Attendance check-in</Text>
              <Text style={styles.attendanceText}>Marked Check-ins: {markedCount}</Text>
              
              <TouchableOpacity 
                style={styles.buttonPrimary} 
                onPress={() => setMarkedCount(markedCount + 1)}
              >
                <Text style={styles.buttonText}>Mark Attendance</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Global Connection indicator */}
        <View style={styles.statusBox}>
          <Text style={styles.statusTitle}>Network Synchronizer Status</Text>
          <View style={styles.statusIndicatorRow}>
            <View style={styles.greenCircle} />
            <Text style={styles.statusText}>Connected to api.fuelupeducation.com</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0915',
  },
  scrollContainer: {
    padding: 24,
    alignItems: 'center',
  },
  header: {
    marginTop: 40,
    marginBottom: 32,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  orangeText: {
    color: '#FF6A3D',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
  },
  card: {
    width: '100%',
    backgroundColor: '#121026',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF6A3D',
    letterSpacing: 1,
  },
  cardDesc: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 6,
    marginTop: 12,
  },
  textInput: {
    backgroundColor: '#0A0915',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    color: '#FFF',
    fontSize: 14,
  },
  roleRow: {
    flexDirection: 'row',
    backgroundColor: '#0A0915',
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.15)',
    marginBottom: 8,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  roleActive: {
    backgroundColor: '#1E1B4B',
  },
  roleBtnText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  roleActiveText: {
    color: '#FF6A3D',
  },
  buttonPrimary: {
    backgroundColor: '#FF6A3D',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  switchText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  linkText: {
    color: '#FF6A3D',
    fontSize: 13,
    fontWeight: '700',
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoutText: {
    color: '#94A3B8',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  attendanceBox: {
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  attendanceTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  attendanceText: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 10,
  },
  statusBox: {
    width: '100%',
    backgroundColor: '#121026',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
