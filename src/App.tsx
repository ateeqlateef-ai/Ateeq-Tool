import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import LeadFinder from './pages/LeadFinder';
import Leads from './pages/Leads';
import FollowUps from './pages/FollowUps';
import Settings from './pages/Settings';

export default function App() {
  console.log("App mounting...");
  return (
    <Router>
      <div className="flex min-h-screen bg-[var(--color-brand-bg)] text-white font-sans selection:bg-[var(--color-brand-primary)] selection:text-black">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/finder" element={<LeadFinder />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/follow-ups" element={<FollowUps />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}
