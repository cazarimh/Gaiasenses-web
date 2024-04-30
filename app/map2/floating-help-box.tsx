"use client";
import useInterval from "@/hooks/use-interval";
import useTimeout from "@/hooks/use-timeout";
import { useEffect, useState } from "react";

const helpOptions = [
  "Clique e arraste para girar o globo",
  "Clique e arraste o marcador para movê-lo para outro lugar",
];

export default function FloatingHelpBox() {
  const [mousePosition, setMousePosition] = useState<{
    x: null | number;
    y: null | number;
  }>({ x: null, y: null });

  const [show, setShow] = useState(false);
  const [helpContent, setHelpContent] = useState<0 | 1>(0);

  const { timeoutRef: timeout, restart: restartTimeout } = useTimeout(
    () => setShow(true),
    10000
  );

  const { intervalRef: interval, restart: restartInterval } = useInterval(
    () =>
      setHelpContent((prev) => {
        if (prev === 0) return 1;
        return 0;
      }),
    10000
  );

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      setMousePosition({ x: event.clientX, y: event.clientY });
      setShow(false);
      restartTimeout();
    }

    function handleMouseDown(event: MouseEvent) {
      setShow(false);
    }

    function handleMouseUp(event: MouseEvent) {
      restartTimeout();
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [restartTimeout, setMousePosition]);

  useEffect(() => {
    if (show) {
      restartInterval();
    }
  }, [show, restartInterval]);

  return (
    <div
      className={`absolute top-0 left-0 bg-white p-2 rounded transition-opacity ${
        show ? "opacity-100" : "opacity-0"
      }`}
      style={{
        top: (mousePosition.y ?? 0) + 8 + "px",
        left: (mousePosition.x ?? 0) + 8 + "px",
      }}
    >
      <div className=" bg-white">
        <p className="text-sm text-center text-gray-500">
          {helpOptions[helpContent]}
        </p>
      </div>
    </div>
  );
}
