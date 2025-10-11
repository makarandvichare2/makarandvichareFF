import { Observable } from "rxjs";

export interface ICanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}
