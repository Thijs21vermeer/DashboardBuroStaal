
// Types voor het project

export interface KennisItem {
  id: number;
  titel: string;
  type: string;
  tags: string;
  gekoppeld_project?: string;
  eigenaar: string;
  samenvatting: string;
  inhoud: string;
  datum_toegevoegd: string;
  laatst_bijgewerkt: string;
  video_link?: string;
}

export interface Case {
  id: number;
  titel: string;
  klant: string;
  industrie: string;
  uitdaging: string;
  oplossing: string;
  resultaten: string;
  tags: string;
  eigenaar: string;
  datum_afgerond: string;
  featured: boolean;
  roi?: string;
  project_duur?: string;
  team_leden?: string;
  referenties?: string;
}

export interface Trend {
  id: number;
  titel: string;
  categorie: string;
  samenvatting: string;
  inhoud: string;
  bron?: string;
  tags: string;
  eigenaar: string;
  datum_gepubliceerd: string;
  relevantie: string;
  impact_score?: number;
}

export interface NewsItem {
  id: number;
  titel: string;
  inhoud: string;
  auteur: string;
  datum_gepubliceerd: string;
  categorie: string;
  featured: boolean;
}

export interface TeamMember {
  id: number;
  naam: string;
  rol: string;
  expertise: string;
  bio: string;
  foto_url?: string;
  linkedin_url?: string;
  email?: string;
  type: 'intern' | 'extern';
  bedrijf?: string;
}

export interface Tool {
  id: number;
  naam: string;
  categorie: string;
  beschrijving: string;
  url?: string;
  licentie_info?: string;
  eigenaar: string;
  datum_toegevoegd: string;
  tags?: string;
  logo_url?: string;
  prijs?: string;
}

export interface Video {
  id: number;
  titel: string;
  beschrijving?: string;
  youtube_url: string;
  thumbnail_url?: string;
  categorie: string;
  tags?: string;
  eigenaar?: string;
  datum_toegevoegd: string;
  laatst_bijgewerkt: string;
  views: number;
  featured: boolean;
}

export type PageType = 
  | 'overzicht' 
  | 'kennisbank' 
  | 'cases' 
  | 'trends' 
  | 'nieuws' 
  | 'team'
  | 'tools'
  | 'videos'
  | 'admin'
  | `kennisitem-${number}`
  | `trend-${number}`
  | `nieuws-${number}`;

