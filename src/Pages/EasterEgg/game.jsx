import React, { useRef, useState, useEffect } from "react";

const Game = () => {
    const canvasRef = useRef(null);
    const [arrow, setArrow] = useState({ x: 50, y: 250, dx: 0, dy: 0, shot: false });
    const [bow, setBow] = useState({ x: 50, y: 250, stretch: 0, angle: 0, pulling: false });
    const [target, setTarget] = useState({ x: 600, y: 200 });
    const [score, setScore] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    
    const canvasWidth = 800;
    const canvasHeight = 500;
    const maxStretch = 50;  // Max stretch distance for the bow

    // Handle mouse down event to start pulling the bow
    const handleMouseDown = (e) => {
        if (!arrow.shot) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setMousePos({ x, y });
            setBow({ ...bow, pulling: true });
        }
    };

    // Handle mouse up event to release the arrow
    const handleMouseUp = () => {
        if (bow.pulling && !arrow.shot) {
            const force = bow.stretch / maxStretch * 10;  // Force proportional to stretch
            const dx = force * Math.cos(bow.angle);
            const dy = force * Math.sin(bow.angle);
            setArrow({ ...arrow, dx, dy, shot: true });
            setBow({ ...bow, pulling: false, stretch: 0 });
        }
    };

    // Handle mouse movement to stretch the bow
    const handleMouseMove = (e) => {
        if (bow.pulling && !arrow.shot) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setMousePos({ x, y });

            const dx = x - bow.x;
            const dy = y - bow.y;
            const distance = Math.min(Math.sqrt(dx * dx + dy * dy), maxStretch);  // Max stretch limited
            const angle = Math.atan2(dy, dx);

            setBow({ ...bow, stretch: distance, angle });
        }
    };

    // Update the arrow position after being shot
    useEffect(() => {
        const interval = setInterval(() => {
            if (arrow.shot) {
                setArrow((prevArrow) => ({
                    ...prevArrow,
                    x: prevArrow.x + prevArrow.dx,
                    y: prevArrow.y + prevArrow.dy
                }));

                // Check if arrow hits the target
                if (Math.abs(arrow.x - target.x) < 20 && Math.abs(arrow.y - target.y) < 20) {
                    setScore(score + 10);
                    setArrow({ x: 50, y: 250, dx: 0, dy: 0, shot: false });
                }

                // Reset arrow if it goes off screen
                if (arrow.x > canvasWidth || arrow.y > canvasHeight || arrow.y < 0) {
                    setArrow({ x: 50, y: 250, dx: 0, dy: 0, shot: false });
                }
            }
        }, 50);

        return () => clearInterval(interval);
    }, [arrow, target, score]);

    // Draw the bow, arrow, and target
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const draw = () => {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            // Draw bow
            ctx.beginPath();
            ctx.moveTo(bow.x, bow.y);
            ctx.lineTo(bow.x - bow.stretch * Math.cos(bow.angle), bow.y - bow.stretch * Math.sin(bow.angle));
            ctx.strokeStyle = "brown";
            ctx.lineWidth = 5;
            ctx.stroke();

            // Draw bow string (lines from bow to arrow position)
            ctx.beginPath();
            ctx.moveTo(bow.x, bow.y);
            ctx.lineTo(arrow.x, arrow.y);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw arrow
            ctx.beginPath();
            ctx.moveTo(arrow.x, arrow.y);
            ctx.lineTo(arrow.x - 20 * Math.cos(bow.angle), arrow.y - 20 * Math.sin(bow.angle));
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.stroke();

            // Draw target
            ctx.beginPath();
            ctx.arc(target.x, target.y, 20, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
        };

        draw();
    }, [bow, arrow, target]);

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                style={{ border: "1px solid black" }}
            />
            <div>
                <h2>Score: {score}</h2>
            </div>
        </div>
    );
};

export default Game;