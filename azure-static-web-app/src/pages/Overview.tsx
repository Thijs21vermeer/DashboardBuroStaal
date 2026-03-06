import { useEffect, useState } from 'react';
import { BookOpen, Award, TrendingUp, Eye, RefreshCw } from 'lucide-react';

interface Stats {
  kennisitems: number;
  cases: number;
  trends: number;
  views: number;
}

export default function Overview() {
  const [stats, setStats] = useState<Stats>({
    kennisitems: 0,
    cases: 0,
    trends: 0,
    views: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [kennisItems, cases, trends] = await Promise.all([
        fetch('/api/kennisitems').then(r => r.json()),
        fetch('/api/cases').then(r => r.json()),
        fetch('/api/trends').then(r => r.json()),
      ]);

      setStats({
        kennisitems: kennisItems.length || 0,
        cases: cases.length || 0,
        trends: trends.length || 0,
        views: 1247, // Mock data voor nu
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Kennisitems', value: stats.kennisitems, icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Case Studies', value: stats.cases, icon: Award, color: 'bg-purple-500' },
    { label: 'Trends', value: stats.trends, icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Totaal Views', value: stats.views, icon: Eye, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header met refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welkom bij de Kennisbank</h2>
          <p className="text-gray-600 mt-1">
            Jouw centraal punt voor kennis, cases en trends in de maakindustrie
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
          title="Ververs statistieken"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Ververs
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '...' : stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-blue-600 text-white p-8 rounded-2xl shadow-lg">
        <div className="max-w-3xl">
          <h3 className="text-3xl font-bold mb-4">
            Jouw groeiparter in de maakindustrie
          </h3>
          <p className="text-lg text-blue-100 mb-6">
            Bij Buro Staal begrijpen we de uitdagingen van de maakindustrie. 
            Van productie-efficiëntie tot digitale transformatie - wij helpen 
            productiebedrijven groeien met online marketing en strategie.
          </p>
          <div className="flex gap-4">
            <a
              href="/kennisbank"
              className="px-6 py-3 bg-accent text-black font-semibold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Verken de Kennisbank
            </a>
            <a
              href="/cases"
              className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors"
            >
              Bekijk Cases
            </a>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/kennisbank"
          className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all group"
        >
          <BookOpen className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-semibold text-lg mb-2">Kennisbank</h4>
          <p className="text-sm text-gray-600">
            Doorzoek onze collectie van artikelen, guides en best practices
          </p>
        </a>

        <a
          href="/cases"
          className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all group"
        >
          <Award className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-semibold text-lg mb-2">Case Studies</h4>
          <p className="text-sm text-gray-600">
            Ontdek hoe we productiebedrijven helpen groeien
          </p>
        </a>

        <a
          href="/trends"
          className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all group"
        >
          <TrendingUp className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-semibold text-lg mb-2">Trends & Insights</h4>
          <p className="text-sm text-gray-600">
            Blijf op de hoogte van ontwikkelingen in de maakindustrie
          </p>
        </a>
      </div>
    </div>
  );
}
