import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ArrowLeft, Calendar, Tag, Newspaper, ExternalLink, Image as ImageIcon, Eye, User } from 'lucide-react';
import { apiClient } from '../../lib/api-client';
import { formatDate } from '../../lib/config';

interface NewsDetailProps {
  newsId: number;
  onBack: () => void;
}

export function NewsDetail({ newsId, onBack }: NewsDetailProps) {
  const [newsItem, setNewsItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNieuws = async () => {
      if (!newsId) return;

      try {
        const data = await apiClient.nieuws.getById(parseInt(newsId));
        setNewsItem(data);
      } catch (error) {
        console.error('Error loading nieuws:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNieuws();
  }, [newsId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Terug naar nieuws
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#280bc4] mx-auto"></div>
            <p className="text-gray-600 mt-4">Nieuws laden...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Terug naar nieuws
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Nieuws item niet gevonden</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Projecten':
        return 'bg-blue-500';
      case 'Team':
        return 'bg-green-500';
      case 'Klanten':
        return 'bg-purple-500';
      case 'Innovatie':
        return 'bg-orange-500';
      case 'Awards':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryBorderColor = (category: string) => {
    switch (category) {
      case 'Projecten':
        return 'border-blue-500';
      case 'Team':
        return 'border-green-500';
      case 'Klanten':
        return 'border-purple-500';
      case 'Innovatie':
        return 'border-orange-500';
      case 'Awards':
        return 'border-yellow-500';
      default:
        return 'border-gray-500';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-2 sm:mb-4 hover:bg-gray-100"
      >
        <ArrowLeft className="mr-2 w-4 h-4" />
        Terug naar nieuws
      </Button>

      {/* Header */}
      <div className="bg-gradient-to-r from-black to-[#280bc4] rounded-xl shadow-lg p-6 sm:p-8 text-white">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Newspaper className="w-6 h-6 sm:w-8 sm:h-8 text-[#7ef769]" />
          <Badge className={`${getCategoryColor(newsItem.categorie)} text-white text-xs sm:text-sm`}>
            {newsItem.categorie}
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">{newsItem.titel}</h1>
        <p className="text-white/90 text-base sm:text-lg">{newsItem.samenvatting}</p>
      </div>

      {/* Meta Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              <div>
                <p className="text-xs text-gray-500">Auteur</p>
                <p className="font-medium text-gray-900 text-sm sm:text-base">{newsItem.auteur}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-sm text-muted-foreground mb-6">
              <Calendar className="inline h-4 w-4 mr-2" />
              {formatDate(newsItem.publicatieDatum)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              <div>
                <p className="text-xs text-gray-500">Views</p>
                <p className="font-medium text-gray-900 text-sm sm:text-base">{newsItem.views || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className={`border-l-4 ${getCategoryBorderColor(newsItem.categorie)}`}>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Volledig Artikel</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose-lg max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
            {newsItem.inhoud}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {newsItem.tags && newsItem.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(newsItem.tags) ? newsItem.tags : []).map((tag: string) => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Back Button Bottom */}
      <div className="flex justify-center pt-2">
        <Button 
          onClick={onBack}
          variant="outline"
          size="lg"
          className="gap-2 w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar nieuws
        </Button>
      </div>
    </div>
  );
}






