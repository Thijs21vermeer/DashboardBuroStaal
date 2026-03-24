




/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Calendar, User, Tag, ArrowRight, BookOpen, RefreshCw } from 'lucide-react';
import { KENNISBANK_CATEGORIES, MEDIA_TYPES } from '../../lib/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { baseUrl } from '../../lib/base-url';
import { KennisItemDetail } from './KennisItemDetail';
import { apiClient } from '../../lib/api-client';
import type { KennisItem } from '../../types';

export function KennisbankPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState<string>('alle');
  const [selectedType, setSelectedType] = useState<string>('alle');
  const [selectedTag, setSelectedTag] = useState<string>('alle');
  const [sortBy, setSortBy] = useState<'recent' | 'populair' | 'titel'>('recent');
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await apiClient.kennisitems.getAll();
      setItems(data);
    } catch (error) {
      console.error('Error loading kennisitems:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Verzamel alle unieke tags
  const allTags = Array.from(
    new Set(items.flatMap(item => item.tags || []))
  ).sort();

  // Filter en sorteer items
  const filteredItems = items
    .filter(item => {
      const matchesSearch = 
        item.titel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.samenvatting.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategorie = selectedCategorie === 'alle' || item.categorie.toLowerCase() === selectedCategorie.toLowerCase();
      const matchesType = selectedType === 'alle' || item.type === selectedType;
      const matchesTag = selectedTag === 'alle' || (item.tags || []).includes(selectedTag);

      return matchesSearch && matchesCategorie && matchesType && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.datumToegevoegd).getTime() - new Date(a.datumToegevoegd).getTime();
      } else if (sortBy === 'populair') {
        return b.views - a.views;
      } else {
        return a.titel.localeCompare(b.titel);
      }
    });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategorie('alle');
    setSelectedType('alle');
    setSelectedTag('alle');
    setSortBy('recent');
  };

  const hasActiveFilters = 
    searchQuery !== '' || 
    selectedCategorie !== 'alle' || 
    selectedType !== 'alle' || 
    selectedTag !== 'alle';

  // Show detail view if item is selected
  if (selectedItemId !== null) {
    return (
      <KennisItemDetail 
        itemId={selectedItemId} 
        onBack={() => setSelectedItemId(null)} 
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-[#280bc4] rounded-xl shadow-lg p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-[#7ef769]" />
            <h1 className="text-2xl sm:text-3xl font-bold">Onze Kennisbank</h1>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={loadItems}
            title="Ververs kennisbank"
            className="bg-white/10 border-white/20 hover:bg-white/20 text-white self-start sm:self-auto"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-white/90 text-base sm:text-lg mb-4 sm:mb-6">
          Centraal overzicht van alle kennis, documenten en resources
        </p>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            <CardTitle className="text-base sm:text-lg">Zoeken & Filteren</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Zoek op titel, beschrijving of tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Categorie
                </label>
                <Select value={selectedCategorie} onValueChange={setSelectedCategorie}>
                  <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                    <SelectValue className="truncate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alle">Alle categorieën</SelectItem>
                    {KENNISBANK_CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Type Media
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alle">Alle types</SelectItem>
                    {MEDIA_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Tag
                </label>
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" align="start" sideOffset={4}>
                    <SelectItem value="alle">Alle tags</SelectItem>
                    {allTags.map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Sorteren op
                </label>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" align="start" sideOffset={4}>
                    <SelectItem value="recent">Meest recent</SelectItem>
                    <SelectItem value="populair">Meest bekeken</SelectItem>
                    <SelectItem value="titel">Alfabetisch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters & Reset */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-sm text-gray-600">
                  {filteredItems.length} resultaten gevonden
                </p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={resetFilters}
                  className="text-[#280bc4]"
                >
                  Reset filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
        </h2>
      </div>

      {/* Loading State */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[#280bc4]" />
            <p className="text-gray-600">Kennisitems laden...</p>
          </CardContent>
        </Card>
      ) : filteredItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 text-lg">
              Geen resultaten gevonden. Probeer andere zoektermen of filters.
            </p>
            <Button 
              onClick={resetFilters}
              className="mt-4 bg-[#280bc4] hover:bg-[#280bc4]/90 text-white"
            >
              Reset filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              className="hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-[#280bc4] flex flex-col"
              onClick={() => setSelectedItemId(item.id)}
            >
              <CardHeader className="flex-shrink-0 pb-2 sm:pb-3 px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 space-y-1 sm:space-y-1.5">
                <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                  <Badge className="bg-[#280bc4] text-white w-fit text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                    {item.type}
                  </Badge>
                  {item.categorie && (
                    <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                      {item.categorie}
                    </Badge>
                  )}
                </div>
                {item.featured && (
                  <Badge className="bg-[#7ef769] text-black text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 w-fit">
                    Featured
                  </Badge>
                )}
                <CardTitle className="text-sm sm:text-base lg:text-lg group-hover:text-[#280bc4] transition-colors leading-snug line-clamp-2">
                  {item.titel}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-xs sm:text-sm lg:text-base leading-relaxed">
                  {item.samenvatting}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-2.5 lg:space-y-3 mt-auto pt-0 px-3 sm:px-6 lg:px-8 pb-3 sm:pb-4">
                {/* Meta Info */}
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 py-2 sm:py-3 border-t">
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate text-xs sm:text-sm">{item.auteur}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    {formatDateShort(item.createdAt)}
                  </div>
                  {/* Tags */}
                  <div className="flex items-start gap-1.5 sm:gap-3 pt-1">
                    <Tag className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 flex-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="text-[10px] sm:text-xs cursor-pointer hover:bg-gray-300 px-1.5 sm:px-2 py-0.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTag(tag);
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Read More Button */}
                <Button 
                  className="w-full bg-[#7ef769] hover:bg-[#7ef769]/90 text-black font-semibold transition-colors text-xs sm:text-sm h-8 sm:h-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItemId(item.id);
                  }}
                >
                  <span className="hidden sm:inline">Lees meer</span>
                  <span className="sm:hidden">Lees</span>
                  <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}











































