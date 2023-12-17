import { useEffect, useState } from "react";

function useWindowResize() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    });

    resizeObserver.observe(document.body);

    return () => resizeObserver.disconnect();
  });

  return {
    windowWidth,
    windowHeight,
  };
}

export default useWindowResize;
