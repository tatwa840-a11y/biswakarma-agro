'use client'
import { useState } from 'react'
import * as XLSX from 'xlsx'
import { db, storage } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useRouter } from 'next/navigation'
import { toast, Toaster } from 'sonner'

export default function AddProduct() {
  const [activeTab, setActiveTab] = useState('manual') // 'manual' or 'bulk'
  const [formData, setFormData] = useState({
    productName: '', category: '', brand: '', technicalName: '', 
    packSize: '', unit: 'ml', unitsPerBox: '', purchasePrice: '', 
    mrp: '', sellingPrice: '', discount: '', gst: '', 
    openingStock: '', minStockAlert: '', recommendedCrop: '', 
    targetPest: '', dosePerAcre: ''
  })
  const [mainImage, setMainImage] = useState(null)
  const [mainImagePreview, setMainImagePreview] = useState('')
  const [bulkProducts, setBulkProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // ===== MANUAL UPLOAD =====
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setMainImage(file)
      setMainImagePreview(URL.createObjectURL(file))
    }
  }

  const handleManualSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let imageUrl = ''
      if (mainImage) {
        const storageRef = ref(storage, `products/${Date.now()}_${mainImage.name}`)
        const snapshot = await uploadBytes(storageRef, mainImage)
        imageUrl = await getDownloadURL(snapshot.ref)
      }
      
      await addDoc(collection(db, 'products'), {
       ...formData,
        price: Number(formData.sellingPrice),
        purchasePrice: Number(formData.purchasePrice),
        mrp: Number(formData.mrp),
        sellingPrice: Number(formData.sellingPrice),
        openingStock: Number(formData.openingStock),
        minStockAlert: Number(formData.minStockAlert),
        unitsPerBox: Number(formData.unitsPerBox),
        imageUrl: imageUrl,
        createdAt: new Date(),
        stockStatus: Number(formData.openingStock) > Number(formData.minStockAlert)? 'In Stock' : 'Low Stock'
      })
      
      toast.success('Product Save ହେଇଗଲା ✅')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Error: ' + error.message)
    }
    setLoading(false)
  }

  // ===== BULK EXCEL UPLOAD =====
  const handleExcelUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(sheet)
        
        const validated = jsonData.map((item, index) => {
          if (!item['Product Name*'] ||!item['Category*'] ||!item['Brand*'] || 
            !item['Selling Price*'] ||!item['Opening Stock*']) {
            throw new Error(`Row ${index + 2}: * ଚିହ୍ନ Field ଦରକାର`)
          }
          
          return {
            productName: item['Product Name*'],
            category: item['Category*'],
            brand: item['Brand*'],
            technicalName: item['Technical Name'] || '',
            unitsPerBox: Number(item['Units per Box']) || 0,
            packSize: item['Pack Size'] || '',
            unit: item['Pack Unit'] || 'ml',
            purchasePrice: Number(item['Purchase Price']) || 0,
            mrp: Number(item['MRP']) || 0,
            sellingPrice: Number(item['Selling Price*']),
            price: Number(item['Selling Price*']),
            discount: Number(item['Discount %']) || 0,
            gst: Number(item['GST %']) || 0,
            openingStock: Number(item['Opening Stock*']),
            minStockAlert: Number(item['Min Stock Alert']) || 5,
            imageUrl: item['Image URL'] || '',
            recommendedCrop: item['Recommended Crop'] || '',
            targetPest: item['Target Pest'] || '',
            dosePerAcre: item['Dose per Acre'] || '',
            createdAt: new Date(),
            stockStatus: Number(item['Opening Stock*']) > Number(item['Min Stock Alert'] || 5)? 'In Stock' : 'Low Stock'
          }
        })
        
        setBulkProducts(validated)
        toast.success(`${validated.length} ଟା Product Ready`)
      } catch (error) {
        toast.error(error.message)
        setBulkProducts([])
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const downloadTemplate = () => {
    const sampleData = [{
      'Product Name*': 'Tata M-45',
      'Category*': 'Fungicide',
      'Brand*': 'Tata',
      'Technical Name': 'Mancozeb 75% WP',
      'Units per Box': 50,
      'Pack Size': 250,
      'Pack Unit': 'gm',
      'Purchase Price': 180,
      'MRP': 250,
      'Selling Price*': 220,
      'Discount %': 12,
      'GST %': 18,
      'Opening Stock*': 100,
      'Min Stock Alert': 10,
      'Image URL': 'https://example.com/tata-m45.jpg',
      'Recommended Crop': 'ଧାନ',
      'Target Pest': 'ବ୍ଲାଷ୍ଟ',
      'Dose per Acre': '250gm'
    }]
    const ws = XLSX.utils.json_to_sheet(sampleData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Products")
    XLSX.writeFile(wb, "Biswakarma-Template.xlsx")
  }

  const handleBulkSave = async () => {
    setLoading(true)
    try {
      await Promise.all(bulkProducts.map(p => addDoc(collection(db, 'products'), p)))
      toast.success(`${bulkProducts.length} ଟା Product Save ହେଲା!`)
      setBulkProducts([])
      router.push('/dashboard')
    } catch (error) {
      toast.error('Failed: ' + error.message)
    }
    setLoading(false)
  }

  const inputStyle = "border-2 border-gray-300 p-3 w-full rounded-lg focus:border-green-600 focus:outline-none"
  const labelStyle = "font-semibold text-gray-700 mb-1 block"
  const sectionStyle = "bg-white p-6 rounded-xl shadow-md border border-gray-200"

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <Toaster richColors />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-green-700">🌾 BISWAKARMA AGRO</h1>
        <p className="text-gray-600 mb-6">ନୂଆ Product Add କରନ୍ତୁ</p>

        {/* Tab Buttons */}
        <div className="flex gap-2 mb-6">
          <button 
            onClick={() => setActiveTab('manual')}
            className={`px-6 py-3 rounded-lg font-bold ${activeTab === 'manual'? 'bg-green-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            ✍️ Manual Entry
          </button>
          <button 
            onClick={() => setActiveTab('bulk')}
            className={`px-6 py-3 rounded-lg font-bold ${activeTab === 'bulk'? 'bg-green-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            📊 Excel Bulk Upload
          </button>
        </div>

        {/* MANUAL FORM */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-6">
            {/* 1. Basic Information */}
            <div className={sectionStyle}>
              <h2 className="text-xl font-bold text-green-700 mb-4">📦 Basic Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Product Name *</label>
                  <input type="text" placeholder="ଯେମିତି: Tata M-45" value={formData.productName} onChange={(e) => setFormData({...formData, productName: e.target.value})} className={inputStyle} required />
                </div>
                <div>
                  <label className={labelStyle}>Category *</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className={inputStyle} required>
                    <option value="">Select କରନ୍ତୁ</option>
                    <option value="Insecticide">Insecticide</option>
                    <option value="Fungicide">Fungicide</option>
                    <option value="Herbicide">Herbicide</option>
                    <option value="Fertilizer">Fertilizer</option>
                    <option value="Seed">Seed</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className={labelStyle}>Brand *</label>
                <input type="text" placeholder="Tata, Bayer, Syngenta" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} className={inputStyle} required />
              </div>
            </div>

            {/* 2. Image Upload */}
            <div className={sectionStyle}>
              <h2 className="text-xl font-bold text-green-700 mb-4">🖼️ Product Photo</h2>
              <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700" />
              {mainImagePreview && (
                <div className="relative w-40 mt-4">
                  <img src={mainImagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-lg border-2 border-green-600" />
                  <button type="button" onClick={() => {setMainImage(null); setMainImagePreview('')}} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7">✕</button>
                </div>
              )}
            </div>

            {/* 3. Technical Details */}
            <div className={sectionStyle}>
              <h2 className="text-xl font-bold text-green-700 mb-4">🔬 Technical Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Technical Name</label>
                  <input type="text" placeholder="Mancozeb 75% WP" value={formData.technicalName} onChange={(e) => setFormData({...formData, technicalName: e.target.value})} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Units per Box</label>
                  <input type="number" placeholder="50" value={formData.unitsPerBox} onChange={(e) => setFormData({...formData, unitsPerBox: e.target.value})} className={inputStyle} />
                </div>
              </div>
              <div className="mt-4">
                <label className={labelStyle}>Pack Size</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="250" value={formData.packSize} onChange={(e) => setFormData({...formData, packSize: e.target.value})} className="border-2 border-gray-300 p-3 w-1/2 rounded-lg" />
                  <select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="border-2 border-gray-300 p-3 w-1/2 rounded-lg">
                    <option value="ml">ml</option><option value="litre">litre</option>
                    <option value="gm">gm</option><option value="kg">kg</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 4. Pricing */}
            <div className={sectionStyle}>
              <h2 className="text-xl font-bold text-green-700 mb-4">💰 Pricing</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className={labelStyle}>Purchase Price *</label>
                  <input type="number" placeholder="₹" value={formData.purchasePrice} onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})} className={inputStyle} required />
                </div>
                <div>
                  <label className={labelStyle}>MRP *</label>
                  <input type="number" placeholder="₹" value={formData.mrp} onChange={(e) => setFormData({...formData, mrp: e.target.value})} className={inputStyle} required />
                </div>
                <div>
                  <label className={labelStyle}>Selling Price *</label>
                  <input type="number" placeholder="₹" value={formData.sellingPrice} onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})} className={inputStyle} required />
                </div>
              </div>
            </div>

            {/* 5. Stock */}
            <div className={sectionStyle}>
              <h2 className="text-xl font-bold text-green-700 mb-4">📊 Stock</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Opening Stock *</label>
                  <input type="number" placeholder="କେତୋଟି ଅଛି" value={formData.openingStock} onChange={(e) => setFormData({...formData, openingStock: e.target.value})} className={inputStyle} required />
                </div>
                <div>
                  <label className={labelStyle}>Min Stock Alert *</label>
                  <input type="number" placeholder="କେତୋଟି ହେଲେ Alert" value={formData.minStockAlert} onChange={(e) => setFormData({...formData, minStockAlert: e.target.value})} className={inputStyle} required />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg w-full text-lg font-bold">
              {loading? '⏳ Saving...' : '✅ Save Product'}
            </button>
          </form>
        )}

        {/* BULK UPLOAD */}
        {activeTab === 'bulk' && (
          <div className={sectionStyle}>
            <h2 className="text-xl font-bold text-green-700 mb-4">📊 Excel Bulk Upload</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="border-2 border-dashed p-6 rounded-lg">
                <h3 className="font-bold mb-3">1. Excel Upload କର</h3>
                <input type="file" accept=".xlsx,.xls" onChange={handleExcelUpload} className="mb-2" />
                <p className="text-xs text-gray-500">* ଚିହ୍ନ Column ଦରକାର</p>
              </div>
              
              <div className="border p-6 rounded-lg bg-blue-50">
                <h3 className="font-bold mb-3">2. Template ନାହିଁ?</h3>
                <button onClick={downloadTemplate} className="bg-blue-600 text-white px-4 py-2 rounded">
                  📥 Sample Excel Download
                </button>
              </div>
            </div>

            {bulkProducts.length > 0 && (
              <div>
                <h3 className="font-bold mb-3">Preview: {bulkProducts.length} ଟା Product</h3>
                <div className="overflow-x-auto mb-4 max-h-60">
                  <table className="w-full text-sm border">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Brand</th>
                        <th className="border p-2">Price</th>
                        <th className="border p-2">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulkProducts.map((p, i) => (
                        <tr key={i}>
                          <td className="border p-2">{p.productName}</td>
                          <td className="border p-2">{p.brand}</td>
                          <td className="border p-2">₹{p.sellingPrice}</td>
                          <td className="border p-2">{p.openingStock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <button onClick={handleBulkSave} disabled={loading} className="bg-green-600 text-white px-6 py-3 rounded font-bold disabled:bg-gray-400 w-full">
                  {loading? 'Uploading...' : `💾 ସବୁ ${bulkProducts.length} ଟା Save କର`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}