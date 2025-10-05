import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as NewsItemActions from '../actions/news-item.actions';
import { catchError, map, of, switchMap } from "rxjs";
import { environment } from "../../common/enviornment/enviornment.dev";
import { ApiEndPoints } from "../../dashboard/constants/api-endpoints.const";

@Injectable()
export class NewsItemEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) { }

  loadNewsItemIds$ = createEffect(() =>
    this.actions$.pipe(
      // 1. Listen for the 'loadNewsItemIds' action
      ofType(NewsItemActions.loadNewsItemIds),
      // 2. Perform the API call and switch to the response Observable
      switchMap(() =>
        this.http.get<number[]>(environment.apiUrl + ApiEndPoints.TopStoriesEndPoint)
          .pipe(
            // 3. If successful, map the data to the 'loadNewsItemIdsSuccess' action
            map(ids => NewsItemActions.loadNewsItemIdsSuccess({ newsItemIds: ids })),
            // 4. If error, catch it and map it to the 'loadNewsItemIdsFailure' action
            catchError(error => of(NewsItemActions.loadNewsItemIdsFailure({ error })))
          )
      )
    )
  );
}
