import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Search, TrendingUp, Calendar, Tag, ArrowRight, AlertCircle } from 'lucide-react';
import { apiClient } from '../../lib/api-client';
import { truncateText, formatDateShort, getRelevantieLevel } from '../../lib/config';
import { TrendDetail } from './TrendDetail';

export function TrendsPage() {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState('alle');
  const [selectedRelevantie, setSelectedRelevantie] = useState('alle');
  const [sortBy, setSortBy] = useState<'recent' | 'relevantie' | 'titel'>('recent');
  const [selectedTrendId, setSelectedTrendId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await apiClient.trends.getAll();
        setTrends(data);
        setFilteredTrends(data);
      } catch (error) {
        console.error('Error loading trends:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-[#280bc4] rounded-xl shadow-lg p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-[#7ef769]" />
            <h1 className="text-2xl sm:text-3xl font-bold">Trends & Inzichten</h1>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={loadTrends}
            title="Ververs trends"
            className="bg-white/10 border-white/20 hover:bg-white/20 text-white self-start sm:self-auto"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-white/90 text-base sm:text-lg mb-4 sm:mb-6">
          Belangrijke ontwikkelingen in de maakindustrie
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-[#7ef769]" />
              <span className="text-xs sm:text-sm font-medium">Totaal Trends</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{trends.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
              <span className="text-xs sm:text-sm font-medium">Hoge Relevantie</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{hoogRelevantieTrends}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#7ef769]" />
              <span className="text-xs sm:text-sm font-medium">Categorieën</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{allCategories.length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            <CardTitle className="text-base sm:text-lg">Filteren</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {/* Filters Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Categorie
                </label>
                <Select value={selectedCategorie} onValueChange={setSelectedCategorie}>
                  <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
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
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Relevantie
                </label>
                <Select value={selectedRelevantie} onValueChange={setSelectedRelevantie}>
                  <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
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

              <div className="col-span-2 md:col-span-1">
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Sorteren op
                </label>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
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
                <p className="text-xs sm:text-sm text-gray-600">
                  {filteredTrends.length} trend{filteredTrends.length !== 1 ? 's' : ''} gevonden
                </p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={resetFilters}
                  className="text-[#280bc4] text-xs sm:text-sm h-8 sm:h-9"
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
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {filteredTrends.map((trend) => (
            <Card 
              key={trend.id} 
              className="hover:shadow-xl transition-all border-2 hover:border-[#280bc4] cursor-pointer group flex flex-col"
              onClick={() => setSelectedTrendId(trend.id)}
            >
              <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
                <div className="flex flex-wrap items-start gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <Badge className="bg-[#280bc4] text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                    {trend.categorie}
                  </Badge>
                  {trend.relevantie && (
                    <Badge className={getRelevantieLevel(trend.relevantie).color}>
                      <AlertCircle className={`h-3 w-3 mr-1 ${getRelevantieLevel(trend.relevantie).iconColor}`} />
                      {getRelevantieLevel(trend.relevantie).label}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-sm sm:text-base lg:text-lg group-hover:text-[#280bc4] transition-colors line-clamp-2 flex items-start gap-1.5 sm:gap-2">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[#280bc4] flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{trend.titel}</span>
                </CardTitle>
                <div className="text-xs text-muted-foreground">
                  <Calendar className="inline h-3 w-3 mr-1" />
                  {formatDateShort(trend.createdAt)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-2 sm:space-y-3 flex-1 flex flex-col p-3 sm:p-6 pt-0">
                {/* Brief Description */}
                <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border-l-2 sm:border-l-4 border-[#280bc4] flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {truncateText(trend.beschrijving, 150)}
                  </p>
                </div>

                {/* Key Impact Highlight */}
                {trend.impact && (
                  <div className="bg-gradient-to-br from-[#7ef769]/10 to-[#7ef769]/5 rounded-lg p-2 sm:p-3 border-l-2 sm:border-l-4 border-[#7ef769]">
                    <div className="flex items-start gap-1.5 sm:gap-2">
                      <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 text-[#7ef769] mt-0.5 flex-shrink-0" />
                      <p className="text-xs sm:text-sm text-gray-700 line-clamp-2 leading-relaxed">
                        {trend.impact}
                      </p>
                    </div>
                  </div>
                )}

                {/* Sources */}
                {trend.bronnen && trend.bronnen.length > 0 && (
                  <div className="flex flex-wrap gap-1 sm:gap-1.5">
                    {trend.bronnen.slice(0, 2).map((bron, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary"
                        className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5"
                      >
                        {bron}
                      </Badge>
                    ))}
                    {trend.bronnen.length > 2 && (
                      <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                        +{trend.bronnen.length - 2}
                      </Badge>
                    )}
                  </div>
                )}

                {/* CTA Button */}
                <Button 
                  className="w-full bg-[#7ef769] hover:bg-[#6de659] text-black font-semibold text-xs sm:text-sm h-8 sm:h-9 mt-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTrendId(trend.id);
                  }}
                >
                  <span className="hidden sm:inline">Lees meer</span>
                  <span className="sm:hidden">Lees</span>
                  <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}




























