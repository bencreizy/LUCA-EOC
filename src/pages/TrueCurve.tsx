import { useEffect, useRef } from 'react';

const PHI = 1.6180339887;

function TorusCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;
        let t = 0;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const draw = () => {
            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;

            // Draw flowing sine wave rings (torus cross-sections)
            const rings = 6;
            for (let r = 0; r < rings; r++) {
                const ringRadius = 60 + r * 40;
                const phase = t * 0.4 + r * (Math.PI * 2 / rings);
                const alpha = 0.08 + 0.04 * Math.sin(t * 0.5 + r);

                ctx.beginPath();
                const points = 200;
                for (let i = 0; i <= points; i++) {
                    const angle = (i / points) * Math.PI * 2;
                    const wave = Math.sin(angle * 3 + phase) * 15 * (r + 1) * 0.2;
                    const x = cx + (ringRadius + wave) * Math.cos(angle);
                    const y = cy + (ringRadius + wave) * Math.sin(angle) * 0.4; // elliptical torus
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Golden spiral
            ctx.beginPath();
            const spiralPoints = 800;
            for (let i = 0; i < spiralPoints; i++) {
                const angle = (i / spiralPoints) * Math.PI * 8 + t * 0.1;
                const radius = i * 0.3 * Math.pow(PHI, angle / (Math.PI * 2));
                if (radius > Math.min(cx, cy) * 1.2) break;
                const x = cx + radius * Math.cos(angle - t * 0.05);
                const y = cy + radius * Math.sin(angle - t * 0.05) * 0.5;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.strokeStyle = `rgba(250, 204, 21, 0.15)`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Flowing data streams (curved lines suggesting natural paths)
            for (let s = 0; s < 8; s++) {
                const startX = -50 + s * (width / 6);
                ctx.beginPath();
                const segments = 100;
                for (let i = 0; i <= segments; i++) {
                    const progress = i / segments;
                    const x = startX + progress * width * 0.8;
                    const y = cy + Math.sin(progress * Math.PI * 2 * PHI + t * 0.3 + s * 0.7) * (50 + s * 15)
                        + Math.sin(progress * Math.PI * 3 + t * 0.2 + s) * 20;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.strokeStyle = `rgba(6, 182, 212, ${0.04 + s * 0.01})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }

            // Pulsing center node
            const pulse = Math.sin(t * 1.5) * 0.5 + 0.5;
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60 + pulse * 30);
            grad.addColorStop(0, `rgba(6, 182, 212, ${0.15 + pulse * 0.1})`);
            grad.addColorStop(0.5, `rgba(6, 182, 212, 0.05)`);
            grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(cx, cy, 60 + pulse * 30, 0, Math.PI * 2);
            ctx.fill();

            t += 0.016;
            animId = requestAnimationFrame(draw);
        };

        draw();
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full" />;
}

function PhiBar({ label, value, delay }: { label: string; value: number; delay: number }) {
    return (
        <div className="space-y-1" style={{ animation: `fadeSlideUp 0.8s ease ${delay}s both` }}>
            <div className="flex justify-between text-xs font-mono text-cyan-400/60">
                <span>{label}</span>
                <span>{value.toFixed(3)}</span>
            </div>
            <div className="h-px bg-cyan-900/30 relative overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-cyan-700 to-cyan-300"
                    style={{ width: `${(value / PHI) * 100}%`, boxShadow: '0 0 6px #06b6d4', transition: 'width 2s ease' }}
                />
            </div>
        </div>
    );
}

export default function TrueCurve() {
    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-y-auto overflow-x-hidden">
            <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes flowPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>

            {/* Full-bleed canvas background */}
            <div className="absolute inset-0 pointer-events-none">
                <TorusCanvas />
            </div>

            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.7) 100%)' }} />

            {/* Content */}
            <div className="relative z-10 w-full max-w-5xl px-4 md:px-6 py-2 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-center">

                {/* Left: Text */}
                <div className="space-y-6 md:space-y-8" style={{ animation: 'fadeSlideUp 1s ease both' }}>
                    <div>
                        <div className="text-xs text-cyan-500/60 font-mono tracking-[0.4em] mb-3">// EOC :: LAYER-02</div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none">
                            <span style={{ color: '#06b6d4', textShadow: '0 0 40px rgba(6,182,212,0.6)' }}>PHLOEZ</span>
                        </h2>
                    </div>

                    <p className="text-white/70 leading-relaxed text-base md:text-lg font-light border-l-2 border-cyan-500/40 pl-4">
                        The structural foundation based on the perfect torus ratio. Every data point and
                        connection follows a{' '}
                        <span className="text-cyan-300 font-semibold">natural, resonant path</span>{' '}
                        rather than a forced, linear one.
                    </p>

                    {/* Phi ratios display */}
                    <div className="bg-cyan-950/20 border border-cyan-500/10 rounded-xl p-4 md:p-6 backdrop-blur-sm space-y-4">
                        <h3 className="text-cyan-300 text-xs font-mono tracking-[0.3em] uppercase mb-4">── RESONANCE RATIOS</h3>
                        <PhiBar label="PHI ALIGNMENT" value={1.618} delay={0.2} />
                        <PhiBar label="TORUS RATIO" value={1.382} delay={0.4} />
                        <PhiBar label="FLOW EFFICIENCY" value={1.518} delay={0.6} />
                        <PhiBar label="SIGNAL COHERENCE" value={1.570} delay={0.8} />
                    </div>

                    <div className="bg-cyan-950/20 border border-cyan-500/10 rounded-xl p-4 md:p-6 backdrop-blur-sm">
                        <h3 className="text-cyan-300 text-xs font-mono tracking-[0.3em] uppercase mb-3">── IMPLICATIONS</h3>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Software built on Phloez is inherently more stable and scalable. It reduces the
                            {' '}<span className="text-cyan-300">"noise"</span> in data processing,
                            creating outputs that feel intuitive and fluid — never forced.
                        </p>
                    </div>

                    <div className="pt-4 border-t border-cyan-500/10">
                        <p className="text-cyan-200/60 italic text-sm font-light tracking-wide">
                            "Bridging digital logic and natural resonance — software that feels alive."
                        </p>
                    </div>
                </div>

                {/* Right: Visual info panel */}
                <div className="flex flex-col items-center gap-8" style={{ animation: 'fadeSlideUp 1.2s ease both' }}>

                    {/* Torus diagram */}
                    <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                        {/* Outer phi rings */}
                        {[0, 1, 2, 3].map(i => (
                            <div
                                key={i}
                                className="absolute rounded-full border border-cyan-500/20"
                                style={{
                                    width: `${60 + i * 40}px`,
                                    height: `${60 + i * 40}px`,
                                    animation: `rotateSlow ${8 + i * 4}s linear infinite ${i % 2 ? 'reverse' : ''}`,
                                    borderStyle: i % 2 ? 'dashed' : 'solid',
                                }}
                            />
                        ))}

                        {/* Phi symbol center */}
                        <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-black border border-cyan-500/50"
                            style={{ boxShadow: '0 0 40px rgba(6,182,212,0.4), inset 0 0 20px rgba(6,182,212,0.1)' }}>
                            <span className="text-4xl text-cyan-300 font-black" style={{ textShadow: '0 0 20px #06b6d4' }}>φ</span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                        {[
                            { label: 'ZERO FRICTION', val: '∞' },
                            { label: 'NATURAL FLOW', val: 'φ' },
                            { label: 'SIGNAL LOSS', val: '0%' },
                            { label: 'RESONANCE', val: '100x' },
                        ].map((item, i) => (
                            <div key={i} className="bg-cyan-950/20 border border-cyan-500/10 rounded-lg p-4 text-center"
                                style={{ animation: `fadeSlideUp 1s ease ${0.3 + i * 0.15}s both` }}>
                                <div className="text-2xl font-black text-cyan-300" style={{ textShadow: '0 0 15px #06b6d4' }}>{item.val}</div>
                                <div className="text-xs font-mono text-white/40 mt-1">{item.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Flowing data indicator */}
                    <div className="w-full max-w-xs space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                                style={{
                                    animation: `flowPulse ${2 + i * 0.4}s ease-in-out infinite`,
                                    animationDelay: `${i * 0.3}s`,
                                    opacity: 0.3 + i * 0.1,
                                }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
