import { useEffect, useState } from 'react'
import Header from './components/Header'
import ServiceSelector from './components/ServiceSelector'
import BookingForm from './components/BookingForm'

function App() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState('en')
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    address: '',
    vehicle_make: '',
    vehicle_model: '',
    service_name: '',
    preferred_date: '',
    preferred_time: '',
    notes: '',
    selected_addons: [],
    package_name: '',
    latitude: '',
    longitude: ''
  })
  const [message, setMessage] = useState('')
  const [pricing, setPricing] = useState(null)
  const [quote, setQuote] = useState(null)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [svcRes, priceRes] = await Promise.all([
          fetch(`${baseUrl}/api/services`),
          fetch(`${baseUrl}/api/pricing`)
        ])
        const svcData = await svcRes.json()
        const priceData = await priceRes.json()
        setServices(svcData)
        setPricing(priceData)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const handleSelectService = (name) => setForm({ ...form, service_name: name })

  const submitBooking = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const payload = { ...form, status: 'pending' }
      if (quote?.total) payload.quoted_price = quote.total
      // empty strings -> undefined
      if (payload.latitude === '') delete payload.latitude
      if (payload.longitude === '') delete payload.longitude
      if (!payload.package_name) delete payload.package_name
      const res = await fetch(`${baseUrl}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to create booking')
      await res.json()
      setMessage('Booking received! We will confirm shortly.')
      setForm({
        customer_name: '', phone: '', address: '', vehicle_make: '', vehicle_model: '',
        service_name: '', preferred_date: '', preferred_time: '', notes: '',
        selected_addons: [], package_name: '', latitude: '', longitude: ''
      })
      setQuote(null)
    } catch (err) {
      setMessage('Could not submit booking. Please try again.')
    }
  }

  const requestQuote = async () => {
    try {
      const payload = {
        service_name: form.service_name,
        package_name: form.package_name || undefined,
        selected_addons: form.selected_addons || [],
      }
      if (form.latitude && form.longitude) {
        payload.latitude = parseFloat(form.latitude)
        payload.longitude = parseFloat(form.longitude)
      }
      const res = await fetch(`${baseUrl}/api/quote`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Quote failed')
      const data = await res.json()
      setQuote(data)
    } catch (e) { console.error(e) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      <Header lang={lang} setLang={setLang} />

      <main className="max-w-5xl mx-auto p-4">
        <section className="grid md:grid-cols-2 gap-6">
          <ServiceSelector services={services} selected={form.service_name} onSelect={handleSelectService} />
          <BookingForm services={services} selectedService={form.service_name} form={form} setForm={setForm} onSubmit={submitBooking} pricing={pricing} quote={quote} onQuote={requestQuote} />
        </section>

        <section className="mt-6">
          {message && <p className="text-center text-sm text-gray-700 bg-white rounded p-3 shadow">{message}</p>}
        </section>

        <section className="mt-10 grid md:grid-cols-3 gap-4">
          {[{
            title: 'On-demand', desc: 'Book same-day slots at your address'
          },{
            title: 'Transparent pricing', desc: 'Instant quotes with addons'
          },{
            title: 'Trusted pros', desc: 'Background-checked technicians'
          }].map((f,i)=> (
            <div key={i} className="bg-white rounded-xl shadow p-5">
              <p className="font-semibold text-slate-800">{f.title}</p>
              <p className="text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 text-center text-sm text-gray-500">
          <p>We serve at your doorstep across the city. Trusted, transparent pricing.</p>
        </section>
      </main>
    </div>
  )
}

export default App
