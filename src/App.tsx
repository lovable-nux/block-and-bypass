
import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import Dashboard from '@/pages/Index'
import CountryBlocking from '@/pages/CountryBlocking'
import TimeRestrictions from '@/pages/TimeRestrictions'
import AffiliateExceptions from '@/pages/AffiliateExceptions'
import NotFound from '@/pages/NotFound'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/country-blocking" element={<CountryBlocking />} />
          <Route path="/time-restrictions" element={<TimeRestrictions />} />
          <Route path="/affiliate-exceptions" element={<AffiliateExceptions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  )
}

export default App
