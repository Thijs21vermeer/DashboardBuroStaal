

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, User, Eye, Tag, BookOpen, ExternalLink, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { baseUrl } from '../../lib/base-url';

interface KennisItemDetailProps {
  itemId: number;
  onBack: () => void;
}

// Helper functie om YouTube video ID te extraheren
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function KennisItemDetail({ itemId, onBack }: KennisItemDetailProps) {
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItem = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/kennisitems/${itemId}`);
        if (response.ok) {
          const data = await response.json();
          setItem(data);
        }
      } catch (error) {
        console.error('Fout bij laden kennisitem:', error);
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [itemId]);

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

  // Extract YouTube video ID if it's a video item
  const youtubeId = item.type === 'Video' && item.videoLink ? extractYouTubeId(item.videoLink) : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4 hover:bg-gray-100"
      >
        <ArrowLeft className="mr-2 w-4 h-4" />
        Terug naar overzicht
      </Button>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#280bc4] to-[#280bc4]/80 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-[#7ef769]" />
          <Badge className="bg-white/20 text-white border-white/30">
            {item.type}
          </Badge>
          <Badge className="bg-[#7ef769] text-black">
            {item.categorie}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold mb-3">{item.titel}</h1>
        <p className="text-white/90 text-lg">{item.samenvatting}</p>
      </div>

      {/* Meta Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        </CardContent>
      </Card>

      {/* Video Player (if type is Video and link exists) */}
      {item.type === 'Video' && item.videoLink && youtubeId && (
        <Card className="border-2 border-[#280bc4]/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Video className="w-5 h-5 text-[#280bc4]" />
              Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={item.titel}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
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
          </CardContent>
        </Card>
      )}

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
      <div className="flex justify-center pt-8 pb-4">
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




