import { useEffect, useState } from 'react'

const translations = {
  en: {
    title: 'Car Home Services',
    systemTest: 'System Test',
    admin: 'Admin',
    tagline: 'Doorstep car care',
    subtitle: 'Car wash, small repairs, tyre puncture, and general servicing at your location.'
  },
  hi: {
    title: 'कार होम सर्विसेज़',
    systemTest: 'सिस्टम टेस्ट',
    admin: 'एडमिन',
    tagline: 'आपके दरवाज़े पर कार केयर',
    subtitle: 'कार वॉश, छोटे रिपेयर, टायर पंचर और जनरल सर्विसिंग – आपके लोकेशन पर।'
  }
}

export default function Header({ lang, setLang }) {
  const t = translations[lang]

  return (
    <header className="bg-white/70 backdrop-blur sticky top-0 z-10 border-b">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-blue-700">{t.title}</h1>
          <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">Beta</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/test" className="text-sm text-blue-600 hover:underline">{t.systemTest}</a>
          <a href="/admin" className="text-sm text-blue-600 hover:underline">{t.admin}</a>
          <select value={lang} onChange={(e)=>setLang(e.target.value)} className="border rounded px-2 py-1 text-sm">
            <option value="en">EN</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-50 to-violet-50 border-t">
        <div className="max-w-5xl mx-auto p-4 text-center">
          <h2 className="text-3xl font-semibold text-gray-800">{t.tagline}</h2>
          <p className="text-gray-600 mt-2">{t.subtitle}</p>
        </div>
      </div>
    </header>
  )
}
