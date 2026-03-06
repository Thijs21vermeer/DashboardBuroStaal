import { useEffect, useState } from 'react';
import { TrendingUp, RefreshCw, ArrowUp, AlertCircle } from 'lucide-react';

interface Trend {
  id: number;
  titel: string;
  categorie: string;
  beschrijving: string;
  impact: string;
  datum: string;
}

export default function Trends() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/trends');
      const data = await response.json();
      setTrends(data);
    } catch (error) {
      console.error('Error fetching trends:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'hoog': return 'bg-red-100 text-red-700 border-red-200';
      case 'middel': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'laag': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Trends & Insights</h2>
          <p className="text-gray-600 mt-1">
            Actuele ontwikkelingen in de maakindustrie
          </p>
        </div>
        <button
          onClick={fetchTrends}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
          title="Ververs lijst"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Ververs
        </button>
      </div>

      {/* Trends List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : trends.length === 0 ? (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Geen trends gevonden</p>
        </div>
      ) : (
        <div className="space-y-6">
          {trends.map((trend, index) => (
            <div
              key={trend.id}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-primary transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-primary to-blue-600 text-white rounded-lg">
                  <TrendingUp className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-gray-300">
                          #{index + 1}
                        </span>
                        <h3 className="font-semibold text-xl text-gray-900">
                          {trend.titel}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                          {trend.categorie}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getImpactColor(trend.impact)}`}>
                          Impact: {trend.impact}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUp className="w-5 h-5" />
                      <span className="font-semibold">Trending</span>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed mb-4">
                    {trend.beschrijving}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      {new Date(trend.datum).toLocaleDateString('nl-NL')}
                    </span>
                    {trend.impact?.toLowerCase() === 'hoog' && (
                      <div className="flex items-center gap-1 text-red-600 text-xs font-medium">
                        <AlertCircle className="w-4 h-4" />
                        <span>Hoge prioriteit</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
