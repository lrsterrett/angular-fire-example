export interface HighLevelStats {
  today: {
    date: string;
    stairs: number;
  },
  thisWeek: {
    date: string;
    stairs: number;
  },
  thisMonth: {
    date: string;
    stairs: number;
  },
  thisYear: {
    date: string;
    stairs: number;
  },
  allTime: {
    date: string;
    stairs: number;
  },
}

export interface UserBasicInfo {
  email: string;
  name: string;
}

export interface User extends UserBasicInfo, HighLevelStats {
  groups: Record<string, UserBasicInfo>;
}

export interface Group extends HighLevelStats {
  name: string;
  members: Record<string, UserBasicInfo>;
}

export interface DayHistory {
  unixTimeStamp: number;
  stairs: number;
}

export enum StatView {
  Today = 'today',
  ThisWeek = 'thisWeek',
  ThisMonth= 'thisMonth',
  ThisYear = 'thisYear',
  AllTime = 'allTime'
}