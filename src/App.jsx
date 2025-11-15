import { useEffect, useState } from 'react'

function App() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    address: '',
    vehicle_make: '',
    vehicle_model: '',
    service_name: '',
    preferred_date: '',
    preferred_time: '',
    notes: ''
  })
  const [message, setMessage] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/services`)
        const data = await res.json()
        setServices(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const submitBooking = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const res = await fetch(`${baseUrl}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status: 'pending' })
      })
      if (!res.ok) throw new Error('Failed to create booking')
      const data = await res.json()
      setMessage('Booking received! We will confirm shortly.')
      setForm({
        customer_name: '', phone: '', address: '', vehicle_make: '', vehicle_model: '',
        service_name: '', preferred_date: '', preferred_time: '', notes: ''
      })
    } catch (err) {
      setMessage('Could not submit booking. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      <header className="bg-white/70 backdrop-blur sticky top-0 z-10 border-b">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-700">Car Home Services</h1>
          <a href="/test" className="text-sm text-blue-600 hover:underline">System Test</a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <section className="text-center py-10">
          <h2 className="text-3xl font-semibold text-gray-800">Doorstep car care</h2>
          <p className="text-gray-600 mt-2">Car wash, small repairs, tyre puncture, and general servicing at your location.</p>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Choose a Service</h3>
            {loading ? (
              <p className="text-gray-500">Loading services...</p>
            ) : (
              <ul className="space-y-3">
                {services.map((s, idx) => (
                  <li key={idx} className={`border rounded-lg p-3 ${form.service_name===s.name? 'border-blue-500 bg-blue-50':'border-gray-200'}`}>
                    <button type="button" onClick={() => setForm({ ...form, service_name: s.name })} className="w-full text-left">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{s.name}</p>
                          <p className="text-sm text-gray-500">{s.description}</p>
                        </div>
                        <span className="text-blue-600 font-semibold">${'{'}s.base_price.toFixed(2){'}'}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">~ {s.duration_minutes} min</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Book at your doorstep</h3>
            <form className="space-y-3" onSubmit={submitBooking}>
              <input name="customer_name" value={form.customer_name} onChange={handleChange} placeholder="Full name" className="w-full border rounded px-3 py-2" required />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full border rounded px-3 py-2" required />
              <input name="address" value={form.address} onChange={handleChange} placeholder="Service address" className="w-full border rounded px-3 py-2" required />
              <div className="grid grid-cols-2 gap-3">
                <input name="vehicle_make" value={form.vehicle_make} onChange={handleChange} placeholder="Vehicle make" className="border rounded px-3 py-2" required />
                <input name="vehicle_model" value={form.vehicle_model} onChange={handleChange} placeholder="Vehicle model" className="border rounded px-3 py-2" required />
              </div>
              <select name="service_name" value={form.service_name} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
                <option value="">Select service</option>
                {services.map((s, idx) => (
                  <option key={idx} value={s.name}>{s.name}</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input type="date" name="preferred_date" value={form.preferred_date} onChange={handleChange} className="border rounded px-3 py-2" required />
                <input type="time" name="preferred_time" value={form.preferred_time} onChange={handleChange} className="border rounded px-3 py-2" required />
              </div>
              <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes (optional)" className="w-full border rounded px-3 py-2" rows="3" />
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded">Request Booking</button>
            </form>
            {message && <p className="mt-3 text-center text-sm text-gray-700">{message}</p>}
          </div>
        </section>

        <section className="mt-10 text-center text-sm text-gray-500">
          <p>We serve at your doorstep across the city. Trusted, transparent pricing.</p>
        </section>
      </main>
    </div>
  )
}

export default App
