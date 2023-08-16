import { Box, Text } from '@mantine/core';
import { useEffect, useRef } from 'react';

// Not sure why the types are not working for this package.
// Not gonna waste time investigating...
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ConfettiGenerator from 'confetti-js';

const SuccessConfetti = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const confetti = new ConfettiGenerator({
      target: canvasRef.current,
      height: 70,
      clock: 15,
    });
    confetti.render();
  }, []);

  return (
    <Box pos="relative" bg="dark" className="flex justify-center items-center p-4" style={{
      height: "70px",
    }}>
      <Text color="white" size="lg" fw="bold">
        Congratulations!!!
      </Text>
      <canvas className="absolute top-0 left-0 w-full h-full" ref={canvasRef} />
    </Box>
  )
}

export { SuccessConfetti };
