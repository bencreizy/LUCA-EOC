import './tesseract.css';

export function Tesseract() {
    return (
        <div className="scene">
            <div className="tesseract">
                {/* INNER RED CORE */}
                <div className="core">
                    {/* 3D SINGULARITY SPHERE */}
                    <div className="singularity-sphere">
                        <div className="ring ring-x"></div>
                        <div className="ring ring-y"></div>
                        <div className="ring ring-z"></div>
                        <div className="ring ring-xy"></div>
                        <div className="ring ring-yz"></div>
                        <div className="glow-center"></div>
                    </div>

                    <div className="core-face core-front"></div>
                    <div className="core-face core-back"></div>
                    <div className="core-face core-right"></div>
                    <div className="core-face core-left"></div>
                    <div className="core-face core-top"></div>
                    <div className="core-face core-bottom"></div>
                </div>

                {/* OUTER SKELETON (Blue Glass Beams) */}
                {/* 12 Edges of the Outer Cube (Size 240) */}
                {/* X Axis Beams */}
                <div className="beam outer" style={{ transform: 'translate3d(0px, -120px, -120px)' }}>
                    <div className="beam-face" style={{ transform: 'translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateY(180deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(90deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(-90deg) translateZ(5px)' }}></div>
                </div>
                <div className="beam outer" style={{ transform: 'translate3d(0px, -120px, 120px)' }}>
                    <div className="beam-face" style={{ transform: 'translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateY(180deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(90deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(-90deg) translateZ(5px)' }}></div>
                </div>
                <div className="beam outer" style={{ transform: 'translate3d(0px, 120px, -120px)' }}>
                    <div className="beam-face" style={{ transform: 'translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateY(180deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(90deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(-90deg) translateZ(5px)' }}></div>
                </div>
                <div className="beam outer" style={{ transform: 'translate3d(0px, 120px, 120px)' }}>
                    <div className="beam-face" style={{ transform: 'translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateY(180deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(90deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(-90deg) translateZ(5px)' }}></div>
                </div>

                {/* Y Axis Beams (Rotated Z 90) */}
                <div className="beam outer" style={{ transform: 'translate3d(-120px, 0px, -120px) rotateZ(90deg)' }}>
                    <div className="beam-face" style={{ transform: 'translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateY(180deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(90deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(-90deg) translateZ(5px)' }}></div>
                </div>
                <div className="beam outer" style={{ transform: 'translate3d(120px, 0px, -120px) rotateZ(90deg)' }}>
                    <div className="beam-face" style={{ transform: 'translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateY(180deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(90deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(-90deg) translateZ(5px)' }}></div>
                </div>
                <div className="beam outer" style={{ transform: 'translate3d(-120px, 0px, 120px) rotateZ(90deg)' }}>
                    <div className="beam-face" style={{ transform: 'translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateY(180deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(90deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(-90deg) translateZ(5px)' }}></div>
                </div>
                <div className="beam outer" style={{ transform: 'translate3d(120px, 0px, 120px) rotateZ(90deg)' }}>
                    <div className="beam-face" style={{ transform: 'translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateY(180deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(90deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(-90deg) translateZ(5px)' }}></div>
                </div>

                {/* Z Axis Beams (Rotated Y 90) */}
                <div className="beam outer" style={{ transform: 'translate3d(-120px, -120px, 0px) rotateY(90deg)' }}>
                    <div className="beam-face" style={{ transform: 'translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateY(180deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(90deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(-90deg) translateZ(5px)' }}></div>
                </div>
                <div className="beam outer" style={{ transform: 'translate3d(120px, -120px, 0px) rotateY(90deg)' }}>
                    <div className="beam-face" style={{ transform: 'translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateY(180deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(90deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(-90deg) translateZ(5px)' }}></div>
                </div>
                <div className="beam outer" style={{ transform: 'translate3d(-120px, 120px, 0px) rotateY(90deg)' }}>
                    <div className="beam-face" style={{ transform: 'translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateY(180deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(90deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(-90deg) translateZ(5px)' }}></div>
                </div>
                <div className="beam outer" style={{ transform: 'translate3d(120px, 120px, 0px) rotateY(90deg)' }}>
                    <div className="beam-face" style={{ transform: 'translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateY(180deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(90deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(-90deg) translateZ(5px)' }}></div>
                </div>

                {/* CONNECTING STRUTS (8 Diagonals) */}
                {/* Length: 158.56px (Extended 20px inwards). */}
                {/* New Center Distance: 128.56px (Shifted 10px inwards). Coords: +/- 74.23px */}

                {/* Corner 1: (+, +, +) */}
                <div className="beam strut" style={{ transform: 'translate3d(74.23px, 74.23px, 74.23px) rotateZ(45deg) rotateY(-35.26deg)' }}>
                    <div className="beam-face" style={{ transform: 'translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateY(180deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(90deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(-90deg) translateZ(5px)' }}></div>
                </div>

                {/* Corner 2: (+, +, -) */}
                <div className="beam strut" style={{ transform: 'translate3d(74.23px, 74.23px, -74.23px) rotateZ(45deg) rotateY(35.26deg)' }}>
                    <div className="beam-face" style={{ transform: 'translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateY(180deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(90deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(-90deg) translateZ(5px)' }}></div>
                </div>

                {/* Corner 3: (+, -, +) */}
                <div className="beam strut" style={{ transform: 'translate3d(74.23px, -74.23px, 74.23px) rotateZ(-45deg) rotateY(-35.26deg)' }}>
                    <div className="beam-face" style={{ transform: 'translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateY(180deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(90deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(-90deg) translateZ(5px)' }}></div>
                </div>

                {/* Corner 4: (+, -, -) */}
                <div className="beam strut" style={{ transform: 'translate3d(74.23px, -74.23px, -74.23px) rotateZ(-45deg) rotateY(35.26deg)' }}>
                    <div className="beam-face" style={{ transform: 'translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateY(180deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(90deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(-90deg) translateZ(5px)' }}></div>
                </div>

                {/* Corner 5: (-, +, +) */}
                <div className="beam strut" style={{ transform: 'translate3d(-74.23px, 74.23px, 74.23px) rotateZ(135deg) rotateY(-35.26deg)' }}>
                    <div className="beam-face" style={{ transform: 'translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateY(180deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(90deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(-90deg) translateZ(5px)' }}></div>
                </div>

                {/* Corner 6: (-, +, -) */}
                <div className="beam strut" style={{ transform: 'translate3d(-74.23px, 74.23px, -74.23px) rotateZ(135deg) rotateY(35.26deg)' }}>
                    <div className="beam-face" style={{ transform: 'translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateY(180deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(90deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(-90deg) translateZ(5px)' }}></div>
                </div>

                {/* Corner 7: (-, -, +) */}
                <div className="beam strut" style={{ transform: 'translate3d(-74.23px, -74.23px, 74.23px) rotateZ(-135deg) rotateY(-35.26deg)' }}>
                    <div className="beam-face" style={{ transform: 'translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateY(180deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(90deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(-90deg) translateZ(5px)' }}></div>
                </div>

                {/* Corner 8: (-, -, -) */}
                <div className="beam strut" style={{ transform: 'translate3d(-74.23px, -74.23px, -74.23px) rotateZ(-135deg) rotateY(35.26deg)' }}>
                    <div className="beam-face" style={{ transform: 'translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateY(180deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(90deg) translateZ(5px)' }}></div>
                    <div className="beam-face" style={{ transform: 'rotateX(-90deg) translateZ(5px)' }}></div>
                </div>

            </div>
        </div>
    );
}
