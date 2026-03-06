





// Centrale type definities voor de hele applicatie

export interface KennisItem {
  id: string;
  titel: string;
  type: string;
  tags: string[];
  gekoppeldProject?: string;
  eigenaar: string;
  samenvatting: string;
  inhoud: string;
  datumToegevoegd: string;
  laatstBijgewerkt: string;
  views: number;
  categorie?: string;
  auteur?: string;
  datumGepubliceerd?: string;
  featured?: boolean;
}

export interface CaseStudy {
  id: string;
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
  featured?: boolean;
  type?: string;
}

export interface Trend {
  id: string;
  titel: string;
  categorie: string;
  beschrijving: string;
  relevantie: 'Hoog' | 'Middel' | 'Laag';
  bronnen: string[];
  bron?: string;
  datum: string;
  datumToegevoegd?: string;
  tags: string[];
  impact: string;
}

export interface NewsItem {
  id: string;
  titel: string;
  categorie: 'Bedrijfsnieuws' | 'Team Update' | 'Project Lancering' | 'Prestatie' | 'Algemeen';
  inhoud: string;
  auteur: string;
  datum: string;
  tags: string[];
  belangrijk?: boolean;
}

export interface TeamMember {
  id: string;
  naam: string;
  rol: string;
  specialisaties: string[];
  specialisatie?: string;
  bio: string;
  email: string;
  avatar?: string;
  linkedIn?: string;
  isExternal?: boolean;
  company?: string;
  bedrijf?: string;
  telefoon?: string;
  website?: string;
  beschrijving?: string;
  expertiseGebieden?: string[];
}

export interface Priority {
  id: string;
  titel: string;
  categorie: 'Marketing' | 'Development' | 'Sales' | 'Operations';
  eigenaar: string;
  deadline: string;
  status: 'Open' | 'In Progress' | 'Completed' | 'Blocked';
  project?: string;
  notities: string;
  priority: 'Hoog' | 'Middel' | 'Laag';
}

export interface Project {
  id: string;
  naam: string;
  klant: string;
  fase: 'Discovery' | 'Design' | 'Development' | 'Testing' | 'Launch' | 'Maintenance';
  status: 'On Track' | 'At Risk' | 'Delayed' | 'Completed';
  voortgang: number;
  eigenaar: string;
  startDatum: string;
  deadline: string;
  budget?: number;
  team: string[];
}

export interface AgendaItem {
  id: string;
  titel: string;
  type: 'Vergadering' | 'Deadline' | 'Event' | 'Milestone';
  startdatum: string;
  einddatum?: string;
  project?: string;
  eigenaar: string;
  fase?: string;
  locatie?: string;
  notities?: string;
}

// Dashboard page types
export type PageType = 'overzicht' | 'kennisbank' | 'cases' | 'trends' | 'team' | 'nieuws';










