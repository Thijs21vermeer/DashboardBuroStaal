import { useEffect, useState } from 'react';
import { Newspaper, RefreshCw } from 'lucide-react';

interface NewsItem {
  id: number;
  titel: string;
  categorie: string;
  inhoud: string;
  datum: string;
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/nieuws');
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const getCategoryColor = (categorie: string) => {
    switch (categorie?.toLowerCase()) {
      case 'prestatie': return 'bg-green-100 text-green-700 border-green-200';
      case 'project': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'team': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'update': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Intern Nieuws</h2>
          <p className="text-gray-600 mt-1">
            Blijf op de hoogte van updates en prestaties
          </p>
        </div>
        <button
          onClick={fetchNews}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
          title="Ververs lijst"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Ververs
        </button>
      </div>

      {/* News Timeline */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-12">
          <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Geen nieuwsitems gevonden</p>
        </div>
      ) : (
        <div className="space-y-6">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all overflow-hidden"
            >
              <div className={`h-1 ${getCategoryColor(item.categorie)}`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded border ${getCategoryColor(item.categorie)}`}>
                        {item.categorie}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(item.datum).toLocaleDateString('nl-NL', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <h3 className="font-semibold text-xl text-gray-900">
                      {item.titel}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {item.inhoud}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
