
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Edit, Trash2, Search, RefreshCw, Calendar, Newspaper, Save, X, Image as ImageIcon } from 'lucide-react';
import { apiClient } from '../../lib/api-client';
import { formatDateShort, truncateText } from '../../lib/config';
import { getBaseUrl } from '../../lib/base-url';
import type { NewsItem } from '../../types';
import { ConnectionStatusBanner, type ConnectionStatus } from '../../hooks/useConnectionStatus';

export default function NewsManager() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState({
    titel: '',
    categorie: 'Bedrijfsnieuws' as 'Bedrijfsnieuws' | 'Team Update' | 'Project Lancering' | 'Prestatie' | 'Algemeen',
    inhoud: '',
    auteur: '',
    tags: '',
    belangrijk: 'false',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await apiClient.nieuws.getAll();
      
      if (data.length === 0) {
        setItems([]);
        setConnectionStatus('mock');
      } else {
        setItems(data);
        setConnectionStatus('connected');
      }
    } catch (error) {
      console.error('Error loading items:', error);
      setItems([]);
      setConnectionStatus('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newsData = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      datum: new Date().toISOString().split('T')[0],
    };

    try {
      if (editingItem) {
        const updated = await apiClient.nieuws.update(editingItem.id, newsData);
        setItems(items.map(i => i.id === editingItem.id ? updated : i));
      } else {
        const newItem = await apiClient.nieuws.create(newsData);
        setItems([newItem, ...items]);
      }
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving news item:', error);
      alert('Fout bij opslaan: ' + (error instanceof Error ? error.message : 'Onbekende fout'));
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    const tagsString = Array.isArray(item.tags) 
      ? item.tags.join(', ') 
      : typeof item.tags === 'string' 
        ? item.tags 
        : '';
    
    setFormData({
      titel: item.titel,
      categorie: item.categorie as "Project Lancering" | "Team Update" | "Bedrijfsnieuws" | "Prestatie" | "Algemeen",
      inhoud: item.inhoud,
      auteur: item.auteur || '',
      tags: tagsString,
      belangrijk: item.belangrijk ? 'true' : 'false',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Weet je zeker dat je dit nieuwsbericht wilt verwijderen?')) {
      return;
    }

    try {
      await apiClient.nieuws.delete(id);
      setItems(items.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting news item:', error);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      titel: '',
      categorie: 'Bedrijfsnieuws',
      inhoud: '',
      auteur: '',
      tags: '',
      belangrijk: 'false',
    });
  };

  const filteredItems = items;

  const getCategoryColor = (categorie: string) => {
    switch (categorie) {
      case 'Succes': return 'border-l-[#7ef769]';
      case 'Team': return 'border-l-[#280bc4]';
      case 'Project': return 'border-l-purple-500';
      case 'Event': return 'border-l-yellow-500';
      case 'Milestone': return 'border-l-red-500';
      default: return 'border-l-gray-500';
    }
  };

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
              placeholder="Zoek nieuws..."
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
            <Button className="bg-[#7ef769] text-black hover:bg-[#7ef769]/90 ml-2">
              <Plus className="w-4 h-4 mr-2" />
              Nieuw Nieuwsitem
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Nieuwsitem bewerken' : 'Nieuw nieuwsitem toevoegen'}
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
                <Label htmlFor="categorie">Categorie</Label>
                <Select value={formData.categorie} onValueChange={(value: any) => setFormData({ ...formData, categorie: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bedrijfsnieuws">Bedrijfsnieuws</SelectItem>
                    <SelectItem value="Team Update">Team Update</SelectItem>
                    <SelectItem value="Project Lancering">Project Lancering</SelectItem>
                    <SelectItem value="Prestatie">Prestatie</SelectItem>
                    <SelectItem value="Algemeen">Algemeen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="auteur">Auteur</Label>
                <Input
                  id="auteur"
                  value={formData.auteur}
                  onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (gescheiden door komma's)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Launch, Client, Marketing"
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

      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className={`border-l-4 ${getCategoryColor(item.categorie)}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {item.datum ? new Date(item.datum).toLocaleDateString('nl-NL', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'Geen datum'}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                      {item.categorie}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{item.titel}</CardTitle>
                  {item.auteur && <p className="text-sm text-gray-500 mt-1">Door {item.auteur}</p>}
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
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{item.inhoud}</p>
              {item.tags && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {(typeof item.tags === 'string' ? item.tags.split(',') : Array.isArray(item.tags) ? item.tags : []).map((tag: string, index: number) => (
                    <span 
                      key={`${tag}-${index}`} 
                      className="inline-block text-xs px-3 py-1.5 bg-purple-50 text-[#280bc4] rounded-full font-medium whitespace-nowrap"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}





































