import { useEffect, useRef, useState } from 'react';

function VerifyCanvas() {
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

        // Hexagonal grid nodes (location check-in points)
        const hexGrid: { x: number; y: number; active: number; pulse: number }[] = [];

        const buildGrid = () => {
            hexGrid.length = 0;
            const size = 50;
            const w = canvas.width || 800;
            const h = canvas.height || 600;
            for (let row = -2; row < h / size + 2; row++) {
                for (let col = -2; col < w / size + 2; col++) {
                    const x = col * size * 1.5;
                    const y = row * size * Math.sqrt(3) + (col % 2) * size * (Math.sqrt(3) / 2);
                    hexGrid.push({ x, y, active: Math.random(), pulse: Math.random() * Math.PI * 2 });
                }
            }
        };
        buildGrid();
        window.addEventListener('resize', buildGrid);

        const drawHex = (x: number, y: number, size: number, alpha: number, filled: boolean) => {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3 - Math.PI / 6;
                const px = x + size * Math.cos(angle);
                const py = y + size * Math.sin(angle);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();

            if (filled) {
                ctx.fillStyle = `rgba(59, 130, 246, ${alpha * 0.2})`;
                ctx.fill();
            }
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        };

        const draw = () => {
            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;

            // Draw hexagonal grid
            for (const hex of hexGrid) {
                const distFromCenter = Math.hypot(hex.x - cx, hex.y - cy);
                const maxDist = Math.hypot(width, height) / 2;
                const baseAlpha = (1 - distFromCenter / maxDist) * 0.12;
                const pulsedAlpha = baseAlpha * (0.5 + 0.5 * Math.sin(t * 0.3 + hex.pulse));
                drawHex(hex.x, hex.y, 22, pulsedAlpha, hex.active > 0.85);
            }

            // Data stream lines radiating outward from center (proof-of-presence signals)
            const streamCount = 12;
            for (let s = 0; s < streamCount; s++) {
                const angle = (s / streamCount) * Math.PI * 2 + t * 0.02;
                const length = 80 + Math.sin(t * 0.5 + s) * 40;
                const startR = 40;

                ctx.beginPath();
                ctx.moveTo(cx + startR * Math.cos(angle), cy + startR * Math.sin(angle));

                // Draw dashed line with moving dash
                const dashOffset = -(t * 3 + s * 20) % 30;
                ctx.setLineDash([8, 12]);
                ctx.lineDashOffset = dashOffset;

                ctx.lineTo(
                    cx + (startR + length) * Math.cos(angle),
                    cy + (startR + length) * Math.sin(angle)
                );

                const streamAlpha = 0.2 + 0.15 * Math.sin(t * 0.8 + s);
                ctx.strokeStyle = `rgba(59, 130, 246, ${streamAlpha})`;
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.lineDashOffset = 0;
            }

            // Central verification pulse
            for (let r = 0; r < 5; r++) {
                const radius = ((t * 1.5 + r * 20) % 100);
                const alpha = Math.max(0, (1 - radius / 100) * 0.3);
                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            // Center lock icon (drawn with arcs)
            const lockR = 18;
            ctx.beginPath();
            ctx.arc(cx, cy, lockR, 0, Math.PI * 2);
            const pulse = Math.sin(t * 1.2) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(59, 130, 246, ${0.15 + pulse * 0.1})`;
            ctx.fill();
            ctx.strokeStyle = `rgba(147, 197, 253, ${0.5 + pulse * 0.4})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Floating hash strings (anonymized data snippets)
            const hashes = ['0x4A8F', '∅PII', 'zkPrv', '0xB2E9', '∅GPS', 'SHA3'];
            for (let i = 0; i < hashes.length; i++) {
                const angle = (i / hashes.length) * Math.PI * 2 + t * 0.015;
                const orbitR = 160 + Math.sin(t * 0.3 + i) * 20;
                const hx = cx + orbitR * Math.cos(angle);
                const hy = cy + orbitR * Math.sin(angle);
                const ha = 0.2 + 0.15 * Math.sin(t + i);
                ctx.fillStyle = `rgba(147, 197, 253, ${ha})`;
                ctx.font = '10px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(hashes[i], hx, hy);
            }

            t += 0.016;
            animId = requestAnimationFrame(draw);
        };

        draw();
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('resize', buildGrid);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

function CheckInSimulator() {
    const [stage, setStage] = useState<'idle' | 'scanning' | 'hashing' | 'verified'>('idle');
    const [hash, setHash] = useState('');

    const run = () => {
        setStage('scanning');
        const HX = '0123456789ABCDEF';
        setTimeout(() => {
            setStage('hashing');
            let h = '';
            const buildHash = setInterval(() => {
                h += HX[Math.floor(Math.random() * 16)];
                setHash(h.substring(0, 32));
                if (h.length >= 32) {
                    clearInterval(buildHash);
                    setHash('0x' + Array.from({ length: 32 }, () => HX[Math.floor(Math.random() * 16)]).join(''));
                    setStage('verified');
                }
            }, 40);
        }, 1400);
    };

    const reset = () => { setStage('idle'); setHash(''); };

    const stageLabel: Record<typeof stage, string> = {
        idle: '[ AWAITING CHECK-IN ]',
        scanning: '[ SCANNING PRESENCE... ]',
        hashing: '[ HASHING — NO PII STORED ]',
        verified: '[ PRESENCE VERIFIED ✓ ]',
    };

    const stageColor: Record<typeof stage, string> = {
        idle: 'rgba(59,130,246,0.4)',
        scanning: '#facc15',
        hashing: '#fb923c',
        verified: '#86efac',
    };

    return (
        <div className="space-y-4 w-full">
            <div className="text-xs font-mono text-center py-2 transition-all duration-500"
                style={{ color: stageColor[stage] }}>
                {stageLabel[stage]}
            </div>

            {/* Proof indicator */}
            <div className="grid grid-cols-3 gap-2 text-center">
                {['IDENTITY', 'LOCATION', 'TIMESTAMP'].map((label, i) => {
                    const active = stage !== 'idle';
                    return (
                        <div key={i} className="rounded-lg border py-3 transition-all duration-700"
                            style={{
                                borderColor: active ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.1)',
                                background: active ? 'rgba(59,130,246,0.08)' : 'transparent',
                            }}>
                            <div className="text-xs font-mono" style={{ color: active ? '#93c5fd' : 'rgba(255,255,255,0.2)' }}>{label}</div>
                            <div className="text-lg font-black mt-1" style={{ color: active ? '#86efac' : 'rgba(255,255,255,0.1)' }}>∅</div>
                            <div className="text-xs text-white/30 font-mono">NEVER STORED</div>
                        </div>
                    );
                })}
            </div>

            {/* Hash output */}
            {hash && (
                <div className="bg-black/40 border border-blue-500/20 rounded-lg p-3">
                    <div className="text-xs font-mono text-blue-400/40 mb-1">PROOF HASH</div>
                    <div className="text-xs font-mono text-blue-300/70 break-all">{hash}</div>
                </div>
            )}

            <div className="flex gap-3">
                <button
                    onClick={stage === 'idle' ? run : reset}
                    disabled={stage === 'scanning' || stage === 'hashing'}
                    className="flex-1 py-3 rounded-lg font-mono text-sm uppercase tracking-widest transition-all duration-300"
                    style={{
                        background: stage === 'verified' ? 'rgba(34,197,94,0.08)' : 'rgba(59,130,246,0.08)',
                        border: `1px solid ${stage === 'verified' ? 'rgba(34,197,94,0.4)' : 'rgba(59,130,246,0.3)'}`,
                        color: stage === 'verified' ? '#86efac' : '#93c5fd',
                        cursor: (stage === 'scanning' || stage === 'hashing') ? 'not-allowed' : 'pointer',
                    }}
                >
                    {stage === 'idle' && '[ SIMULATE CHECK-IN ]'}
                    {stage === 'scanning' && '[ SCANNING... ]'}
                    {stage === 'hashing' && '[ HASHING... ]'}
                    {stage === 'verified' && '[ RESET ]'}
                </button>
            </div>
        </div>
    );
}

export default function VerifyzProtocol() {
    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseBlue {
          0%, 100% { box-shadow: 0 0 20px rgba(59,130,246,0.2); }
          50% { box-shadow: 0 0 60px rgba(59,130,246,0.5), 0 0 100px rgba(59,130,246,0.2); }
        }
        @keyframes blinkOn {
          0%, 49% { opacity: 0; }
          50%, 100% { opacity: 1; }
        }
      `}</style>

            <VerifyCanvas />

            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.80) 100%)' }} />

            <div className="relative z-10 w-full max-w-5xl px-6 py-2 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">

                {/* Left: Text */}
                <div className="space-y-8" style={{ animation: 'fadeSlideUp 1s ease both' }}>
                    <div>
                        <div className="text-xs text-blue-500/60 font-mono tracking-[0.4em] mb-3">// EOC :: LAYER-05</div>
                        <h2 className="text-6xl font-black uppercase tracking-tight leading-none">
                            <span style={{ color: '#3b82f6', textShadow: '0 0 40px rgba(59,130,246,0.6)' }}>VERIFYZ</span><br />
                            <span className="text-white/90">PROTOCOL</span>
                        </h2>
                    </div>

                    <p className="text-white/70 leading-relaxed text-lg font-light border-l-2 border-blue-500/40 pl-4">
                        A first-of-its-kind privacy web application enabling secure digital{' '}
                        <span className="text-blue-300 font-semibold">"check-ins"</span> across all industries
                        while keeping user identities{' '}
                        <span className="text-blue-300 font-semibold">100% private.</span>{' '}
                        Proof of Presence — without PII or GPS.
                    </p>

                    <div className="bg-blue-950/20 border border-blue-500/10 rounded-xl p-6 backdrop-blur-sm"
                        style={{ animation: 'pulseBlue 5s ease-in-out infinite' }}>
                        <h3 className="text-blue-300 text-xs font-mono tracking-[0.3em] uppercase mb-4">── THE STACK</h3>
                        <div className="space-y-3">
                            {[
                                { key: 'Omega Key', role: 'Godlock — secures the verification handshake', color: '#c084fc' },
                                { key: 'True Curve', role: 'Frictionless flow — natural data patterns', color: '#22d3ee' },
                                { key: 'Replica Qubit', role: 'Instant high-volume verification processing', color: '#4ade80' },
                                { key: 'Ego Loss', role: 'Protocol never forms a "memory" of the user', color: '#f87171' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: item.color }} />
                                    <div>
                                        <span className="text-xs font-mono font-bold" style={{ color: item.color }}>{item.key}: </span>
                                        <span className="text-xs text-white/50">{item.role}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-blue-500/10">
                        <p className="text-blue-200/60 italic text-sm font-light tracking-wide">
                            "Personal privacy as the baseline for every digital interaction — the world stays connected, never surveilled."
                        </p>
                    </div>
                </div>

                {/* Right: Interactive simulator */}
                <div className="flex flex-col items-center gap-6" style={{ animation: 'fadeSlideUp 1.2s ease both' }}>
                    <div className="w-full bg-black/70 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-lg"
                        style={{ boxShadow: '0 0 40px rgba(59,130,246,0.1)' }}>

                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-2 h-2 rounded-full bg-blue-400" style={{ boxShadow: '0 0 8px #3b82f6', animation: 'blinkOn 1.5s step-end infinite' }} />
                            <span className="text-xs font-mono text-blue-400/70 tracking-widest">PROOF OF PRESENCE ENGINE</span>
                        </div>

                        <CheckInSimulator />
                    </div>

                    {/* Key stats */}
                    <div className="grid grid-cols-3 gap-3 w-full">
                        {[
                            { v: '0 bytes', l: 'PII STORED' },
                            { v: '∅GPS', l: 'DATA SENT' },
                            { v: '∞', l: 'PRIVACY' },
                        ].map((item, i) => (
                            <div key={i} className="bg-blue-950/20 border border-blue-500/10 rounded-xl p-4 text-center"
                                style={{ animation: `fadeSlideUp 1s ease ${0.4 + i * 0.15}s both` }}>
                                <div className="text-xl font-black text-blue-300" style={{ textShadow: '0 0 12px #3b82f6' }}>{item.v}</div>
                                <div className="text-xs font-mono text-white/30 mt-1">{item.l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
