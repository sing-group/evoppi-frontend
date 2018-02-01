export interface BlastResult {
  qseqid: number;
  qseqversion: number;
  sseqid: number;
  sseqversion: number;
  pident: number;
  length: number;
  mismatch: number;
  gapopen: number;
  qstart: number;
  qend: number;
  sstart: number;
  send: number;
  evalue: string;
  bitscore: number;
}
