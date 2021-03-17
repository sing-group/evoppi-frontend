/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2021 - Noé Vázquez González,
 *  Miguel Reboiro-Jato, Jorge Vieira, Hugo López-Fernández,
 *  and Cristina Vieira.
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

export interface UniProtDb {
    abbreviation: string,
    name: string
}

export const UNIPROT_DBS: UniProtDb[] = [
    { name: 'Allergome', abbreviation: 'ALLERGOME_ID' },
    { name: 'ArachnoServer', abbreviation: 'ARACHNOSERVER_ID' },
    { name: 'Araport', abbreviation: 'ARAPORT_ID' },
    { name: 'BioCyc', abbreviation: 'BIOCYC_ID' },
    { name: 'BioGrid', abbreviation: 'BIOGRID_ID' },
    { name: 'BioMuta', abbreviation: 'BIOMUTA_ID' },
    { name: 'CCDS', abbreviation: 'CCDS_ID' },
    { name: 'CGD', abbreviation: 'CGD' },
    { name: 'ChEMBL', abbreviation: 'CHEMBL_ID' },
    { name: 'ChiTaRS', abbreviation: 'CHITARS_ID' },
    { name: 'CleanEx', abbreviation: 'CLEANEX_ID' },
    { name: 'CollecTF', abbreviation: 'COLLECTF_ID' },
    { name: 'ConoServer', abbreviation: 'CONOSERVER_ID' },
    { name: 'CRC64', abbreviation: 'CRC64' },
    { name: 'dictyBase', abbreviation: 'DICTYBASE_ID' },
    { name: 'DIP', abbreviation: 'DIP_ID' },
    { name: 'DisProt', abbreviation: 'DISPROT_ID' },
    { name: 'DNASU', abbreviation: 'DNASU_ID' },
    { name: 'DrugBank', abbreviation: 'DRUGBANK_ID' },
    { name: 'EchoBASE', abbreviation: 'ECHOBASE_ID' },
    { name: 'EcoGene', abbreviation: 'ECOGENE_ID' },
    { name: 'eggNOG', abbreviation: 'EGGNOG_ID' },
    { name: 'EMBL/GenBank/DDBJ CDS', abbreviation: 'EMBL' },
    { name: 'EMBL/GenBank/DDBJ', abbreviation: 'EMBL_ID' },
    { name: 'Ensembl Genomes', abbreviation: 'ENSEMBLGENOME_ID' },
    { name: 'Ensembl Genomes Protein', abbreviation: 'ENSEMBLGENOME_PRO_ID' },
    { name: 'Ensembl Genomes Transcript', abbreviation: 'ENSEMBLGENOME_TRS_ID' },
    { name: 'Ensembl', abbreviation: 'ENSEMBL_ID' },
    { name: 'Ensembl Protein', abbreviation: 'ENSEMBL_PRO_ID' },
    { name: 'Ensembl Transcript', abbreviation: 'ENSEMBL_TRS_ID' },
    { name: 'ESTHER', abbreviation: 'ESTHER_ID' },
    { name: 'euHCVdb', abbreviation: 'EUHCVDB_ID' },
    { name: 'EuPathDB', abbreviation: 'EUPATHDB_ID' },
    { name: 'FlyBase', abbreviation: 'FLYBASE_ID' },
    { name: 'GeneCards', abbreviation: 'GENECARDS_ID' },
    { name: 'GeneDB', abbreviation: 'GENEDB_ID' },
    { name: 'GeneID (Entrez Gene)', abbreviation: 'P_ENTREZGENEID' },
    { name: 'GeneID', abbreviation: 'P_ENTREZGENEID' },
    { name: 'Gene name', abbreviation: 'GENENAME' },
    { name: 'Gene_ORFName', abbreviation: 'GENEORFNAME' },
    { name: 'GeneReviews', abbreviation: 'GENEREVIEWS_ID' },
    { name: 'GeneTree', abbreviation: 'GENETREE_ID' },
    { name: 'GeneWiki', abbreviation: 'GENEWIKI_ID' },
    { name: 'GenomeRNAi', abbreviation: 'GENOMERNAI_ID' },
    { name: 'GI number', abbreviation: 'P_GI' },
    { name: 'GuidetoPHARMACOLOGY', abbreviation: 'GUIDETOPHARMACOLOGY_ID' },
    { name: 'HGNC', abbreviation: 'HGNC_ID' },
    { name: 'H-InvDB', abbreviation: 'H_INVDB_ID' },
    { name: 'HOGENOM', abbreviation: 'HOGENOM_ID' },
    { name: 'HOVERGEN', abbreviation: 'HOVERGEN_ID' },
    { name: 'HPA', abbreviation: 'HPA_ID' },
    { name: 'KEGG', abbreviation: 'KEGG_ID' },
    { name: 'KO', abbreviation: 'KO_ID' },
    { name: 'LegioList', abbreviation: 'LEGIOLIST_ID' },
    { name: 'Leproma', abbreviation: 'LEPROMA_ID' },
    { name: 'MaizeGDB', abbreviation: 'MAIZEGDB_ID' },
    { name: 'MEROPS', abbreviation: 'MEROPS_ID' },
    { name: 'MGI', abbreviation: 'MGI_ID' },
    { name: 'MIM', abbreviation: 'MIM_ID' },
    { name: 'MINT', abbreviation: 'MINT_ID' },
    { name: 'mycoCLAP', abbreviation: 'MYCOCLAP_ID' },
    { name: 'neXtProt', abbreviation: 'NEXTPROT_ID' },
    { name: 'OMA', abbreviation: 'OMA_ID' },
    { name: 'Orphanet', abbreviation: 'ORPHANET_ID' },
    { name: 'OrthoDB', abbreviation: 'ORTHODB_ID' },
    { name: 'PATRIC', abbreviation: 'PATRIC_ID' },
    { name: 'PDB', abbreviation: 'PDB_ID' },
    { name: 'PeroxiBase', abbreviation: 'PEROXIBASE_ID' },
    { name: 'PharmGKB', abbreviation: 'PHARMGKB_ID' },
    { name: 'PIR', abbreviation: 'PIR' },
    { name: 'PomBase', abbreviation: 'POMBASE_ID' },
    { name: 'PseudoCAP', abbreviation: 'PSEUDOCAP_ID' },
    { name: 'Reactome', abbreviation: 'REACTOME_ID' },
    { name: 'REBASE', abbreviation: 'REBASE_ID' },
    { name: 'RefSeq Nucleotide', abbreviation: 'REFSEQ_NT_ID' },
    { name: 'RefSeq Protein', abbreviation: 'P_REFSEQ_AC' },
    { name: 'RGD', abbreviation: 'RGD_ID' },
    { name: 'SGD', abbreviation: 'SGD_ID' },
    { name: 'STRING', abbreviation: 'STRING_ID' },
    { name: 'SwissLipids', abbreviation: 'SWISSLIPIDS_ID' },
    { name: 'TCDB', abbreviation: 'TCDB_ID' },
    { name: 'TreeFam', abbreviation: 'TREEFAM_ID' },
    { name: 'TubercuList', abbreviation: 'TUBERCULIST_ID' },
    { name: 'UCSC', abbreviation: 'UCSC_ID' },
    { name: 'UniGene', abbreviation: 'UNIGENE_ID' },
    { name: 'UniParc', abbreviation: 'UPARC' },
    { name: 'UniPathway', abbreviation: 'UNIPATHWAY_ID' },
    { name: 'UniProtKB AC', abbreviation: 'ACC' },
    { name: 'UniProtKB AC/ID', abbreviation: 'ACC+ID' },
    { name: 'UniProtKB ID', abbreviation: 'ID' },
    { name: 'UniRef100', abbreviation: 'NF100' },
    { name: 'UniRef50', abbreviation: 'NF50' },
    { name: 'UniRef90', abbreviation: 'NF90' },
    { name: 'VectorBase', abbreviation: 'VECTORBASE_ID' },
    { name: 'WBParaSite', abbreviation: 'WBPARASITE_ID' },
    { name: 'World-2DPAGE', abbreviation: 'WORLD_2DPAGE_ID' },
    { name: 'WormBase', abbreviation: 'WORMBASE_ID' },
    { name: 'WormBase Protein', abbreviation: 'WORMBASE_PRO_ID' },
    { name: 'WormBase Transcript', abbreviation: 'WORMBASE_TRS_ID' },
    { name: 'Xenbase', abbreviation: 'XENBASE_ID' },
    { name: 'ZFIN', abbreviation: 'ZFIN_ID' }
];
