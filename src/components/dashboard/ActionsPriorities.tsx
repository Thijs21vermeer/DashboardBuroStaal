import { useState, useMemo } from 'react';
import { FilterState } from '../Dashboard';
import { mockPriorities } from '../../data/mockData';
import type { Priority } from '../../types';
import { Target, AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface ActionsPrioritiesProps {
  filters: FilterState;
}

export function ActionsPriorities({ filters }: ActionsPrioritiesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = Array.from(new Set(mockPriorities.map(p => p.categorie)));

  const filteredPriorities = useMemo(() => {
    return mockPriorities.filter((priority: Priority) => {
      if (selectedCategory !== 'all' && priority.categorie !== selectedCategory) return false;
      if (filters.eigenaar && priority.eigenaar !== filters.eigenaar) return false;
      return true;
    });
  }, [filters, selectedCategory]);

  const topPriorities = useMemo(() => {
    return [...mockPriorities]
      .filter((p: Priority) => p.status !== 'Completed')
      .sort((a, b) => {
        const priorityOrder = { 'Hoog': 0, 'Middel': 1, 'Laag': 2 };
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 3;
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 3;
        return aPriority - bPriority;
      })
      .slice(0, 5);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-[#7ef769] text-black';
      case 'In Progress':
        return 'bg-[#280bc4] text-white';
      case 'Open':
        return 'bg-gray-200 text-gray-800';
      case 'Blocked':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'In Progress':
        return <Clock className="w-4 h-4" />;
      case 'Blocked':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (prioriteit: string) => {
    switch (prioriteit) {
      case 'Hoog':
        return 'text-red-600 border-red-300 bg-red-50';
      case 'Midden':
        return 'text-orange-600 border-orange-300 bg-orange-50';
      case 'Laag':
        return 'text-gray-600 border-gray-300 bg-gray-50';
      default:
        return 'text-gray-600 border-gray-300 bg-gray-50';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Proces': 'bg-[#280bc4] text-white',
      'Klant': 'bg-purple-500 text-white',
      'Systeem': 'bg-orange-500 text-white',
      'Team': 'bg-blue-500 text-white',
    };
    return colors[category] || 'bg-gray-500 text-white';
  };

  return (
    <div className="space-y-6">
      {/* Top Priorities Widget */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-2 border-red-200 p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
          <Target className="w-5 h-5 text-red-600" />
          Top 5 prioriteiten deze maand
        </h3>
        <div className="space-y-3">
          {topPriorities.map((priority, index) => (
            <div 
              key={priority.id}
              className="flex items-start gap-4 bg-white rounded-lg p-4 shadow-sm border border-red-100"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{priority.titel}</h4>
                <div className="text-sm text-gray-600 mb-2">
                  {priority.eigenaar} • Deadline: {priority.deadline ? new Date(priority.deadline).toLocaleDateString('nl-NL') : 'Geen deadline'}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(priority.categorie)}`}>
                    {priority.categorie}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(priority.status)}`}>
                    {priority.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-4 items-center">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#280bc4]"
        >
          <option value="all">Alle categorieën</option>
          {categories.map(category => (
            <option key={category} value={String(category)}>{String(category)}</option>
          ))}
        </select>
      </div>

      {/* Priority Board - Kanban Style */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Open */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            Open ({filteredPriorities.filter((p: Priority) => p.status === 'Open').length})
          </h3>
          <div className="space-y-3">
            {filteredPriorities
              .filter((p: Priority) => p.status === 'Open')
              .map((priority: Priority) => (
                <div 
                  key={priority.id}
                  className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${getPriorityColor(priority.priority)}`}
                >
                  <h4 className="font-medium text-gray-900 mb-2">{priority.titel}</h4>
                  <div className="text-sm text-gray-600 mb-3">
                    <div className="mb-1">Project: {priority.project}</div>
                    <div>Eigenaar: {priority.eigenaar}</div>
                    <div className="flex items-center gap-1 text-gray-500 mt-2">
                      <Clock className="w-3 h-3" />
                      {priority.deadline ? new Date(priority.deadline).toLocaleDateString('nl-NL') : 'Geen deadline'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(priority.categorie)}`}>
                      {priority.categorie}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#280bc4]"></div>
            In Progress ({filteredPriorities.filter((p: Priority) => p.status === 'In Progress').length})
          </h3>
          <div className="space-y-3">
            {filteredPriorities
              .filter((p: Priority) => p.status === 'In Progress')
              .map((priority: Priority) => (
                <div 
                  key={priority.id}
                  className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${getPriorityColor(priority.priority)}`}
                >
                  <h4 className="font-medium text-gray-900 mb-2">{priority.titel}</h4>
                  <div className="text-sm text-gray-600 mb-3">
                    <div className="mb-1">Project: {priority.project}</div>
                    <div>Eigenaar: {priority.eigenaar}</div>
                    <div className="flex items-center gap-1 text-gray-500 mt-2">
                      <Clock className="w-3 h-3" />
                      {priority.deadline ? new Date(priority.deadline).toLocaleDateString('nl-NL') : 'Geen deadline'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(priority.categorie)}`}>
                      {priority.categorie}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Gereed / Geblokkeerd */}
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#7ef769]"></div>
            Completed & Blocked ({filteredPriorities.filter((p: Priority) => p.status === 'Completed' || p.status === 'Blocked').length})
          </h3>
          <div className="space-y-3">
            {filteredPriorities
              .filter((p: Priority) => p.status === 'Completed' || p.status === 'Blocked')
              .map((priority: Priority) => (
                <div 
                  key={priority.id}
                  className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${getPriorityColor(priority.priority)}`}
                >
                  <h4 className="font-medium text-gray-900 mb-2">{priority.titel}</h4>
                  <div className="text-sm text-gray-600 mb-3">
                    <div className="mb-1">Project: {priority.project}</div>
                    <div>Eigenaar: {priority.eigenaar}</div>
                    <div className="flex items-center gap-1 text-gray-500 mt-2">
                      <Clock className="w-3 h-3" />
                      {priority.deadline ? new Date(priority.deadline).toLocaleDateString('nl-NL') : 'Geen deadline'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(priority.categorie)}`}>
                      {priority.categorie}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium inline-flex items-center gap-1 ${getStatusColor(priority.status)}`}>
                      {getStatusIcon(priority.status)}
                      {priority.status}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}






