




/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Search, Briefcase, TrendingUp, Users, ArrowRight, Target, CheckCircle2, RefreshCw, Building2, Filter, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { baseUrl } from '../../lib/base-url';
import { CaseDetail } from './CaseDetail';

export function CasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustrie, setSelectedIndustrie] = useState<string>('alle');
  const [selectedType, setSelectedType] = useState<string>('alle');
  const [sortBy, setSortBy] = useState<'recent' | 'bedrijf' | 'resultaat' | 'featured'>('recent');
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);

  const loadCases = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/cases`);
      if (response.ok) {
        const data = await response.json();
        setCases(data);
      }
    } catch (error) {
      console.error('Fout bij laden cases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  // Verzamel alle unieke industrieën en types
  const allIndustries = Array.from(
    new Set(cases.map(c => c.industrie).filter(Boolean))
  ).sort();

  const allTypes = Array.from(
    new Set(cases.map(c => c.type).filter(Boolean))
  ).sort();

  // Filter en sorteer cases
  const filteredCases = cases
    .filter(caseItem => {
      const matchesSearch = 
        caseItem.titel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.klant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.uitdaging.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (caseItem.tags || []).some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesIndustrie = selectedIndustrie === 'alle' || caseItem.industrie === selectedIndustrie;

      return matchesSearch && matchesIndustrie;
    })
    .sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
      }
      return new Date(b.datum).getTime() - new Date(a.datum).getTime();
    });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedIndustrie('alle');
    setSortBy('featured');
  };

  const hasActiveFilters = 
    searchQuery !== '' || 
    selectedIndustrie !== 'alle';

  // Show detail view if case is selected
  if (selectedCaseId !== null) {
    return (
      <CaseDetail 
        caseId={selectedCaseId} 
        onBack={() => setSelectedCaseId(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-[#280bc4] rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-[#7ef769]" />
            <h1 className="text-3xl font-bold">Case Studies</h1>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={loadCases}
            title="Ververs cases"
            className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-white/90 text-lg mb-6">
          Overzicht van projecten en behaalde resultaten
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-5 h-5 text-[#7ef769]" />
              <span className="text-sm font-medium">Totaal Cases</span>
            </div>
            <p className="text-3xl font-bold">{cases.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-[#7ef769]" />
              <span className="text-sm font-medium">Gem. Lead Groei</span>
            </div>
            <p className="text-3xl font-bold">280%</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-5 h-5 text-[#7ef769]" />
              <span className="text-sm font-medium">Industrieën</span>
            </div>
            <p className="text-3xl font-bold">{allIndustries.length}</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <CardTitle>Zoeken & Filteren</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Zoek op titel, klant, uitdaging of tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Industrie
                </label>
                <Select value={selectedIndustrie} onValueChange={setSelectedIndustrie}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alle">Alle industrieën</SelectItem>
                    {allIndustries.map(ind => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Sorteren op
                </label>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured eerst</SelectItem>
                    <SelectItem value="recent">Meest recent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters & Reset */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-sm text-gray-600">
                  {filteredCases.length} case{filteredCases.length !== 1 ? 's' : ''} gevonden
                </p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={resetFilters}
                  className="text-[#280bc4]"
                >
                  Reset filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {filteredCases.length} case{filteredCases.length !== 1 ? 's' : ''}
        </h2>
      </div>

      {/* Loading State */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[#280bc4]" />
            <p className="text-gray-600">Cases laden...</p>
          </CardContent>
        </Card>
      ) : filteredCases.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 text-lg">
              Geen resultaten gevonden. Probeer andere zoektermen of filters.
            </p>
            <Button 
              onClick={resetFilters}
              className="mt-4 bg-[#280bc4] hover:bg-[#280bc4]/90 text-white"
            >
              Reset filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCases.map((caseItem) => (
            <Card 
              key={caseItem.id} 
              className="hover:shadow-xl transition-all cursor-pointer group border-2 hover:border-[#280bc4] flex flex-col"
              onClick={() => setSelectedCaseId(caseItem.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start gap-2 mb-2">
                  {caseItem.featured && (
                    <Badge className="bg-[#7ef769] text-black text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {caseItem.industrie}
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-[#280bc4] transition-colors line-clamp-2">
                  {caseItem.titel}
                </CardTitle>
                <div className="flex items-center gap-2 text-gray-600 text-sm pt-1">
                  <Building2 className="w-3 h-3" />
                  <span className="font-medium">{caseItem.klant}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3 flex-1 flex flex-col">
                {/* Brief Description */}
                <p className="text-sm text-gray-600 line-clamp-3 flex-1">
                  {caseItem.uitdaging}
                </p>

                {/* Key Result Highlight */}
                {caseItem.resultaten && caseItem.resultaten.length > 0 && (
                  <div className="bg-gradient-to-r from-[#280bc4]/10 to-[#7ef769]/10 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-[#280bc4] mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {caseItem.resultaten[0]}
                      </p>
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(caseItem.tags || []).slice(0, 3).map((tag: string) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {caseItem.tags && caseItem.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{caseItem.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* CTA */}
                <Button 
                  className="w-full bg-[#280bc4] text-white hover:bg-[#280bc4]/90 font-medium text-sm mt-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCaseId(caseItem.id);
                  }}
                >
                  Bekijk details
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}















