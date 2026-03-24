import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Plus, Edit, Trash2, Search, RefreshCw } from 'lucide-react';
import { apiClient } from '../../lib/api-client';
import { KENNISITEM_TYPES, KENNISBANK_CATEGORIES } from '../../lib/config';
import { getBaseUrl } from '../../lib/base-url';
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
    categorie: '',
    tags: '',
    gekoppeldProject: '',
    eigenaar: '',
    samenvatting: '',
    inhoud: '',
    videoLink: '',
    afbeelding: '',
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      console.log('[KennisItemsManager] Fetching kennisitems...');
      
      const data = await apiClient.kennisitems.getAll();
      console.log('[KennisItemsManager] Received items:', data.length);
      
      setItems(data);
      setConnectionStatus('connected');
      
      if (data.length === 0) {
        console.log('[KennisItemsManager] Database is empty - ready to add items');
      }
    } catch (error) {
      console.error('[KennisItemsManager] Error loading items:', error);
      setItems([]);
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
      if (editingItem) {
        // Update existing item
        const updated = await apiClient.kennisitems.update(editingItem.id, itemData);
        setItems(items.map(i => i.id === editingItem.id ? updated : i));
        alert('✅ Item succesvol bijgewerkt!');
      } else {
        // Create new item
        const newItem = await apiClient.kennisitems.create(itemData);
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
      categorie: item.categorie || '',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
      gekoppeldProject: item.gekoppeldProject || '',
      eigenaar: item.eigenaar,
      samenvatting: item.samenvatting,
      inhoud: item.inhoud,
      videoLink: item.videoLink || '',
      afbeelding: item.afbeelding || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Weet je zeker dat je dit item wilt verwijderen?')) return;
    
    try {
      await apiClient.kennisitems.delete(id);
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
      categorie: '',
      tags: '',
      gekoppeldProject: '',
      eigenaar: '',
      samenvatting: '',
      inhoud: '',
      videoLink: '',
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

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer type" />
                  </SelectTrigger>
                  <SelectContent>
                    {KENNISITEM_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="categorie">Categorie</Label>
                <Select value={formData.categorie} onValueChange={(value) => setFormData({ ...formData, categorie: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer een categorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {KENNISBANK_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.type === 'Video' && (
                <div>
                  <Label htmlFor="videoLink">Video Link</Label>
                  <Input
                    id="videoLink"
                    type="url"
                    value={formData.videoLink}
                    onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Voeg een YouTube, Vimeo of andere video link toe
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="afbeelding">Afbeelding (optioneel)</Label>
                {!formData.afbeelding ? (
                  <div className="mt-2">
                    <label 
                      htmlFor="afbeelding-upload" 
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-600">
                          <span className="font-semibold">Klik om een afbeelding te uploaden</span>
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF tot 10MB</p>
                      </div>
                    </label>
                    <Input
                      id="afbeelding-upload"
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
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="mt-3">
                    <div className="relative">
                      <img 
                        src={formData.afbeelding} 
                        alt="Preview" 
                        className="max-w-full h-auto rounded-lg border"
                      />
                    </div>
                    <div className="flex gap-2 mt-3">
                      <label htmlFor="afbeelding-replace">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <span>
                            <Edit className="w-4 h-4 mr-2" />
                            Vervang afbeelding
                          </span>
                        </Button>
                      </label>
                      <Input
                        id="afbeelding-replace"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({ ...formData, afbeelding: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData({ ...formData, afbeelding: '' })}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Verwijder afbeelding
                      </Button>
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Upload een afbeelding voor dit kennisitem (wordt alleen getoond op de detailpagina)
                </p>
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
                <Button type="submit" className="bg-[#7ef769] text-black hover:bg-[#7ef769]/90">
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
                {(Array.isArray(item.tags) ? item.tags : []).map((tag: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}




















































