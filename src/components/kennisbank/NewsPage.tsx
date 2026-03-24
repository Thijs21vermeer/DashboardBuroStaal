import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, Newspaper, Calendar, Tag, ArrowRight, Award, Briefcase, User, Users, TrendingUp, Rocket, PartyPopper, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { NewsDetail } from './NewsDetail';
import { apiClient } from '../../lib/api-client';
import { truncateText } from '../../lib/config';
import { formatDate } from '../../lib/config';

export function NewsPage() {
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategorie, setSelectedCategorie] = useState<string>('alle');
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);

  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await apiClient.nieuws.getAll();
      setNewsItems(data);
    } catch (error) {
      console.error('Error loading nieuws:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  // Filter nieuws op categorie
  const filteredNews = selectedCategorie === 'alle' 
    ? newsItems 
    : newsItems.filter(item => item.categorie.toLowerCase() === selectedCategorie.toLowerCase());

  // Bereken statistieken
  const totalItems = filteredNews.length;

  // Groepeer nieuws per categorie
  const categorieën = Array.from(new Set(newsItems.map(item => item.categorie)));
  
  // Tel items per categorie
  const categoryCounts = categorieën.reduce((acc, cat) => {
    acc[cat] = newsItems.filter(item => item.categorie === cat).length;
    return acc;
  }, {} as Record<string, number>);

  // Sorteer op datum (nieuwste eerst)
  const sortedNews = [...filteredNews].sort((a, b) => 
    new Date(b.datum).getTime() - new Date(a.datum).getTime()
  );

  // Recent nieuws (laatste 7 dagen)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const recentCount = newsItems.filter(item => 
    new Date(item.datum) > weekAgo
  ).length;

  // Icon per categorie
  const getCategoryIcon = (categorie: string) => {
    switch (categorie.toLowerCase()) {
      case 'succes':
        return <Award className="w-5 h-5" />;
      case 'team':
        return <Users className="w-5 h-5" />;
      case 'project':
        return <Briefcase className="w-5 h-5" />;
      case 'event':
        return <PartyPopper className="w-5 h-5" />;
      case 'milestone':
        return <Rocket className="w-5 h-5" />;
      default:
        return <Newspaper className="w-5 h-5" />;
    }
  };

  // Kleur per categorie
  const getCategoryColor = (categorie: string) => {
    switch (categorie.toLowerCase()) {
      case 'succes':
        return 'bg-[#7ef769] text-black';
      case 'team':
        return 'bg-[#280bc4] text-white';
      case 'project':
        return 'bg-blue-500 text-white';
      case 'event':
        return 'bg-purple-500 text-white';
      case 'milestone':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Show detail view if news is selected
  if (selectedNewsId !== null) {
    return (
      <NewsDetail 
        newsId={selectedNewsId} 
        onBack={() => setSelectedNewsId(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-[#280bc4] rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-[#7ef769]" />
            <h1 className="text-3xl font-bold">Intern Nieuws</h1>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={loadNews}
            title="Ververs nieuws"
            className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-white/90 text-lg mb-6">
          Updates, successen en belangrijke gebeurtenissen binnen Buro Staal
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Newspaper className="w-5 h-5 text-[#7ef769]" />
              <span className="text-sm font-medium">Totaal Items</span>
            </div>
            <p className="text-3xl font-bold">{totalItems}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-[#7ef769]" />
              <span className="text-sm font-medium">Deze Week</span>
            </div>
            <p className="text-3xl font-bold">{recentCount}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-5 h-5 text-[#7ef769]" />
              <span className="text-sm font-medium">Categorieën</span>
            </div>
            <p className="text-3xl font-bold">{categorieën.length}</p>
          </div>
        </div>
      </div>

      {/* Categorie Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter op Categorie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge 
              onClick={() => setSelectedCategorie('alle')}
              className={`${selectedCategorie === 'alle' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'} hover:bg-gray-300 cursor-pointer text-sm px-4 py-2`}
            >
              Alle ({newsItems.length})
            </Badge>
            {categorieën.map((cat) => (
              <Badge 
                key={cat}
                onClick={() => setSelectedCategorie(cat)}
                className={`${selectedCategorie === cat ? 'ring-2 ring-black ring-offset-2' : ''} ${getCategoryColor(cat)} hover:opacity-90 cursor-pointer text-sm px-4 py-2`}
              >
                <span className="mr-1.5">{getCategoryIcon(cat)}</span>
                {cat} ({categoryCounts[cat]})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Nieuws Timeline */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-[#280bc4]" />
          Nieuwste Updates
        </h2>
        
        {/* Loading State */}
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[#280bc4]" />
              <p className="text-gray-600">Nieuws laden...</p>
            </CardContent>
          </Card>
        ) : sortedNews.length > 0 ? (
        <div className="space-y-4">
          {sortedNews.map((item) => (
            <Card 
              key={item.id}
              className="hover:shadow-lg transition-all border-l-4 hover:border-l-[#280bc4] cursor-pointer group"
              onClick={() => setSelectedNewsId(item.id)}
              style={{ 
                borderLeftColor: item.categorie.toLowerCase() === 'succes' ? '#7ef769' : 
                                item.categorie.toLowerCase() === 'team' ? '#280bc4' : 
                                item.categorie.toLowerCase() === 'project' ? '#3b82f6' :
                                item.categorie.toLowerCase() === 'event' ? '#a855f7' :
                                item.categorie.toLowerCase() === 'milestone' ? '#f97316' : '#6b7280'
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getCategoryColor(item.categorie)} text-xs`}>
                        {getCategoryIcon(item.categorie)}
                        <span className="ml-1">{item.categorie}</span>
                      </Badge>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(item.datum), 'd MMMM yyyy', { locale: nl })}
                      </span>
                    </div>
                    <CardTitle className="text-xl mb-1">{item.titel}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Inhoud */}
                <div className="bg-gray-50 rounded-lg p-4 border-l-2 border-[#280bc4]/30">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {truncateText(item.inhoud, 150)}
                  </p>
                </div>

                {/* Auteur */}
                {item.auteur && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Geplaatst door <strong>{item.auteur}</strong></span>
                  </div>
                )}

                {/* Tags (indien aanwezig) */}
                {item.tags && Array.isArray(item.tags) && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t">
                    {item.tags.map((tag: string) => (
                      <Badge 
                        key={tag}
                        variant="outline"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        ) : null}
      </div>

      {/* Empty State (indien geen nieuws) */}
      {!loading && totalItems === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nog geen nieuws items
            </h3>
            <p className="text-gray-500">
              Er zijn nog geen nieuwsberichten geplaatst
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}














