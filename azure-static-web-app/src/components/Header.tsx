import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard Overzicht',
  '/kennisbank': 'Kennisbank',
  '/cases': 'Case Studies',
  '/trends': 'Trends & Insights',
  '/team': 'Team & Expertise',
  '/nieuws': 'Intern Nieuws',
  '/admin': 'Admin Panel',
};

export default function Header() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Buro Staal Kennisbank';

  return (
    <header className="bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg">
      <div className="px-8 py-16">
        <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-8 border border-white/20">
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          <p className="text-blue-100">
            Jouw groeiparter in de maakindustrie
          </p>
        </div>
      </div>
    </header>
  );
}
