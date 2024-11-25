/*
  * first calculate grade, as grade scales by a factor of 2x if middle vs end highest point
  * then convert grade to angle, round to nearest hundredth and return
*/

import { CalcGrade, HighestPoint } from "./tableTypes";

export function calculateAngleNearestHudredth(distance: number, elevationGain: number, highestPoint: HighestPoint): number {
  return roundToHundredth(calculateDegrees(calculateRadians(calculateGrade({ distance, elevationGain, highestPoint }))));
}

function calculateGrade(calcVals: CalcGrade): number {
  const grade = calcVals.distance === 0
    ? 0
    : (calcVals.elevationGain / convertMilesToFeet(calcVals.distance)) * 100;
  return calcVals.highestPoint === 'end' ? grade : grade * 2;
}

function roundToHundredth(angleDegrees: number): number {
  return Math.round(angleDegrees * 100) / 100;
}

function calculateDegrees(angleRadians: number): number {
  return angleRadians * (180 / Math.PI);
}

function calculateRadians(grade: number): number {
  return Math.atan(grade / 100);
}

function convertMilesToFeet(miles: number): number {
  const feetPerMile = 5280;
  return miles * feetPerMile;
}


