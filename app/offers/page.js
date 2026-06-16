'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';

export default function OffersPanel() {
  const [offers, setOffers] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // 🔥 Image URL ପାଇଁ

  const fetchOffers = async () => {
    const snap = await getDocs(collection(db, 'offers'));
    setOffers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'offers'), {
      title,
      description: desc,
      imageUrl, // 🔥 Image URL Save ହେବ
      active: true,
      createdAt: serverTimestamp(),
    });
    setTitle('');
    setDesc('');
    setImageUrl(''); // 🔥 Reset
    fetchOffers();
  };

  const toggleActive = async (id, active) => {
    await updateDoc(doc(db, 'offers', id), { active: !active });
    fetchOffers();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'offers', id));
    fetchOffers();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🔥 Daily Offer Control</h1>
      <form onSubmit={handleAdd} className="bg-white p-6 rounded-xl border mb-6 space-y-4">
        <h2 className="text-xl font-semibold">ନୂଆ Offer Add କରନ୍ତୁ</h2>
        <input
          type="text"
          placeholder="Offer Title - ଆଜିର ଧମାକା"
          required
          className="w-full p-3 border rounded-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Details - ସବୁ ସାର ଉପରେ 20% ଛାଡ"
          required
          className="w-full p-3 border rounded-lg"
          rows={3}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL - https://..."
          className="w-full p-3 border rounded-lg"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold">
          Publish Offer
        </button>
      </form>
      <div className="space-y-3">
        {offers.map((offer) => (
          <div key={offer.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold">{offer.title}</h3>
                <span className={`text-xs px-2 py-1 rounded ${offer.active ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                  {offer.active ? 'Live' : 'Hidden'}
                </span>
              </div>
              <p className="text-slate-600 text-sm">{offer.description}</p>
              {offer.imageUrl && (
                <p className="text-xs text-slate-500 mt-1">📸 Image Added</p>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleActive(offer.id, offer.active)} className="p-2 hover:bg-slate-100 rounded-lg">
                {offer.active ? <FiEyeOff /> : <FiEye />}
              </button>
              <button onClick={() => handleDelete(offer.id)} className="p-2 hover:bg-red-100 rounded-lg text-red-600">
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}