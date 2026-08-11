"use client";

import React from "react";
import {
  PiggyBank,
  TrendingUp,
  ShieldCheck,
  Wallet,
  Landmark,
  Calculator,
  HeartHandshake,
  LineChart,
  type LucideIcon,
} from "lucide-react";
import ParticleSphereAnimation from "./orbiting-circles-02-utils/particalsphear";

const orbits: {
  size: string;
  duration: number;
  icons: { Icon: LucideIcon; alt: string; angle: number }[];
}[] = [
  {
    size: "w-70 h-70 md:w-100 md:h-100",
    duration: 18,
    icons: [
      { Icon: PiggyBank, alt: "저축", angle: -60 },
      { Icon: TrendingUp, alt: "자산 성장", angle: 0 },
      { Icon: ShieldCheck, alt: "안전 자산", angle: 60 },
    ],
  },
  {
    size: "w-95 h-95 md:w-135 md:h-135",
    duration: 24,
    icons: [
      { Icon: Wallet, alt: "자산 관리", angle: 0 },
      { Icon: Landmark, alt: "금융기관", angle: -90 },
    ],
  },
  {
    size: "w-120 h-120 md:w-170 md:h-170",
    duration: 30,
    icons: [
      { Icon: Calculator, alt: "재무 설계", angle: -60 },
      { Icon: HeartHandshake, alt: "신뢰 상담", angle: 0 },
      { Icon: LineChart, alt: "투자 분석", angle: 60 },
    ],
  },
];

export default function OrbitingCirclesGlobeDemo() {
  return (
    <div className="relative w-full h-64 md:h-88 overflow-hidden flex justify-center">
      <style>{`
        @keyframes orbit-cw {
          from { transform: rotate(var(--start-angle)) }
          to   { transform: rotate(calc(var(--start-angle) + 360deg)) }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(var(--start-angle)) }
          to   { transform: rotate(calc(var(--start-angle) - 360deg)) }
        }
        @keyframes counter-cw {
          from { transform: rotate(var(--counter-offset, 0deg)) }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) - 360deg)) }
        }
        @keyframes counter-ccw {
          from { transform: rotate(var(--counter-offset, 0deg)) }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) + 360deg)) }
        }
      `}</style>

      {/* Center particle globe */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 aspect-square pointer-events-none w-40 md:w-60 z-10">
        <ParticleSphereAnimation />
      </div>

      {/* Orbiting rings */}
      {orbits.map((orbit, index) => {
        const isCW = index % 2 === 0;
        const orbitAnim = isCW ? "orbit-cw" : "orbit-ccw";
        const counterAnim = isCW ? "counter-cw" : "counter-ccw";

        const allIcons = [
          ...orbit.icons,
          ...orbit.icons.map((ic) => ({
            ...ic,
            angle: ic.angle + 180,
            alt: `${ic.alt}-mirror`,
          })),
        ];

        return (
          <div
            key={index}
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full border border-border ${orbit.size}`}
          >
            {allIcons.map((iconData, iconIndex) => (
              <div
                key={iconIndex}
                className="absolute top-0 left-1/2 h-1/2 -ml-8 origin-bottom flex flex-col justify-start items-center"
                style={
                  {
                    "--start-angle": `${iconData.angle}deg`,
                    animation: `${orbitAnim} ${orbit.duration}s linear infinite`,
                  } as React.CSSProperties
                }
              >
                <div
                  className="p-3 sm:p-4 border border-border rounded-full bg-background -mt-8 relative z-10"
                  style={
                    {
                      "--counter-offset": `${-iconData.angle}deg`,
                      animation: `${counterAnim} ${orbit.duration}s linear infinite`,
                    } as React.CSSProperties
                  }
                >
                  <iconData.Icon
                    aria-label={iconData.alt}
                    className="w-6 h-6 md:w-8 md:h-8 text-primary"
                    strokeWidth={1.75}
                  />
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
