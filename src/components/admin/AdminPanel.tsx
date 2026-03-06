import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import KennisItemsManager from './KennisItemsManager';
import CasesManager from './CasesManager';
import TrendsManager from './TrendsManager';
import NewsManager from './NewsManager';
import { Settings, Database, ArrowLeft } from 'lucide-react';
import React from 'react';
import { baseUrl } from '../../lib/base-url';

export default function AdminPanel() {
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Test if we can access the API
    const testAPI = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/kennisitems`);
        if (!response.ok) {
          console.warn('API test failed, will use mock data');
        }
      } catch (err) {
        console.error('API connection error:', err);
      }
    };
    testAPI();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-600 hover:bg-red-700"
            >
              Herlaad pagina
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-[#280bc4] text-white">
        <div className="max-w-[1100px] mx-auto px-6 py-16">
          <Button
            onClick={() => window.location.href = `${baseUrl}/`}
            className="mb-6 bg-[#7ef769] hover:bg-[#6de659] text-black font-semibold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar Dashboard
          </Button>
          
          <div className="flex items-center gap-3 mb-3">
            <Settings className="w-8 h-8 text-[#7ef769]" />
            <h1 className="text-3xl font-bold">Admin Panel</h1>
          </div>
          <p className="text-white/90 text-lg">
            Beheer de kennisbank, cases, trends en nieuws
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1100px] mx-auto px-6 py-8">
        <Tabs defaultValue="kennisitems" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="kennisitems">
              <Database className="w-4 h-4 mr-2" />
              Kennisitems
            </TabsTrigger>
            <TabsTrigger value="cases">
              <Database className="w-4 h-4 mr-2" />
              Cases
            </TabsTrigger>
            <TabsTrigger value="trends">
              <Database className="w-4 h-4 mr-2" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="nieuws">
              <Database className="w-4 h-4 mr-2" />
              Nieuws
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kennisitems">
            <KennisItemsManager />
          </TabsContent>

          <TabsContent value="cases">
            <CasesManager />
          </TabsContent>

          <TabsContent value="trends">
            <TrendsManager />
          </TabsContent>

          <TabsContent value="nieuws">
            <NewsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}












