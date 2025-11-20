export default function ServiceSelector({ services, selected, onSelect }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Choose a Service</h3>
      {services.length === 0 ? (
        <p className="text-gray-500">Loading services...</p>
      ) : (
        <ul className="space-y-3">
          {services.map((s, idx) => (
            <li key={idx} className={`border rounded-lg p-3 ${selected===s.name? 'border-blue-500 bg-blue-50':'border-gray-200'}`}>
              <button type="button" onClick={() => onSelect(s.name)} className="w-full text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{s.name}</p>
                    <p className="text-sm text-gray-500">{s.description}</p>
                  </div>
                  <span className="text-blue-600 font-semibold">${s.base_price.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">~ {s.duration_minutes} min</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
