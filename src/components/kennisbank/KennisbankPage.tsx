/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Calendar, User, Tag, ArrowRight, BookOpen, RefreshCw } from 'lucide-react';
import { mockKennisItems, kennisCategorieen, typeMedia } from '../../data/mockData';
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

export function KennisbankPage() {
  const [items, setItems] = useState(mockKennisItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState<string>('alle');
  const [selectedType, setSelectedType] = useState<string>('alle');
  const [selectedTag, setSelectedTag] = useState<string>('alle');
  const [sortBy, setSortBy] = useState<'recent' | 'populair' | 'titel'>('recent');

  const loadItems = () => {
    // In de toekomst wordt dit een API call
    setItems([...mockKennisItems]);
  };

  // Verzamel alle unieke tags
  const allTags = Array.from(
    new Set(items.flatMap(item => item.tags))
  ).sort();

  // Filter en sorteer items
  const filteredItems = items
    .filter(item => {
      const matchesSearch = 
        item.titel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.samenvatting.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategorie = selectedCategorie === 'alle' || item.categorie === selectedCategorie;
      const matchesType = selectedType === 'alle' || item.type === selectedType;
      const matchesTag = selectedTag === 'alle' || item.tags.includes(selectedTag);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#280bc4] to-[#280bc4]/80 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#7ef769]" />
            <h1 className="text-3xl font-bold">Onze Kennisbank</h1>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={loadItems}
            title="Ververs kennisbank"
            className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-white/90 text-lg mb-6">
          Centraal overzicht van alle kennis, documenten en resources
        </p>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <CardTitle>Zoeken & Filteren</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Zoek op titel, beschrijving of tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Categorie
                </label>
                <Select value={selectedCategorie} onValueChange={setSelectedCategorie}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alle">Alle categorieën</SelectItem>
                    {kennisCategorieen.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Type Media
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alle">Alle types</SelectItem>
                    {typeMedia.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Tag
                </label>
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alle">Alle tags</SelectItem>
                    {allTags.map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Sorteren op
                </label>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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

      {/* Content Grid */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 text-lg">
              Geen resultaten gevonden. Probeer andere zoektermen of filters.
            </p>
            <Button 
              onClick={resetFilters}
              className="mt-4 bg-[#280bc4] hover:bg-[#280bc4]/90"
            >
              Reset filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              className="hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-[#280bc4]"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="outline" className="font-medium">
                    {item.type}
                  </Badge>
                  {item.featured && (
                    <Badge className="bg-[#7ef769] text-black">
                      Featured
                    </Badge>
                  )}
                </div>
                <Badge className="bg-[#280bc4] text-white mb-3 w-fit">
                  {item.categorie}
                </Badge>
                <CardTitle className="text-lg group-hover:text-[#280bc4] transition-colors">
                  {item.titel}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {item.samenvatting}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Meta Info */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{item.auteur}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(item.datumToegevoegd || item.datumToegevoegd).toLocaleDateString('nl-NL')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{item.views} views</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 4).map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="text-xs cursor-pointer hover:bg-gray-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTag(tag);
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{item.tags.length - 4}
                    </Badge>
                  )}
                </div>

                {/* Read More Button */}
                <Button 
                  className="w-full bg-[#280bc4] hover:bg-[#280bc4]/90 group-hover:bg-[#7ef769] group-hover:text-black transition-colors"
                >
                  Lees meer
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}



