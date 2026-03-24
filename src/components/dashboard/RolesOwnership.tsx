
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from 'react';
import { phaseMatrix, mockActions } from '../../data/mockData';
import { Users, CheckCircle2, Activity } from 'lucide-react';

export function RolesOwnership() {
  const [selectedTab, setSelectedTab] = useState<'matrix' | 'actions'>('matrix');
  const [selectedPerson, setSelectedPerson] = useState<string>('all');

  const uniquePersons = Array.from(new Set(mockActions.map(a => a.verantwoordelijke)));

  const filteredActions = selectedPerson === 'all' 
    ? mockActions 
    : mockActions.filter(a => a.verantwoordelijke === selectedPerson);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Gereed':
        return 'bg-[#7ef769] text-black';
      case 'Bezig':
        return 'bg-[#280bc4] text-white';
      case 'Open':
        return 'bg-gray-200 text-gray-800';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (prioriteit: string) => {
    switch (prioriteit) {
      case 'Hoog':
        return 'bg-red-500 text-white';
      case 'Midden':
        return 'bg-orange-500 text-white';
      case 'Laag':
        return 'bg-gray-300 text-gray-800';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const actionsByPerson = uniquePersons.map(person => ({
    person,
    actions: mockActions.filter(a => a.verantwoordelijke === person),
    open: mockActions.filter(a => a.verantwoordelijke === person && a.status === 'Open').length,
    bezig: mockActions.filter(a => a.verantwoordelijke === person && a.status === 'Bezig').length,
  }));

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setSelectedTab('matrix')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            selectedTab === 'matrix'
              ? 'border-[#280bc4] text-[#280bc4]'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Fase Matrix
        </button>
        <button
          onClick={() => setSelectedTab('actions')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            selectedTab === 'actions'
              ? 'border-[#280bc4] text-[#280bc4]'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Open Acties per Persoon
        </button>
      </div>

      {/* Fase Matrix */}
      {selectedTab === 'matrix' && (
        <div className="space-y-4">
          {Object.entries(phaseMatrix).map(([phaseName, phase]) => (
            <div 
              key={phase.fase}
              className="bg-gray-50 rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-gray-900">
                    {phase.fase}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Primaire eigenaar: <strong className="text-gray-900">{phase.primaireEigenaar}</strong></span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Betrokken rollen</h4>
                  <div className="flex flex-wrap gap-2">
                    {phase.betrokkenRollen.map(role => (
                      <span key={role} className="px-3 py-1 rounded-full text-sm font-medium bg-[#280bc4] text-white">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Verantwoordelijkheden</h4>
                  <ul className="space-y-2">
                    {phase.verantwoordelijkheden.map((verantwoordelijkheid, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-[#7ef769] mt-0.5 flex-shrink-0" />
                        <span>{verantwoordelijkheid}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Open Acties per Persoon */}
      {selectedTab === 'actions' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {actionsByPerson.map(({ person, actions, open, bezig }) => (
              <div 
                key={person}
                onClick={() => setSelectedPerson(selectedPerson === person ? 'all' : person)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedPerson === person
                    ? 'bg-[#280bc4] text-white border-[#280bc4] shadow-lg'
                    : 'bg-white border-gray-200 hover:shadow-md text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4" />
                  <div className="font-medium">{person}</div>
                </div>
                <div className="text-2xl font-bold mb-1">{actions.length}</div>
                <div className={`text-xs ${selectedPerson === person ? 'text-white/80' : 'text-gray-600'}`}>
                  {open} open • {bezig} bezig
                </div>
              </div>
            ))}
          </div>

          {/* Actions Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Taak</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Project</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Verantwoordelijke</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Deadline</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Prioriteit</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-500 py-8">
                        Geen acties gevonden
                      </td>
                    </tr>
                  ) : (
                    filteredActions.map((action) => (
                      <tr 
                        key={action.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium text-gray-900">{action.taak}</td>
                        <td className="py-4 px-4 text-gray-600">{action.project}</td>
                        <td className="py-4 px-4 text-gray-700">{action.verantwoordelijke}</td>
                        <td className="py-4 px-4 text-gray-600">
                          {action.deadline ? new Date(action.deadline).toLocaleDateString('nl-NL') : 'Geen deadline'}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(action.prioriteit || "Normaal")}`}>
                            {action.prioriteit}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(action.status)}`}>
                            {action.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


