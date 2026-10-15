// Share the existing, pinned Three.js CDN download between decorative canvases.
let pendingThree;

export function loadThree() {
  if (window.THREE) return Promise.resolve(window.THREE);
  if (pendingThree) return pendingThree;

  pendingThree = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const timer = window.setTimeout(() => reject(new Error("Three.js load timed out")), 15000);
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = true;
    script.onload = () => {
      window.clearTimeout(timer);
      if (window.THREE) resolve(window.THREE);
      else reject(new Error("Three.js unavailable"));
    };
    script.onerror = () => {
      window.clearTimeout(timer);
      script.remove();
      reject(new Error("Three.js download failed"));
    };
    document.head.appendChild(script);
  }).catch((error) => {
    pendingThree = undefined;
    throw error;
  });

  return pendingThree;
}
