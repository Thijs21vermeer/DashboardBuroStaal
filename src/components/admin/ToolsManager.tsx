import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Code } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import type { Tool } from '../../types';
import { baseUrl } from '../../lib/base-url';

export default function ToolsManager() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTool, setEditingTool] = useState<Partial<Tool>>({});

  const fetchTools = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/tools`);
      if (response.ok) {
        const data = await response.json();
        setTools(data);
      }
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingTool.id
        ? `${baseUrl}/api/tools/${editingTool.id}`
        : `${baseUrl}/api/tools`;
      
      const method = editingTool.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTool),
      });

      if (response.ok) {
        fetchTools();
        setIsEditing(false);
        setEditingTool({});
      }
    } catch (error) {
      console.error('Error saving tool:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Weet je zeker dat je deze tool wilt verwijderen?')) return;

    try {
      const response = await fetch(`${baseUrl}/api/tools/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTools();
      }
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

  if (loading) {
    return <div className="text-center py-8">Laden...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Code className="w-8 h-8 text-[#280bc4]" />
          <h2 className="text-2xl font-bold">Developer Tools</h2>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-[#7ef769] text-black hover:bg-[#7ef769]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nieuwe Tool
          </Button>
        )}
      </div>

      {isEditing && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">
            {editingTool.id ? 'Tool Bewerken' : 'Nieuwe Tool'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Titel *</label>
              <Input
                required
                value={editingTool.titel || ''}
                onChange={(e) => setEditingTool({ ...editingTool, titel: e.target.value })}
                placeholder="Bijv: Database Connection String"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Categorie *</label>
                <select
                  required
                  value={editingTool.categorie || ''}
                  onChange={(e) => setEditingTool({ ...editingTool, categorie: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
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
                <label className="block text-sm font-medium mb-1">Taal</label>
                <select
                  value={editingTool.taal || ''}
                  onChange={(e) => setEditingTool({ ...editingTool, taal: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Selecteer...</option>
                  <option value="bash">Bash</option>
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript</option>
                  <option value="sql">SQL</option>
                  <option value="json">JSON</option>
                  <option value="yaml">YAML</option>
                  <option value="python">Python</option>
                  <option value="css">CSS</option>
                  <option value="html">HTML</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Beschrijving</label>
              <Textarea
                value={editingTool.beschrijving || ''}
                onChange={(e) => setEditingTool({ ...editingTool, beschrijving: e.target.value })}
                placeholder="Korte uitleg over wat deze tool doet..."
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Code / Command *</label>
              <Textarea
                required
                value={editingTool.code || ''}
                onChange={(e) => setEditingTool({ ...editingTool, code: e.target.value })}
                placeholder="De tool, snippet of command..."
                rows={6}
                className="font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tags (komma gescheiden)</label>
                <Input
                  value={editingTool.tags || ''}
                  onChange={(e) => setEditingTool({ ...editingTool, tags: e.target.value })}
                  placeholder="deploy, azure, database"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Eigenaar</label>
                <Input
                  value={editingTool.eigenaar || ''}
                  onChange={(e) => setEditingTool({ ...editingTool, eigenaar: e.target.value })}
                  placeholder="Bijv: Rick"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="favoriet"
                checked={editingTool.favoriet || false}
                onChange={(e) => setEditingTool({ ...editingTool, favoriet: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="favoriet" className="text-sm font-medium">
                Markeer als favoriet
              </label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-[#280bc4] text-white hover:bg-[#1f0a9a]">
                {editingTool.id ? 'Bijwerken' : 'Toevoegen'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Annuleren
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {tools.map((tool) => (
          <Card key={tool.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold">{tool.titel}</h3>
                  {tool.favoriet && (
                    <Badge className="bg-yellow-100 text-yellow-800">Favoriet</Badge>
                  )}
                  <Badge variant="outline">{tool.categorie}</Badge>
                  {tool.taal && (
                    <Badge variant="secondary">{tool.taal}</Badge>
                  )}
                </div>
                {tool.beschrijving && (
                  <p className="text-sm text-gray-600 mb-2">{tool.beschrijving}</p>
                )}
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mb-2">
                  <code>{tool.code.length > 100 ? tool.code.substring(0, 100) + '...' : tool.code}</code>
                </pre>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {tool.eigenaar && <span>👤 {tool.eigenaar}</span>}
                  {tool.gebruik_count !== undefined && tool.gebruik_count > 0 && (
                    <span>📋 {tool.gebruik_count}x gebruikt</span>
                  )}
                  {tool.tags && <span>🏷️ {tool.tags}</span>}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(tool)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(tool.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {tools.length === 0 && !isEditing && (
        <div className="text-center py-12 text-gray-500">
          <Code className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Nog geen tools toegevoegd</p>
        </div>
      )}
    </div>
  );
}

