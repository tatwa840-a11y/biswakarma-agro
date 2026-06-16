'use client'
import { useRouter } from 'next/navigation'
import { useState, useCallback, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import {
  FiArrowRight,
  FiShoppingBag,
  FiShield,
  FiTruck,
  FiAward,
  FiPhoneCall,
  FiSettings,
  FiGrid
} from 'react-icons/fi'

const COLORS = {
  primary: '#064e3b',
  secondary: '#fbbf24',
  accent: '#34d399',
  light: '#f8fafc',
  white: '#ffffff',
  dark: '#0f172a',
  border: '#e2e8f0',
  gold: '#fcd34d',
}

const PRODUCTS = [
  { id: 1, name: 'ଧାନ ବିହନ - IR-64', price: 2200, unit: 'କୁଇଣ୍ଟାଲ', img: '/paddy1.jpg', badge: 'ଜଣାଶୁଣା', emoji: '🌾' },
  { id: 2, name: 'ଧାନ ବିହନ - MTU-1010', price: 2250, unit: 'କୁଇଣ୍ଟାଲ', img: '/paddy2.jpg', badge: 'ନୂଆ', emoji: '🌱' },
  { id: 3, name: 'ସାର - DAP', price: 1350, unit: 'ବ୍ୟାଗ', img: '/dap.jpg', badge: '', emoji: '🌿' },
  { id: 4, name: 'କୀଟନାଶକ', price: 450, unit: 'ଲିଟର', img: '/pesticide.jpg', badge: '', emoji: '🛡️' },
]

const TRUST_ITEMS = [
  { icon: <FiShield />, label: 'ଗୁଣମାନ ନିଶ୍ଚିତ' },
  { icon: <FiTruck />, label: 'ଦ୍ରୁତ ଡ଼େଲିଭରି' },
  { icon: <FiAward />, label: 'ସର୍ବୋତ୍ତମ ମୂଲ୍ୟ' },
  { icon: <FiPhoneCall />, label: '୨୪/୭ ସହାୟତା' },
]

function Button({ children, onClick, variant = 'primary', fullWidth = false,...props }) {
  const [isHovered, setIsHovered] = useState(false)

  const baseStyles = {
    padding: '12px 24px',
    fontSize: 15,
    border: 'none',
    borderRadius: 14,
    cursor: 'pointer',
    fontWeight: 700,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: fullWidth? '100%' : 'auto',
    fontFamily: 'inherit'
  }

  const variants = {
    primary: {
     ...baseStyles,
      background: COLORS.secondary,
      color: COLORS.primary,
      boxShadow: isHovered? '0 10px 15px -3px rgba(251, 191, 36, 0.3)' : 'none',
      transform: isHovered? 'translateY(-2px)' : 'none'
    },
    outline: {
     ...baseStyles,
      background: 'rgba(255,255,255,0.1)',
      color: COLORS.white,
      border: '1px solid rgba(255,255,255,0.3)',
      backdropFilter: 'blur(4px)',
      transform: isHovered? 'translateY(-2px)' : 'none'
    },
    dark: {
     ...baseStyles,
      background: COLORS.primary,
      color: COLORS.white,
      boxShadow: isHovered? '0 10px 15px -3px rgba(6, 78, 59, 0.3)' : 'none',
      transform: isHovered? 'translateY(-2px)' : 'none'
    },
    ghost: {
     ...baseStyles,
      background: 'transparent',
      color: COLORS.primary,
      padding: '8px 16px',
      fontSize: 14
    }
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={variants[variant] || variants.primary}
      {...props}
    >
      {children}
    </button>
  )
}

function ProductCard({ product }) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <div
      style={{
        background: COLORS.white,
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: isHovered? '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)' : '0 1px 3px rgba(0,0,0,0.02)',
        border: `1px solid ${isHovered? COLORS.accent + '40' : COLORS.border}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered? 'translateY(-8px)' : 'translateY(0)',
        cursor: 'pointer'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push('/products')}
    >
      <div style={{ width: '100%', height: 220, background: '#f8fafc', position: 'relative', overflow: 'hidden' }} >
        {!imageError && (
          <img
            src={product.img}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isHovered? 0.9 : 1, transition: 'opacity 0.3s' }}
            onError={() => setImageError(true)}
          />
        )}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, zIndex: imageError? 1 : 0, filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))' }} >
          {product.emoji}
        </div>
        {product.badge && (
          <div style={{ position: 'absolute', top: 16, left: 16, background: COLORS.secondary, color: COLORS.primary, fontSize: 11, fontWeight: 800, padding: '5px 12px', borderRadius: 10, zIndex: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }} >
            {product.badge}
          </div>
        )}
      </div>
      <div style={{ padding: '24px' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px', color: COLORS.dark, lineHeight: 1.3 }} > {product.name} </h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: COLORS.primary }}> ₹{product.price.toLocaleString('en-IN')} </span>
          <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}> / {product.unit} </span>
        </div>
        <Button variant="dark" fullWidth>
          ଏବେ କିଣନ୍ତୁ <FiShoppingBag size={16} />
        </Button>
      </div>
    </div>
  )
}

// 1. PREMIUM NAVIGATION - REPLACE କର
function Navigation() {
  const router = useRouter()
  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 80,
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)'
    }} >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.primary}, #059669)`,
          width: 44,
          height: 44,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 16px rgba(6, 78, 59, 0.3)'
        }}>
          <span style={{ fontSize: 24 }}>🌾</span>
        </div>
        <span style={{
          color: COLORS.dark,
          fontSize: 22,
          fontWeight: 900,
          letterSpacing: '-0.03em',
          background: `linear-gradient(135deg, ${COLORS.primary}, #059669)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }} > Biswakarma Agro </span>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Button variant="ghost" onClick={() => router.push('/products')}>
          <FiGrid size={18} /> ସମସ୍ତ ଉତ୍ପାଦ
        </Button>
        <Button variant="primary" onClick={() => router.push('/login')} style={{
          padding: '10px 20px',
          fontSize: 14,
          boxShadow: '0 8px 16px rgba(251, 191, 36, 0.3)'
        }}>
          Admin <FiSettings size={16} />
        </Button>
      </div>
    </nav>
  )
}

// 2. PREMIUM OFFER BANNER - REPLACE କର
function OfferBanner() {
  const [offers, setOffers] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const q = query(collection(db, 'offers'), where('active', '==', true), limit(5))
        const snap = await getDocs(q)
        if (!snap.empty) {
          setOffers(snap.docs.map(doc => ({ id: doc.id,...doc.data() })))
        }
      } catch (e) { console.error(e) }
    }
    fetchOffers()
  }, [])

  useEffect(() => {
    if (offers.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [offers.length])

  if (offers.length === 0) return null
  const currentOffer = offers[currentIndex]

  return (
    <div style={{
      background: currentOffer.imageUrl
    ? `linear-gradient(135deg, rgba(6,78,59,0.95) 0%, rgba(6,78,59,0.8) 100%), url(${currentOffer.imageUrl})`
       : `linear-gradient(135deg, ${COLORS.primary} 0%, #065f46 100%)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '40px 24px',
      margin: '24px',
      borderRadius: '32px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(6, 78, 59, 0.25)'
    }}>
      {offers.length > 1 && (
        <div style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 10,
          zIndex: 10
        }}>
          {offers.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: currentIndex === idx? 40 : 10,
                height: 10,
                borderRadius: 10,
                background: currentIndex === idx? COLORS.secondary : 'rgba(255,255,255,0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: currentIndex === idx? '0 0 20px rgba(251, 191, 36, 0.5)' : 'none'
              }}
            />
          ))}
        </div>
      )}

      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 40,
        flexWrap: 'wrap',
        position: 'relative',
        zIndex: 1,
        minHeight: 240
      }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(251, 191, 36, 0.2)',
            padding: '8px 16px',
            borderRadius: '12px',
            marginBottom: 20,
            fontSize: 13,
            fontWeight: 800,
            color: COLORS.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            border: '1px solid rgba(251, 191, 36, 0.4)',
            backdropFilter: 'blur(8px)'
          }}>
            🔥 ଅଫର୍ {currentIndex + 1}/{offers.length}
          </div>
          <h2 style={{
            margin: '0 0 12px',
            fontWeight: 900,
            fontSize: 'clamp(28px, 5vw, 48px)',
            color: COLORS.white,
            lineHeight: 1.1,
            textShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            {currentOffer.title}
          </h2>
          <p style={{
            margin: 0,
            fontSize: 'clamp(16px, 2.5vw, 22px)',
            color: COLORS.accent,
            fontWeight: 600,
            lineHeight: 1.5,
            textShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {currentOffer.description}
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => window.location.href = '/products'}
          style={{
            padding: '20px 40px',
            fontSize: 18,
            whiteSpace: 'nowrap',
            boxShadow: '0 10px 30px rgba(251, 191, 36, 0.4)'
          }}
        >
          ଏବେ କିଣନ୍ତୁ <FiArrowRight size={22} />
        </Button>
      </div>

      {offers.length > 1 && (
        <div style={{
          position: 'absolute',
          top: 24,
          right: 24,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(12px)',
          padding: '10px 18px',
          borderRadius: 14,
          fontSize: 14,
          fontWeight: 700,
          color: COLORS.white,
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <span style={{ fontSize: 18 }}>🎁</span> {offers.length} Active Offers
        </div>
      )}
    </div>
  )
}

// 3. PREMIUM HERO SECTION - REPLACE କର
function HeroSection() {
  const router = useRouter()
  return (
    <div style={{
      background: `radial-gradient(circle at 20% 50%, #065f46, ${COLORS.primary}), radial-gradient(circle at 80% 50%, #059669, ${COLORS.primary})`,
      padding: '100px 24px 120px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      margin: '0 24px 24px',
      borderRadius: '40px',
      boxShadow: '0 30px 60px -15px rgba(6, 78, 59, 0.3)'
    }} >
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)',
        animation: 'pulse 4s ease-in-out infinite'
      }} />
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>

      <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto' }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(52, 211, 153, 0.15)',
          border: '2px solid rgba(52, 211, 153, 0.3)',
          borderRadius: 24,
          padding: '8px 24px',
          fontSize: 15,
          color: COLORS.accent,
          marginBottom: 32,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          backdropFilter: 'blur(8px)'
        }} > 🌾 ଓଡ଼ିଶାର ବିଶ୍ୱସ୍ତ କୃଷି ପ୍ରତିଷ୍ଠାନ </div>

        <h1 style={{
          fontSize: 'clamp(48px, 10vw, 88px)',
          color: COLORS.white,
          margin: '0 0 24px',
          fontWeight: 900,
          lineHeight: 0.95,
          letterSpacing: '-0.05em',
          textShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }} >
          Biswakarma <br/>
          <span style={{
            background: `linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.gold} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Agro</span>
        </h1>

        <p style={{
          fontSize: 'clamp(20px, 3.5vw, 28px)',
          color: '#d1fae5',
          margin: '0 0 56px',
          fontWeight: 500,
          maxWidth: 700,
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: 1.6,
          opacity: 0.95
        }} > ଉନ୍ନତ ମାନର ବିହନ, ସାର ଓ କୀଟନାଶକ — ସିଧା ଆପଣଙ୍କ ଘରକୁ </p>

        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary" onClick={() => router.push('/products')} style={{
            padding: '22px 48px',
            fontSize: 20,
            boxShadow: '0 20px 40px rgba(251, 191, 36, 0.5)'
          }} >
            ଏବେ କିଣନ୍ତୁ <FiArrowRight size={24} />
          </Button>
          <Button variant="outline" onClick={() => router.push('/products')} style={{
            padding: '22px 48px',
            fontSize: 20,
            backdropFilter: 'blur(12px)'
          }} >
            ସମସ୍ତ ଉତ୍ପାଦ ଦେଖନ୍ତୁ
          </Button>
        </div>
      </div>
    </div>
  )
}

function TrustStrip() {
  return (
    <div style={{
      background: COLORS.white,
      padding: '32px 24px',
      display: 'flex',
      justifyContent: 'center',
      gap: 'clamp(24px, 6vw, 80px)',
      flexWrap: 'wrap',
      margin: '0 24px 48px',
      borderRadius: '24px',
      border: '1px solid #f1f5f9'
    }} >
      {TRUST_ITEMS.map(({ icon, label }, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: COLORS.dark, fontSize: 15, fontWeight: 700 }} >
          <div style={{ color: COLORS.primary, fontSize: 20 }}>{icon}</div>
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}

function ProductsSection() {
  const router = useRouter()
  return (
    <section style={{ padding: '0 24px 80px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: COLORS.dark, margin: '0 0 12px', fontWeight: 800, letterSpacing: '-0.02em' }} > ଆମର ମୁଖ୍ୟ ଉତ୍ପାଦ </h2>
        <div style={{ width: 64, height: 4, background: COLORS.secondary, margin: '0 auto', borderRadius: 10 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 32 }} >
        {PRODUCTS.map((product) => ( <ProductCard key={product.id} product={product} /> ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 64 }}>
        <Button variant="outline" onClick={() => router.push('/products')} style={{ color: COLORS.primary, borderColor: COLORS.primary, padding: '16px 48px' }} >
          ସମସ୍ତ ଉତ୍ପାଦ ଦେଖନ୍ତୁ <FiArrowRight size={18} />
        </Button>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: COLORS.primary, color: COLORS.white, padding: '64px 24px 32px' }} >
      <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
          <span style={{ fontSize: 32 }}>🌾</span>
          <span style={{ fontSize: 24, fontWeight: 800 }}>Biswakarma Agro</span>
        </div>
        <p style={{ fontSize: 16, color: COLORS.accent, maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.6 }}>
          ଓଡ଼ିଶାର କୃଷକମାନଙ୍କୁ ଉନ୍ନତମାନର କୃଷି ସାମଗ୍ରୀ ଯୋଗାଇଦେବା ଆମର ମୁଖ୍ୟ ଲକ୍ଷ୍ୟ।
        </p>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 32, opacity: 0.6, fontSize: 14 }}>
          © ୨୦୨୬ Biswakarma Agro • ଓଡ଼ିଶାର କୃଷକଙ୍କ ସେବାରେ
        </div>
      </div>
    </footer>
  )
}

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.light,
      fontFamily: "'Sora', 'Inter', system-ui, sans-serif",
      color: COLORS.dark,
    }} >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>
      <Navigation />
      <HeroSection />
      <OfferBanner />
      <TrustStrip />
      <ProductsSection />
      <Footer />
    </div>
  )
}