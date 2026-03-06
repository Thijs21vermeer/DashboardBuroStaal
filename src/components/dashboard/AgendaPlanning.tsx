import { useState, useMemo } from 'react';
import { FilterState } from '../Dashboard';
import { mockAgendaItems } from '../../data/mockData';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import type { AgendaItem } from '../../types';

interface AgendaPlanningProps {
  filters: FilterState;
}

export function AgendaPlanning({ filters }: AgendaPlanningProps) {
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredItems = useMemo(() => {
    return mockAgendaItems.filter((item: AgendaItem) => {
      const itemDate = new Date(item.startdatum);
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      if (itemDate < now || itemDate > weekFromNow) return false;
      if (selectedType !== 'all' && item.type !== selectedType) return false;
      if (filters.eigenaar && item.eigenaar !== filters.eigenaar) return false;
      
      return true;
    });
  }, [filters, selectedType]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: AgendaItem, b: AgendaItem) => {
      return new Date(a.startdatum).getTime() - new Date(b.startdatum).getTime();
    });
  }, [filteredItems]);

  const upcomingDeadlines = useMemo(() => {
    return mockAgendaItems
      .filter((item: AgendaItem) => {
        const itemDate = new Date(item.startdatum);
        const now = new Date();
        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        return item.type === 'Deadline' && itemDate >= now && itemDate <= threeDaysFromNow;
      })
      .sort((a: AgendaItem, b: AgendaItem) => new Date(a.startdatum).getTime() - new Date(b.startdatum).getTime());
  }, []);

  const uniqueEigenaren = Array.from(new Set(mockAgendaItems.map(i => i.eigenaar)));

  const getNext7Days = () => {
    const today = new Date();
    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);
    
    return mockAgendaItems.filter(item => {
      const itemDate = new Date(item.startdatum);
      return itemDate >= today && itemDate <= next7Days;
    }).sort((a, b) => new Date(a.startdatum).getTime() - new Date(b.startdatum).getTime());
  };

  const upcoming = getNext7Days();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Milestone':
        return 'bg-[#7ef769] text-black';
      case 'Vergadering':
        return 'bg-[#280bc4] text-white';
      case 'Deadline':
        return 'bg-orange-500 text-white';
      case 'Event':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upcoming Widget */}
      <div className="bg-gradient-to-r from-[#7ef769]/10 to-[#7ef769]/5 rounded-xl border-2 border-[#7ef769]/20 p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
          <Clock className="w-5 h-5 text-[#7ef769]" />
          Komende 7 dagen
        </h3>
        {upcoming.length === 0 ? (
          <p className="text-gray-500">Geen items gepland in de komende 7 dagen</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map(item => (
              <div key={item.id} className="flex items-start gap-4 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="text-center min-w-[60px] bg-gray-50 rounded-lg p-2">
                  <div className="text-2xl font-bold text-gray-900">{new Date(item.startdatum).getDate()}</div>
                  <div className="text-xs text-gray-600">
                    {new Date(item.startdatum).toLocaleDateString('nl-NL', { month: 'short' })}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1 text-gray-900">{item.titel}</div>
                  {item.project && <div className="text-sm text-gray-600 mb-2">{item.project}</div>}
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {item.eigenaar}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#280bc4]"
          >
            <option value="all">Alle types</option>
            <option value="Vergadering">Vergaderingen</option>
            <option value="Deadline">Deadlines</option>
            <option value="Event">Events</option>
            <option value="Milestone">Milestones</option>
          </select>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
          <Calendar className="w-5 h-5 text-[#280bc4]" />
          Agenda overzicht
        </h3>
        <div className="space-y-4">
          {sortedItems.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Geen agenda items gevonden</p>
          ) : (
            sortedItems.map(item => (
              <div 
                key={item.id}
                className="flex items-center gap-4 p-4 bg-white hover:shadow-md rounded-lg border border-gray-200 cursor-pointer transition-all"
              >
                <div className="text-center min-w-[80px] bg-gradient-to-br from-[#280bc4] to-[#280bc4]/80 text-white rounded-lg p-3">
                  <div className="text-xl font-bold">{new Date(item.startdatum).getDate()}</div>
                  <div className="text-xs opacity-90">
                    {new Date(item.startdatum).toLocaleDateString('nl-NL', { month: 'short' })}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1 text-gray-900">{item.titel}</div>
                  <div className="text-sm text-gray-600 mb-2">
                    {item.project}{item.fase ? ` • ${item.fase}` : ''}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {item.eigenaar}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}



