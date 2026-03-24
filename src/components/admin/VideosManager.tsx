import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Plus, Edit, Trash2, Save, X, Video, ExternalLink, PlayCircle } from 'lucide-react';
import { apiClient } from '../../lib/api-client';
import { truncateText } from '../../lib/config';
import type { Video as VideoType } from '../../types';

const CATEGORIES = [
  'CMS Instructies',
  'Website Beheer',
  'SEO & Analytics',
  'E-commerce',
  'Technical Support',
  'Algemene Tips'
];

export default function VideosManager() {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    titel: '',
    beschrijving: '',
    youtube_url: '',
    categorie: '',
    tags: '',
    eigenaar: '',
    featured: false
  });

  const loadVideos = async () => {
    try {
      const data = await apiClient.videos.getAll();
      setVideos(data);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const resetForm = () => {
    setFormData({
      titel: '',
      beschrijving: '',
      youtube_url: '',
      categorie: '',
      tags: '',
      eigenaar: '',
      featured: false
    });
    setEditingId(null);
  };

  const handleEdit = (video: VideoType) => {
    setFormData({
      titel: video.titel,
      beschrijving: video.beschrijving || '',
      youtube_url: video.youtube_url,
      categorie: video.categorie,
      tags: video.tags || '',
      eigenaar: video.eigenaar || '',
      featured: video.featured
    });
    setEditingId(video.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await apiClient.videos.update(editingId, formData);
      } else {
        await apiClient.videos.create(formData);
      }
      
      await loadVideos();
      resetForm();
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Weet je zeker dat je deze video wilt verwijderen?')) {
      return;
    }

    try {
      await apiClient.videos.delete(id);
      setVideos(videos.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

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

  const getThumbnail = (url: string): string => {
    const videoId = extractVideoId(url);
    return videoId 
      ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
      : '/placeholder-video.jpg';
  };

  const filteredVideos = videos.filter(video => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      video.titel.toLowerCase().includes(query) ||
      video.beschrijving?.toLowerCase().includes(query) ||
      video.categorie.toLowerCase().includes(query) ||
      video.tags?.toLowerCase().includes(query) ||
      video.eigenaar?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Video className="h-8 w-8 text-[#280bc4]" />
          <div>
            <h2 className="text-2xl font-bold">Video's Beheren</h2>
            <p className="text-gray-600">Beheer de video catalogus</p>
          </div>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {videos.length} video's
        </Badge>
      </div>

      {/* Form */}
      <Card className={editingId ? 'border-2 border-[#280bc4] bg-blue-50/50' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {editingId ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {editingId ? 'Video Bewerken' : 'Nieuwe Video Toevoegen'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titel">Titel *</Label>
                <Input
                  id="titel"
                  value={formData.titel}
                  onChange={(e) => setFormData({ ...formData, titel: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube_url">YouTube URL *</Label>
                <Input
                  id="youtube_url"
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
                {formData.youtube_url && (
                  <img 
                    src={getThumbnail(formData.youtube_url)} 
                    alt="Preview"
                    className="w-32 h-auto rounded mt-2"
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="beschrijving">Beschrijving</Label>
              <Textarea
                id="beschrijving"
                value={formData.beschrijving}
                onChange={(e) => setFormData({ ...formData, beschrijving: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categorie">Categorie</Label>
                <Select
                  value={formData.categorie}
                  onValueChange={(value: string) => setFormData({ ...formData, categorie: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer categorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="demo">Demo</SelectItem>
                    <SelectItem value="presentatie">Presentatie</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eigenaar">Eigenaar</Label>
                <Input
                  id="eigenaar"
                  value={formData.eigenaar}
                  onChange={(e) => setFormData({ ...formData, eigenaar: e.target.value })}
                  placeholder="Naam van maker"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="tag1,tag2,tag3"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked: boolean) => setFormData({ ...formData, featured: checked })}
              />
              <Label htmlFor="featured">Featured video</Label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-[#280bc4] hover:bg-[#280bc4]/90">
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Bijwerken' : 'Toevoegen'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Annuleren
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Videos List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Bestaande Video's</h3>
        
        {/* Search Bar */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Zoek video's op titel, beschrijving, categorie, tags of eigenaar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#280bc4]"></div>
          </div>
        ) : filteredVideos.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              {searchQuery ? 'Geen video\'s gevonden voor deze zoekopdracht' : 'Nog geen video\'s toegevoegd'}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <img 
                      src={getThumbnail(video.youtube_url)} 
                      alt={video.titel}
                      className="w-32 h-24 object-cover rounded flex-shrink-0"
                    />
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-lg truncate">{video.titel}</h4>
                            {video.featured && (
                              <Badge className="bg-[#7ef769] text-black">Featured</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {truncateText(video.beschrijving || '', 100)}
                          </p>
                          <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                            <Badge variant="outline">{video.categorie}</Badge>
                            {video.eigenaar && <span>• {video.eigenaar}</span>}
                            <span>• {video.views} views</span>
                            <span>• {video.datum_toegevoegd ? new Date(video.datum_toegevoegd).toLocaleDateString('nl-NL') : 'Geen datum'}</span>
                          </div>
                          {video.tags && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {video.tags.split(',').map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {tag.trim()}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(video.youtube_url, '_blank')}
                            title="Bekijk op YouTube"
                          >
                            <PlayCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(video)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(video.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}




















