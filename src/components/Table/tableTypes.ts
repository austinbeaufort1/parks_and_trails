type Route = 'loop' | 'out & back' | 'loop / out & back';

export type DifficultyDesc = 'Easy' | 'Moderate' | 'Moderately Strenuous'
  | 'Strenuous' | 'Very Strenuous' | 'Challenging' | 'Bomber';

export type AngleDesc = 'Flat' | 'Nearly Flat' | 'Gentle Slope'
  | 'Moderately Steep' | 'Steep' | 'Terrifying';

export interface DistanceElevation {
  difficulty: number;
  angle: number;
}

export interface CalculatedFields extends DistanceElevation {
  distance: number;
  elevationGain: number;
  difficultyDesc: DifficultyDesc;
  angleDesc: AngleDesc;
}

export interface Row extends CalculatedFields {
  key: string;
  state: string;
  county: string;
  parkName: string;
  trailName: string;
  route: Route;
  videos: string[][];
  extras: {
    description: string;
    crux: Crux;
  }
}

export interface Crux {
  distance: number;
  angle: number;
  angleDesc: AngleDesc;
}

export type HighestPoint = 'middle' | 'end';

export interface CalcGrade {
  distance: number;
  elevationGain: number;
  highestPoint: HighestPoint;
}

export type AngleTagColors = '#369c56' | '#007d27' |
  '#00641f' | '#004616' | '#003310' | '#001005';

export const angleTagColors: { [key: string]: AngleTagColors } = {
  flat: '#369c56',
  nearlyFlat: '#007d27',
  gentleSlope: '#00641f',
  moderatelySteep: '#004616',
  steep: '#003310',
  verySteep: '#001005',
}

export type DifficultyTagColors = AngleTagColors | '#450000';

export const difficultyTagColors: { [key: string]: DifficultyTagColors } = {
  easy: '#369c56',
  moderate: '#007d27',
  moderatelyStrenuous: '#00641f',
  strenous: '#004616',
  veryStrenuous: '#003310',
  challenging: '#001005',
  bomber: '#450000',
}

export type TableColors = '#dfffe3' | '#eefff0' |
  'e7f5ff' | '#fff5e2' | '#fff7ef'

export const tableColors: { [key: string]: TableColors } = {
  lightestGreen: '#eefff0',
  lightGreen: '#dfffe3',
  lightBlue: 'e7f5ff',
  lightBrown: '#fff5e2',
  lightestBrown: '#fff7ef',
}

// for future use
/*
const scrambles = {
  moderate: '30-45', // class 2
  fairlySteep: '45-60', // class 3
  steep: '60-75', // class 4
  verySteep: '75 and up', // 5.0 climb
}
*/