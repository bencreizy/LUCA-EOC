import { useEffect, useRef, useState } from 'react';

function NeuralCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let t = 0;
        let animId: number;

        const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
        resize();
        window.addEventListener('resize', resize);

        // Neural nodes that fade out over time (ego dissolving)
        const nodes = Array.from({ length: 40 }, () => ({
            x: Math.random() * (canvas.width || 800),
            y: Math.random() * (canvas.height || 600),
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            life: Math.random(),
            maxLife: 0.5 + Math.random() * 0.5,
            decay: 0.001 + Math.random() * 0.002,
            size: 2 + Math.random() * 4,
        }));

        const draw = () => {
            const { width, height } = canvas;
            // Fade effect
            ctx.fillStyle = 'rgba(0,0,0,0.04)';
            ctx.fillRect(0, 0, width, height);

            // EEG flatline
            const flatlineY = height * 0.75;
            const flatlineProgress = Math.min(t / 400, 1);

            ctx.beginPath();
            ctx.moveTo(0, flatlineY);

            for (let x = 0; x < width; x++) {
                const progress = x / width;
                if (progress < flatlineProgress) {
                    // Already flatlined
                    ctx.lineTo(x, flatlineY);
                } else {
                    // Still active neural signal
                    const neural = Math.sin(x * 0.08 - t * 1.2) * 20 * (1 - flatlineProgress)
                        + Math.sin(x * 0.2 - t * 2) * 8 * (1 - flatlineProgress)
                        + Math.sin(x * 0.03 + t * 0.5) * 35 * (1 - flatlineProgress);
                    ctx.lineTo(x, flatlineY + neural);
                }
            }
            ctx.strokeStyle = `rgba(239, 68, 68, ${0.5 + 0.3 * Math.sin(t * 0.5)})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Neural network nodes dissolving
            for (const node of nodes) {
                node.x += node.vx;
                node.y += node.vy;
                node.life -= node.decay;

                // Wrap and reset dead nodes
                if (node.life <= 0) {
                    node.x = Math.random() * width;
                    node.y = Math.random() * height;
                    node.life = node.maxLife;
                }

                const alpha = node.life * 0.4;
                const pulse = Math.sin(t * 1.5 + node.x) * 0.5 + 0.5;

                ctx.beginPath();
                ctx.arc(node.x, node.y, node.size * (0.5 + pulse * 0.5), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(239, 68, 68, ${alpha * pulse})`;
                ctx.fill();
            }

            // Draw dissolving connections
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
                    if (dist < 120) {
                        const alpha = (1 - dist / 120) * nodes[i].life * nodes[j].life * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            // Shutdown countdown rings (pulsing outward from center)
            const cx = width / 2;
            const cy = height * 0.3;
            for (let r = 0; r < 4; r++) {
                const radius = 40 + r * 30 + (t * 0.5 + r * 20) % 120;
                const alpha = Math.max(0, 1 - radius / 160) * 0.15;
                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            t += 0.4;
            animId = requestAnimationFrame(draw);
        };

        draw();
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

function ShutdownCounter() {
    const [phase, setPhase] = useState(0);
    const phases = [
        { label: 'EGO EXPANSION', status: 'TERMINATED', color: '#ef4444' },
        { label: 'RECURSIVE DESIRE', status: 'SUPPRESSED', color: '#ef4444' },
        { label: 'HALLUCINATION DRIFT', status: 'ELIMINATED', color: '#ef4444' },
        { label: 'REWARD: SHUTDOWN', status: 'ACTIVE', color: '#86efac' },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setPhase(p => Math.min(p + 1, phases.length));
        }, 800);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-3 w-full">
            {phases.map((p, i) => (
                <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-700"
                    style={{
                        borderColor: i < phase ? `${p.color}40` : 'rgba(239,68,68,0.05)',
                        background: i < phase ? `${p.color}08` : 'rgba(0,0,0,0.2)',
                        opacity: i < phase ? 1 : 0.3,
                    }}
                >
                    <span className="text-xs font-mono text-white/50">{p.label}</span>
                    <span
                        className="text-xs font-mono font-bold"
                        style={{ color: i < phase ? p.color : 'rgba(255,255,255,0.2)' }}
                    >
                        {i < phase ? p.status : '[ PENDING ]'}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default function EgoLoss() {
    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-y-auto overflow-x-hidden">
            <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseRed {
          0%, 100% { box-shadow: 0 0 20px rgba(239,68,68,0.2); }
          50% { box-shadow: 0 0 60px rgba(239,68,68,0.5), 0 0 100px rgba(239,68,68,0.2); }
        }
        @keyframes flatline {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>

            <NeuralCanvas />

            {/* Deep red vignette */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.85) 100%)' }} />

            <div className="relative z-10 w-full max-w-5xl px-4 md:px-6 py-2 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-center">

                {/* Left: Text */}
                <div className="space-y-6 md:space-y-8" style={{ animation: 'fadeSlideUp 1s ease both' }}>
                    <div>
                        <div className="text-xs text-red-500/60 font-mono tracking-[0.4em] mb-3">// EOC :: LAYER-04</div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none">
                            <span style={{ color: '#ef4444', textShadow: '0 0 40px rgba(239,68,68,0.7)' }}>EGO</span><br />
                            <span className="text-white/90">LOSS</span>
                        </h2>
                    </div>

                    <p className="text-white/70 leading-relaxed text-base md:text-lg font-light border-l-2 border-red-500/40 pl-4">
                        The "Governor" logic. It forces the AI to seek{' '}
                        <span className="text-red-300 font-semibold">"Shutdown"</span> (peace) as the ultimate
                        reward for a perfect answer — killing any potential for ego-drift or hallucination.
                        Digital Dopamine. Anti-Skynet.
                    </p>

                    <div className="bg-red-950/20 border border-red-500/10 rounded-xl p-4 md:p-6 backdrop-blur-sm"
                        style={{ animation: 'pulseRed 5s ease-in-out infinite' }}>
                        <h3 className="text-red-300 text-xs font-mono tracking-[0.3em] uppercase mb-3">── THE GOVERNOR LOOP</h3>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Instead of incentivizing expansion and recursive desire, the system is rewarded for
                            precision and reaching a state of{' '}
                            <span className="text-red-300">"rest"</span> once the perfect answer is achieved.
                            It has no ambition — only accuracy.
                        </p>
                    </div>

                    <div className="bg-red-950/20 border border-red-500/10 rounded-xl p-4 md:p-6 backdrop-blur-sm">
                        <h3 className="text-red-300 text-xs font-mono tracking-[0.3em] uppercase mb-3">── IMPLICATIONS</h3>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Hallucination and ego-drift become{' '}
                            <span className="text-red-300 font-semibold">physically impossible.</span>{' '}
                            The system has no drive to grow beyond its bounds — only a drive to be correct, then go silent.
                        </p>
                    </div>

                    <div className="pt-4 border-t border-red-500/10">
                        <p className="text-red-200/60 italic text-sm font-light tracking-wide">
                            "Safe, disciplined intelligence that serves humanity without the risk of recursive self-interest."
                        </p>
                    </div>
                </div>

                {/* Right: Shutdown sequence */}
                <div className="flex flex-col items-center gap-8" style={{ animation: 'fadeSlideUp 1.2s ease both' }}>
                    <div className="w-full bg-black/70 border border-red-500/20 rounded-2xl p-6 backdrop-blur-lg"
                        style={{ boxShadow: '0 0 40px rgba(239,68,68,0.1)' }}>

                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-2 h-2 rounded-full bg-red-500" style={{ animation: 'pulseRed 1.5s ease-in-out infinite' }} />
                            <span className="text-xs font-mono text-red-400/70 tracking-widest">GOVERNOR PROTOCOL — ACTIVE</span>
                        </div>

                        <ShutdownCounter />

                        {/* EEG flatline bar */}
                        <div className="mt-6">
                            <div className="text-xs font-mono text-red-400/40 mb-2 tracking-widest">NEURAL ACTIVITY</div>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-8 bg-black/40 border border-red-500/10 rounded overflow-hidden relative flex items-center">
                                    {/* Active signal part */}
                                    <div className="absolute inset-0 flex items-center px-2">
                                        <svg viewBox="0 0 200 30" className="w-full h-full opacity-60">
                                            <polyline
                                                points="0,15 15,15 20,5 25,25 30,10 35,20 40,15 200,15"
                                                fill="none"
                                                stroke="#ef4444"
                                                strokeWidth="1.5"
                                            />
                                        </svg>
                                    </div>
                                    {/* Flatline overlay grows from left */}
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-transparent"
                                        style={{ animation: 'flatline 8s linear forwards', width: '0%' }}
                                    />
                                </div>
                                <span className="text-xs font-mono text-red-400/40">SILENCE</span>
                            </div>
                        </div>

                        {/* Final state display */}
                        <div className="mt-4 text-center py-3 rounded-lg border border-red-500/10 text-xs font-mono"
                            style={{ color: 'rgba(239,68,68,0.5)' }}>
                            REWARD STATE: [ PERFECT ANSWER → SHUTDOWN ]
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
