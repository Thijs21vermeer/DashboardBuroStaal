import { Users, Mail, Briefcase } from 'lucide-react';

const teamMembers = [
  { name: 'Rosanne', role: 'Eigenaar & Strategisch/Marketing', email: 'rosanne@burostaal.nl' },
  { name: 'Annemieke', role: 'Eigenaar & Financieel Beheer', email: 'annemieke@burostaal.nl' },
  { name: 'Kevin', role: 'Design Lead', email: 'kevin@burostaal.nl' },
  { name: 'Rick', role: 'Lead Developer', email: 'rick@burostaal.nl' },
  { name: 'Coen', role: 'Support & Tech', email: 'coen@burostaal.nl' },
];

const externalPartners = [
  { name: 'Jan de Vries', company: 'ContentPro', expertise: 'Copywriting & SEO Content' },
  { name: 'Sarah Johnson', company: 'Digital Boost', expertise: 'SEA & Google Ads' },
  { name: 'Mark Peters', company: 'Video Vision', expertise: 'Videoproductie' },
  { name: 'Lisa van der Berg', company: 'FotoFocus', expertise: 'Fotografie' },
  { name: 'Tom Bakker', company: 'AutoPilot', expertise: 'CRM & Marketing Automation' },
];

export default function Team() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ons Team</h2>
        <p className="text-gray-600">
          Maak kennis met de specialisten achter Buro Staal
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Externe Partners</p>
              <p className="text-2xl font-bold text-gray-900">{externalPartners.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Totaal</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamMembers.length + externalPartners.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Kernteam</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-primary transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-gray-900">{member.name}</h4>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              </div>
              <a
                href={`mailto:${member.email}`}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <Mail className="w-4 h-4" />
                {member.email}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* External Partners */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Externe Partners</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {externalPartners.map((partner) => (
            <div
              key={partner.name}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-primary transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-xl font-bold flex-shrink-0">
                  {partner.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-gray-900">{partner.name}</h4>
                  <p className="text-sm text-primary font-medium mb-1">{partner.company}</p>
                  <p className="text-sm text-gray-600">{partner.expertise}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
