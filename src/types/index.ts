




// Types voor het project

export interface KennisItem {
  id: number;
  titel: string;
  type: string;
  categorie: string;
  tags: string[];
  gekoppeldProject?: string;
  eigenaar: string;
  auteur: string;
  samenvatting: string;
  inhoud: string;
  datumToegevoegd: string;
  laatstBijgewerkt: string;
  views: number;
  featured: boolean;
  videoLink?: string;
  afbeelding?: string;
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

export interface CaseStudy {
  id: number;
  titel: string;
  klant: string;
  industrie: string;
  uitdaging: string;
  oplossing: string;
  resultaten: string[];
  tags: string[];
  eigenaar: string;
  datum: string;
  imageUrl?: string;
  featured: boolean;
  referenties: string[];
  type?: string;
  projectDuur?: string;
  team?: string[];
  status?: string;
  budget?: string;
  roi?: string;
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
  datum: string;
  categorie: string;
  tags?: string;
  belangrijk: boolean;
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

// Request types for API endpoints
export interface KennisItemRequest {
  titel: string;
  type: string;
  categorie: string;
  tags?: string;
  gekoppeldProject?: string;
  eigenaar: string;
  auteur: string;
  samenvatting: string;
  inhoud: string;
  featured?: boolean;
  videoLink?: string;
  afbeelding?: string;
}

export interface CaseRequest {
  titel: string;
  klant: string;
  industrie: string;
  uitdaging: string;
  oplossing: string;
  resultaten: string;
  tags?: string;
  eigenaar: string;
  datum_afgerond?: string;
  featured?: boolean;
  roi?: string;
  project_duur?: string;
  team_leden?: string;
  referenties?: string;
}

export interface TrendRequest {
  titel: string;
  categorie: string;
  samenvatting: string;
  beschrijving?: string;
  inhoud: string;
  bron?: string;
  bronnen?: string[];
  tags?: string;
  eigenaar?: string;
  datum_gepubliceerd?: string;
  relevantie: string;
  impact?: string;
  impact_score?: number;
}

export interface NewsRequest {
  titel: string;
  inhoud: string;
  auteur: string;
  datum_gepubliceerd?: string;
  categorie: string;
  tags?: string;
  belangrijk?: boolean;
  featured?: boolean;
}

export interface TeamMemberRequest {
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

export interface ToolRequest {
  naam: string;
  categorie: string;
  beschrijving: string;
  url?: string;
  licentie_info?: string;
  eigenaar: string;
  datum_toegevoegd?: string;
  tags?: string;
  logo_url?: string;
  prijs?: string;
}

export interface VideoRequest {
  titel: string;
  beschrijving?: string;
  youtube_url: string;
  categorie: string;
  tags?: string;
  eigenaar?: string;
  featured?: boolean;
}

export interface Partner {
  id: number;
  naam: string;
  bedrijf?: string;
  specialisatie: string;
  email: string;
  telefoon?: string;
  website?: string;
  beschrijving?: string;
  expertise?: string;
  expertiseGebieden?: string[];
  volgorde?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PartnerRequest {
  naam: string;
  bedrijf?: string;
  specialisatie: string;
  email: string;
  telefoon?: string;
  website?: string;
  beschrijving?: string;
  expertiseGebieden?: string[];
  expertise?: string;
  volgorde?: number;
}



