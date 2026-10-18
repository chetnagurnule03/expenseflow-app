import { useState, useEffect } from 'react';
import { ThreeDPaper } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export function Scene() {
  const [canRender3D, setCanRender3D] = useState<boolean>(true);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const webGLSupported = isWebGLAvailable();

    if (prefersReducedMotion || !webGLSupported) {
      setCanRender3D(false);
    }
  }, []);

  if (!canRender3D) {
    return <div className="static-fallback-bg" />;
  }

  return (
    <div className="shader-frame">
      <ThreeDPaper variant={"original" as any} />
    </div>
  );
}

export default Scene;
