import { useEffect, useState } from 'react';
import { Search, Filter, RefreshCw, BookOpen, FileText, Video, Image } from 'lucide-react';

interface KennisItem {
  id: number;
  titel: string;
  type: string;
  tags: string;
  samenvatting: string;
  datum_toegevoegd: string;
}

export default function Kennisbank() {
  const [items, setItems] = useState<KennisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/kennisitems');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching kennisitems:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = items.filter(item =>
    item.titel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.samenvatting?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'artikel': return FileText;
      case 'video': return Video;
      case 'afbeelding': return Image;
      default: return BookOpen;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek in kennisbank..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button
            onClick={fetchItems}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
            title="Ververs lijst"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Ververs
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {loading ? 'Laden...' : `${filteredItems.length} items gevonden`}
        </p>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Geen kennisitems gevonden</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const Icon = getIcon(item.type);
            return (
              <div
                key={item.id}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-primary transition-all group cursor-pointer"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6 text-primary group-hover:text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded mb-2">
                      {item.type}
                    </span>
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors">
                      {item.titel}
                    </h3>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {item.samenvatting}
                </p>

                {item.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.split(',').slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  {new Date(item.datum_toegevoegd).toLocaleDateString('nl-NL')}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
