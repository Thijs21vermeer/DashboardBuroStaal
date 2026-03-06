/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, User, Eye, TrendingUp, AlertCircle, Lightbulb, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { baseUrl } from '../../lib/base-url';

interface TrendDetailProps {
  trendId: number;
  onBack: () => void;
}

export function TrendDetail({ trendId, onBack }: TrendDetailProps) {
  const [trend, setTrend] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrend = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/trends/${trendId}`);
        if (response.ok) {
          const data = await response.json();
          setTrend(data);
        }
      } catch (error) {
        console.error('Fout bij laden trend:', error);
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

  const getRelevanceColor = (relevantie: string) => {
    switch (relevantie) {
      case 'hoog': return 'bg-red-500';
      case 'gemiddeld': return 'bg-orange-500';
      case 'laag': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getRelevanceBgColor = (relevantie: string) => {
    switch (relevantie) {
      case 'hoog': return 'from-red-500/10 to-red-500/5';
      case 'gemiddeld': return 'from-orange-500/10 to-orange-500/5';
      case 'laag': return 'from-yellow-500/10 to-yellow-500/5';
      default: return 'from-gray-500/10 to-gray-500/5';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4 hover:bg-gray-100"
      >
        <ArrowLeft className="mr-2 w-4 h-4" />
        Terug naar trends
      </Button>

      {/* Header */}
      <div className={`bg-gradient-to-r ${getRelevanceBgColor(trend.relevantie)} rounded-xl shadow-lg p-8 border-2 ${
        trend.relevantie === 'hoog' ? 'border-red-500' : 
        trend.relevantie === 'gemiddeld' ? 'border-orange-500' : 
        'border-yellow-500'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className={`w-8 h-8 ${
            trend.relevantie === 'hoog' ? 'text-red-600' : 
            trend.relevantie === 'gemiddeld' ? 'text-orange-600' : 
            'text-yellow-600'
          }`} />
          <Badge className="bg-[#280bc4] text-white">
            {trend.categorie}
          </Badge>
          <Badge className={`${getRelevanceColor(trend.relevantie)} text-white`}>
            {trend.relevantie.charAt(0).toUpperCase() + trend.relevantie.slice(1)} Relevantie
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{trend.titel}</h1>
        <p className="text-gray-700 text-lg">{trend.samenvatting}</p>
      </div>

      {/* Meta Information */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-5 h-5" />
              <div>
                <p className="text-xs text-gray-500">Toegevoegd door</p>
                <p className="font-medium text-gray-900">{trend.auteur}</p>
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
                  {new Date(trend.datum).toLocaleDateString('nl-NL')}
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
                <p className="font-medium text-gray-900">{trend.views}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-gray-600">
              <TrendingUp className="w-5 h-5" />
              <div>
                <p className="text-xs text-gray-500">Sector</p>
                <p className="font-medium text-gray-900">{trend.sector}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-[#280bc4]" />
            Beschrijving
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {trend.beschrijving}
          </div>
        </CardContent>
      </Card>

      {/* Impact */}
      <Card className="border-2 border-[#280bc4]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6 text-[#280bc4]" />
            Impact voor de Maakindustrie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
            {trend.impact}
          </p>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {trend.aanbevelingen && (
        <Card className="border-2 border-[#7ef769]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-[#7ef769]" />
              Aanbevelingen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
              {trend.aanbevelingen}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {trend.tags && trend.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {trend.tags.map((tag: string) => (
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
          Terug naar trends
        </Button>
      </div>
    </div>
  );
}
