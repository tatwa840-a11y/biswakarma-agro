'use client'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  const products = [
    { id: 1, name: 'ଧାନ ବିହନ - IR-64', price: 2200, unit: 'କୁଇଣ୍ଟାଲ', img: '/paddy1.jpg', badge: 'ଜଣାଶୁଣା', emoji: '🌾' },
    { id: 2, name: 'ଧାନ ବିହନ - MTU-1010', price: 2250, unit: 'କୁଇଣ୍ଟାଲ', img: '/paddy2.jpg', badge: 'ନୂଆ', emoji: '🌱' },
    { id: 3, name: 'ସାର - DAP', price: 1350, unit: 'ବ୍ୟାଗ', img: '/dap.jpg', badge: '', emoji: '🌿' },
    { id: 4, name: 'କୀଟନାଶକ', price: 450, unit: 'ଲିଟର', img: '/pesticide.jpg', badge: '', emoji: '🛡️' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fdf6e9',
      fontFamily: "'Segoe UI', Arial, sans-serif",
      color: '#1a1a1a',
    }}>

      {/* Top Nav */}
      <nav style={{
        background: '#0f5c2e',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>🌾</span>
          <span style={{ color: 'white', fontSize: 20, fontWeight: 700, letterSpacing: 0.5 }}>
            Biswakarma Agro
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={() => router.push('/products')}
            style={{
              padding: '8px 18px',
              fontSize: 14,
              background: 'transparent',
              color: '#d4f0be',
              border: '1px solid #4a9e6b',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            ସମସ୍ତ ଉତ୍ପାଦ
          </button>
          <button
            onClick={() => router.push('/login')}
            style={{
              padding: '8px 18px',
              fontSize: 14,
              background: '#e8a020',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            Admin ⚙️
          </button>
        </div>
      </nav>

      {/* Offer Banner */}
      <div style={{
        background: 'linear-gradient(90deg, #b87d0e 0%, #e8a020 40%, #f5bc3a 60%, #e8a020 80%, #b87d0e 100%)',
        padding: '11px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.06) 40px, rgba(255,255,255,0.06) 41px)',
        }} />
        <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#3b1f00', position: 'relative' }}>
          🎉 ମୌସୁମୀ ଅଫର: 50 କୁଇଣ୍ଟାଲ ଉପରେ ଅର୍ଡର ଦେଲେ <strong>2% Extra ଛାଡ</strong> &nbsp;|&nbsp; Valid Till: 30 June 2026 🎉
        </p>
      </div>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(160deg, #0f5c2e 0%, #1a7d40 55%, #145e30 100%)',
        padding: '72px 32px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative grain texture overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(232,160,32,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(232,160,32,0.08) 0%, transparent 50%)',
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(232,160,32,0.18)',
            border: '1px solid rgba(232,160,32,0.4)',
            borderRadius: 20,
            padding: '4px 16px',
            fontSize: 13,
            color: '#f5d080',
            marginBottom: 20,
            letterSpacing: 1,
            fontWeight: 600,
            textTransform: 'uppercase',
          }}>
            ଓଡ଼ିଶାର ବିଶ୍ୱସ୍ତ କୃଷି ଦୋକାନ
          </div>
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 68px)',
            color: 'white',
            margin: '0 0 16px',
            fontWeight: 800,
            lineHeight: 1.1,
            textShadow: '0 2px 16px rgba(0,0,0,0.3)',
          }}>
            Biswakarma Agro
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 2.5vw, 22px)',
            color: '#a8e6bf',
            margin: '0 0 36px',
            fontWeight: 400,
            maxWidth: 500,
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.5,
          }}>
            ଉନ୍ନତ ମାନର ବିହନ, ସାର ଓ କୀଟନାଶକ — ସିଧା ଆପଣ ଘରକୁ
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => router.push('/products')}
              style={{
                padding: '14px 36px',
                fontSize: 17,
                background: '#e8a020',
                color: '#1a1a1a',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 700,
                boxShadow: '0 4px 16px rgba(232,160,32,0.4)',
                transition: 'transform 0.15s',
              }}
            >
              ଏବେ କିଣନ୍ତୁ →
            </button>
            <button
              onClick={() => router.push('/products')}
              style={{
                padding: '14px 36px',
                fontSize: 17,
                background: 'transparent',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.35)',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              ସମସ୍ତ ଉତ୍ପାଦ ଦେଖନ୍ତୁ
            </button>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div style={{
        background: '#0f5c2e',
        padding: '12px 32px',
        display: 'flex',
        justifyContent: 'center',
        gap: 'clamp(16px, 4vw, 60px)',
        flexWrap: 'wrap',
        borderBottom: '3px solid #e8a020',
      }}>
        {[
          ['✅', 'ଗୁଣମାନ ନିଶ୍ଚିତ'],
          ['🚚', 'ଦ୍ରୁତ ଡ଼େଲିଭରି'],
          ['💰', 'ସର୍ବୋତ୍ତମ ମୂଲ୍ୟ'],
          ['📞', '24/7 ସହାୟତା'],
        ].map(([icon, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#a8e6bf', fontSize: 14, fontWeight: 600 }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Products Section */}
      <div style={{ padding: 'clamp(32px, 5vw, 60px) clamp(20px, 5vw, 60px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 36px)',
            color: '#0f5c2e',
            margin: '0 0 10px',
            fontWeight: 800,
          }}>
            ଆମର ମୁଖ୍ୟ ଉତ୍ପାଦ
          </h2>
          <div style={{
            width: 60,
            height: 3,
            background: '#e8a020',
            margin: '0 auto',
            borderRadius: 2,
          }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24,
          maxWidth: 1200,
          margin: '0 auto',
        }}>
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                background: 'white',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(15,92,46,0.1)',
                border: '1px solid #e8f5e0',
                transition: 'box-shadow 0.2s, transform 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                (e.currentTarget).style.boxShadow = '0 8px 28px rgba(15,92,46,0.2)'
                ;(e.currentTarget).style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={e => {
                (e.currentTarget).style.boxShadow = '0 2px 12px rgba(15,92,46,0.1)'
                ;(e.currentTarget).style.transform = 'translateY(0)'
              }}
            >
              {/* Image area with emoji fallback */}
              <div style={{
                width: '100%',
                height: 180,
                background: 'linear-gradient(135deg, #d4f0be 0%, #a8d8a8 100%)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <img
                  src={product.img}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => {
                    (e.currentTarget).style.display = 'none'
                  }}
                />
                {/* Emoji fallback shown behind image */}
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 64,
                  zIndex: 0,
                }}>
                  {product.emoji}
                </div>
                {product.badge && (
                  <div style={{
                    position: 'absolute', top: 12, left: 12,
                    background: '#e8a020',
                    color: '#3b1f00',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 12,
                    zIndex: 2,
                    letterSpacing: 0.5,
                  }}>
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Card content */}
              <div style={{ padding: '18px 20px 20px' }}>
                <h3 style={{
                  fontSize: 17,
                  fontWeight: 700,
                  margin: '0 0 8px',
                  color: '#1a1a1a',
                  lineHeight: 1.3,
                }}>
                  {product.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 16 }}>
                  <span style={{ fontSize: 24, fontWeight: 800, color: '#0f5c2e' }}>
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>
                    / {product.unit}
                  </span>
                </div>
                <button
                  onClick={() => router.push('/products')}
                  style={{
                    width: '100%',
                    padding: '11px 0',
                    fontSize: 15,
                    fontWeight: 700,
                    background: '#0f5c2e',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    letterSpacing: 0.3,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1a7d40')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#0f5c2e')}
                >
                  ଏବେ କିଣନ୍ତୁ
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View all CTA */}
        <div style={{ textAlign: 'center', marginTop: 44 }}>
          <button
            onClick={() => router.push('/products')}
            style={{
              padding: '13px 40px',
              fontSize: 16,
              background: 'white',
              color: '#0f5c2e',
              border: '2px solid #0f5c2e',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 700,
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#0f5c2e'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'white'
              e.currentTarget.style.color = '#0f5c2e'
            }}
          >
            ସମସ୍ତ ଉତ୍ପାଦ ଦେଖନ୍ତୁ →
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: '#0f5c2e',
        color: '#a8e6bf',
        textAlign: 'center',
        padding: '28px 20px',
        fontSize: 14,
        marginTop: 20,
      }}>
        <p style={{ margin: '0 0 4px', fontWeight: 600, color: 'white' }}>Biswakarma Agro 🌾</p>
        <p style={{ margin: 0, opacity: 0.7 }}>© 2026 · ଓଡ଼ିଶାର କୃଷକଙ୍କ ସେବାରେ</p>
      </footer>
    </div>
  )
}