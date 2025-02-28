
import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import CountryBlocking from '@/pages/CountryBlocking'
import TimeRestrictions from '@/pages/TimeRestrictions'
import AffiliateExceptions from '@/pages/AffiliateExceptions'
import NotFound from '@/pages/NotFound'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/country-blocking" replace />} />
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
