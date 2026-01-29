// export function formatDistance(feet: number): string {
//   const meters = feet / 3.28084;
//   if (meters >= 1000) {
//     return `${(feet / 5280).toFixed(2)} mi (${(meters / 1000).toFixed(2)} km)`;
//   }
//   return `${(feet / 5280).toFixed(2)} mi (${Math.round(meters)} m)`;
// }

// export function formatElevation(feet: number): string {
//   const meters = feet / 3.28084;
//   if (meters >= 1000) {
//     return `${feet.toFixed(0)} ft (${(meters / 1000).toFixed(2)} km)`;
//   }
//   return `${feet.toFixed(0)} ft (${Math.round(meters)} m)`;
// }

// src/components/helpers/format.ts

/** Convert meters to miles */
export function metersToMiles(m: number) {
  return m / 1609.34;
}

/** Convert meters to kilometers */
export function metersToKm(m: number) {
  return m / 1000;
}

/** Convert meters to feet */
export function metersToFeet(m: number) {
  return m * 3.28084;
}

/** Format distance nicely for display */
export function formatDistance(m: number) {
  const miles = metersToMiles(m);
  if (m >= 500) {
    // Show km if >= 1 km
    const km = metersToKm(m);
    return `${miles.toFixed(2)} mi (${km.toFixed(1)} km)`;
  }
  const ft = metersToFeet(m);
  return `${ft.toFixed(0)} ft (${Math.round(m)} m)`;
}

/** Format elevation nicely for display */
export function formatElevation(m: number) {
  const ft = metersToFeet(m);
  if (m >= 1000) {
    const km = metersToKm(m);
    return `${ft.toFixed(0)} ft (${km.toFixed(1)} km)`;
  }
  return `${ft.toFixed(0)} ft (${Math.round(m)} m)`;
}
