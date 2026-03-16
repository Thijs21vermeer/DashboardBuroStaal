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
import { mockTrends } from '../../data/mockData';
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
    beschrijving: '',
    relevantie: 'Middel' as 'Hoog' | 'Middel' | 'Laag',
    bronnen: '',
    tags: '',
    impact: '',
    eigenaar: '',
  });
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/trends`);
      
      if (!response.ok) {
        console.warn('API request failed, using mock data');
        setItems(mockTrends);
        setConnectionStatus('mock');
        return;
      }
      
      const data = await response.json() as Trend[];
      
      if (data.length === 0) {
        setItems(mockTrends);
        setConnectionStatus('mock');
      } else {
        setItems(data);
        setConnectionStatus('connected');
      }
    } catch (error) {
      console.error('Error loading items:', error);
      setItems(mockTrends);
      setConnectionStatus('error');
    }
  };

  const loadTrends = async () => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/trends`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API request failed:', response.status, errorText);
        setItems(mockTrends);
        setConnectionStatus('error');
        return;
      }
      
      const data = await response.json() as Trend[];
      setItems(data);
      setConnectionStatus('connected');
      
      if (data.length === 0) {
        console.log('Database is empty - ready to add trends');
      }
    } catch (error) {
      console.error('Error loading trends:', error);
      setItems(mockTrends);
      setConnectionStatus('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trendData = {
      ...formData,
      bronnen: formData.bronnen.split('\n').filter(Boolean),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    try {
      const baseUrl = getBaseUrl();
      
      if (editingItem) {
        const response = await fetch(`${baseUrl}/api/trends/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trendData),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to update trend:', response.status, errorText);
          alert('Fout bij opslaan: ' + errorText);
          return;
        }
        
        const updated = await response.json() as Trend;
        setItems(items.map(t => t.id === editingItem.id ? updated : t));
        alert('✅ Trend succesvol bijgewerkt!');
      } else {
        const response = await fetch(`${baseUrl}/api/trends`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trendData),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to create trend:', response.status, errorText);
          alert('Fout bij toevoegen: ' + errorText);
          return;
        }
        
        const newTrend = await response.json() as Trend;
        setItems([newTrend, ...items]);
        alert('✅ Trend succesvol toegevoegd!');
      }
      
      resetForm();
      setIsDialogOpen(false);
      setConnectionStatus('connected');
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
      beschrijving: item.beschrijving,
      relevantie: item.relevantie,
      bronnen: item.bronnen.join('\n'),
      tags: item.tags.join(', '),
      impact: item.impact,
      eigenaar: item.eigenaar || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze trend wilt verwijderen?')) return;
    
    try {
      await fetch(`${getBaseUrl()}/api/trends/${id}`, {
        method: 'DELETE',
      });
      setItems(items.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting trend:', error);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      titel: '',
      categorie: 'Productie',
      beschrijving: '',
      relevantie: 'Middel',
      bronnen: '',
      tags: '',
      impact: '',
      eigenaar: '',
    });
  };

  const filteredItems = items.filter(item =>
    item.titel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.beschrijving.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRelevantieColor = (relevantie: string) => {
    switch (relevantie) {
      case 'Hoog':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Middel':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Laag':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
                <Label htmlFor="bronnen">Bronnen (gescheiden door komma's)</Label>
                <Input
                  id="bronnen"
                  value={formData.bronnen}
                  onChange={(e) => setFormData({ ...formData, bronnen: e.target.value })}
                  placeholder="Gartner, HubSpot, LinkedIn"
                  required
                />
              </div>

              <div>
                <Label htmlFor="impact">Impact</Label>
                <Textarea
                  id="impact"
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                  rows={2}
                  placeholder="Beschrijf de impact van deze trend..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="beschrijving">Beschrijving</Label>
                <Textarea
                  id="beschrijving"
                  value={formData.beschrijving}
                  onChange={(e) => setFormData({ ...formData, beschrijving: e.target.value })}
                  rows={4}
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
                    <span className={`text-xs px-2 py-1 rounded ${getRelevantieColor(item.relevantie)}`}>
                      Relevantie: {item.relevantie}
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
              <p className="text-sm text-gray-600 mb-2">{item.beschrijving}</p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Impact:</strong> {item.impact}
              </p>
              <p className="text-xs text-gray-500">
                <strong>Bronnen:</strong> {item.bronnen.join(', ')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}





















