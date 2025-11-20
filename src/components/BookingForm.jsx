import { useMemo } from 'react'

const ADDONS = [
  { code: 'pickup_drop', label: 'Pick-up & Drop', price: 8.0 },
  { code: 'sanitization', label: 'Interior Sanitization', price: 10.0 },
  { code: 'engine_check', label: 'Engine Health Check', price: 12.0 },
]

export default function BookingForm({ services, selectedService, form, setForm, onSubmit, pricing, quote, onQuote }) {
  const packages = useMemo(() => {
    const svc = services.find(s=>s.name===selectedService)
    if (!svc) return []
    const pk = pricing?.services?.find(s=>s.name===selectedService)?.packages || []
    return pk
  }, [services, selectedService, pricing])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name === 'selected_addons') {
      const updated = new Set(form.selected_addons || [])
      if (checked) updated.add(value); else updated.delete(value)
      setForm({ ...form, selected_addons: Array.from(updated) })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Book at your doorstep</h3>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input name="customer_name" value={form.customer_name} onChange={handleChange} placeholder="Full name" className="w-full border rounded px-3 py-2" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full border rounded px-3 py-2" required />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Service address" className="w-full border rounded px-3 py-2" required />
        <div className="grid grid-cols-2 gap-3">
          <input name="vehicle_make" value={form.vehicle_make} onChange={handleChange} placeholder="Vehicle make" className="border rounded px-3 py-2" required />
          <input name="vehicle_model" value={form.vehicle_model} onChange={handleChange} placeholder="Vehicle model" className="border rounded px-3 py-2" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select name="service_name" value={form.service_name} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
            <option value="">Select service</option>
            {services.map((s, idx) => (
              <option key={idx} value={s.name}>{s.name}</option>
            ))}
          </select>
          <select name="package_name" value={form.package_name||''} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="">Package (optional)</option>
            {packages.map((p, i)=> (
              <option key={i} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-sm text-gray-700 mb-2">Add-ons</p>
          <div className="grid grid-cols-2 gap-2">
            {ADDONS.map(a => (
              <label key={a.code} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="selected_addons" value={a.code} onChange={handleChange} checked={(form.selected_addons||[]).includes(a.code)} />
                <span>{a.label} (+${a.price})</span>
              </label>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input type="date" name="preferred_date" value={form.preferred_date} onChange={handleChange} className="border rounded px-3 py-2" required />
          <input type="time" name="preferred_time" value={form.preferred_time} onChange={handleChange} className="border rounded px-3 py-2" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input type="number" step="any" name="latitude" value={form.latitude||''} onChange={handleChange} placeholder="Latitude (optional)" className="border rounded px-3 py-2" />
          <input type="number" step="any" name="longitude" value={form.longitude||''} onChange={handleChange} placeholder="Longitude (optional)" className="border rounded px-3 py-2" />
        </div>
        <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes (optional)" className="w-full border rounded px-3 py-2" rows="3" />
        <div className="flex items-center justify-between">
          <button type="button" onClick={onQuote} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded">Get Instant Quote</button>
          {quote && (
            <div className="text-right">
              <p className="text-sm text-gray-700">Estimated total</p>
              <p className="text-lg font-semibold">${quote.total}</p>
            </div>
          )}
        </div>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded">Request Booking</button>
      </form>
    </div>
  )
}
