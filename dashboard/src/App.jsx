import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Sessions from './pages/Sessions';
import Heatmap from './pages/Heatmap';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Sessions />} />
            <Route path="/heatmap" element={<Heatmap />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
