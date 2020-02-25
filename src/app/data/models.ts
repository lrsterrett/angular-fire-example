export interface HighLevelStats {
  today: number,
  thisWeek: number,
  thisMonth: number,
  thisYear: number,
  allTime: number,
}

export interface UserBasicInfo {
  email: string;
  name: string;
}

export interface User extends UserBasicInfo, HighLevelStats {
  groups: string[];
}

export interface Group extends HighLevelStats {
  name: string;
  members: UserBasicInfo[];
}

export interface DayHistory {
  timeStamp: number;
  stairs: number;
}

export enum StatView {
  Today = 'today',
  ThisWeek = 'thisWeek',
  ThisMonth= 'thisMonth',
  ThisYear = 'thisYear',
  AllTime = 'allTime'
}