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
import { mockCases } from '../../data/mockData';
import type { CaseStudy } from '../../types';
import { ConnectionStatusBanner, type ConnectionStatus } from '../../hooks/useConnectionStatus';

export default function CasesManager() {
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CaseStudy | null>(null);
  const [formData, setFormData] = useState({
    titel: '',
    klant: '',
    industrie: 'Metaalbewerking',
    tags: '',
    uitdaging: '',
    oplossing: '',
    resultaten: '',
    eigenaar: 'Admin',
  });
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/cases`);
      
      if (!response.ok) {
        console.warn('API request failed, using mock data');
        setItems(mockCases);
        setConnectionStatus('mock');
        return;
      }
      
      const data = await response.json() as CaseStudy[];
      
      if (data.length === 0) {
        setItems(mockCases);
        setConnectionStatus('mock');
      } else {
        setItems(data);
        setConnectionStatus('connected');
      }
    } catch (error) {
      console.error('Error loading items:', error);
      setItems(mockCases);
      setConnectionStatus('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const caseData = {
      ...formData,
      tags: formData.tags.split(',').map(d => d.trim()).filter(Boolean),
      resultaten: formData.resultaten.split('\n').filter(Boolean),
      datum: new Date().toISOString().split('T')[0],
      featured: false,
    };

    try {
      if (editingItem) {
        const response = await fetch(`${getBaseUrl()}/api/cases/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(caseData),
        });
        const updated = await response.json() as CaseStudy;
        setItems(items.map(i => i.id === editingItem.id ? updated : i));
      } else {
        const response = await fetch(`${getBaseUrl()}/api/cases`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(caseData),
        });
        const newCase = await response.json() as CaseStudy;
        setItems([newCase, ...items]);
      }
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving case:', error);
    }
  };

  const handleEdit = (item: CaseStudy) => {
    setEditingItem(item);
    setFormData({
      titel: item.titel,
      klant: item.klant,
      industrie: item.industrie,
      tags: item.tags.join(', '),
      uitdaging: item.uitdaging,
      oplossing: item.oplossing,
      resultaten: item.resultaten.join('\n'),
      eigenaar: item.eigenaar || 'Admin',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze case wilt verwijderen?')) return;
    
    try {
      await fetch(`${getBaseUrl()}/api/cases/${id}`, {
        method: 'DELETE',
      });
      setItems(items.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting case:', error);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      titel: '',
      klant: '',
      industrie: 'Metaalbewerking',
      tags: '',
      uitdaging: '',
      oplossing: '',
      resultaten: '',
      eigenaar: 'Admin',
    });
  };

  const filteredItems = items.filter(item =>
    item.titel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.klant.toLowerCase().includes(searchTerm.toLowerCase())
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
              placeholder="Zoek cases..."
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
              Nieuwe Case
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Case bewerken' : 'Nieuwe case toevoegen'}
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
                <Label htmlFor="klant">Klant</Label>
                <Input
                  id="klant"
                  value={formData.klant}
                  onChange={(e) => setFormData({ ...formData, klant: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="industrie">Industrie</Label>
                <Select value={formData.industrie} onValueChange={(value) => setFormData({ ...formData, industrie: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Metaalbewerking">Metaalbewerking</SelectItem>
                    <SelectItem value="Productie">Productie</SelectItem>
                    <SelectItem value="Automotive">Automotive</SelectItem>
                    <SelectItem value="Techniek">Techniek</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags">Tags (gescheiden door komma's)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Website, SEO, Marketing"
                  required
                />
              </div>

              <div>
                <Label htmlFor="uitdaging">Uitdaging</Label>
                <Textarea
                  id="uitdaging"
                  value={formData.uitdaging}
                  onChange={(e) => setFormData({ ...formData, uitdaging: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="oplossing">Oplossing</Label>
                <Textarea
                  id="oplossing"
                  value={formData.oplossing}
                  onChange={(e) => setFormData({ ...formData, oplossing: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="resultaten">Resultaten (één per regel)</Label>
                <Textarea
                  id="resultaten"
                  value={formData.resultaten}
                  onChange={(e) => setFormData({ ...formData, resultaten: e.target.value })}
                  rows={4}
                  placeholder="85% meer organisch verkeer&#10;+120% conversies&#10;50% lagere bounce rate"
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
                      {item.klant}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {item.industrie}
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
              <p className="text-sm text-gray-600 mb-3"><strong>Uitdaging:</strong> {item.uitdaging}</p>
              <p className="text-sm text-gray-600 mb-3"><strong>Oplossing:</strong> {item.oplossing}</p>
              <div>
                <strong className="text-sm">Resultaten:</strong>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                  {item.resultaten.map((result, idx) => (
                    <li key={idx}>{result}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


















