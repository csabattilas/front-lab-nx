import '../styles.css';
import './app.scss';

import { Route, Routes } from 'react-router-dom';
import Header from './components/shared/header/Header';
import Footer from './components/shared/footer/Footer';
import Home from './pages/home/Home';
import LockedSelectionPage from './pages/locked-selection/LockedSelection';
import CustomLionDemo from './pages/custom-lion/custom-lion-demo';

export function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/locked-selection" element={<LockedSelectionPage />} />
          <Route path="/custom-lion" element={<CustomLionDemo />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
