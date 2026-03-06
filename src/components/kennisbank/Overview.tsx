/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { BookOpen, Briefcase, TrendingUp, Eye, ArrowRight, RefreshCw } from 'lucide-react';
import { baseUrl } from '../../lib/base-url';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const MOCK_STATS = {
  aantalKennisitems: 42,
  aantalCases: 15,
  aantalTrends: 8,
  totaalViews: 1284
};

const MOCK_FEATURED = [
  {
    id: '1',
    titel: 'Optimalisatie van productieprocessen',
    type: 'artikel',
    samenvatting: 'Ontdek hoe moderne automatisering kan leiden tot 30% efficiëntieverbetering.',
    tags: ['productie', 'automatisering', 'efficiency']
  }
];

const MOCK_TRENDS = [
  {
    id: '1',
    titel: 'AI in de maakindustrie',
    categorie: 'technologie',
    samenvatting: 'Kunstmatige intelligentie transformeert de manier waarop we produceren.',
    relevantie: 95
  }
];

const MOCK_NEWS = [
  {
    id: '1',
    titel: 'Nieuw project gestart',
    categorie: 'project',
    datum: new Date().toISOString().split('T')[0],
    auteur: 'Rosanne'
  }
];

interface OverviewProps {
  onNavigate: (page: string) => void;
}

export function Overview({ onNavigate }: OverviewProps) {
  const [stats, setStats] = useState(MOCK_STATS);
  const [featured, setFeatured] = useState<any[]>(MOCK_FEATURED);
  const [trends, setTrends] = useState<any[]>(MOCK_TRENDS);
  const [news, setNews] = useState<any[]>(MOCK_NEWS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Try to fetch real data, but fall back to mock data on error
      const [kennisRes, casesRes, trendsRes, newsRes] = await Promise.all([
        fetch(`${baseUrl}/api/kennisitems`).catch(() => null),
        fetch(`${baseUrl}/api/cases`).catch(() => null),
        fetch(`${baseUrl}/api/trends`).catch(() => null),
        fetch(`${baseUrl}/api/nieuws`).catch(() => null),
      ]);

      if (kennisRes?.ok) {
        const kennisData = await kennisRes.json() as any[];
        const casesData = casesRes?.ok ? await casesRes.json() as any[] : [];
        const trendsData = trendsRes?.ok ? await trendsRes.json() as any[] : [];
        
        setStats({
          aantalKennisitems: kennisData.length,
          aantalCases: casesData.length,
          aantalTrends: trendsData.length,
          totaalViews: 1284,
        });
        
        setFeatured(kennisData.slice(0, 3));
        setTrends(trendsData.slice(0, 3));
      }
      
      if (newsRes?.ok) {
        const newsData = await newsRes.json() as any[];
        setNews(newsData.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Keep mock data on error
    } finally {
      setLoading(false);
    }
  };

  const featuredKennis = featured.map((item) => ({
    ...item,
    type: item.type || 'artikel',
    categorie: item.categorie || 'onbekend',
    tags: item.tags || [],
    auteur: item.auteur || item.eigenaar || 'Onbekend',
    views: item.views || 0,
  }));

  // Nieuwste trends (top 3)
  const latestTrends = trends.slice(0, 3).map((trend) => ({
    ...trend,
    beschrijving: trend.samenvatting || trend.beschrijving || '',
    bronnen: trend.bronnen || [],
    relevantie: trend.relevantie >= 80 ? 'Hoog' : trend.relevantie >= 50 ? 'Gemiddeld' : 'Laag',
  }));

  // Recent nieuws (top 5)
  const recentNews = news.slice(0, 5).map((item) => ({
    ...item,
    belangrijk: item.belangrijk || false,
    beschrijving: item.beschrijving || item.inhoud || '',
  }));

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#280bc4] to-[#280bc4]/80 rounded-xl shadow-lg p-8 md:p-12 text-white">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Kennisbank Buro Staal
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-white/90">
            Al onze kennis, cases en trends op één plek
          </p>
          <p className="text-lg mb-8 text-white/80 leading-relaxed">
            Ons interne dashboard om kennis te delen, projecten te volgen en op de hoogte te blijven van ontwikkelingen in de maakindustrie.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => onNavigate('kennisbank')}
              className="bg-[#7ef769] text-black hover:bg-[#7ef769]/90 font-semibold border-2 border-[#7ef769]"
            >
              Verken de Kennisbank
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button 
              onClick={() => onNavigate('cases')}
              className="bg-transparent text-white hover:bg-white/10 font-semibold border-2 border-white"
            >
              Bekijk Cases
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Kennisitems</p>
                <p className="text-3xl font-bold text-gray-900">{stats.aantalKennisitems}</p>
              </div>
              <BookOpen className="w-8 h-8 text-[#280bc4]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Case Studies</p>
                <p className="text-3xl font-bold text-gray-900">{stats.aantalCases}</p>
              </div>
              <Briefcase className="w-8 h-8 text-[#280bc4]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Trends</p>
                <p className="text-3xl font-bold text-gray-900">{stats.aantalTrends}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#280bc4]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Totale Views</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totaalViews}
                </p>
              </div>
              <Eye className="w-8 h-8 text-[#280bc4]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Content */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Uitgelichte Content</h2>
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
              className="text-[#280bc4]"
            >
              Bekijk alles
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredKennis.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline">{item.type}</Badge>
                  <Badge className="bg-[#7ef769] text-black">{item.categorie}</Badge>
                </div>
                <CardTitle className="text-lg">{item.titel}</CardTitle>
                <CardDescription>{item.samenvatting}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{item.auteur}</span>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{item.views}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trends */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Belangrijke Trends</CardTitle>
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
                <div key={trend.id} className="border-l-4 border-[#7ef769] pl-4 py-2">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{trend.titel}</h4>
                    <Badge 
                      variant={trend.relevantie === 'Hoog' ? 'default' : 'secondary'}
                      className={trend.relevantie === 'Hoog' ? 'bg-[#280bc4]' : ''}
                    >
                      {trend.relevantie}
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
              <CardTitle>Intern Nieuws</CardTitle>
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
                  className={`p-4 rounded-lg ${
                    item.belangrijk 
                      ? 'bg-gradient-to-r from-[#7ef769]/10 to-[#7ef769]/5 border border-[#7ef769]/20' 
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{item.titel}</h4>
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














