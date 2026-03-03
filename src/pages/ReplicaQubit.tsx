import { useEffect, useRef, useState } from 'react';

const QUBIT_COUNT = 8;

type QubitState = '|0⟩' | '|1⟩' | '|+⟩' | '|-⟩';
const QUBIT_STATES: QubitState[] = ['|0⟩', '|1⟩', '|+⟩', '|-⟩'];

function QuantumCanvas() {
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

        const draw = () => {
            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;

            // Interference pattern
            const resolution = 4;
            const cols = Math.ceil(width / resolution);
            const rows = Math.ceil(height / resolution);

            const sources = [
                { x: cx - 120, y: cy, freq: 0.04, phase: t * 0.8 },
                { x: cx + 120, y: cy, freq: 0.04, phase: t * 0.8 + Math.PI },
                { x: cx, y: cy - 100, freq: 0.035, phase: t * 0.6 },
            ];

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const px = col * resolution;
                    const py = row * resolution;

                    let amplitude = 0;
                    for (const src of sources) {
                        const dist = Math.sqrt((px - src.x) ** 2 + (py - src.y) ** 2);
                        amplitude += Math.sin(dist * src.freq - src.phase) / sources.length;
                    }

                    const intensity = (amplitude + 1) / 2;
                    const alpha = intensity * 0.12;
                    ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
                    ctx.fillRect(px, py, resolution, resolution);
                }
            }

            // Qubit connection grid
            const qubits = Array.from({ length: 6 }, (_, i) => ({
                x: cx + Math.cos((i / 6) * Math.PI * 2 + t * 0.05) * 150,
                y: cy + Math.sin((i / 6) * Math.PI * 2 + t * 0.05) * 80,
            }));

            // Draw entanglement lines
            for (let i = 0; i < qubits.length; i++) {
                for (let j = i + 1; j < qubits.length; j++) {
                    const entangled = (i + j) % 2 === 0;
                    if (!entangled) continue;
                    ctx.beginPath();
                    ctx.moveTo(qubits[i].x, qubits[i].y);
                    const mx = (qubits[i].x + qubits[j].x) / 2 + Math.sin(t * 0.7 + i) * 30;
                    const my = (qubits[i].y + qubits[j].y) / 2 + Math.cos(t * 0.7 + j) * 30;
                    ctx.quadraticCurveTo(mx, my, qubits[j].x, qubits[j].y);
                    const pulse = (Math.sin(t * 1.5 + i * j) + 1) / 2;
                    ctx.strokeStyle = `rgba(34, 197, 94, ${0.08 + pulse * 0.12})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }

            // Draw qubit nodes
            for (const [i, q] of qubits.entries()) {
                const pulse = Math.sin(t * 2 + i * 1.2) * 0.5 + 0.5;
                const grad = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, 12 + pulse * 8);
                grad.addColorStop(0, `rgba(34, 197, 94, ${0.6 + pulse * 0.4})`);
                grad.addColorStop(1, 'rgba(34, 197, 94, 0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(q.x, q.y, 12 + pulse * 8, 0, Math.PI * 2);
                ctx.fill();

                ctx.beginPath();
                ctx.arc(q.x, q.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(134, 239, 172, ${0.8 + pulse * 0.2})`;
                ctx.fill();
            }

            // Central resonance burst
            const burstPulse = Math.sin(t * 1.2) * 0.5 + 0.5;
            const burstGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80 + burstPulse * 40);
            burstGrad.addColorStop(0, `rgba(34, 197, 94, ${0.12 + burstPulse * 0.08})`);
            burstGrad.addColorStop(1, 'rgba(34, 197, 94, 0)');
            ctx.fillStyle = burstGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, 80 + burstPulse * 40, 0, Math.PI * 2);
            ctx.fill();

            t += 0.016;
            animId = requestAnimationFrame(draw);
        };

        draw();
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

function QubitDisplay() {
    const [qubits, setQubits] = useState<QubitState[]>(
        Array.from({ length: QUBIT_COUNT }, () => QUBIT_STATES[0])
    );
    const [computing, setComputing] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const runCompute = () => {
        setComputing(true);
        setResult(null);
        let frames = 0;
        const flicker = setInterval(() => {
            frames++;
            setQubits(Array.from({ length: QUBIT_COUNT }, () =>
                QUBIT_STATES[Math.floor(Math.random() * QUBIT_STATES.length)]
            ));
            if (frames > 30) {
                clearInterval(flicker);
                setQubits(Array.from({ length: QUBIT_COUNT }, (_, i) =>
                    i < 5 ? '|1⟩' : '|0⟩'
                ));
                setResult('FREQUENCY LOCK: 100x SPEEDUP ACHIEVED');
                setComputing(false);
            }
        }, 60);
    };

    return (
        <div className="space-y-4 w-full">
            <div className="flex gap-2 flex-wrap justify-center">
                {qubits.map((state, i) => (
                    <div
                        key={i}
                        className="w-14 h-14 rounded-lg border flex items-center justify-center font-mono text-xs font-bold transition-all duration-100"
                        style={{
                            borderColor: state === '|1⟩' ? 'rgba(34,197,94,0.8)' : state === '|+⟩' ? 'rgba(250,204,21,0.8)' : 'rgba(34,197,94,0.2)',
                            background: state === '|1⟩' ? 'rgba(34,197,94,0.1)' : 'rgba(0,0,0,0.4)',
                            color: state === '|1⟩' ? '#86efac' : state === '|+⟩' ? '#fde047' : 'rgba(34,197,94,0.5)',
                            boxShadow: state === '|1⟩' ? '0 0 15px rgba(34,197,94,0.4)' : 'none',
                        }}
                    >
                        {state}
                    </div>
                ))}
            </div>

            <button
                onClick={runCompute}
                disabled={computing}
                className="w-full py-3 rounded-lg font-mono text-sm uppercase tracking-widest transition-all duration-300"
                style={{
                    background: computing ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.08)',
                    border: `1px solid ${computing ? 'rgba(34,197,94,0.8)' : 'rgba(34,197,94,0.3)'}`,
                    color: computing ? '#86efac' : 'rgba(34,197,94,0.7)',
                    boxShadow: computing ? '0 0 20px rgba(34,197,94,0.3)' : 'none',
                    cursor: computing ? 'not-allowed' : 'pointer',
                }}
            >
                {computing ? '[ RESONATING... ]' : '[ INITIATE COMPUTE ]'}
            </button>

            {result && (
                <div className="text-center text-xs font-mono text-green-400 py-2 border border-green-500/20 rounded-lg"
                    style={{ boxShadow: '0 0 20px rgba(34,197,94,0.2)', animation: 'fadeSlideUp 0.5s ease both' }}>
                    ✦ {result}
                </div>
            )}
        </div>
    );
}

export default function ReplicaQubit() {
    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @keyframes blinkOn {
          0%, 49% { opacity: 0; }
          50%, 100% { opacity: 1; }
        }
      `}</style>

            <QuantumCanvas />

            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.75) 100%)' }} />

            {/* Scan line effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                <div className="absolute h-px w-full bg-green-400/40"
                    style={{ animation: 'scanSweep 3s linear infinite', top: '40%' }} />
            </div>

            <div className="relative z-10 w-full max-w-5xl px-6 py-2 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">

                {/* Left: Text */}
                <div className="space-y-8" style={{ animation: 'fadeSlideUp 1s ease both' }}>
                    <div>
                        <div className="text-xs text-green-500/60 font-mono tracking-[0.4em] mb-3">// EOC :: LAYER-03</div>
                        <h2 className="text-6xl font-black uppercase tracking-tight leading-none">
                            <span style={{ color: '#22c55e', textShadow: '0 0 40px rgba(34,197,94,0.6)' }}>QUBIT</span><br />
                            <span className="text-white/90">SLOOT</span>
                        </h2>
                    </div>

                    <p className="text-white/70 leading-relaxed text-lg font-light border-l-2 border-green-500/40 pl-4">
                        The processing unit that uses geometric resonance to handle complex data. It achieves a
                        {' '}<span className="text-green-300 font-black text-xl">100×</span>{' '}
                        speedup by finding the right answer through frequency alignment — not brute force.
                    </p>

                    <div className="bg-green-950/20 border border-green-500/10 rounded-xl p-6 backdrop-blur-sm">
                        <h3 className="text-green-300 text-xs font-mono tracking-[0.3em] uppercase mb-3">── PURPOSE</h3>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Enable high-velocity processing through geometric alignment. Identifies the "right
                            answer" by matching data frequencies — solving high-complexity problems that
                            {' '}<span className="text-green-400">standard systems can't even approach.</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { v: '100×', l: 'SPEEDUP' },
                            { v: '0ms', l: 'DRIFT' },
                            { v: 'φ', l: 'RESONANCE' },
                        ].map((item, i) => (
                            <div key={i} className="bg-green-950/20 border border-green-500/10 rounded-xl p-4 text-center"
                                style={{ animation: `fadeSlideUp 1s ease ${0.3 + i * 0.15}s both` }}>
                                <div className="text-2xl font-black text-green-300" style={{ textShadow: '0 0 15px #22c55e' }}>{item.v}</div>
                                <div className="text-xs font-mono text-white/40 mt-1">{item.l}</div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-green-500/10">
                        <p className="text-green-200/60 italic text-sm font-light tracking-wide">
                            "Qubit Sloot unlocks the next level of human potential — beyond the limitations of traditional computing."
                        </p>
                    </div>
                </div>

                {/* Right: Interactive Qubit Display */}
                <div className="flex flex-col items-center gap-8" style={{ animation: 'fadeSlideUp 1.2s ease both' }}>
                    <div className="w-full bg-black/60 border border-green-500/20 rounded-2xl p-6 backdrop-blur-lg"
                        style={{ boxShadow: '0 0 40px rgba(34,197,94,0.1)' }}>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: '0 0 8px #22c55e', animation: 'blinkOn 1s step-end infinite' }} />
                            <span className="text-xs font-mono text-green-400/70 tracking-widest">QUANTUM REGISTER</span>
                        </div>

                        <QubitDisplay />

                        {/* Frequency bands */}
                        <div className="mt-6 space-y-2">
                            {['FREQ-ALPHA', 'FREQ-BETA', 'FREQ-GAMMA'].map((band, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-xs font-mono text-green-400/40 w-24">{band}</span>
                                    <div className="flex-1 h-1 bg-green-900/20 rounded-full overflow-hidden relative">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-600 to-green-300 rounded-full"
                                            style={{
                                                width: `${55 + i * 15}%`,
                                                boxShadow: '0 0 6px #22c55e',
                                                animation: `fadeSlideUp 1.5s ease ${i * 0.2}s both`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-xs font-mono text-green-400/40">{(55 + i * 15)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
