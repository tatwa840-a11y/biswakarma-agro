'use client';
import { useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';

export default function AddProduct() {
  const [formData, setFormData] = useState({
    productName: '', category: '', brand: '', technicalName: '',
    packSize: '', unit: 'ml', unitsPerBox: '', purchasePrice: '',
    mrp: '', sellingPrice: '', discount: '', gst: '',
    openingStock: '', minStockAlert: '', recommendedCrop: '',
    targetPest: '', dosePerAcre: ''
  });
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = '';
      if (mainImage) {
        const storageRef = ref(storage, `products/${Date.now()}_${mainImage.name}`);
        const snapshot = await uploadBytes(storageRef, mainImage);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, 'products'), {
      ...formData,
        price: Number(formData.sellingPrice),
        imageUrl: imageUrl,
        createdAt: new Date(),
        stockStatus: Number(formData.openingStock) > Number(formData.minStockAlert)? 'In Stock' : 'Low Stock'
      });

      alert('Product Save ହେଇଗଲା ✅');
      router.push('/dashboard');
    } catch (error) {
      alert('Error: ' + error);
    }
    setLoading(false);
  };

  const inputStyle = "border-2 border-gray-300 p-3 w-full rounded-lg focus:border-green-600 focus:outline-none";
  const labelStyle = "font-semibold text-gray-700 mb-1 block";
  const sectionStyle = "bg-white p-6 rounded-xl shadow-md border border-gray-200";

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-green-700">🌾 BISWAKARMA AGRO</h1>
        <p className="text-gray-600 mb-6">ନୂଆ Product Add କରନ୍ତୁ</p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* 1. Basic Information */}
          <div className={sectionStyle}>
            <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
              📦 Basic Information / ମୂଳ ତଥ୍ୟ
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Product Name / ପ୍ରଡକ୍ଟ ନାମ *</label>
                <input type="text" placeholder="ଯେମିତି: Tata M-45" value={formData.productName} onChange={(e) => setFormData({...formData, productName: e.target.value})} className={inputStyle} required />
              </div>
              <div>
                <label className={labelStyle}>Category / ପ୍ରକାର *</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className={inputStyle} required>
                  <option value="">Select କରନ୍ତୁ</option>
                  <option value="Insecticide">Insecticide / କୀଟନାଶକ</option>
                  <option value="Fungicide">Fungicide / ଫଙ୍ଗିସାଇଡ୍</option>
                  <option value="Herbicide">Herbicide / ଘାସ ମରା</option>
                  <option value="Fertilizer">Fertilizer / ସାର</option>
                  <option value="Plant Growth Promoter">PGP / ବୃଦ୍ଧି କାରକ</option>
                  <option value="Seed">Seed / ବିହନ</option>
                  <option value="Micronutrient">Micronutrient / ସୂକ୍ଷ୍ମ ପୋଷକ</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className={labelStyle}>Brand / କମ୍ପାନୀ *</label>
              <input type="text" placeholder="ଯେମିତି: Tata, Bayer, Syngenta" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} className={inputStyle} required />
            </div>
          </div>

          {/* 2. Image Upload */}
          <div className={sectionStyle}>
            <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
              🖼️ Product Photo / ପ୍ରଡକ୍ଟ ଫଟୋ
            </h2>
            <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
            {mainImagePreview && (
              <div className="relative w-40 mt-4">
                <img src={mainImagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-lg border-2 border-green-600" />
                <button type="button" onClick={() => {setMainImage(null); setMainImagePreview('')}} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center">✕</button>
              </div>
            )}
          </div>

          {/* 3. Technical Details */}
          <div className={sectionStyle}>
            <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
              🔬 Technical Details / ବୈଷୟିକ ତଥ୍ୟ
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Technical Name / ଟେକ୍ନିକାଲ୍ ନାମ</label>
                <input type="text" placeholder="ଯେମିତି: Mancozeb 75% WP" value={formData.technicalName} onChange={(e) => setFormData({...formData, technicalName: e.target.value})} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Units per Box / ବକ୍ସ ରେ କେତୋଟି</label>
                <input type="number" placeholder="ଯେମିତି: 50" value={formData.unitsPerBox} onChange={(e) => setFormData({...formData, unitsPerBox: e.target.value})} className={inputStyle} />
              </div>
            </div>
            <div className="mt-4">
              <label className={labelStyle}>Pack Size / ପ୍ୟାକ୍ ସାଇଜ୍</label>
              <div className="flex gap-2">
                <input type="number" placeholder="ଯେମିତି: 250" value={formData.packSize} onChange={(e) => setFormData({...formData, packSize: e.target.value})} className="border-2 border-gray-300 p-3 w-1/2 rounded-lg focus:border-green-600 focus:outline-none" />
                <select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="border-2 border-gray-300 p-3 w-1/2 rounded-lg focus:border-green-600 focus:outline-none">
                  <option value="ml">ml</option>
                  <option value="litre">litre</option>
                  <option value="gm">gm</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. Pricing */}
          <div className={sectionStyle}>
            <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
              💰 Pricing / ଦାମ୍
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className={labelStyle}>Purchase Price / କିଣା ଦାମ୍ *</label>
                <input type="number" placeholder="₹" value={formData.purchasePrice} onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})} className={inputStyle} required />
              </div>
              <div>
                <label className={labelStyle}>MRP *</label>
                <input type="number" placeholder="₹" value={formData.mrp} onChange={(e) => setFormData({...formData, mrp: e.target.value})} className={inputStyle} required />
              </div>
              <div>
                <label className={labelStyle}>Selling Price / ବିକ୍ରି ଦାମ୍ *</label>
                <input type="number" placeholder="₹" value={formData.sellingPrice} onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})} className={inputStyle} required />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className={labelStyle}>Discount % / ରିହାତି</label>
                <input type="number" placeholder="%" value={formData.discount} onChange={(e) => setFormData({...formData, discount: e.target.value})} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>GST %</label>
                <input type="number" placeholder="%" value={formData.gst} onChange={(e) => setFormData({...formData, gst: e.target.value})} className={inputStyle} />
              </div>
            </div>
          </div>

          {/* 5. Stock */}
          <div className={sectionStyle}>
            <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
              📊 Stock / ଷ୍ଟକ୍
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Opening Stock / ଆରମ୍ଭ ଷ୍ଟକ୍ *</label>
                <input type="number" placeholder="କେତୋଟି ଅଛି" value={formData.openingStock} onChange={(e) => setFormData({...formData, openingStock: e.target.value})} className={inputStyle} required />
              </div>
              <div>
                <label className={labelStyle}>Min Stock Alert / କମ୍ ହେଲେ ଜଣାଅ *</label>
                <input type="number" placeholder="କେତୋଟି ହେଲେ Alert" value={formData.minStockAlert} onChange={(e) => setFormData({...formData, minStockAlert: e.target.value})} className={inputStyle} required />
              </div>
            </div>
          </div>

          {/* 6. Crop Info */}
          <div className={sectionStyle}>
            <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
              🌾 Crop Info / ଫସଲ ତଥ୍ୟ
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className={labelStyle}>Recommended Crop / ଫସଲ</label>
                <input type="text" placeholder="ଯେମିତି: ଧାନ, ମକା" value={formData.recommendedCrop} onChange={(e) => setFormData({...formData, recommendedCrop: e.target.value})} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Target Pest / କୀଟ/ରୋଗ</label>
                <input type="text" placeholder="ଯେମିତି: ବ୍ଲାଷ୍ଟ, ବ୍ରାଉନ୍ ହପର୍" value={formData.targetPest} onChange={(e) => setFormData({...formData, targetPest: e.target.value})} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Dose per Acre / ଏକର ପିଛା ଡୋଜ୍</label>
                <input type="text" placeholder="ଯେମିତି: 250ml" value={formData.dosePerAcre} onChange={(e) => setFormData({...formData, dosePerAcre: e.target.value})} className={inputStyle} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg w-full text-lg font-bold shadow-lg">
            {loading? '⏳ Saving...' : '✅ Save Product / ସେଭ୍ କରନ୍ତୁ'}
          </button>
        </form>
      </div>
    </div>
  );
}