





/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { TrendingUp, Search, Calendar, AlertCircle, ArrowRight, BarChart3, Target, RefreshCw, Lightbulb, Filter, CheckCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { baseUrl } from '../../lib/base-url';
import { TrendDetail } from './TrendDetail';

export function TrendsPage() {
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState<string>('alle');
  const [selectedRelevantie, setSelectedRelevantie] = useState<string>('alle');
  const [sortBy, setSortBy] = useState<'recent' | 'relevantie' | 'titel'>('recent');
  const [selectedTrendId, setSelectedTrendId] = useState<number | null>(null);

  const loadTrends = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/trends`);
      if (response.ok) {
        const data = await response.json();
        
        // Convert relevantie values to consistent labels
        const processedTrends = data.map((trend: any) => {
          let relevantieLabel = 'Laag';
          if (typeof trend.relevantie === 'string') {
            const rel = trend.relevantie.toLowerCase();
            if (rel.includes('zeer') || rel === 'hoog') {
              relevantieLabel = 'Hoog';
            } else if (rel === 'relevant' || rel === 'gemiddeld' || rel === 'middel') {
              relevantieLabel = 'Gemiddeld';
            }
          } else if (typeof trend.relevantie === 'number') {
            relevantieLabel = trend.relevantie >= 80 ? 'Hoog' : trend.relevantie >= 50 ? 'Gemiddeld' : 'Laag';
          }
          
          return {
            ...trend,
            relevantie: relevantieLabel
          };
        });
        
        setTrends(processedTrends);
      }
    } catch (error) {
      console.error('Fout bij laden trends:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrends();
  }, []);

  // Verzamel alle unieke categorieën
  const allCategories = Array.from(
    new Set(trends.map(t => t.categorie).filter(Boolean))
  ).sort();

  // Filter en sorteer trends
  const filteredTrends = trends
    .filter(trend => {
      const matchesCategorie = selectedCategorie === 'alle' || trend.categorie === selectedCategorie;
      const matchesRelevantie = selectedRelevantie === 'alle' || trend.relevantie === selectedRelevantie;
      return matchesCategorie && matchesRelevantie;
    })
    .sort((a, b) => {
      if (sortBy === 'relevantie') {
        const relevantieOrder = { 'Hoog': 0, 'Gemiddeld': 1, 'Laag': 2 };
        return relevantieOrder[a.relevantie] - relevantieOrder[b.relevantie];
      } else if (sortBy === 'titel') {
        return a.titel.localeCompare(b.titel);
      } else {
        return new Date(b.datumToegevoegd || b.datum).getTime() - new Date(a.datumToegevoegd || a.datum).getTime();
      }
    });

  const resetFilters = () => {
    setSelectedCategorie('alle');
    setSelectedRelevantie('alle');
    setSortBy('relevantie');
  };

  const hasActiveFilters = 
    selectedCategorie !== 'alle' || 
    selectedRelevantie !== 'alle';

  const getRelevantieIcon = (relevantie: string) => {
    switch (relevantie) {
      case 'Hoog':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'Gemiddeld':
        return <TrendingUp className="w-5 h-5 text-yellow-500" />;
      case 'Laag':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getRelevantieColor = (relevantie: string) => {
    switch (relevantie) {
      case 'Hoog':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Gemiddeld':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Laag':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const hoogRelevantieTrends = trends.filter(t => t.relevantie === 'Hoog').length;

  // Show detail view if trend is selected
  if (selectedTrendId !== null) {
    return (
      <TrendDetail 
        trendId={selectedTrendId} 
        onBack={() => setSelectedTrendId(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#280bc4] to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-[#7ef769]" />
            <h1 className="text-3xl font-bold">Trends & Insights</h1>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={loadTrends}
            title="Ververs trends"
            className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-white/90 text-lg mb-6">
          Actuele ontwikkelingen en trends die wij in de gaten houden
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="w-5 h-5 text-[#7ef769]" />
              <span className="text-sm font-medium">Totaal Trends</span>
            </div>
            <p className="text-3xl font-bold">{trends.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-sm font-medium">Hoge Relevantie</span>
            </div>
            <p className="text-3xl font-bold">{hoogRelevantieTrends}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-[#7ef769]" />
              <span className="text-sm font-medium">Categorieën</span>
            </div>
            <p className="text-3xl font-bold">{allCategories.length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <CardTitle>Filteren</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Categorie
                </label>
                <Select value={selectedCategorie} onValueChange={setSelectedCategorie}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alle">Alle categorieën</SelectItem>
                    {allCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Relevantie
                </label>
                <Select value={selectedRelevantie} onValueChange={setSelectedRelevantie}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alle">Alle niveaus</SelectItem>
                    <SelectItem value="Hoog">Hoog</SelectItem>
                    <SelectItem value="Gemiddeld">Gemiddeld</SelectItem>
                    <SelectItem value="Laag">Laag</SelectItem>
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
                    <SelectItem value="relevantie">Relevantie</SelectItem>
                    <SelectItem value="recent">Meest recent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters & Reset */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-sm text-gray-600">
                  {filteredTrends.length} trend{filteredTrends.length !== 1 ? 's' : ''} gevonden
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
          {filteredTrends.length} trend{filteredTrends.length !== 1 ? 's' : ''}
        </h2>
      </div>

      {/* Loading State */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[#280bc4]" />
            <p className="text-gray-600">Trends laden...</p>
          </CardContent>
        </Card>
      ) : filteredTrends.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 text-lg">
              Geen resultaten gevonden. Probeer andere filters.
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
          {filteredTrends.map((trend) => (
            <Card 
              key={trend.id} 
              className="hover:shadow-xl transition-all border-2 hover:border-[#280bc4] cursor-pointer group flex flex-col"
              onClick={() => setSelectedTrendId(trend.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start gap-2 mb-2">
                  <Badge className="bg-[#280bc4] text-white text-xs">
                    {trend.categorie}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs font-medium border ${getRelevantieColor(trend.relevantie)}`}
                  >
                    <span className="flex items-center gap-1">
                      {getRelevantieIcon(trend.relevantie)}
                      {trend.relevantie}
                    </span>
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-[#280bc4] transition-colors line-clamp-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#280bc4] flex-shrink-0" />
                  <span className="line-clamp-2">{trend.titel}</span>
                </CardTitle>
                <div className="flex items-center gap-2 text-xs text-gray-600 pt-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(trend.datumToegevoegd || trend.datum).toLocaleDateString('nl-NL', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3 flex-1 flex flex-col">
                {/* Brief Description */}
                <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-[#280bc4] flex-1">
                  <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                    {trend.beschrijving}
                  </p>
                </div>

                {/* Key Impact Highlight */}
                {trend.impact && (
                  <div className="bg-gradient-to-br from-[#7ef769]/10 to-[#7ef769]/5 rounded-lg p-3 border-l-4 border-[#7ef769]">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-[#7ef769] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                        {trend.impact}
                      </p>
                    </div>
                  </div>
                )}

                {/* Sources */}
                {trend.bronnen && trend.bronnen.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {trend.bronnen.slice(0, 2).map((bron, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary"
                        className="text-xs"
                      >
                        {bron}
                      </Badge>
                    ))}
                    {trend.bronnen.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{trend.bronnen.length - 2}
                      </Badge>
                    )}
                  </div>
                )}

                {/* CTA Button */}
                <Button 
                  className="w-full bg-[#280bc4] hover:bg-[#280bc4]/90 text-white font-medium text-sm mt-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTrendId(trend.id);
                  }}
                >
                  Lees meer
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















