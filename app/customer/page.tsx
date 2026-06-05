'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import Link from 'next/link';

type Customer = {
  id: string;
  name: string;
  phone: string;
  address?: string;
  createdAt?: any;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const q = query(collection(db, 'customers'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list: Customer[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Customer, 'id'>),
      }));
      setCustomers(list);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!name.trim() || !phone.trim()) {
      alert('ନାମ ଆଉ Phone Number ଦିଅ');
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, 'customers'), {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        createdAt: serverTimestamp(),
      });
      setName(''); setPhone(''); setAddress('');
      setShowForm(false);
      fetchCustomers();
    } catch (err) {
      alert('Error: ' + err);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ଏই Customer କୁ Delete କରିବ?')) return;
    await deleteDoc(doc(db, 'customers', id));
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  if (loading) return <div className="p-8 text-center text-xl">Loading... ⏳</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <button className="text-green-700 font-bold hover:underline">← Dashboard</button>
            </Link>
            <h1 className="text-3xl font-bold text-green-700">👥 Customers</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold"
          >
            {showForm ? '✕ Cancel' : '+ Add New Customer'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <p className="text-gray-600">Total Customers / ମୋଟ Customers</p>
            <p className="text-3xl font-bold text-blue-600">{customers.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <p className="text-gray-600">ଆଜି Added</p>
            <p className="text-3xl font-bold text-green-600">
              {customers.filter(c => {
                if (!c.createdAt?.toDate) return false;
                const today = new Date();
                const d = c.createdAt.toDate();
                return d.toDateString() === today.toDateString();
              }).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
            <p className="text-gray-600">Search Results</p>
            <p className="text-3xl font-bold text-yellow-600">{filtered.length}</p>
          </div>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-green-700 mb-4">ନୂଆ Customer ଯୋଡ଼ନ୍ତୁ</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <input
                placeholder="Customer ନାମ *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <input
                placeholder="Phone Number *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <input
                placeholder="ଠିକଣା (Optional)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        )}

        {/* Search */}
        <div className="mb-4">
          <input
            placeholder="🔍 ନାମ ବା Phone ଦ୍ୱାରା Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">ନାମ / Name</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">ଠିକଣା / Address</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-gray-500">{i + 1}</td>
                  <td className="p-3 font-semibold">{c.name}</td>
                  <td className="p-3">
                    <a href={`tel:${c.phone}`} className="text-blue-600 hover:underline">
                      {c.phone}
                    </a>
                  </td>
                  <td className="p-3 text-gray-600">{c.address || '—'}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded-lg text-sm font-bold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="p-8 text-center text-gray-500">
              {search ? 'କୌଣସି Customer ମିଳିଲା ନାହିଁ' : 'Customer ନାହିଁ। + Add New Customer ଦବାଇ ଯୋଡ଼ନ୍ତୁ।'}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
