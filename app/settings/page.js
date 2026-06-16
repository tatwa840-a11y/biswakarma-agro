'use client'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import Link from 'next/link'

export default function SettingsPage() {
  const [currentBg, setCurrentBg] = useState('/banner-bg.jpg')
  const [newUrl, setNewUrl] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getDoc(doc(db, 'settings', 'home')).then((snap) => {
      if (snap.exists()) {
        setCurrentBg(snap.data()?.hero_bg_url || '/banner-bg.jpg')
      }
    })
  }, [])

  const handleUpdate = async () => {
    if (!newUrl) return alert('Image Path ଦିଅ ବାପୁନ ଭାଇ: /your-image.jpg')
    setLoading(true)
    try {
      await updateDoc(doc(db, 'settings', 'home'), { hero_bg_url: newUrl })
      setCurrentBg(newUrl)
      alert('Background Change ହେଇଗଲା! 🎉 Page Refresh କର')
      setNewUrl('')
    } catch (error) {
      alert('Error: ' + error)
    }
    setLoading(false)
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-green-600 mb-6 inline-block">← Back to Dashboard</Link>
        <h1 className="text-3xl font-bold text-green-700 mb-6">⚙️ Website Settings</h1>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Home Page Background</h2>
          <img src={currentBg} className="w-full max-w-md h-48 object-cover rounded mb-6 border" />
          
          <div className="bg-yellow-50 p-4 rounded mb-4">
            <p className="text-sm font-bold mb-2">କେମିତି ବଦଳେଇବେ:</p>
            <p className="text-sm">1. `public` folder ରେ ନୂଆ photo ରଖ - ଯେମିତି `hero2.jpg`</p>
            <p className="text-sm">2. ତଳେ `/hero2.jpg` ଲେଖି Update ଦବା</p>
          </div>

          <input 
            type="text" 
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="/banner-bg.jpg ବା /new-photo.jpg" 
            className="border p-2 rounded w-full mb-4" 
          />
          <button onClick={handleUpdate} disabled={loading || !newUrl} className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded font-bold">
            {loading ? 'Updating...' : 'Background ବଦଳାନ୍ତୁ'}
          </button>
        </div>
      </div>
    </div>
  )
}