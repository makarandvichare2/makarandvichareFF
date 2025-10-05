import { NewsType } from "../enums/news-type.enum";

export interface IApiNewsItem {
  id: number;
  type: NewsType;
  by: string;
  time: number;
  title: string;
  url: string;
  score: number;
  descendants: number;
}

