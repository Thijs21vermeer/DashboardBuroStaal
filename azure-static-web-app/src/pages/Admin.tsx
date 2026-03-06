import { ArrowLeft, Database, Activity, HardDrive } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Admin() {
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-black font-semibold rounded-lg hover:bg-accent/90 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Terug naar Dashboard
      </Link>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel</h2>
        <p className="text-gray-600">
          Beheer je kennisbank content en instellingen
        </p>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Database className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Database</p>
              <p className="text-lg font-bold text-green-600">Online</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Azure SQL Database</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">API Status</p>
              <p className="text-lg font-bold text-blue-600">Active</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Azure Functions</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <HardDrive className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Storage</p>
              <p className="text-lg font-bold text-purple-600">OK</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Azure Blob Storage</p>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/api/kennisitems"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all"
          >
            <h4 className="font-semibold text-gray-900 mb-1">Kennisitems API</h4>
            <p className="text-sm text-gray-600">Bekijk kennisitems endpoint</p>
          </a>

          <a
            href="/api/cases"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all"
          >
            <h4 className="font-semibold text-gray-900 mb-1">Cases API</h4>
            <p className="text-sm text-gray-600">Bekijk cases endpoint</p>
          </a>

          <a
            href="/api/trends"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all"
          >
            <h4 className="font-semibold text-gray-900 mb-1">Trends API</h4>
            <p className="text-sm text-gray-600">Bekijk trends endpoint</p>
          </a>

          <a
            href="/api/nieuws"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all"
          >
            <h4 className="font-semibold text-gray-900 mb-1">Nieuws API</h4>
            <p className="text-sm text-gray-600">Bekijk nieuws endpoint</p>
          </a>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Deployment Info</h3>
        <p className="text-sm text-blue-800 mb-3">
          Deze applicatie draait volledig op Azure:
        </p>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Frontend: Azure Static Web Apps</li>
          <li>Backend: Azure Functions</li>
          <li>Database: Azure SQL Database</li>
          <li>CI/CD: GitHub Actions</li>
        </ul>
      </div>
    </div>
  );
}
