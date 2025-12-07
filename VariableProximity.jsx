import React, { useRef, useEffect, useMemo } from "react";

// --- Helper Hook: useAnimationFrame ---
function useAnimationFrame(callback) {
    useEffect(() => {
        let frameId;
        const loop = () => {
            callback();
            frameId = requestAnimationFrame(loop);
        };
        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, [callback]);
}

// --- Helper Hook: useMousePositionRef ---
function useMousePositionRef(containerRef) {
    const positionRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const updatePosition = (x, y) => {
            if (containerRef?.current) {
                const rect = containerRef.current.getBoundingClientRect();
                positionRef.current = { x: x - rect.left, y: y - rect.top };
            } else {
                positionRef.current = { x, y };
            }
        };
        const handleMouseMove = (ev) => updatePosition(ev.clientX, ev.clientY);
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [containerRef]);

    return positionRef;
}

// --- Reusable, Self-Contained Effect Component ---
const VariableProximity = ({ label, className, containerRef, fromSettings, toSettings, radius }) => {
    const letterRefs = useRef([]);
    const mousePositionRef = useMousePositionRef(containerRef);

    const parsedSettings = useMemo(() => {
        const parse = (str) => new Map(str.split(",").map(s => {
            const [axis, value] = s.trim().split(" ");
            return [axis.replace(/['"]/g, ""), parseFloat(value)];
        }));
        const from = parse(fromSettings);
        const to = parse(toSettings);
        return Array.from(from.entries()).map(([axis, fromValue]) => ({
            axis,
            fromValue,
            toValue: to.get(axis) ?? fromValue,
        }));
    }, [fromSettings, toSettings]);

    useAnimationFrame(() => {
        if (!containerRef?.current) return;
        const { x, y } = mousePositionRef.current;
        const containerRect = containerRef.current.getBoundingClientRect();

        letterRefs.current.forEach((letterRef) => {
            if (!letterRef) return;
            const rect = letterRef.getBoundingClientRect();
            const letterCenterX = rect.left + rect.width / 2 - containerRect.left;
            const letterCenterY = rect.top + rect.height / 2 - containerRect.top;
            const distance = Math.sqrt((x - letterCenterX) ** 2 + (y - letterCenterY) ** 2);
            const falloff = Math.max(0, 1 - distance / radius);

            const newSettings = parsedSettings.map(({ axis, fromValue, toValue }) => {
                const value = fromValue + (toValue - fromValue) * falloff;
                return `'${axis}' ${value}`;
            }).join(", ");

            letterRef.style.fontVariationSettings = newSettings;
        });
    });

    return (
        <div className={className} style={{ fontFamily: '"Roboto Flex", sans-serif' }}>
            {label.split(" ").map((word, wordIndex, words) => (
                <span key={wordIndex} className="inline-block whitespace-nowrap">
                    {word.split("").map((letter, letterIndex) => (
                        <span key={letterIndex} ref={(el) => letterRefs.current.push(el)} className="inline-block">
                            {letter}
                        </span>
                    ))}
                    {wordIndex < words.length - 1 && '\u00A0' /* Non-breaking space */}
                </span>
            ))}
        </div>
    );
};

export default VariableProximity;
