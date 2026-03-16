




/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { BookOpen, Briefcase, TrendingUp, Wrench, Eye, ArrowRight, RefreshCw, AlertCircle, CheckCircle, Search, X } from 'lucide-react';
import { getBaseUrl } from '../../lib/base-url';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface OverviewProps {
  onNavigate: (page: string) => void;
}

// Helper functions for relevantie styling (same as TrendsPage)
const getRelevantieIcon = (relevantie: string) => {
  switch (relevantie) {
    case 'Hoog':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    case 'Gemiddeld':
      return <TrendingUp className="w-4 h-4 text-yellow-500" />;
    case 'Laag':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
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

export function Overview({ onNavigate }: OverviewProps) {
  const [stats, setStats] = useState({
    aantalKennisitems: 0,
    aantalCases: 0,
    aantalTrends: 0,
    aantalTools: 0
  });
  const [featured, setFeatured] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allContent, setAllContent] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  // Search effect
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const performSearch = (query: string) => {
    setIsSearching(true);
    const lowerQuery = query.toLowerCase();
    
    const results = allContent.filter((item) => {
      const searchText = [
        item.titel || item.title || '',
        item.samenvatting || item.beschrijving || item.inhoud || '',
        item.auteur || item.eigenaar || '',
        ...(item.tags || []),
        item.categorie || '',
        item.type || item.contentType || ''
      ].join(' ').toLowerCase();
      
      return searchText.includes(lowerQuery);
    });
    
    setSearchResults(results);
    setIsSearching(false);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const baseUrl = getBaseUrl();
      
      // Fetch all data in parallel
      const [kennisRes, casesRes, trendsRes, newsRes, toolsRes] = await Promise.all([
        fetch(`${baseUrl}/api/kennisitems`),
        fetch(`${baseUrl}/api/cases`),
        fetch(`${baseUrl}/api/trends`),
        fetch(`${baseUrl}/api/nieuws`),
        fetch(`${baseUrl}/api/tools`),
      ]);

      // Process kennisitems
      if (kennisRes.ok) {
        const kennisData = await kennisRes.json() as any[];
        setFeatured(kennisData.slice(0, 3));
        
        // Get cases data
        const casesData = casesRes.ok ? await casesRes.json() as any[] : [];
        
        // Get trends data
        const trendsData = trendsRes.ok ? await trendsRes.json() as any[] : [];
        setTrends(trendsData.slice(0, 3));
        
        // Get tools data
        const toolsData = toolsRes.ok ? await toolsRes.json() as any[] : [];
        
        // Combine all content for search
        const combined = [
          ...kennisData.map(item => ({ ...item, contentType: 'kennisitem' })),
          ...casesData.map(item => ({ ...item, contentType: 'case' })),
          ...trendsData.map(item => ({ ...item, contentType: 'trend' })),
          ...toolsData.map(item => ({ ...item, contentType: 'tool' }))
        ];
        setAllContent(combined);
        
        // Update stats
        setStats({
          aantalKennisitems: kennisData.length,
          aantalCases: casesData.length,
          aantalTrends: trendsData.length,
          aantalTools: toolsData.length,
        });
      }
      
      // Process news
      if (newsRes.ok) {
        const newsData = await newsRes.json() as any[];
        setNews(newsData.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getContentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'kennisitem': 'Kennisitem',
      'case': 'Case Study',
      'trend': 'Trend',
      'tool': 'Tool'
    };
    return labels[type] || type;
  };

  const getContentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'kennisitem': 'bg-blue-100 text-blue-800',
      'case': 'bg-purple-100 text-purple-800',
      'trend': 'bg-green-100 text-green-800',
      'tool': 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const handleResultClick = (item: any) => {
    const type = item.contentType;
    if (type === 'kennisitem') {
      onNavigate(`kennisitem-${item.id}`);
    } else if (type === 'case') {
      onNavigate('cases');
    } else if (type === 'trend') {
      onNavigate(`trend-${item.id}`);
    } else if (type === 'tool') {
      onNavigate('tools');
    }
    setSearchQuery('');
  };

  const featuredKennis = featured.map((item) => ({
    ...item,
    type: item.type || 'artikel',
    categorie: item.categorie || undefined,
    tags: item.tags || [],
    auteur: item.auteur || item.eigenaar || 'Onbekend',
    views: item.views || 0,
  }));

  // Nieuwste trends (top 3)
  const latestTrends = trends.slice(0, 3).map((trend) => {
    // Handle both string and numeric relevantie values (same logic as TrendsPage)
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
      beschrijving: trend.samenvatting || trend.beschrijving || '',
      bronnen: trend.bronnen || [],
      relevantie: relevantieLabel,
    };
  });

  // Recent nieuws (top 5)
  const recentNews = news.slice(0, 3).map((item) => ({
    ...item,
    belangrijk: item.belangrijk || false,
    beschrijving: item.beschrijving || item.inhoud || '',
  }));

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-black to-[#280bc4] rounded-xl shadow-lg p-6 sm:p-8 md:p-12 text-white">
        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Dashboard Buro Staal
          </h1>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 text-white/80 leading-relaxed">
            Ons interne dashboard om kennis te delen, projecten te volgen en op de hoogte te blijven van ontwikkelingen in de maakindustrie.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Button 
              onClick={() => onNavigate('kennisbank')}
              className="bg-[#7ef769] !text-black hover:bg-[#7ef769]/90 font-semibold border-2 border-[#7ef769] transition-colors w-full sm:w-auto"
            >
              <span className="text-black">Verken de Kennisbank</span>
              <ArrowRight className="ml-2 w-4 h-4 text-black" />
            </Button>
            <Button 
              onClick={() => onNavigate('cases')}
              className="bg-transparent text-white hover:bg-white/10 font-semibold border-2 border-white w-full sm:w-auto"
            >
              Bekijk Cases
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Card className="border-2 border-[#280bc4]/20 shadow-lg">
          <CardContent className="px-6 pt-2 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Snel zoeken...
            </h3>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Zoek in kennisbank, cases, trends en tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#280bc4] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Search Results Dropdown */}
            {searchQuery && (
              <div className="mt-4 border-t pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-600">
                    {searchResults.length} {searchResults.length === 1 ? 'resultaat' : 'resultaten'} gevonden
                  </p>
                  {isSearching && (
                    <RefreshCw className="w-4 h-4 animate-spin text-[#280bc4]" />
                  )}
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <p className="text-sm text-gray-500 py-4 text-center">
                      Geen resultaten gevonden voor "{searchQuery}"
                    </p>
                  ) : (
                    searchResults.slice(0, 10).map((item) => (
                      <div
                        key={`${item.contentType}-${item.id}`}
                        onClick={() => handleResultClick(item)}
                        className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors border border-gray-200"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900 flex-1">
                            {item.titel || item.title || 'Geen titel'}
                          </h4>
                          <Badge className={getContentTypeColor(item.contentType)}>
                            {getContentTypeLabel(item.contentType)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {item.samenvatting || item.beschrijving || item.inhoud || 'Geen beschrijving'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{item.auteur || item.eigenaar || 'Onbekend'}</span>
                          {item.categorie && (
                            <>
                              <span>•</span>
                              <span>{item.categorie}</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
          onClick={() => onNavigate('kennisbank')}
        >
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Kennisitems</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.aantalKennisitems}</p>
              </div>
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-[#280bc4]" />
            </div>
          </CardContent>
        </Card>
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
          onClick={() => onNavigate('cases')}
        >
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Case Studies</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.aantalCases}</p>
              </div>
              <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-[#280bc4]" />
            </div>
          </CardContent>
        </Card>
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
          onClick={() => onNavigate('trends')}
        >
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Trends</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.aantalTrends}</p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-[#280bc4]" />
            </div>
          </CardContent>
        </Card>
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
          onClick={() => onNavigate('tools')}
        >
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Tools</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {stats.aantalTools}
                </p>
              </div>
              <Wrench className="w-6 h-6 sm:w-8 sm:h-8 text-[#280bc4]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Content */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Laatste kennisitems</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={loadData}
              title="Ververs kennisitems"
              className="text-[#280bc4]"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('kennisbank')}
              className="text-[#280bc4] text-sm sm:text-base"
            >
              Bekijk alles
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {featuredKennis.map((item) => (
            <Card 
              key={item.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
              onClick={() => onNavigate(`kennisitem-${item.id}`)}
            >
              <CardHeader className="flex-shrink-0">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline">{item.type}</Badge>
                  {item.categorie && (
                    <Badge className="bg-[#7ef769] text-black">{item.categorie}</Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{item.titel}</CardTitle>
                <CardDescription>{item.samenvatting}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{item.auteur}</span>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{item.views}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Trends */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Belangrijke Trends</CardTitle>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={loadData}
                  title="Ververs trends"
                  className="text-[#280bc4] h-8 w-8"
                >
                  <RefreshCw className="w-3 h-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onNavigate('trends')}
                  className="text-[#280bc4]"
                >
                  Meer
                  <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {latestTrends.map((trend) => (
                <div 
                  key={trend.id} 
                  className="border-l-4 border-[#7ef769] pl-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer rounded-r"
                  onClick={() => onNavigate(`trend-${trend.id}`)}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{trend.titel}</h3>
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
                  <p className="text-sm text-gray-600">{trend.beschrijving}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Bronnen: {trend.bronnen.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Intern Nieuws */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Intern Nieuws</CardTitle>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={loadData}
                  title="Ververs nieuws"
                  className="text-[#280bc4] h-8 w-8"
                >
                  <RefreshCw className="w-3 h-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onNavigate('nieuws')}
                  className="text-[#280bc4]"
                >
                  Meer
                  <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNews.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-4 rounded-lg cursor-pointer hover:opacity-90 transition-opacity ${
                    item.belangrijk 
                      ? 'bg-gradient-to-r from-[#7ef769]/10 to-[#7ef769]/5 border border-[#7ef769]/20' 
                      : 'bg-gray-50'
                  }`}
                  onClick={() => onNavigate(`nieuws-${item.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{item.titel}</h3>
                    {item.belangrijk && (
                      <Badge className="bg-[#7ef769] text-black">Belangrijk</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.beschrijving}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.auteur}</span>
                    <span>{new Date(item.datum).toLocaleDateString('nl-NL')}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}









































































