import { IApiNewsItem } from "../../dashboard/interfaces/news-item.interface";

export interface IWorkerInput {
  csvData: IApiNewsItem[];
  headers: Record<string, string>;
}
