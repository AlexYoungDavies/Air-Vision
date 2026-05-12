import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@mui/system';
import Lottie, { type LottieRefCurrentProps } from 'lottie-react';
import hoverAnimationData from '../../assets/hover.json';

const slowSpin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

/**
 * Hover.json is ~80.56 frames @ 29.97fps ≈ 2.69s of source animation. The
 * speed factor gets the loop down to ~2s per half so the ping-pong cadence
 * matches the surrounding UI rhythm.
 */
const GREETING_LOTTIE_SPEED = 80.56 / 29.97 / 2;

export interface AthelasGreetingEmblemProps {
  /** Outer size in px. Defaults to 80, matching the Ask Athelas greeting. */
  size?: number;
}

/**
 * Reusable Athelas greeting emblem — the slow-spinning Lottie shown when the
 * AI Assistant panel first opens. Plays once forward, then reverses on every
 * completion to ping-pong indefinitely, while the outer wrapper provides a
 * separate 20s continuous rotation.
 */
export function AthelasGreetingEmblem({ size = 80 }: AthelasGreetingEmblemProps) {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const directionRef = useRef<1 | -1>(1);

  useEffect(() => {
    const lottie = lottieRef.current;
    if (!lottie) return;
    lottie.setSpeed(GREETING_LOTTIE_SPEED);
    lottie.setDirection(1);
    directionRef.current = 1;
    lottie.play();
  }, []);

  const handleComplete = () => {
    const nextDir = (directionRef.current === 1 ? -1 : 1) as 1 | -1;
    directionRef.current = nextDir;
    lottieRef.current?.setDirection(nextDir);
    lottieRef.current?.play();
  };

  return (
    <Box sx={{ width: size, height: size, animation: `${slowSpin} 20s linear infinite` }}>
      <Lottie
        lottieRef={lottieRef}
        animationData={hoverAnimationData}
        loop={false}
        onComplete={handleComplete}
        style={{ width: size, height: size }}
        rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
      />
    </Box>
  );
}
