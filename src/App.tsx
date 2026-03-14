/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { FeeScanner } from './pages/FeeScanner';
import { Simulator } from './pages/Simulator';
import { AIAdvisor } from './pages/AIAdvisor';
import { GlassBox } from './pages/GlassBox';
import { Performance } from './pages/Performance';
import { ImportData } from './pages/ImportData';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/portfolio" element={<div className="p-8 text-white">Portfolio Page (Coming Soon)</div>} />
          <Route path="/import" element={<ImportData />} />
          <Route path="/advisor" element={<AIAdvisor />} />
          <Route path="/glass-box" element={<GlassBox />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/fee-scanner" element={<FeeScanner />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
