
export class CsvHelper {
  public static getCSV(headers: Array<string>, data: Array<Array<string>>): string {
    let csv = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n';
    for (const row of data){
      csv += row.join(',') + '\n';
    }
    return encodeURI(csv);
  }
}
