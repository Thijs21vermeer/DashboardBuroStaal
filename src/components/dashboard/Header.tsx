import { FilterState } from '../Dashboard';
import { mockProjects } from '../../data/mockData';
import { Calendar, Filter, TrendingUp, AlertCircle, Activity, Search, Map, Rocket, LineChart } from 'lucide-react';

interface HeaderProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}

export function Header({ filters, setFilters }: HeaderProps) {
  // Calculate metrics
  const actieveProjecten = mockProjects.length;
  const projectenPerFase = mockProjects.reduce((acc, project) => {
    acc[project.fase] = (acc[project.fase] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const geblokkeerdeProjecten = mockProjects.filter(p => p.blokkade).length;

  // Get unique values for filters
  const klanten = [...new Set(mockProjects.map(p => p.klant))];
  const fases = [...new Set(mockProjects.map(p => p.fase))];
  const eigenaren = [...new Set(mockProjects.map(p => p.eigenaar))];

  return (
    <header className="bg-gradient-to-r from-black to-[#280bc4] text-white shadow-lg">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Title and Date */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Project Phoenix Dashboard</h1>
            <p className="text-gray-300 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Buro Staal - Realtime projectoverzicht
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-300">Laatste update</p>
            <p className="text-lg font-semibold">{new Date().toLocaleDateString('nl-NL', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Actieve Projecten */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#280bc4] to-[#280bc4]/80 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 font-medium truncate">Actieve projecten</p>
                <p className="text-2xl font-bold text-gray-900">{actieveProjecten}</p>
              </div>
            </div>
          </div>

          {/* Projecten per Fase */}
          {Object.entries(projectenPerFase).map(([fase, count]) => {
            const colors: Record<string, string> = {
              'Diagnose': 'from-blue-500 to-blue-600',
              'Roadmap': 'from-purple-500 to-purple-600',
              'Uitvoering': 'from-[#7ef769] to-green-500',
              'Optimalisatie': 'from-orange-500 to-orange-600'
            };
            
            const icons: Record<string, typeof Search> = {
              'Diagnose': Search,
              'Roadmap': Map,
              'Uitvoering': Rocket,
              'Optimalisatie': LineChart
            };
            
            const Icon = icons[fase] || Activity;
            const colorClass = colors[fase] || 'from-gray-500 to-gray-600';

            return (
              <div key={String(fase)} className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 font-medium truncate">{String(fase)}</p>
                    <p className="text-2xl font-bold text-gray-900">{Number(count)}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Geblokkeerde Projecten */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 font-medium truncate">Geblokkeerd</p>
                <p className="text-2xl font-bold text-gray-900">{geblokkeerdeProjecten}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Klant</label>
              <select
                value={filters.klant}
                onChange={(e) => setFilters({ ...filters, klant: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-[#7ef769]"
              >
                <option value="" className="text-black">Alle klanten</option>
                {klanten.map(client => (
                  <option key={String(client)} value={String(client)} className="text-black">{String(client)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Fase</label>
              <select
                value={filters.fase}
                onChange={(e) => setFilters({ ...filters, fase: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-[#7ef769]"
              >
                <option value="" className="text-black">Alle fases</option>
                {fases.map(phase => (
                  <option key={String(phase)} value={String(phase)} className="text-black">{String(phase)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Eigenaar</label>
              <select
                value={filters.eigenaar}
                onChange={(e) => setFilters({ ...filters, eigenaar: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-[#7ef769]"
              >
                <option value="" className="text-black">Alle eigenaren</option>
                {eigenaren.map(owner => (
                  <option key={String(owner)} value={String(owner)} className="text-black">{String(owner)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Van datum</label>
              <input
                type="date"
                value={filters.datumStart}
                onChange={(e) => setFilters({ ...filters, datumStart: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-[#7ef769]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tot datum</label>
              <input
                type="date"
                value={filters.datumEind}
                onChange={(e) => setFilters({ ...filters, datumEind: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-[#7ef769]"
              />
            </div>
          </div>

          {(filters.klant || filters.fase || filters.eigenaar || filters.datumStart || filters.datumEind) && (
            <button
              onClick={() => setFilters({ klant: '', fase: '', eigenaar: '', datumStart: '', datumEind: '' })}
              className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>
    </header>
  );
}





