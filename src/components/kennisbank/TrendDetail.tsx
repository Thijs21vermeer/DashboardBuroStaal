import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ArrowLeft, Calendar, Tag, TrendingUp, AlertCircle, Image as ImageIcon, Eye, Lightbulb, Target, User } from 'lucide-react';
import { apiClient } from '../../lib/api-client';
import { formatDate } from '../../lib/config';

interface TrendDetailProps {
  trendId: number;
  onBack: () => void;
}

// Helper function to get relevance level styling
const getRelevantieLevel = (relevantie: string) => {
  switch (relevantie?.toLowerCase()) {
    case 'hoog':
      return { label: 'Hoog', color: 'bg-red-500', iconColor: 'text-red-100' };
    case 'middel':
    case 'gemiddeld':
      return { label: 'Gemiddeld', color: 'bg-orange-500', iconColor: 'text-orange-100' };
    case 'laag':
      return { label: 'Laag', color: 'bg-blue-500', iconColor: 'text-blue-100' };
    default:
      return { label: 'Onbekend', color: 'bg-gray-500', iconColor: 'text-gray-100' };
  }
};

export function TrendDetail({ trendId, onBack }: TrendDetailProps) {
  const [trend, setTrend] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrend = async () => {
      if (!trendId) return;

      try {
        const data = await apiClient.trends.getById(parseInt(trendId));
        setTrend(data);
      } catch (error) {
        console.error('Error loading trend:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrend();
  }, [trendId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Terug naar trends
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#280bc4] mx-auto"></div>
            <p className="text-gray-600 mt-4">Trend laden...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!trend) {
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Terug naar trends
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Trend niet gevonden</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-2 sm:mb-4 hover:bg-gray-100"
      >
        <ArrowLeft className="mr-2 w-4 h-4" />
        Terug naar trends
      </Button>

      {/* Header */}
      <div className="bg-gradient-to-r from-black to-[#280bc4] rounded-xl shadow-lg p-6 sm:p-8 text-white">
        <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
          <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-[#7ef769]" />
          <Badge className="bg-white/20 text-white border-white/30 text-xs sm:text-sm">
            {trend.categorie}
          </Badge>
          <Badge className={`${getRelevantieLevel(trend.relevantie).color} text-white text-xs sm:text-sm`}>
            {getRelevantieLevel(trend.relevantie).label} Relevantie
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">{trend.titel}</h1>
        <p className="text-white/90 text-base sm:text-lg">{trend.samenvatting}</p>
      </div>

      {/* Meta Information */}
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex items-center gap-4 mb-6">
            {trend.relevantie && (
              <Badge className={getRelevantieLevel(trend.relevantie).color}>
                <AlertCircle className={`h-3 w-3 mr-1 ${getRelevantieLevel(trend.relevantie).iconColor}`} />
                {getRelevantieLevel(trend.relevantie).label}
              </Badge>
            )}
            <div className="text-sm text-muted-foreground">
              <Calendar className="inline h-4 w-4 mr-2" />
              {formatDate(trend.createdAt)}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#280bc4]" />
              <div>
                <p className="text-xs text-gray-500">Eigenaar</p>
                <p className="font-medium text-gray-900 text-sm sm:text-base">{trend.eigenaar || 'Onbekend'}</p>
              </div>
            </div>
            <div className="h-6 sm:h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#280bc4]" />
              <div>
                <p className="text-xs text-gray-500">Datum</p>
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  {new Date(trend.datum).toLocaleDateString('nl-NL')}
                </p>
              </div>
            </div>
            {trend.views && (
              <>
                <div className="h-6 sm:h-8 w-px bg-gray-200"></div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-[#280bc4]" />
                  <div>
                    <p className="text-xs text-gray-500">Views</p>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">{trend.views}</p>
                  </div>
                </div>
              </>
            )}
            {trend.sector && (
              <>
                <div className="h-6 sm:h-8 w-px bg-gray-200"></div>
                <div className="flex items-center gap-2 text-gray-600">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#280bc4]" />
                  <div>
                    <p className="text-xs text-gray-500">Sector</p>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">{trend.sector}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#280bc4]" />
            Beschrijving
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose-lg max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
            {trend.beschrijving}
          </div>
        </CardContent>
      </Card>

      {/* Impact */}
      <Card className="border-2 border-[#280bc4]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-[#280bc4]" />
            Impact voor de Maakindustrie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base lg:text-lg">
            {trend.impact}
          </p>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {trend.aanbevelingen && (
        <Card className="border-2 border-[#7ef769]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-[#7ef769]" />
              Aanbevelingen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base lg:text-lg">
              {trend.aanbevelingen}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {trend.tags && trend.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {trend.tags.map((tag: string) => (
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
          Terug naar trends
        </Button>
      </div>
    </div>
  );
}












