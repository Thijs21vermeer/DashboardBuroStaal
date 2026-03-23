import React, { useState, useEffect } from 'react';
import { Video, PlayCircle, Filter, RefreshCw, Eye, Calendar, Link2, Check, Sparkles, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import type { Video as VideoType } from '../../types';
import { apiClient } from '../../lib/api-client';
import { truncateText } from '../../lib/config';

const CATEGORIES = [
  'Alle Categorieën',
  'CMS Instructies',
  'Website Beheer',
  'SEO & Analytics',
  'E-commerce',
  'Technical Support',
  'Algemene Tips'
];

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Alle Categorieën');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const data = await apiClient.videos.getAll();
      setVideos(data);
      setFilteredVideos(data);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    let filtered = videos;
    
    // Filter by category
    if (selectedCategory !== 'Alle Categorieën') {
      filtered = filtered.filter(v => v.categorie === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(v => 
        v.titel.toLowerCase().includes(query) ||
        (v.beschrijving && v.beschrijving.toLowerCase().includes(query)) ||
        (v.tags && v.tags.toLowerCase().includes(query))
      );
    }
    
    setFilteredVideos(filtered);
  }, [selectedCategory, searchQuery, videos]);

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getThumbnail = (video: VideoType): string => {
    if (video.thumbnail_url) return video.thumbnail_url;
    const videoId = extractVideoId(video.youtube_url);
    return videoId 
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : '/placeholder-video.jpg';
  };

  const handleVideoClick = (video: VideoType) => {
    setSelectedVideo(video);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  const featuredVideos = filteredVideos.filter(v => v.featured);
  const regularVideos = filteredVideos; // Show all videos including featured ones

  return (
    <div className="flex-1 overflow-auto bg-gray-50 min-h-screen">
      {/* Spacer */}
      <div className="h-4 sm:h-6"></div>
      
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-black to-[#280bc4] rounded-2xl sm:rounded-3xl shadow-lg">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-[#7ef769]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl">
                <Video className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Video Catalogus</h1>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mb-6 sm:mb-8">
              Onze collectie instructievideo's en tutorials voor het helpen van onze klanten
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-white/20">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
                    <PlayCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{videos.length}</div>
                    <div className="text-xs sm:text-sm text-white/80">Video's</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-white/20">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{CATEGORIES.length - 1}</div>
                    <div className="text-xs sm:text-sm text-white/80">Categorieën</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-white/20 col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{videos.reduce((sum, v) => sum + v.views, 0)}</div>
                    <div className="text-xs sm:text-sm text-white/80">Totaal Views</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Zoek video's op titel, beschrijving of tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 border-gray-200 h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>
            
            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 w-full">
                <div className="p-1.5 sm:p-2 bg-purple-50 rounded-lg flex-shrink-0">
                  <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-[#280bc4]" />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[280px] border-gray-200 h-10 sm:h-11 text-sm sm:text-base">
                    <SelectValue placeholder="Selecteer categorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={loadVideos} 
                variant="outline" 
                size="sm"
                disabled={loading}
                className="border-gray-200 hover:bg-purple-50 hover:text-[#280bc4] hover:border-[#280bc4] w-full sm:w-auto text-sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Ververs
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pb-8 sm:pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-16 sm:py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-3 sm:border-4 border-[#280bc4] border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-500 text-sm sm:text-base">Video's laden...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Featured Videos */}
            {featuredVideos.length > 0 && (
              <div className="mb-8 sm:mb-12">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[#280bc4] to-[#7f56d9] rounded-lg sm:rounded-xl">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Uitgelichte Video's</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {featuredVideos.map(video => (
                    <VideoCard 
                      key={video.id} 
                      video={video} 
                      onClick={() => handleVideoClick(video)}
                      getThumbnail={getThumbnail}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Videos */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                {selectedCategory === 'Alle Categorieën' ? 'Alle Video\'s' : selectedCategory}
              </h2>
              {regularVideos.length === 0 ? (
                <div className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl border border-gray-100">
                  <div className="p-3 sm:p-4 bg-white rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center border border-gray-200">
                    <Video className="h-8 w-8 sm:h-10 sm:w-10 text-gray-300" />
                  </div>
                  <p className="text-gray-500 text-base sm:text-lg">Geen video's gevonden in deze categorie</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {regularVideos.map(video => (
                    <VideoCard 
                      key={video.id} 
                      video={video} 
                      onClick={() => handleVideoClick(video)}
                      getThumbnail={getThumbnail}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal 
          video={selectedVideo} 
          onClose={closeModal}
          extractVideoId={extractVideoId}
        />
      )}
    </div>
  );
}

interface VideoCardProps {
  video: VideoType;
  onClick: () => void;
  getThumbnail: (video: VideoType) => string;
  formatDate: (date: string) => string;
}

function VideoCard({ video, onClick, getThumbnail, formatDate }: VideoCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(video.youtube_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-2xl transition-all duration-300 overflow-hidden border-gray-100 hover:border-[#280bc4]/20 bg-white flex flex-col h-full"
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden bg-gray-50">
        <img 
          src={getThumbnail(video)} 
          alt={video.titel}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay voor lagere helderheid */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
        
        {/* Hover play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <div className="p-1.5 sm:p-2 md:p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
              <PlayCircle className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-[#280bc4]" />
            </div>
          </div>
        </div>
        
        {video.featured && (
          <Badge className="absolute top-1.5 sm:top-2 md:top-3 right-1.5 sm:right-2 md:right-3 bg-gradient-to-r from-[#7ef769] to-[#6de659] text-black font-semibold shadow-lg border-0 z-10 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
            ⭐ <span className="hidden sm:inline">Featured</span>
          </Badge>
        )}
      </div>
      
      <div className="flex-1 flex flex-col p-2.5 sm:p-4 md:p-5">
        <div className="flex-1">
          <h3 className="font-bold text-xs sm:text-sm md:text-base lg:text-lg mb-1 sm:mb-2 line-clamp-2 text-gray-900 group-hover:text-[#280bc4] transition-colors">
            {video.titel}
          </h3>
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 line-clamp-2 mb-2 sm:mb-3 md:mb-4 hidden sm:block">
            {video.beschrijving || 'Bekijk deze instructievideo voor meer informatie'}
          </p>
          
          <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
            <Badge variant="secondary" className="bg-purple-50 text-[#280bc4] border-0 font-medium text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
              {video.categorie}
            </Badge>
          </div>
          
          {video.tags && (
            <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2 sm:mb-3 md:mb-4">
              {video.tags.split(',').slice(0, 2).map((tag, idx) => (
                <span 
                  key={idx}
                  className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2 sm:pt-3 md:pt-4 border-t border-gray-100 space-y-1.5 sm:space-y-2 md:space-y-3">
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500">
            <div className="flex items-center gap-0.5 sm:gap-1">
              <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" />
              <span>{video.views}</span>
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1">
              <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" />
              <span className="hidden sm:inline">{formatDate(video.datum_toegevoegd)}</span>
              <span className="sm:hidden">{new Date(video.datum_toegevoegd).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}</span>
            </div>
          </div>
          
          {/* Copy Link Button */}
          <Button
            onClick={handleCopyLink}
            size="sm"
            className={`w-full transition-all duration-200 shadow-sm text-[10px] sm:text-xs md:text-sm h-7 sm:h-8 md:h-9 ${
              copied 
                ? 'bg-[#6de659] hover:bg-[#5dd548] text-black font-semibold border-0' 
                : 'bg-[#7ef769] hover:bg-[#6de659] text-black font-semibold border-0'
            }`}
          >
            {copied ? (
              <>
                <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 mr-0.5 sm:mr-1 md:mr-2" />
                <span className="hidden sm:inline">Gekopieerd!</span>
                <span className="sm:hidden">✓</span>
              </>
            ) : (
              <>
                <Link2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 mr-0.5 sm:mr-1 md:mr-2" />
                <span className="hidden sm:inline">Kopieer Link</span>
                <span className="sm:hidden">Link</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

interface VideoModalProps {
  video: VideoType;
  onClose: () => void;
  extractVideoId: (url: string) => string | null;
}

function VideoModal({ video, onClose, extractVideoId }: VideoModalProps) {
  const videoId = extractVideoId(video.youtube_url);
  
  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl sm:rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10 rounded-t-xl sm:rounded-t-2xl">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 pr-2">{video.titel}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100 flex-shrink-0">
            ✕
          </Button>
        </div>
        
        <div className="p-4 sm:p-6">
          {/* YouTube Player */}
          <div className="aspect-video mb-4 sm:mb-6 rounded-lg sm:rounded-xl overflow-hidden shadow-lg">
            {videoId ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title={video.titel}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500 text-sm sm:text-base">Ongeldige YouTube URL</p>
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <Badge className="bg-[#280bc4] text-white text-xs sm:text-sm">{video.categorie}</Badge>
              <div className="flex items-center gap-1 text-gray-600">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">{video.views} views</span>
              </div>
              {video.eigenaar && (
                <span className="text-xs sm:text-sm text-gray-600">Door: <span className="font-medium">{video.eigenaar}</span></span>
              )}
            </div>

            {video.beschrijving && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Beschrijving</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">{video.beschrijving}</p>
              </div>
            )}

            {video.tags && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {video.tags.split(',').map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-purple-50 text-[#280bc4] text-xs">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 sm:pt-4 border-t">
              <a 
                href={video.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#280bc4] hover:text-[#7f56d9] font-medium inline-flex items-center gap-2 transition-colors text-sm sm:text-base"
              >
                <PlayCircle className="h-4 w-4" />
                Bekijk op YouTube
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

















