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
