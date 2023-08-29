export interface IInitialState {
  isLoading: boolean;
  isSuccess: boolean;
  responseMessage: String | null;
  updatedAt: Number | null;
}

export interface ILeaderboard {
  user: string;
  game: string;
  mode: string;
  point: number;
  time: number;
  guess: number;
  rank: number;
}

export interface IAttribute {
  trait_type: string;
  value: string;
}
export interface IMetadata {
  name: string;
  description: string;
  image?: File | string | null;
  attributes: IAttribute[];
}
