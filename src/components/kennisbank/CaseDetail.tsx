/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Building2, Award, Target, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { baseUrl } from '../../lib/base-url';

interface CaseDetailProps {
  caseId: number;
  onBack: () => void;
}

export function CaseDetail({ caseId, onBack }: CaseDetailProps) {
  const [caseItem, setCaseItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCase = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/cases/${caseId}`);
        if (response.ok) {
          const data = await response.json();
          setCaseItem(data);
        }
      } catch (error) {
        console.error('Fout bij laden case:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCase();
  }, [caseId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Terug naar cases
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#280bc4] mx-auto"></div>
            <p className="text-gray-600 mt-4">Case laden...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!caseItem) {
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Terug naar cases
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Case niet gevonden</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4 hover:bg-gray-100"
      >
        <ArrowLeft className="mr-2 w-4 h-4" />
        Terug naar cases
      </Button>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#280bc4] to-[#280bc4]/80 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-8 h-8 text-[#7ef769]" />
          <Badge className="bg-[#7ef769] text-black">
            {caseItem.sector}
          </Badge>
          <Badge className="bg-white/20 text-white border-white/30">
            {caseItem.fase}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold mb-3">{caseItem.titel}</h1>
        <div className="flex items-center gap-4 text-white/90">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            <span>{caseItem.klant}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>{new Date(caseItem.datum).toLocaleDateString('nl-NL')}</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-[#7ef769]/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#7ef769]/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#7ef769]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ROI</p>
                <p className="text-2xl font-bold text-gray-900">{caseItem.roi || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#280bc4]/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#280bc4]/10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-[#280bc4]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Project Type</p>
                <p className="text-lg font-bold text-gray-900">{caseItem.projectType}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Eigenaar</p>
                <p className="text-lg font-bold text-gray-900">{caseItem.eigenaar}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Challenge & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-red-600" />
              </div>
              Uitdaging
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {caseItem.uitdaging}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              Oplossing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {caseItem.oplossing}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <Card className="border-2 border-[#7ef769]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#7ef769] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-black" />
            </div>
            Resultaten
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
            {caseItem.resultaat}
          </p>
        </CardContent>
      </Card>

      {/* Tags */}
      {caseItem.tags && caseItem.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {caseItem.tags.map((tag: string) => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className="text-sm px-3 py-1"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Back Button Bottom */}
      <div className="flex justify-center pt-8 pb-4">
        <Button 
          onClick={onBack}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar cases
        </Button>
      </div>
    </div>
  );
}
