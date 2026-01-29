// Node Script for converting gpx to geojson files
// run when conversion needed, separate from app

import fs from 'fs';
import path from 'path';
import { gpx } from '@tmcw/togeojson';
import { DOMParser } from 'xmldom';

// Example: convert all GPX files in a folder
const gpxFolder = './src/trail-data/gpx';
const geojsonFolder = './src/trail-data/geojson';

fs.readdirSync(gpxFolder).forEach((file) => {
  if (!file.endsWith('.gpx')) return;

  const xml = fs.readFileSync(path.join(gpxFolder, file), 'utf-8');
  const xmlDoc = new DOMParser().parseFromString(xml, 'text/xml');
  const geojson = gpx(xmlDoc);

  const outFile = file.replace('.gpx', '.json');
  fs.writeFileSync(path.join(geojsonFolder, outFile), JSON.stringify(geojson, null, 2));
  console.log(`Converted ${file} → ${outFile}`);
});
