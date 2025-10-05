import { createAction, props } from "@ngrx/store";

// An action to load articles (often handled by an Effect)
export const loadNewsItemIds = createAction('[NewsItems API] Load NewsItemIds');

// An action for successful data retrieval
export const loadNewsItemIdsSuccess = createAction(
  '[NewsItemIds API] Load NewsItemIds Success',
  props<{ newsItemIds: number[] }>()
);

// An action for failure data retrieval
export const loadNewsItemIdsFailure = createAction(
  '[NewsItemIds API] Load NewsItemIds Failure',
  props<{ error: unknown }>()
);

// An action for an event in the UI
export const addNewsItemIds = createAction(
  '[NewsItems Page] Add NewsItemIds',
  props<{ newsItemIds: number[] }>()
);
