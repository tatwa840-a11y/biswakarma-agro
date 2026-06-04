'use client'
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    if (!email || !password) return alert('Email ଆଉ Password ଦିଅ');
    setLoading(true);
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Account ତିଆରି ହେଲା! Biswakarma Agro କୁ ସ୍ୱାଗତ 🎉');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Login Success! 🎉');
      }
      router.push('/'); // Login ପରେ Home Page କୁ ଯିବ
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('ଏଇ Email ରେ Account ଅଛି। Login କର।');
        setIsSignup(false);
      } else if (error.code === 'auth/weak-password') {
        alert('Password 6 digit ରୁ ଅଧିକ ଦିଅ');
      } else {
        alert('Error: ' + error.message);
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#16a34a' }}>Biswakarma Agro</h1>
      <p style={{ textAlign: 'center', marginBottom: 30, fontSize: 18 }}>
        {isSignup ? 'ନୂଆ Account ବନାନ୍ତୁ' : 'Email ଦେଇ Login କରନ୍ତୁ'}
      </p>
      
      <input 
        type="email" 
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: 12, width: '100%', marginBottom: 15, fontSize: 16, border: '1px solid #ccc', borderRadius: 8 }}
      />
      <input 
        type="password" 
        placeholder="Password - 6 Digit ରୁ ଅଧିକ"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: 12, width: '100%', marginBottom: 15, fontSize: 16, border: '1px solid #ccc', borderRadius: 8 }}
      />
      <button onClick={handleAuth} disabled={loading} style={{ padding: 12, width: '100%', fontSize: 16, background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', marginBottom: 15 }}>
        {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Login'}
      </button>

      <p style={{ textAlign: 'center', cursor: 'pointer', color: '#2563eb' }} onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? 'ପୁରୁଣା Account ଅଛି? Login କର' : 'ନୂଆ User? Sign Up କର'}
      </p>
    </div>
  );
}
