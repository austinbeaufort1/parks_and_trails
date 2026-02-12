// Compute bounding box of an SVG path
export function getPathBoundingBox(path: string) {
  const commands = path.match(/[a-df-z][^a-df-z]*/gi);
  if (!commands) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };

  let x = 0,
    y = 0;
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  for (const cmd of commands) {
    const type = cmd[0];
    const nums = cmd
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(Number)
      .filter((n) => !isNaN(n));

    switch (type) {
      case "M":
        x = nums[0];
        y = nums[1];
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        // remaining pairs are treated as "L"
        for (let i = 2; i < nums.length; i += 2) {
          x = nums[i];
          y = nums[i + 1];
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
        break;
      case "m": // relative move
        for (let i = 0; i < nums.length; i += 2) {
          x += nums[i];
          y += nums[i + 1];
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
        break;
      case "L":
        for (let i = 0; i < nums.length; i += 2) {
          x = nums[i];
          y = nums[i + 1];
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
        break;
      case "l": // relative line
        for (let i = 0; i < nums.length; i += 2) {
          x += nums[i];
          y += nums[i + 1];
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
        break;
      case "H":
        for (const n of nums) {
          x = n;
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
        }
        break;
      case "h": // relative horizontal
        for (const n of nums) {
          x += n;
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
        }
        break;
      case "V":
        for (const n of nums) {
          y = n;
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
        break;
      case "v": // relative vertical
        for (const n of nums) {
          y += n;
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
        break;
      case "C":
      case "c":
      case "Q":
      case "q":
      case "S":
      case "s":
      case "T":
      case "t":
        for (let i = 0; i < nums.length; i += 2) {
          if (type === type.toUpperCase()) {
            x = nums[i];
            y = nums[i + 1];
          } else {
            x += nums[i];
            y += nums[i + 1];
          }
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
        break;
      case "Z":
      case "z":
        break;
      default:
        break;
    }
  }

  // Fallback if bbox is invalid
  if (!isFinite(minX)) minX = 0;
  if (!isFinite(minY)) minY = 0;
  if (!isFinite(maxX)) maxX = 100;
  if (!isFinite(maxY)) maxY = 100;

  return { minX, minY, maxX, maxY };
}
