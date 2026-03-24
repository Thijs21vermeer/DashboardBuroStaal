


import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Edit, Trash2, Search, RefreshCw, TrendingUp, Save, X, Calendar, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { apiClient } from '../../lib/api-client';
import { formatDateShort, truncateText, getRelevantieLevel } from '../../lib/config';
import { getBaseUrl } from '../../lib/base-url';
import type { Trend } from '../../types';
import { ConnectionStatusBanner, type ConnectionStatus } from '../../hooks/useConnectionStatus';

export default function TrendsManager() {
  const [items, setItems] = useState<Trend[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Trend | null>(null);
  const [formData, setFormData] = useState({
    titel: '',
    categorie: 'Technologie',
    samenvatting: '',
    inhoud: '',
    bron: '',
    tags: '',
    eigenaar: '',
    relevantie: 'Middel',
  });
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await apiClient.trends.getAll();
      
      if (data.length === 0) {
        setItems([]);
        setConnectionStatus('empty');
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
    
    const trendData = {
      ...formData,
      datum_gepubliceerd: new Date().toISOString().split('T')[0],
    };

    try {
      if (editingItem) {
        const updated = await apiClient.trends.update(editingItem.id, trendData);
        setItems(items.map(i => i.id === editingItem.id ? updated : i));
      } else {
        const newItem = await apiClient.trends.create(trendData);
        setItems([newItem, ...items]);
      }
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving trend:', error);
      alert('Fout bij opslaan: ' + (error instanceof Error ? error.message : 'Onbekende fout'));
    }
  };

  const handleEdit = (item: Trend) => {
    setEditingItem(item);
    setFormData({
      titel: item.titel,
      categorie: item.categorie,
      samenvatting: item.samenvatting,
      inhoud: item.inhoud,
      bron: item.bron || '',
      tags: item.tags || '',
      eigenaar: item.eigenaar || '',
      relevantie: item.relevantie,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Weet je zeker dat je deze trend wilt verwijderen?')) {
      return;
    }

    try {
      await apiClient.trends.delete(id);
      setItems(items.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting trend:', error);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      titel: '',
      categorie: 'Technologie',
      samenvatting: '',
      inhoud: '',
      bron: '',
      tags: '',
      eigenaar: '',
      relevantie: 'Middel',
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
              placeholder="Zoek trends..."
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
              Nieuwe Trend
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Trend bewerken' : 'Nieuwe trend toevoegen'}
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
                    <SelectItem value="Maakindustrie">Maakindustrie</SelectItem>
                    <SelectItem value="Digitale Marketing">Digitale Marketing</SelectItem>
                    <SelectItem value="Technologie">Technologie</SelectItem>
                    <SelectItem value="Business Development">Business Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="relevantie">Relevantie</Label>
                <Select value={formData.relevantie} onValueChange={(value: any) => setFormData({ ...formData, relevantie: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hoog">Hoog</SelectItem>
                    <SelectItem value="Middel">Middel</SelectItem>
                    <SelectItem value="Laag">Laag</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="eigenaar">Eigenaar</Label>
                <Input
                  id="eigenaar"
                  value={formData.eigenaar}
                  onChange={(e) => setFormData({ ...formData, eigenaar: e.target.value })}
                  placeholder="Bijv. Rick, Kevin, Rosanne"
                />
              </div>

              <div>
                <Label htmlFor="bron">Bron</Label>
                <Input
                  id="bron"
                  value={formData.bron}
                  onChange={(e) => setFormData({ ...formData, bron: e.target.value })}
                  placeholder="Bijv. Gartner, HubSpot, LinkedIn"
                />
              </div>

              <div>
                <Label htmlFor="samenvatting">Samenvatting</Label>
                <Textarea
                  id="samenvatting"
                  value={formData.samenvatting}
                  onChange={(e) => setFormData({ ...formData, samenvatting: e.target.value })}
                  rows={2}
                  placeholder="Korte samenvatting van de trend..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="inhoud">Inhoud</Label>
                <Textarea
                  id="inhoud"
                  value={formData.inhoud}
                  onChange={(e) => setFormData({ ...formData, inhoud: e.target.value })}
                  rows={4}
                  placeholder="Uitgebreide beschrijving van de trend..."
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
                      {item.categorie}
                    </span>
                    {item.relevantie && (
                      <Badge className={getRelevantieLevel(item.relevantie).color}>
                        <AlertCircle className={`h-3 w-3 mr-1 ${getRelevantieLevel(item.relevantie).iconColor}`} />
                        {getRelevantieLevel(item.relevantie).label}
                      </Badge>
                    )}
                    <div className="text-xs text-muted-foreground">
                      <Calendar className="inline h-3 w-3 mr-1" />
                      {formatDateShort(item.datum_gepubliceerd)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {truncateText(item.samenvatting, 100)}
                    </p>
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
              <p className="text-sm text-gray-600 mb-2">
                <strong>Inhoud:</strong> {truncateText(item.inhoud, 200)}
              </p>
              {item.bron && (
                <p className="text-xs text-gray-500">
                  <strong>Bron:</strong> {item.bron}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}































