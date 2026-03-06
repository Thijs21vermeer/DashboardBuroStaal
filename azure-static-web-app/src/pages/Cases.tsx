import { useEffect, useState } from 'react';
import { Building2, RefreshCw, Award, TrendingUp } from 'lucide-react';

interface Case {
  id: number;
  titel: string;
  klant: string;
  fase: string;
  resultaten: string;
  datum: string;
}

export default function Cases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cases');
      const data = await response.json();
      setCases(data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Succesverhalen</h2>
          <p className="text-gray-600 mt-1">
            Ontdek hoe we productiebedrijven helpen groeien
          </p>
        </div>
        <button
          onClick={fetchCases}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
          title="Ververs lijst"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Ververs
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Totaal Cases</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : cases.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Afgerond</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : cases.filter(c => c.fase === 'afgerond').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Klanten</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : new Set(cases.map(c => c.klant)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cases List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : cases.length === 0 ? (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Geen cases gevonden</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-primary transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-xl text-gray-900 group-hover:text-primary transition-colors mb-2">
                    {caseItem.titel}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4" />
                    <span>{caseItem.klant}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  caseItem.fase === 'afgerond'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {caseItem.fase}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Resultaten</h4>
                  <p className="text-sm text-gray-600">{caseItem.resultaten}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  {new Date(caseItem.datum).toLocaleDateString('nl-NL')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
