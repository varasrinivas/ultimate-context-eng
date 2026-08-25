import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import { NavRail } from './components/layout/NavRail';
import { CopilotPanel } from './components/copilot/CopilotPanel';
import { QueuePage } from './pages/QueuePage';
import { RequestsPage } from './pages/RequestsPage';
import { RequestDetailPage } from './pages/RequestDetailPage';
import { MembersPage, MemberDetailPage } from './pages/MembersPage';
import { SubmitPage } from './pages/SubmitPage';
import './components/layout/layout.css';

export default function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <div className="shell">
          <NavRail />
          <main className="main">
            <Routes>
              <Route path="/" element={<QueuePage />} />
              <Route path="/requests" element={<RequestsPage />} />
              <Route path="/requests/:id" element={<RequestDetailPage />} />
              <Route path="/members" element={<MembersPage />} />
              <Route path="/members/:id" element={<MemberDetailPage />} />
              <Route path="/submit" element={<SubmitPage />} />
            </Routes>
          </main>
          <CopilotPanel />
        </div>
      </BrowserRouter>
    </SessionProvider>
  );
}
