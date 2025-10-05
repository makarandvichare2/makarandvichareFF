import moment from "moment";
import { nullableString } from "../../common/types/nullable-string.type";
import { IApiNewsItem } from "../../dashboard/interfaces/news-item.interface";

export class Helpers {

  static downloadFile(csvData: string, fileName: string) {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('download', fileName + '.csv');
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static generateCSV(data: IApiNewsItem[], headers: Record<string, string>) {

    const colHeaderKeys = Object.keys(headers);
    const colHeaderCaptions = Object.values(headers);
    const csvRows = data.map((row: IApiNewsItem) => {
      return colHeaderKeys.map((header: string) => {
        let value = (row[header as keyof IApiNewsItem] === null
          || row[header as keyof IApiNewsItem] === undefined)
          ? ''
          : String(Helpers.transform(row, header));

        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = '"' + value.replace(/"/g, '""') + '"';
        }
        return value;
      }).join(',');
    });
    return colHeaderCaptions.join(',') + '\n' + csvRows.join('\n');
  }
  // private static transformData<T extends PipeTransform>(value: unknown,
  //   PipeClass: PipeConstructor<T>,
  //   ...pipeArgs: unknown[]): ReturnType<T['transform']> {
  //   const pipeInstance = new PipeClass();
  //   return pipeInstance.transform(value, ...pipeArgs) as ReturnType<T['transform']>;;
  // }

  // private static transformData<T extends PipeTransform>(value: unknown,
  //   pipeInstance: T): ReturnType<T['transform']> {

  //   return pipeInstance.transform(value) as ReturnType<T['transform']>;;
  // }

  private static transform(indexableRow: IApiNewsItem, header: string) {
    if (header === 'time') {
      return moment(indexableRow[header as keyof IApiNewsItem] as number * 1000).fromNow();
    }
    else if (header === 'title') {
      return Helpers.getNewsTitleWithDomainUrl(indexableRow[header as keyof IApiNewsItem] as nullableString, String(indexableRow['url' as keyof IApiNewsItem]));
    }
    return indexableRow[header as keyof IApiNewsItem];
  }

  static getNewsTitleWithDomainUrl(value: nullableString, ...args: string[]) {
    if (value === null || value === undefined) {
      return '';
    }

    // const urlObject = new URL(args.join(" "));
    // return value.concat(" (", urlObject.hostname, ")");
    const fullUrl = args.join(" ");
    let domainUrl = '';
    if (fullUrl.length > 0 && fullUrl.indexOf("/", 8) >= 0) {
      domainUrl = fullUrl.substring(0, fullUrl.indexOf("/", 8));
    }
    else if (fullUrl.length > 0) {
      domainUrl = fullUrl;
    }

    return domainUrl.length > 8 ? value.concat(" (", domainUrl, ")") : value;
  }
}

