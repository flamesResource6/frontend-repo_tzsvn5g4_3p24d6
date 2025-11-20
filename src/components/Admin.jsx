import { useEffect, useState } from 'react'

export default function Admin() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const fetchData = async () => {
    setLoading(true)
    try {
      const qs = filter ? `?status=${encodeURIComponent(filter)}` : ''
      const res = await fetch(`${baseUrl}/api/bookings${qs}`)
      const data = await res.json()
      setItems(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ fetchData() }, [filter])

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${baseUrl}/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) fetchData()
    } catch(e) { console.error(e) }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-800">Admin - Bookings</h1>
          <a href="/" className="text-blue-600">Back to site</a>
        </div>
        <div className="bg-white rounded-xl shadow p-4 mb-4 flex items-center gap-3">
          <label className="text-sm text-slate-700">Filter by status</label>
          <select value={filter} onChange={(e)=>setFilter(e.target.value)} className="border rounded px-2 py-1">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button onClick={fetchData} className="ml-auto px-3 py-1 bg-slate-800 text-white rounded">Refresh</button>
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="space-y-3">
            {items.map((b)=> (
              <div key={b._id} className="bg-white rounded-lg border p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{b.customer_name} • {b.phone}</p>
                    <p className="text-sm text-slate-600">{b.service_name} • {b.vehicle_make} {b.vehicle_model}</p>
                    <p className="text-sm text-slate-600">{b.preferred_date} {b.preferred_time}</p>
                    {b.address && <p className="text-xs text-slate-500">{b.address}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Status: <span className="font-medium capitalize">{b.status}</span></p>
                    {b.quoted_price !== undefined && <p className="text-sm">Quote: ${b.quoted_price}</p>}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['pending','confirmed','completed','cancelled'].map(s => (
                    <button key={s} onClick={()=>updateStatus(b._id, s)} className={`px-3 py-1 rounded border ${b.status===s? 'bg-slate-800 text-white':'bg-white'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
