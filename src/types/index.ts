export interface Theater {
  id: string;
  name: string;
}

export interface Cast {
  id: string;
  name: string;
  role: string;
}

export interface Show {
  id: string;
  showDate: Date;
  casts: Cast[];
  theater: Theater;
}

export interface Title {
  id: string;
  name: string;
  year: number;
  url: URL;
  shows: Show[];
}
