import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Code, Search, Save, X, Wrench } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import type { Tool } from '../../types';
import { apiClient } from '../../lib/api-client';

export default function ToolsManager() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTool, setEditingTool] = useState<Partial<Tool>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const loadTools = async () => {
    setLoading(true);
    try {
      const data = await apiClient.tools.getAll();
      setTools(data);
    } catch (error) {
      console.error('Error loading tools:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTools();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTool.id) {
        await apiClient.tools.update(editingTool.id, editingTool);
      } else {
        await apiClient.tools.create(editingTool);
      }
      
      loadTools();
      setIsEditing(false);
      setEditingTool({});
    } catch (error) {
      console.error('Error saving tool:', error);
    }
  };

  const handleSave = async () => {
    if (!editingTool) return;

    try {
      if (editingTool.id === 0 || !editingTool.id) {
        await apiClient.tools.create(editingTool);
      } else {
        await apiClient.tools.update(editingTool.id, editingTool);
      }

      setIsEditing(false);
      setEditingTool({});
    } catch (error) {
      console.error('Error saving tool:', error);
    }
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id) {
      console.error('Ongeldige tool ID');
      return;
    }
    
    if (!confirm('Weet je zeker dat je deze tool wilt verwijderen?')) return;
    
    try {
      await apiClient.tools.delete(id);
      await loadTools();
    } catch (error) {
      console.error('Error deleting tool:', error);
    }
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingTool({});
  };

  const filteredTools = tools.filter((tool) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      tool.naam.toLowerCase().includes(search) ||
      tool.beschrijving?.toLowerCase().includes(search) ||
      tool.tags?.toLowerCase().includes(search) ||
      tool.categorie.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return <div className="text-center py-8">Laden...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <Code className="w-6 h-6 sm:w-8 sm:h-8 text-[#280bc4]" />
          <h2 className="text-xl sm:text-2xl font-bold">Developer Tools</h2>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-[#7ef769] text-black hover:bg-[#7ef769]/90 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nieuwe Tool
          </Button>
        )}
      </div>

      {!isEditing && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Zoek tools op titel, beschrijving, code, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {isEditing && (
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4">
            {editingTool.id ? 'Tool Bewerken' : 'Nieuwe Tool'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Naam *</label>
              <Input
                required
                value={editingTool.naam || ''}
                onChange={(e) => setEditingTool({ ...editingTool, naam: e.target.value })}
                placeholder="Bijv: Database Connection String"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Categorie *</label>
                <select
                  required
                  value={editingTool.categorie || ''}
                  onChange={(e) => setEditingTool({ ...editingTool, categorie: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">Selecteer...</option>
                  <option value="Command">Command</option>
                  <option value="Code Snippet">Code Snippet</option>
                  <option value="Configuration">Configuration</option>
                  <option value="Script">Script</option>
                  <option value="SQL">SQL</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <Input
                  value={editingTool.url || ''}
                  onChange={(e) => setEditingTool({ ...editingTool, url: e.target.value })}
                  placeholder="https://..."
                  className="text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Beschrijving *</label>
              <Textarea
                required
                value={editingTool.beschrijving || ''}
                onChange={(e) => setEditingTool({ ...editingTool, beschrijving: e.target.value })}
                placeholder="Beschrijving van deze tool..."
                rows={4}
                className="text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tags (komma gescheiden)</label>
                <Input
                  value={editingTool.tags || ''}
                  onChange={(e) => setEditingTool({ ...editingTool, tags: e.target.value })}
                  placeholder="deploy, azure, database"
                  className="text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Eigenaar</label>
                <Input
                  value={editingTool.eigenaar || ''}
                  onChange={(e) => setEditingTool({ ...editingTool, eigenaar: e.target.value })}
                  placeholder="Bijv: Rick"
                  className="text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="bg-[#280bc4] text-white hover:bg-[#1f0a9a] w-full sm:w-auto">
                {editingTool.id ? 'Bijwerken' : 'Toevoegen'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                Annuleren
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-3 sm:gap-4">
        {filteredTools.map((tool) => (
          <Card key={tool.id} className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-bold text-sm sm:text-base break-words">{tool.naam}</h3>
                  <Badge variant="outline" className="text-xs">{tool.categorie}</Badge>
                </div>
                {tool.beschrijving && (
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 break-words">{tool.beschrijving}</p>
                )}
                {tool.url && (
                  <div className="mb-2">
                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-blue-600 hover:underline break-all">
                      {tool.url}
                    </a>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
                  {tool.eigenaar && <span>👤 {tool.eigenaar}</span>}
                  {tool.tags && <span className="break-words">🏷️ {tool.tags}</span>}
                </div>
              </div>
              <div className="flex gap-2 sm:ml-4 self-start sm:self-auto">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(tool)}
                  className="h-8 px-2 sm:px-3"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(tool.id)}
                  className="text-red-600 hover:text-red-700 h-8 px-2 sm:px-3"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {tools.length === 0 && !isEditing && (
        <div className="text-center py-8 sm:py-12 text-gray-500">
          <Code className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-sm sm:text-base">Nog geen tools toegevoegd</p>
        </div>
      )}
    </div>
  );
}
















