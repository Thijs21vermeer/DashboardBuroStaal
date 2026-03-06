
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Search, Briefcase, TrendingUp, Users, ArrowRight, Target, CheckCircle2, RefreshCw, Building2, Filter, Award } from 'lucide-react';
import { mockCases } from '../../data/mockData';
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

export function CasesPage() {
  const [cases, setCases] = useState(mockCases);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustrie, setSelectedIndustrie] = useState<string>('alle');
  const [selectedType, setSelectedType] = useState<string>('alle');
  const [sortBy, setSortBy] = useState<'recent' | 'bedrijf' | 'resultaat' | 'featured'>('recent');

  const loadCases = () => {
    // In de toekomst wordt dit een API call
    setCases([...mockCases]);
  };

  // Verzamel alle unieke industrieën en types
  const allIndustries = Array.from(
    new Set(cases.map(c => c.industrie))
  ).sort();

  const allTypes = Array.from(
    new Set(cases.map(c => c.type))
  ).sort();

  // Filter en sorteer cases
  const filteredCases = cases
    .filter(caseItem => {
      const matchesSearch = 
        caseItem.titel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.klant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.uitdaging.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
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

      {/* Cases Grid */}
      {filteredCases.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 text-lg">
              Geen resultaten gevonden. Probeer andere zoektermen of filters.
            </p>
            <Button 
              onClick={resetFilters}
              className="mt-4 bg-[#280bc4] hover:bg-[#280bc4]/90"
            >
              Reset filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredCases.map((caseItem) => (
            <Card 
              key={caseItem.id} 
              className="hover:shadow-xl transition-all cursor-pointer group border-2 hover:border-[#280bc4]"
            >
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {caseItem.featured && (
                        <Badge className="bg-[#7ef769] text-black">
                          <Award className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Badge variant="outline" className="font-medium">
                        {caseItem.industrie}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl group-hover:text-[#280bc4] transition-colors mb-2">
                      {caseItem.titel}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 className="w-4 h-4" />
                      <span className="font-medium">{caseItem.klant}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Challenge & Solution in two columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Challenge */}
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#280bc4]">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#280bc4]" />
                      Uitdaging
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {caseItem.uitdaging}
                    </p>
                  </div>

                  {/* Solution */}
                  <div className="bg-gradient-to-br from-[#280bc4]/5 to-[#7ef769]/5 rounded-lg p-4 border-l-4 border-[#7ef769]">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#7ef769]" />
                      Oplossing
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {caseItem.oplossing}
                    </p>
                  </div>
                </div>

                {/* Results */}
                <div className="bg-gradient-to-r from-[#280bc4] to-[#280bc4]/80 rounded-lg p-6 text-white">
                  <h4 className="font-semibold mb-4 text-lg flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#7ef769]" />
                    Resultaten
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {caseItem.resultaten.map((resultaat, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3"
                      >
                        <div className="bg-[#7ef769] rounded-full p-1 mt-0.5">
                          <TrendingUp className="w-4 h-4 text-black" />
                        </div>
                        <p className="text-sm font-medium">{resultaat}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags & CTA */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
                  <div className="flex flex-wrap gap-2">
                    {caseItem.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    className="bg-[#7ef769] text-black hover:bg-[#7ef769]/90 font-semibold"
                  >
                    Lees volledige case
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}







