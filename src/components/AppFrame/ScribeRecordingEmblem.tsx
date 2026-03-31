import { useEffect, useRef, useState } from 'react';
import { Box, useTheme } from '@mui/material';

export type ScribeEmblemPhase = 'flower' | 'pulse';

const PULSE_DURATION_S = 2.2;
/** Design: pulse between 120px and 150px outer bounds */
const EMBLEM_BASE_PX = 150;

/** Distance from emblem center to each petal center; lower = more overlap in the middle */
const FLOWER_SPREAD_PX = 21;
/** Diameter in flower / paused formation (larger petals, tighter cross) */
const FLOWER_SIZE_PX = 56;

/** Concentric ring diameters (px), inner → outer */
const PULSE_DIAMETERS = [36, 58, 88, 118] as const;

/** Recording formation: ring opacity inner → outer; lerps to 1 in flower / paused */
const RECORDING_RING_OPACITY = [1, 0.4, 0.2, 0.1] as const;

const PULSE_MIN = 0.8;
const PULSE_MAX = 1;

const PETAL_DIRECTIONS = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
] as const;

/**
 * Shared gradient: transparent at top, accent at bottom (in element local space).
 * Flower: rotate so “bottom” points toward emblem center (top, right, bottom, left petal).
 * Recording: rotate(0) → accent reads as top, transparent as bottom per spec.
 */
const FLOWER_ROTATIONS_DEG = [0, 90, 180, -90] as const;

/** scale = PULSE_MIN + (PULSE_MAX-PULSE_MIN) * (0.5 + 0.5*sin(angle)) → sin = (scale - 0.9) / 0.1 */
function scaleToSin(scale: number): number {
  return Math.max(-1, Math.min(1, (scale - 0.9) / 0.1));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function useSmoothEmblemMotion(phase: ScribeEmblemPhase) {
  const morphRef = useRef(phase === 'flower' ? 1 : 0);
  const scaleRef = useRef(1);
  const angleRef = useRef(Math.PI / 2);
  const lastTRef = useRef<number | null>(null);
  const phaseRef = useRef(phase);

  const [snapshot, setSnapshot] = useState(() => ({
    morph: morphRef.current,
    scale: scaleRef.current,
  }));

  useEffect(() => {
    phaseRef.current = phase;
    if (phase === 'pulse') {
      angleRef.current = Math.asin(scaleToSin(scaleRef.current));
    }
  }, [phase]);

  useEffect(() => {
    const MORPH_RATE = 5.5;
    const SCALE_TO_ONE_RATE = 6.5;

    let raf = 0;
    const tick = (now: number) => {
      const last = lastTRef.current;
      const dt = last == null ? 1 / 60 : Math.min(0.05, (now - last) / 1000);
      lastTRef.current = now;

      const ph = phaseRef.current;
      const morphTarget = ph === 'flower' ? 1 : 0;

      morphRef.current += (morphTarget - morphRef.current) * (1 - Math.exp(-MORPH_RATE * dt));
      if (Math.abs(morphRef.current - morphTarget) < 0.002) {
        morphRef.current = morphTarget;
      }

      if (ph === 'pulse') {
        angleRef.current += ((2 * Math.PI) / PULSE_DURATION_S) * dt;
        const breathe = 0.5 + 0.5 * Math.sin(angleRef.current);
        scaleRef.current = PULSE_MIN + (PULSE_MAX - PULSE_MIN) * breathe;
      } else {
        scaleRef.current += (1 - scaleRef.current) * (1 - Math.exp(-SCALE_TO_ONE_RATE * dt));
        if (Math.abs(scaleRef.current - 1) < 0.001) {
          scaleRef.current = 1;
        }
      }

      setSnapshot((prev) => {
        const m = morphRef.current;
        const s = scaleRef.current;
        if (Math.abs(prev.morph - m) < 0.0002 && Math.abs(prev.scale - s) < 0.0002) {
          return prev;
        }
        return { morph: m, scale: s };
      });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return snapshot;
}

export interface ScribeRecordingEmblemProps {
  /** Flower: before recording + paused. Pulse: active recording (concentric + scale loop). */
  phase: ScribeEmblemPhase;
}

/**
 * Four-circle emblem: cross “flower” layout morphs into concentric rings when recording,
 * with a continuous 120↔150px pulse while active.
 */
export function ScribeRecordingEmblem({ phase }: ScribeRecordingEmblemProps) {
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const { morph, scale } = useSmoothEmblemMotion(phase);

  const flowerGradient = `linear-gradient(to bottom, transparent, ${accent})`;
  const pulseGradient = `linear-gradient(to bottom, ${accent}, transparent)`;

  return (
    <Box
      sx={{
        width: EMBLEM_BASE_PX,
        height: EMBLEM_BASE_PX,
        position: 'relative',
        flexShrink: 0,
        isolation: 'isolate',
        bgcolor: 'background.default',
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        willChange: 'transform',
      }}
    >
      {PETAL_DIRECTIONS.map((dir, i) => {
        const w = lerp(PULSE_DIAMETERS[i], FLOWER_SIZE_PX, morph);
        const tx = lerp(0, dir.x * FLOWER_SPREAD_PX, morph);
        const ty = lerp(0, dir.y * FLOWER_SPREAD_PX, morph);
        const half = w / 2;
        const rotation = lerp(0, FLOWER_ROTATIONS_DEG[i], morph);
        const zFlower = i;
        const zPulse = 4 - i;
        const zIndex = morph >= 0.5 ? zFlower : zPulse;
        const ringMasterOpacity = lerp(RECORDING_RING_OPACITY[i], 1, morph);

        return (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              left: `calc(50% + ${tx}px)`,
              top: `calc(50% + ${ty}px)`,
              width: w,
              height: w,
              marginLeft: `${-half}px`,
              marginTop: `${-half}px`,
              borderRadius: '50%',
              overflow: 'hidden',
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              pointerEvents: 'none',
              zIndex,
              /* Per-channel min vs backdrop so overlaps read darker than multiply here */
              mixBlendMode: 'darken',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: flowerGradient,
                opacity: morph * ringMasterOpacity,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: pulseGradient,
                opacity: (1 - morph) * ringMasterOpacity,
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
}
