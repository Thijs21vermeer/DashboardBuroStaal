import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Search, 
  Filter, 
  Code2, 
  Terminal, 
  FileCode, 
  Settings, 
  Database,
  Copy,
  Check,
  RefreshCw,
  Wrench,
  ExternalLink,
  Tag
} from 'lucide-react';
import { apiClient } from '../../lib/api-client';
import { truncateText } from '../../lib/config';

interface Tool {
  id: number;
  titel: string;
  categorie: string;
  beschrijving: string;
  code: string;
  taal: string | null;
  tags: string | null;
  eigenaar: string;
  datum_toegevoegd: string;
  laatst_bijgewerkt: string | null;
}

const categoryIcons: Record<string, any> = {
  'Command': Terminal,
  'Code Snippet': Code2,
  'Configuration': Settings,
  'SQL': Database,
  'default': FileCode,
};

const languageColors: Record<string, string> = {
  'typescript': 'bg-blue-100 text-blue-700',
  'javascript': 'bg-yellow-100 text-yellow-700',
  'bash': 'bg-green-100 text-green-700',
  'sql': 'bg-purple-100 text-purple-700',
  'css': 'bg-pink-100 text-pink-700',
  'default': 'bg-gray-100 text-gray-700',
};

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await apiClient.tools.getAll();
        setTools(data);
        setFilteredTools(data);
      } catch (error) {
        console.error('Error loading tools:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const data = await apiClient.tools.getAll();
      setTools(data);
      setFilteredTools(data);
    } catch (error) {
      console.error('Error loading tools:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = tools;

    // Filter op categorie
    if (selectedCategory !== 'Alle') {
      result = result.filter(tool => tool.categorie === selectedCategory);
    }

    // Filter op zoekterm
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(tool =>
        tool.titel.toLowerCase().includes(search) ||
        tool.beschrijving.toLowerCase().includes(search) ||
        tool.tags?.toLowerCase().includes(search) ||
        tool.eigenaar.toLowerCase().includes(search)
      );
    }

    setFilteredTools(result);
  }, [searchTerm, selectedCategory, tools]);

  const categories = ['Alle', ...Array.from(new Set(tools.map(t => t.categorie)))];

  const handleCopy = async (id: number, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Error copying code:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    const Icon = categoryIcons[category] || categoryIcons.default;
    return <Icon className="w-5 h-5" />;
  };

  const getLanguageColor = (lang: string | null) => {
    if (!lang) return languageColors.default;
    return languageColors[lang.toLowerCase()] || languageColors.default;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#280bc4]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-[#280bc4] rounded-xl shadow-lg p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Tools & Snippets</h1>
            <p className="text-white/90 text-sm sm:text-base">
              Herbruikbare code snippets, commando's en configuraties voor het team
            </p>
          </div>
          <Button
            onClick={fetchTools}
            variant="outline"
            size="icon"
            title="Ververs tools"
            className="bg-white/10 border-white/20 hover:bg-white/20 text-white self-start sm:self-auto"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="flex gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <Input
              type="text"
              placeholder="Zoek tools, tags, eigenaar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 sm:pl-10 h-10 sm:h-11 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
          {categories.map(category => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              className={`text-xs sm:text-sm ${selectedCategory === category ? 'bg-[#280bc4] hover:bg-[#280bc4]/90' : ''}`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Totaal Tools</p>
              <p className="text-xl sm:text-2xl font-bold text-black">{tools.length}</p>
            </div>
            <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#280bc4]" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Commands</p>
              <p className="text-xl sm:text-2xl font-bold text-black">
                {tools.filter(t => t.categorie === 'Command').length}
              </p>
            </div>
            <Terminal className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Snippets</p>
              <p className="text-xl sm:text-2xl font-bold text-black">
                {tools.filter(t => t.categorie === 'Code Snippet').length}
              </p>
            </div>
            <FileCode className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Configuraties</p>
              <p className="text-xl sm:text-2xl font-bold text-black">
                {tools.filter(t => t.categorie === 'Configuration').length}
              </p>
            </div>
            <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Results Count */}
      <div>
        <p className="text-xs sm:text-sm text-gray-600">
          {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'} gevonden
        </p>
      </div>

      {/* Tools Grid */}
      {filteredTools.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center">
          <Code2 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Geen tools gevonden</h3>
          <p className="text-sm sm:text-base text-gray-600">
            Probeer een andere zoekopdracht of filter
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {filteredTools.map((tool) => (
            <Card key={tool.id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 sm:gap-4 flex-1">
                  <div className="p-2 sm:p-3 bg-gray-100 rounded-lg flex-shrink-0">
                    {getCategoryIcon(tool.categorie)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-black mb-2">
                      {tool.titel}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {truncateText(tool.omschrijving, 150)}
                    </p>
                    
                    <div className="flex items-center gap-2 flex-wrap mb-4">
                      <Badge variant="outline" className="bg-[#280bc4] text-white border-[#280bc4] text-xs">
                        {tool.categorie}
                      </Badge>
                      {tool.taal && (
                        <Badge variant="outline" className={`${getLanguageColor(tool.taal)} text-xs`}>
                          {tool.taal}
                        </Badge>
                      )}
                      {tool.tags && tool.tags.split(',').map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="bg-gray-100 text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>

                    {/* Code Block */}
                    <div className="relative bg-gray-900 text-gray-100 rounded-lg p-3 sm:p-4 overflow-x-auto">
                      <Button
                        onClick={() => handleCopy(tool.id, tool.code)}
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white text-xs"
                      >
                        {copiedId === tool.id ? (
                          <>
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="hidden sm:inline">Gekopieerd</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="hidden sm:inline">Kopieer</span>
                          </>
                        )}
                      </Button>
                      <pre className="text-xs sm:text-sm font-mono whitespace-pre-wrap break-all pr-20 sm:pr-24">
                        {tool.code}
                      </pre>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 text-xs sm:text-sm text-gray-500 gap-2">
                      <span>Door: <span className="font-semibold text-black">{tool.eigenaar}</span></span>
                      <span>
                        {new Date(tool.datum_toegevoegd).toLocaleDateString('nl-NL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}






