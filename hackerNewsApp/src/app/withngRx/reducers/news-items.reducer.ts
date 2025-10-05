import { createReducer, on } from "@ngrx/store";
import { initialState } from "../state/news-item.state";
import * as NewsItemActions from '../actions/news-item.actions';
export const newsItemsReducer = createReducer(
  initialState,

  // Example for updating a boolean property
  on(NewsItemActions.loadNewsItemIds, (state) => ({
    ...state,
    isLoading: true,
  })),

  // Example for replacing a collection
  on(NewsItemActions.loadNewsItemIdsSuccess, (state, { newsItemIds }) => ({
    ...state,
    newsItemIds: newsItemIds, // Set the new array of articles
    isLoading: false,
  })),

  // When 'loadNewsItemIdsFailure' is dispatched: store the error, turn off loading
  on(NewsItemActions.loadNewsItemIdsFailure, (state, { error }) => ({
    ...state,
    error: error,
    isLoading: false,
    newsItemIds: [], // Optionally clear data on failure
  })),

  // Example for adding an item to a collection
  on(NewsItemActions.addNewsItemIds, (state, { newsItemIds }) => ({
    ...state,
    newsItemIds: [...newsItemIds], // Add new ids to the array ...state.newsItemIds,
  }))
);
