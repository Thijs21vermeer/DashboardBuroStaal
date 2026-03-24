import { FilterState } from '../Dashboard';
import { mockProjects } from '../../data/mockData';
import { CheckCircle, AlertTriangle, XCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react';

interface ProjectProgressProps {
  filters: FilterState;
}

export function ProjectProgress({ filters }: ProjectProgressProps) {
  // Filter projects based on active filters
  const filteredProjects = mockProjects.filter(project => {
    if (filters.klant && project.klant !== filters.klant) return false;
    if (filters.fase && project.fase !== filters.fase) return false;
    if (filters.eigenaar && project.eigenaar !== filters.eigenaar) return false;
    if (filters.datumStart && project.startdatum < filters.datumStart) return false;
    if (filters.datumEind && project.startdatum > filters.datumEind) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Op schema':
        return 'bg-[#7ef769] text-black';
      case 'Risico':
        return 'bg-orange-500 text-white';
      case 'Geblokkeerd':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Op schema':
        return <CheckCircle className="w-4 h-4" />;
      case 'Risico':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Geblokkeerd':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Klantnaam</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Projectnaam</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fase</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Eigenaar</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Startdatum</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Volgende mijlpaal</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project, index) => (
              <tr 
                key={project.id}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                <td className="px-6 py-5 text-sm font-medium text-gray-900">
                  {project.klant}
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm font-medium text-gray-900">{project.naam}</div>
                  {project.blokkade && (
                    <div className="flex items-start gap-2 mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{project.blokkade}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-[#280bc4]/10 to-[#280bc4]/5 text-[#280bc4] border border-[#280bc4]/20">
                    {project.fase}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#280bc4] to-[#7ef769] flex items-center justify-center text-white text-xs font-bold">
                      {project.eigenaar.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm text-gray-700">{project.eigenaar}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-gray-600">
                  {project.startdatum ? new Date(project.startdatum).toLocaleDateString('nl-NL', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }) : ''}
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm text-gray-900">{project.volgendeMijlpaal}</div>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(project.status || 'Op schema')}`}>
                    {getStatusIcon(project.status || 'Op schema')}
                    {project.status || 'Op schema'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg">Geen projecten gevonden met de huidige filters</p>
        </div>
      )}
    </div>
  );
}





