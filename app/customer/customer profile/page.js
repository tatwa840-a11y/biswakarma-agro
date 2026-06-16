'use client'
import { useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { FiUser, FiLogOut, FiShoppingBag, FiPhone, FiMail } from 'react-icons/fi'

export default function CustomerProfile() {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser)
          const userDoc = await getDoc(doc(db, 'customers', currentUser.uid))
          if (userDoc.exists()) {
            setUserData(userDoc.data())
          } else {
            console.log("No user data found!")
          }
        } else {
          router.push('/customer-login')
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await signOut(auth)
    setUser(null)
    setUserData(null)
    router.push('/customer-login')
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-3">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-600 font-medium">ଦୟାକରି ଅପେକ୍ଷା କରନ୍ତୁ...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-700">🌾 Biswakarma Agro</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">My Profile / ମୋ ପ୍ରୋଫାଇଲ୍</h2>

        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <FiUser className="text-green-600 text-3xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{userData?.name || 'Customer'}</h3>
              <p className="text-slate-500">Customer ID: {user?.uid?.substring(0, 8)}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <FiMail className="text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="font-semibold text-slate-800">{user?.email || 'Not Added'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <FiPhone className="text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Phone / ଫୋନ୍</p>
                <p className="font-semibold text-slate-800">{userData?.phone || 'Not Added'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiShoppingBag className="text-green-600 text-2xl" />
            <h3 className="text-xl font-bold text-slate-800">My Orders / ମୋ ଅର୍ଡର</h3>
          </div>
          <div className="text-center py-10 text-slate-500">
            <p>ଏପର୍ଯ୍ୟନ୍ତ କିଛି Order ନାହିଁ</p>
            <button
              onClick={() => router.push('/products')}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Shop Now / ଏବେ କିଣନ୍ତୁ
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}