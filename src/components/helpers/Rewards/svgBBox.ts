// helpers/svgBBox.ts
export function getBrowserBBox(pathD: string) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.style.position = "absolute";
  svg.style.visibility = "hidden";

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathD);

  svg.appendChild(path);
  document.body.appendChild(svg);

  const bbox = path.getBBox();

  document.body.removeChild(svg);

  return bbox;
}
