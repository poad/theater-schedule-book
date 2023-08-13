export interface Theater {
  id: string;
  name: string;
}

export interface Cast {
  id: string;
  name: String;
  role: String;
}

export interface Show {
  id: string;
  showDate: Date;
  casts: Cast[];
  theater: Theater
}

export interface Title {
  id: string;
  name: string;
  url: URL;
  shows: Show[]
}
