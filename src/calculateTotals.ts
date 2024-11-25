import { data } from "./components/Table/tableData";
import { Row } from "./components/Table/tableTypes";

export interface Totals {
  hike: number,
  bike: number,
  elevationGain: number,
}

export const calculateTotals = (): Totals => {
  return {
    hike: getHikeTotal(data),
    bike: getBikeTotal(data),
    elevationGain: getElevationTotal(data),
  }
}

function checkIsHike(record: Row): boolean {
  return record.videos.some((videoArr: string[]): boolean => videoArr[0].toLowerCase().includes('hike'));
}

function checkIsBike(record: Row): boolean {
  return record.videos.some((videoArr: string[]): boolean => videoArr[0].toLowerCase().includes('bike'));
}

function getHikeTotal(data: Row[]): number {
  return data.reduce((acc, record) =>
    checkIsHike(record) ? acc + record.distance : acc, 0)
}

function getBikeTotal(data: Row[]): number {
  return data.reduce((acc, record) =>
    checkIsBike(record) ? acc + record.distance : acc, 0)
}

function getElevationTotal(data: Row[]): number {
  return data.reduce((acc, record) => acc + record.elevationGain, 0)
}
