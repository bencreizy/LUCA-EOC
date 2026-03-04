import React, { useState } from 'react';
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

function MobileNav() {
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home', hover: 'hover:text-white' },
    { to: '/omega-key', label: 'Omega Key', hover: 'hover:text-purple-400' },
    { to: '/true-curve', label: 'Phloez', hover: 'hover:text-cyan-400' },
    { to: '/replica-qubit', label: 'Qubit Sloot', hover: 'hover:text-green-400' },
    { to: '/ego-loss', label: 'Ego Loss', hover: 'hover:text-red-400' },
    { to: '/verifyz', label: 'Verifyz', hover: 'hover:text-blue-400' },
  ];

  return (
    <nav className="w-full top-0 absolute z-50 bg-gradient-to-b from-black/80 to-transparent">
      {/* Desktop nav */}
      <div className="hidden md:flex justify-center gap-6 p-6">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`text-white/80 ${l.hover} uppercase tracking-widest text-sm font-semibold transition-all`}
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* Mobile hamburger */}
      <div className="md:hidden flex items-center justify-between px-5 py-4">
        <span className="text-white/70 text-xs font-mono tracking-[0.3em] uppercase">EOC</span>
        <button
          onClick={() => setOpen(!open)}
          className="relative w-8 h-8 flex flex-col items-center justify-center gap-1.5 z-50"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-px bg-white/80 transition-all duration-300 ${open ? 'rotate-45 translate-y-[3.5px]' : ''}`}
          />
          <span
            className={`block w-6 h-px bg-white/80 transition-all duration-300 ${open ? 'opacity-0' : ''}`}
          />
          <span
            className={`block w-6 h-px bg-white/80 transition-all duration-300 ${open ? '-rotate-45 -translate-y-[3.5px]' : ''}`}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}
      >
        <div className="flex flex-col items-center gap-4 py-6">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`text-white/80 ${l.hover} uppercase tracking-widest text-sm font-semibold transition-all`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-black overflow-x-hidden font-sans">
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
        className="absolute w-[60vmin] h-[60vmin] md:w-[120vmin] md:h-[120vmin] pointer-events-none z-10 animate-float"
        style={{ bottom: '-30vmin', left: '-25vmin' }}
      />

      {/* Medium: Dark blue, center right, touching edge */}
      <ShaderCanvas
        color1="#020617"
        color2="#1e3a8a"
        cloudDensity={2.0}
        glowIntensity={1.0}
        rotationSpeed={0.05}
        cloudSpeed={0.3}
        className="absolute w-[18vmin] h-[18vmin] md:w-[30vmin] md:h-[30vmin] pointer-events-none z-10 animate-float"
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
        className="absolute w-[6vmin] h-[6vmin] md:w-[9vmin] md:h-[9vmin] pointer-events-none z-10 animate-float"
        style={{ top: '15vmin', right: '35vmin' }}
      />

      {/* Moon image: Hidden on very small screens, adjusted positioning for tablet+ */}
      <img
        src="https://raw.githubusercontent.com/bencreizy/Seven-/main/moon_eoc.png"
        alt="Moon"
        className="absolute z-20 pointer-events-none w-24 md:w-40 object-contain animate-float hidden sm:block"
        style={{ bottom: '70vmin', left: 'clamp(80px, 15vw, 260px)' }}
      />

      {/* Foreground UI Layer */}
      <div className="relative z-30 w-full h-full min-h-screen flex flex-col pointer-events-auto">
        {/* Navigation */}
        <MobileNav />

        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center p-4 pt-20 md:pt-16 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {/* EOC Logo — Responsive sizing */}
      <div
        className="absolute left-0 right-0 flex justify-center pointer-events-none select-none z-50"
        style={{ top: 'clamp(-160px, -12vw, -60px)' }}
      >
        <img
          src="https://raw.githubusercontent.com/bencreizy/Seven-/main/eoc.png"
          alt="End of Computation"
          className="opacity-90 transition-opacity duration-1000"
          style={{
            width: 'clamp(120%, 200%, 285%)',
            maxWidth: '3900px',
            maxHeight: '105vh',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 50px rgba(52,211,153,0.8))',
          }}
        />
      </div>

      {/* Tesseract — Responsive scale */}
      <div className="relative flex items-center justify-center overflow-visible scale-[0.4] sm:scale-[0.55] md:scale-[0.65] lg:scale-[0.75]">
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
