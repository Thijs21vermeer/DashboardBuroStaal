
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, User, Eye, Newspaper, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { baseUrl } from '../../lib/base-url';

interface NewsDetailProps {
  newsId: number;
  onBack: () => void;
}

export function NewsDetail({ newsId, onBack }: NewsDetailProps) {
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/nieuws/${newsId}`);
        if (response.ok) {
          const data = await response.json();
          setNews(data);
        }
      } catch (error) {
        console.error('Fout bij laden nieuws:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
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

  if (!news) {
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4 hover:bg-gray-100"
      >
        <ArrowLeft className="mr-2 w-4 h-4" />
        Terug naar nieuws
      </Button>

      {/* Header */}
      <div className={`bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl shadow-lg p-8 border-l-8 ${getCategoryBorderColor(news.categorie)}`}>
        <div className="flex items-center gap-3 mb-4">
          <Newspaper className="w-8 h-8 text-[#7ef769]" />
          <Badge className={`${getCategoryColor(news.categorie)} text-white`}>
            {news.categorie}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">{news.titel}</h1>
        <p className="text-white/90 text-lg">{news.samenvatting}</p>
      </div>

      {/* Meta Information */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-5 h-5" />
              <div>
                <p className="text-xs text-gray-500">Auteur</p>
                <p className="font-medium text-gray-900">{news.auteur}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <div>
                <p className="text-xs text-gray-500">Datum</p>
                <p className="font-medium text-gray-900">
                  {new Date(news.datum).toLocaleDateString('nl-NL', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Eye className="w-5 h-5" />
              <div>
                <p className="text-xs text-gray-500">Views</p>
                <p className="font-medium text-gray-900">{news.views || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className={`border-l-4 ${getCategoryBorderColor(news.categorie)}`}>
        <CardHeader>
          <CardTitle>Volledig Artikel</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {news.inhoud}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {news.tags && news.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(news.tags) ? news.tags : []).map((tag: string) => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className="text-sm px-3 py-1"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Back Button Bottom */}
      <div className="flex justify-center pt-8 pb-4">
        <Button 
          onClick={onBack}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar nieuws
        </Button>
      </div>
    </div>
  );
}

