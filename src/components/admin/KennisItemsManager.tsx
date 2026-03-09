



import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Edit, Trash2, Search, RefreshCw } from 'lucide-react';
import { getBaseUrl } from '../../lib/base-url';
import { mockKennisItems } from '../../data/mockData';
import type { KennisItem } from '../../types';
import { ConnectionStatusBanner, type ConnectionStatus } from '../../hooks/useConnectionStatus';

export default function KennisItemsManager() {
  const [items, setItems] = useState<KennisItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KennisItem | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');
  const [formData, setFormData] = useState({
    titel: '',
    type: 'Artikel',
    tags: '',
    gekoppeld_project: '',
    eigenaar: '',
    samenvatting: '',
    inhoud: '',
    video_link: '',
    afbeelding: '',
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const baseUrl = getBaseUrl();
      console.log('[KennisItemsManager] Fetching from:', `${baseUrl}/api/kennisitems`);
      
      const response = await fetch(`${baseUrl}/api/kennisitems`);
      console.log('[KennisItemsManager] Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[KennisItemsManager] API request failed:', response.status, errorText);
        setItems(mockKennisItems);
        setConnectionStatus('error');
        return;
      }
      
      const contentType = response.headers.get('content-type');
      console.log('[KennisItemsManager] Content-Type:', contentType);
      
      const data = await response.json() as KennisItem[];
      console.log('[KennisItemsManager] Received items:', data.length);
      
      // Set items regardless of whether database is empty
      setItems(data);
      setConnectionStatus('connected');
      
      // If database is empty, log it but don't use mock data
      if (data.length === 0) {
        console.log('[KennisItemsManager] Database is empty - ready to add items');
      }
    } catch (error) {
      console.error('[KennisItemsManager] Error loading items:', error);
      setItems(mockKennisItems);
      setConnectionStatus('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    try {
      const baseUrl = getBaseUrl();
      
      if (editingItem) {
        // Update existing item
        const response = await fetch(`${baseUrl}/api/kennisitems/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to update item:', response.status, errorText);
          alert('Fout bij opslaan: ' + errorText);
          return;
        }
        
        const updated = await response.json() as KennisItem;
        setItems(items.map(i => i.id === editingItem.id ? updated : i));
        alert('✅ Item succesvol bijgewerkt!');
      } else {
        // Create new item
        const response = await fetch(`${baseUrl}/api/kennisitems`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to create item:', response.status, errorText);
          alert('Fout bij toevoegen: ' + errorText);
          return;
        }
        
        const newItem = await response.json() as KennisItem;
        setItems([newItem, ...items]);
        alert('✅ Item succesvol toegevoegd!');
      }
      
      resetForm();
      setIsDialogOpen(false);
      
      // Update connection status to connected if successful
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Fout bij opslaan: ' + (error instanceof Error ? error.message : 'Onbekende fout'));
    }
  };

  const handleEdit = (item: KennisItem) => {
    setEditingItem(item);
    setFormData({
      titel: item.titel,
      type: item.type,
      tags: item.tags,
      gekoppeld_project: item.gekoppeld_project || '',
      eigenaar: item.eigenaar,
      samenvatting: item.samenvatting,
      inhoud: item.inhoud,
      video_link: item.video_link || '',
      afbeelding: item.afbeelding || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Weet je zeker dat je dit item wilt verwijderen?')) return;
    
    try {
      await fetch(`${getBaseUrl()}/api/kennisitems/${id}`, {
        method: 'DELETE',
      });
      setItems(items.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      titel: '',
      type: 'Artikel',
      tags: '',
      gekoppeld_project: '',
      eigenaar: '',
      samenvatting: '',
      inhoud: '',
      video_link: '',
      afbeelding: '',
    });
  };

  const filteredItems = items.filter(item =>
    item.titel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.samenvatting.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Connection Status Banner */}
      <ConnectionStatusBanner status={connectionStatus} onRetry={loadItems} />

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2 items-center flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Zoek kennisitems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={loadItems}
            title="Ververs lijst"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-[#7ef769] text-black hover:bg-[#7ef769]/90">
              <Plus className="w-4 h-4 mr-2" />
              Nieuw Kennisitem
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Kennisitem bewerken' : 'Nieuw kennisitem toevoegen'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="titel">Titel</Label>
                <Input
                  id="titel"
                  value={formData.titel}
                  onChange={(e) => setFormData({ ...formData, titel: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Artikel">Artikel</SelectItem>
                    <SelectItem value="Video">Video</SelectItem>
                    <SelectItem value="Document">Document</SelectItem>
                    <SelectItem value="Checklist">Checklist</SelectItem>
                    <SelectItem value="Template">Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === 'Video' && (
                <div>
                  <Label htmlFor="video_link">Video Link</Label>
                  <Input
                    id="video_link"
                    type="url"
                    value={formData.video_link}
                    onChange={(e) => setFormData({ ...formData, video_link: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Voeg een YouTube, Vimeo of andere video link toe
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="afbeelding">Afbeelding (optioneel)</Label>
                <Input
                  id="afbeelding"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Convert to base64
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({ ...formData, afbeelding: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload een afbeelding voor dit kennisitem (wordt alleen getoond op de detailpagina)
                </p>
                {formData.afbeelding && (
                  <div className="mt-3">
                    <img 
                      src={formData.afbeelding} 
                      alt="Preview" 
                      className="max-w-xs rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setFormData({ ...formData, afbeelding: '' })}
                    >
                      Verwijder afbeelding
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="eigenaar">Eigenaar</Label>
                <Input
                  id="eigenaar"
                  value={formData.eigenaar}
                  onChange={(e) => setFormData({ ...formData, eigenaar: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (gescheiden door komma's)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="SEO, Marketing, Strategie"
                />
              </div>

              <div>
                <Label htmlFor="gekoppeld_project">Gekoppeld Project (optioneel)</Label>
                <Input
                  id="gekoppeld_project"
                  value={formData.gekoppeld_project}
                  onChange={(e) => setFormData({ ...formData, gekoppeld_project: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="samenvatting">Samenvatting</Label>
                <Textarea
                  id="samenvatting"
                  value={formData.samenvatting}
                  onChange={(e) => setFormData({ ...formData, samenvatting: e.target.value })}
                  rows={2}
                  required
                />
              </div>

              <div>
                <Label htmlFor="inhoud">Inhoud</Label>
                <Textarea
                  id="inhoud"
                  value={formData.inhoud}
                  onChange={(e) => setFormData({ ...formData, inhoud: e.target.value })}
                  rows={6}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuleren
                </Button>
                <Button type="submit" className="bg-[#280bc4] text-white hover:bg-[#280bc4]/90">
                  {editingItem ? 'Opslaan' : 'Toevoegen'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{item.titel}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-[#280bc4]/10 text-[#280bc4] rounded">
                      {item.type}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {item.eigenaar}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{item.samenvatting}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {(typeof item.tags === 'string' ? item.tags.split(',') : []).map((tag: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

























