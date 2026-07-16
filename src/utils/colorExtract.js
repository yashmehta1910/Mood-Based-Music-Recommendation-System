export function extractColor(imageUrl) {
  return new Promise((resolve) => {
    if (!imageUrl) return resolve({ r: 201, g: 168, b: 76 });
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < d.length; i += 16) {
          r += d[i]; g += d[i+1]; b += d[i+2]; count++;
        }
        resolve({ r: Math.round(r/count), g: Math.round(g/count), b: Math.round(b/count) });
      } catch { resolve({ r: 201, g: 168, b: 76 }); }
    };
    img.onerror = () => resolve({ r: 201, g: 168, b: 76 });
  });
}