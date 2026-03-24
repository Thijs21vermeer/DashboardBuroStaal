import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ArrowLeft, Calendar, Tag, ExternalLink, FileText, Image as ImageIcon, BookOpen, Eye, User, Video } from 'lucide-react';
import { apiClient } from '../../lib/api-client';
import { formatDate } from '../../lib/config';

interface KennisItemDetailProps {
  itemId: number;
  onBack: () => void;
}

export function KennisItemDetail({ itemId, onBack }: KennisItemDetailProps) {
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItem = async () => {
      if (!itemId) return;

      try {
        const data = await apiClient.kennisitems.getById(parseInt(itemId));
        setItem(data);
      } catch (error) {
        console.error('Error loading kennisitem:', error);
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [itemId]);

  // Helper function to extract YouTube video ID from various URL formats
  const extractYouTubeId = (url: string): string | null => {
    if (!url) return null;
    
    // Match various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct ID format
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Terug naar overzicht
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#280bc4] mx-auto"></div>
            <p className="text-gray-600 mt-4">Item laden...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Terug naar overzicht
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Item niet gevonden</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-[#280bc4] rounded-xl shadow-lg p-6 sm:p-8 md:p-10 text-white mb-6">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-4 text-white hover:bg-white/10 -ml-2 sm:-ml-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Terug naar overzicht
        </Button>
        
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-4 sm:mb-6">
          <div className="p-3 sm:p-4 bg-white/10 rounded-xl backdrop-blur-sm">
            <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-[#7ef769]" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
              {item.categorie && (
                <Badge variant="outline" className="border-white/30 text-white text-xs sm:text-sm">
                  {item.categorie}
                </Badge>
              )}
              <Badge className="bg-[#7ef769] text-black text-xs sm:text-sm">{item.type}</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">{item.titel}</h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90">{item.samenvatting}</p>
          </div>
        </div>
      </div>

      {/* Meta Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center gap-2 text-gray-600">
          <User className="w-5 h-5" />
          <div>
            <p className="text-xs text-gray-500">Auteur</p>
            <p className="font-medium text-gray-900">{item.auteur}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-5 h-5" />
          <div>
            <p className="text-xs text-gray-500">Datum</p>
            <p className="font-medium text-gray-900">
              {new Date(item.datumToegevoegd).toLocaleDateString('nl-NL')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Eye className="w-5 h-5" />
          <div>
            <p className="text-xs text-gray-500">Views</p>
            <p className="font-medium text-gray-900">{item.views}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Tag className="w-5 h-5" />
          <div>
            <p className="text-xs text-gray-500">Tags</p>
            <p className="font-medium text-gray-900">{item.tags?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Inhoud</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {item.inhoud}
          </div>
        </CardContent>
      </Card>

      {/* Video Player (if type is Video and link exists) */}
      {item.type === 'Video' && item.videoLink && (
        <Card className="border-2 border-[#280bc4]/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Video className="w-5 h-5 text-[#280bc4]" />
              Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-3xl mx-auto">
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                {extractYouTubeId(item.videoLink) ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${extractYouTubeId(item.videoLink)}`}
                    title={item.titel}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <p>Ongeldige YouTube URL</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Bekijk op YouTube
                </p>
                <Button 
                  onClick={() => window.open(item.videoLink, '_blank', 'noopener,noreferrer')}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in YouTube
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Display (if exists) - moved after content */}
      {item.afbeelding && (
        <Card>
          <CardContent className="pt-6">
            <div className="rounded-lg overflow-hidden max-w-2xl mx-auto">
              <img 
                src={item.afbeelding} 
                alt={item.titel}
                className="w-full h-auto object-cover"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag: string) => (
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

      {/* Project Link (if exists) */}
      {item.gekoppeldProject && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Gekoppeld Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{item.gekoppeldProject}</p>
              <Button 
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Bekijk project
              </Button>
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
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar kennisbank
        </Button>
      </div>
    </div>
  );
}














