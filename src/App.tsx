import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { StarsCanvas } from './components/ui/StarsCanvas';
import { InteractiveNebulaShader } from './components/ui/InteractiveNebulaShader';
import ShaderCanvas from './components/ui/ShaderCanvas';
import { Tesseract } from './components/ui/Tesseract';

// Pages
import OmegaKey from './pages/OmegaKey';
import TrueCurve from './pages/TrueCurve';
import ReplicaQubit from './pages/ReplicaQubit';
import EgoLoss from './pages/EgoLoss';
import VerifyzProtocol from './pages/VerifyzProtocol';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden font-sans">
      {/* Background layer 1: Stars - Extremely slow drift */}
      <StarsCanvas maxStars={1500} brightness={8} speedMultiplier={0.04} />

      {/* Background layer 2: Nebula - Opacity naturally lowered by shader, doubled in size */}
      <InteractiveNebulaShader className="opacity-70 scale-[2] pointer-events-none" />

      {/* Background planets */}
      {/* Large: Dark red and dark purple, bottom left, off screen ~30%, doubled in size */}
      <ShaderCanvas
        color1="#301934"
        color2="#8b0000"
        cloudDensity={1.5}
        glowIntensity={1.2}
        rotationSpeed={0}
        cloudSpeed={0.15}
        className="absolute w-[120vmin] h-[120vmin] pointer-events-none z-10 animate-float"
        style={{ bottom: '-60vmin', left: '-50vmin' }}
      />

      {/* Medium: Dark blue, center right, touching edge */}
      <ShaderCanvas
        color1="#020617"
        color2="#1e3a8a"
        cloudDensity={2.0}
        glowIntensity={1.0}
        rotationSpeed={0.05}
        cloudSpeed={0.3}
        className="absolute w-[30vmin] h-[30vmin] pointer-events-none z-10 animate-float"
        style={{ top: '50%', right: '2vmin', transform: 'translateY(-50%)' }}
      />

      {/* Small: Green and orange, scaled down by half, moved top right above the medium planet */}
      <ShaderCanvas
        color1="#10b981"
        color2="#e2e8f0"
        cloudDensity={2.5}
        glowIntensity={0.8}
        rotationSpeed={0.08}
        cloudSpeed={0.35}
        className="absolute w-[9vmin] h-[9vmin] pointer-events-none z-10 animate-float"
        style={{ top: '15vmin', right: '35vmin' }}
      />

      {/* Moon image: Left center, above red planet, moved up and to the right slightly */}
      <img
        src="https://raw.githubusercontent.com/bencreizy/Seven-/main/moon_eoc.png"
        alt="Moon"
        className="absolute z-20 pointer-events-none w-40 object-contain animate-float"
        style={{ bottom: '70vmin', left: '260px' }}
      />

      {/* Foreground UI Layer */}
      <div className="relative z-30 w-full h-full min-h-screen flex flex-col pointer-events-auto">
        {/* Navigation */}
        <nav className="w-full flex justify-center gap-6 p-6 top-0 absolute bg-gradient-to-b from-black/80 to-transparent">
          <Link to="/" className="text-white/80 hover:text-white uppercase tracking-widest text-sm font-semibold transition-all">Home</Link>
          <Link to="/omega-key" className="text-white/80 hover:text-purple-400 uppercase tracking-widest text-sm font-semibold transition-all">Omega Key</Link>
          <Link to="/true-curve" className="text-white/80 hover:text-cyan-400 uppercase tracking-widest text-sm font-semibold transition-all">Phloez</Link>
          <Link to="/replica-qubit" className="text-white/80 hover:text-green-400 uppercase tracking-widest text-sm font-semibold transition-all">Qubit Sloot</Link>
          <Link to="/ego-loss" className="text-white/80 hover:text-red-400 uppercase tracking-widest text-sm font-semibold transition-all">Ego Loss</Link>
          <Link to="/verifyz" className="text-white/80 hover:text-blue-400 uppercase tracking-widest text-sm font-semibold transition-all">Verifyz</Link>
        </nav>

        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center p-4 pt-16 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {/* EOC Logo — Enlarged 3x and shifted very high */}
      <div
        className="absolute left-0 right-0 flex justify-center pointer-events-none select-none z-50"
        style={{ top: '-110px' }}
      >
        <img
          src="https://raw.githubusercontent.com/bencreizy/Seven-/main/eoc.png"
          alt="End of Computation"
          className="opacity-90 transition-opacity duration-1000"
          style={{
            width: '285%',
            maxWidth: '3900px',
            maxHeight: '105vh',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 50px rgba(52,211,153,0.8))',
          }}
        />
      </div>

      {/* Tesseract centered and reduced in size by 25% */}
      <div className="relative flex items-center justify-center overflow-visible scale-[0.75]">
        <Tesseract />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/omega-key" element={<OmegaKey />} />
          <Route path="/true-curve" element={<TrueCurve />} />
          <Route path="/replica-qubit" element={<ReplicaQubit />} />
          <Route path="/ego-loss" element={<EgoLoss />} />
          <Route path="/verifyz" element={<VerifyzProtocol />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
