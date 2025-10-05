
export interface ApiNewsItemIdsState {
  newsItemIds: number[];
  isLoading: boolean;
  error: unknown;
}

export const initialState: ApiNewsItemIdsState = {
  newsItemIds: [],
  isLoading: false,
  error: null
};
