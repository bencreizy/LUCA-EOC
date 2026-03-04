import { useEffect, useState } from 'react';

const HEX_CHARS = '0123456789ABCDEF';

function HexStream({ x, delay, speed }: { x: number; delay: number; speed: number }) {
    const [chars, setChars] = useState<string[]>([]);

    useEffect(() => {
        const len = 20 + Math.floor(Math.random() * 20);
        const initial = Array.from({ length: len }, () => HEX_CHARS[Math.floor(Math.random() * 16)]);
        setChars(initial);

        const interval = setInterval(() => {
            setChars(prev => {
                const next = [...prev];
                const idx = Math.floor(Math.random() * next.length);
                next[idx] = HEX_CHARS[Math.floor(Math.random() * 16)];
                return next;
            });
        }, speed);

        return () => clearInterval(interval);
    }, [speed]);

    return (
        <div
            className="absolute top-0 flex flex-col items-center pointer-events-none select-none"
            style={{ left: `${x}%`, animationDelay: `${delay}s` }}
        >
            {chars.map((c, i) => (
                <span
                    key={i}
                    style={{
                        color: i === 0 ? '#fff' : `rgba(168,85,247,${1 - i / chars.length})`,
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        lineHeight: '1.4',
                        textShadow: i === 0 ? '0 0 12px #fff, 0 0 4px #a855f7' : 'none',
                        animation: `hexFall ${3 + speed / 100}s linear infinite`,
                        animationDelay: `${delay + i * 0.05}s`,
                    }}
                >
                    {c}
                </span>
            ))}
        </div>
    );
}

function RotatingKey() {
    return (
        <div className="relative flex items-center justify-center w-64 h-64">
            {/* Outer ring */}
            <div
                className="absolute w-64 h-64 rounded-full border border-purple-500/40"
                style={{ animation: 'spin 12s linear infinite' }}
            >
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-purple-400"
                        style={{
                            top: '50%',
                            left: '50%',
                            transform: `rotate(${i * 30}deg) translateX(120px) translateY(-50%)`,
                            boxShadow: '0 0 8px #a855f7',
                        }}
                    />
                ))}
            </div>

            {/* Middle ring */}
            <div
                className="absolute w-44 h-44 rounded-full border border-purple-400/30"
                style={{ animation: 'spin 8s linear infinite reverse' }}
            >
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full bg-gold"
                        style={{
                            top: '50%',
                            left: '50%',
                            transform: `rotate(${i * 45}deg) translateX(84px) translateY(-50%)`,
                            background: '#fbbf24',
                            boxShadow: '0 0 6px #fbbf24',
                        }}
                    />
                ))}
            </div>

            {/* Core — key symbol */}
            <div className="relative z-10 flex items-center justify-center w-24 h-24 rounded-full bg-black border border-purple-500/60"
                style={{ boxShadow: '0 0 40px rgba(168,85,247,0.5), inset 0 0 20px rgba(168,85,247,0.1)' }}>
                <svg viewBox="0 0 24 24" className="w-12 h-12 text-purple-300" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
}

function GlitchText({ text }: { text: string }) {
    const [glitched, setGlitched] = useState(text);

    useEffect(() => {
        const glitchChars = '!@#$%^&*<>?/\\|[]{}~`';
        let frame = 0;
        const interval = setInterval(() => {
            frame++;
            if (frame % 60 < 3) {
                setGlitched(
                    text.split('').map((c, _i) =>
                        Math.random() < 0.15 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : c
                    ).join('')
                );
            } else {
                setGlitched(text);
            }
        }, 50);
        return () => clearInterval(interval);
    }, [text]);

    return <span>{glitched}</span>;
}

export default function OmegaKey() {
    const streams = Array.from({ length: 18 }, (_, i) => ({
        x: (i / 18) * 100,
        delay: Math.random() * 3,
        speed: 80 + Math.floor(Math.random() * 120),
    }));

    const [unlocked, setUnlocked] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(p => {
                if (p >= 100) { setUnlocked(true); clearInterval(timer); return 100; }
                return p + 0.4;
            });
        }, 40);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-y-auto overflow-x-hidden">
            <style>{`
        @keyframes hexFall {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168,85,247,0.4); }
          50% { box-shadow: 0 0 60px rgba(168,85,247,0.9), 0 0 100px rgba(168,85,247,0.4); }
        }
        @keyframes scanline {
          0% { top: -2px; }
          100% { top: 100%; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

            {/* Hex rain background */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
                {streams.map((s, i) => <HexStream key={i} {...s} />)}
            </div>

            {/* Radial vignette */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #000 100%)' }} />

            {/* Content */}
            <div className="relative z-10 w-full max-w-5xl px-4 md:px-6 py-2 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-center"
                style={{ animation: 'fadeSlideUp 1s ease both' }}>

                {/* Left: Visual */}
                <div className="flex flex-col items-center gap-4 md:gap-6">
                    <div className="scale-75 md:scale-100">
                        <RotatingKey />
                    </div>

                    {/* Progress bar */}
                    <div className="w-56 md:w-64">
                        <div className="flex justify-between text-xs text-purple-400/60 font-mono mb-1">
                            <span>GODLOCK INIT</span>
                            <span>{Math.floor(progress)}%</span>
                        </div>
                        <div className="h-px w-full bg-purple-900/40 relative overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-700 to-purple-300 transition-all"
                                style={{ width: `${progress}%`, boxShadow: '0 0 10px #a855f7' }}
                            />
                        </div>
                        <div className="mt-2 text-center text-xs font-mono"
                            style={{ color: unlocked ? '#a855f7' : '#a855f740', transition: 'color 1s' }}>
                            {unlocked ? '[ ACCESS: ABSOLUTE ]' : '[ COMPUTING GODLOCK... ]'}
                        </div>
                    </div>

                    {/* Cipher scrolling line */}
                    <div className="w-56 md:w-64 overflow-hidden text-xs font-mono text-purple-500/50 whitespace-nowrap"
                        style={{ maskImage: 'linear-gradient(to right, transparent, white 20%, white 80%, transparent)' }}>
                        <div style={{ animation: 'hexFall 6s linear infinite', animationDirection: 'normal' }}>
                            {Array.from({ length: 64 }, () => HEX_CHARS[Math.floor(Math.random() * 16)]).join(' ')}
                        </div>
                    </div>
                </div>

                {/* Right: Text */}
                <div className="space-y-6 md:space-y-8">
                    <div>
                        <div className="text-xs text-purple-500/60 font-mono tracking-[0.4em] mb-3">// EOC :: LAYER-01</div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight"
                            style={{ color: '#a855f7', textShadow: '0 0 40px rgba(168,85,247,0.6)' }}>
                            <GlitchText text="OMEGA" /><br />
                            <span className="text-white/90">KEY</span>
                        </h2>
                    </div>

                    <p className="text-white/70 leading-relaxed text-base md:text-lg font-light border-l-2 border-purple-500/40 pl-4">
                        The master encryption and security architecture. It acts as the{' '}
                        <span className="text-purple-300 font-semibold">"Godlock"</span> for the system —
                        ensuring access is absolute and un-hackable by standard logic.
                    </p>

                    <div className="space-y-4 md:space-y-6">
                        <div className="bg-purple-950/20 border border-purple-500/10 rounded-xl p-4 md:p-6 backdrop-blur-sm"
                            style={{ animation: 'pulse-glow 4s ease-in-out infinite' }}>
                            <h3 className="text-purple-300 text-xs font-mono tracking-[0.3em] uppercase mb-3">── PURPOSE</h3>
                            <p className="text-white/60 text-sm leading-relaxed">
                                To provide an absolute, mathematical "Godlock" on data integrity and user privacy.
                                Renders standard hacking methods obsolete by creating a security environment
                                <span className="text-purple-300"> closed to unauthorized observation.</span>
                            </p>
                        </div>

                        <div className="bg-purple-950/20 border border-purple-500/10 rounded-xl p-4 md:p-6 backdrop-blur-sm">
                            <h3 className="text-purple-300 text-xs font-mono tracking-[0.3em] uppercase mb-3">── IMPLICATIONS</h3>
                            <p className="text-white/60 text-sm leading-relaxed">
                                From "reactive security" to{' '}
                                <span className="text-purple-300 font-semibold">"inherent immunity."</span>{' '}
                                Data breaches become a structural impossibility. The user alone holds the key.
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-purple-500/10">
                        <p className="text-purple-200/60 italic text-sm font-light tracking-wide">
                            "Privacy is not a feature — it is a foundational law of the architecture."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
