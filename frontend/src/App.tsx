import { Routes, Route } from 'react-router-dom';
import ScanPage from './pages/ScanPage';
import ScanAnalysisPage from './pages/ScanAnalysisPage';
import T2VScanResultPage from './pages/T2VScanResultPage';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WaitlistPage from './pages/WaitlistPage';
import FindIdPage from './pages/FindIdPage';
import FindPasswordPage from './pages/FindPasswordPage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ScanPage />} />
      <Route path="/scan/analysis" element={<ScanAnalysisPage />} />
      <Route path="/scan/analysis/t2v" element={<T2VScanResultPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/waitlist" element={<WaitlistPage />} />
      <Route path="/find-id" element={<FindIdPage />} />
      <Route path="/find-password" element={<FindPasswordPage />} />
    </Routes>
  );
}
