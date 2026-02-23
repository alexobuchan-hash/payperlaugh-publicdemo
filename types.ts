
export interface LaughStats {
  count: number;
  totalDue: number;
  pricePerLaugh: number;
  maxCharge: number;
}

export enum AppState {
  IDLE = 'IDLE',
  PERMISSIONS = 'PERMISSIONS',
  SHOWTIME = 'SHOWTIME',
  FINISHED = 'FINISHED'
}

export interface DetectionResult {
  smileProbability: number;
  isSmiling: boolean;
}
