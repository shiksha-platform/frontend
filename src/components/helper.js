import React from "react";
import manifest from "../shiksha-os/manifest.json";

export const maxWidth = manifest?.maxWidth ? manifest?.maxWidth : "414";
export function useWindowSize() {
  const [size, setSize] = React.useState([0, 0]);
  React.useLayoutEffect(() => {
    function updateSize() {
      setSize([
        window.outerWidth > maxWidth ? maxWidth : window.outerWidth,
        window.innerHeight,
      ]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}
