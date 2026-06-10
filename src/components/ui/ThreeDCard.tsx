"use client";

import { useRef, useState } from "react";

type ThreeDCardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function ThreeDCard({ children, className = "" }: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState("");

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    setTransform(
      `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`
    );
  }

  function handleMouseLeave() {
    setTransform("perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{ transform }}
    >
      {children}
    </div>
  );
}
