
export class FastaHelper {
  public static getFasta(header: string, data: Array<string>): string {
    let res = 'data:text/x-fasta;base64,';
    let plain = '';
    for (const row of data) {
      plain += '>' + header + '\n';
      let aux: string;
      let i = 0;
      do {
         aux = row.substring(i * 80, i * 80 + 80);
         plain += aux + '\n';
         ++i;
      } while (aux.length === 80);
      plain += '\n';
    }
    res += btoa(plain);
    return encodeURI(res);
  }
}
