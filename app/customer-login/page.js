"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { FiPhone, FiUser, FiArrowLeft } from 'react-icons/fi';

export default function CustomerLogin() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Name
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (phone.length!== 10) {
      alert('10 Digit Phone Number ଦିଅନ୍ତୁ');
      return;
    }

    setLoading(true);

    // Check if customer exists
    const q = query(collection(db, 'customers'), where('mobile', '==', phone));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Old Customer - Name ଅଛି
      setIsNewCustomer(false);
      const customerData = querySnapshot.docs[0].data();
      setName(customerData.name);
    } else {
      // New Customer - Name ମାଗିବ
      setIsNewCustomer(true);
    }

    // Generate 6 digit OTP
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    console.log('OTP:', randomOtp); // Testing ପାଇଁ Console ରେ ଦେଖିବ
    alert(`Demo OTP: ${randomOtp}`); // Real SMS ବଦଳରେ Alert

    setStep(2);
    setLoading(false);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      if (isNewCustomer) {
        setStep(3); // Name ମାଗିବ
      } else {
        // Old customer - Direct login
        completeLogin(name);
      }
    } else {
      alert('ଭୁଲ OTP! ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ');
    }
  };

  // Step 3: Save New Customer + Login
  const completeLogin = async (customerName) => {
    setLoading(true);
    try {
      // New customer ହେଲେ DB ରେ Save କର
      if (isNewCustomer) {
        await addDoc(collection(db, 'customers'), {
          name: customerName.trim(),
          mobile: phone,
          createdAt: serverTimestamp(),
        });
      }

      // LocalStorage ରେ Save କର
      const customerData = {
        name: customerName.trim(),
        mobile: phone,
      };
      localStorage.setItem('customer', JSON.stringify(customerData));

      alert('Login Successful!');
      router.push('/customer'); // Dashboard କୁ ଯିବ
    } catch (error) {
      alert('Error: ' + error.message);
      setLoading(false);
    }
  };

  const handleNameSubmit = () => {
    if (!name.trim()) {
      alert('ନାମ ଲେଖନ୍ତୁ');
      return;
    }
    completeLogin(name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6"
        >
          <FiArrowLeft /> Back to Home
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="text-green-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Customer Login</h1>
          <p className="text-slate-500 mt-2">OTP ଦେଇ Login କରନ୍ତୁ</p>
        </div>

        {/* Step 1: Phone Number */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="10 Digit Number"
                  maxLength="10"
                />
              </div>
            </div>

            <button
              onClick={handleSendOtp}
              disabled={loading || phone.length!== 10}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-sm text-blue-700">
                OTP ପଠାଗଲା: <span className="font-bold">+91 {phone}</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength="6"
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={otp.length!== 6}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold disabled:opacity-50"
            >
              Verify OTP
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full text-slate-600 hover:text-slate-800 text-sm"
            >
              Change Phone Number
            </button>
          </div>
        )}

        {/* Step 3: Name for New Customer */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <p className="text-sm text-green-700">OTP Verified ✅</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Your Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="ନାମ ଲେଖନ୍ତୁ"
                />
              </div>
            </div>

            <button
              onClick={handleNameSubmit}
              disabled={loading ||!name.trim()}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold disabled:opacity-50"
            >
              {loading? 'Creating Account...' : 'Complete Login'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}