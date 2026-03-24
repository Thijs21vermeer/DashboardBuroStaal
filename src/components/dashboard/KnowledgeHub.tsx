import { useState, useMemo } from 'react';
import { mockKennisItems } from '../../data/mockData';
import { Search, BookOpen, Tag, Calendar } from 'lucide-react';

export function KnowledgeHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    mockKennisItems.forEach(item => {
      item.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, []);

  const filteredItems = useMemo(() => {
    return mockKennisItems.filter(item => {
      const matchesSearch = 
        item.titel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.samenvatting.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.inhoud.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = selectedTag === 'all' || item.tags.includes(selectedTag);
      
      return matchesSearch && matchesTag;
    });
  }, [searchQuery, selectedTag]);

  const newestItems = useMemo(() => {
    return [...mockKennisItems]
      .filter(item => item.datumToegevoegd) // Filter out items without dates
      .sort((a, b) => new Date(b.datumToegevoegd).getTime() - new Date(a.datumToegevoegd).getTime())
      .slice(0, 3);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Proces':
        return 'bg-[#280bc4] text-white';
      case 'Template':
        return 'bg-[#7ef769] text-black';
      case 'Best Practice':
        return 'bg-purple-500 text-white';
      case 'Documentatie':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Newest Items Widget */}
      <div className="bg-gradient-to-r from-[#280bc4]/10 to-[#280bc4]/5 rounded-xl border-2 border-[#280bc4]/20 p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
          <BookOpen className="w-5 h-5 text-[#280bc4]" />
          Nieuwste items
        </h3>
        <div className="space-y-3">
          {newestItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{item.titel}</h4>
                  <p className="text-sm text-gray-600 mb-2">{item.samenvatting}</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                    {item.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {item.datumToegevoegd ? new Date(item.datumToegevoegd).toLocaleDateString('nl-NL') : 'Geen datum'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Zoek in kennis hub..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#280bc4]"
          />
        </div>
        <div className="min-w-[200px]">
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#280bc4]"
          >
            <option value="all">Alle tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Knowledge Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-gray-500">
            <p>Geen kennis items gevonden</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div 
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">{item.titel}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                  {item.type}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{item.samenvatting}</p>
              
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <BookOpen className="w-4 h-4" />
                  <span>Project: {item.gekoppeldProject}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Bijgewerkt: {item.laatstBijgewerkt ? new Date(item.laatstBijgewerkt).toLocaleDateString('nl-NL') : 'Onbekend'}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {item.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-500">{item.eigenaar}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}




