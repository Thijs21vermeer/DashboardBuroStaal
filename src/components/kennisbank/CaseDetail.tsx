import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ArrowLeft, Calendar, Tag, ExternalLink, Briefcase, Image as ImageIcon, Award, Building2, CheckCircle2, Clock, DollarSign, Quote, Target, TrendingUp, Users } from 'lucide-react';
import { apiClient } from '../../lib/api-client';
import { formatDate } from '../../lib/config';

interface CaseDetailProps {
  caseId: number;
  onBack: () => void;
}

export function CaseDetail({ caseId, onBack }: CaseDetailProps) {
  const [caseItem, setCaseItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCase = async () => {
      if (!caseId) return;

      try {
        const data = await apiClient.cases.getById(parseInt(caseId));
        setCaseItem(data);
      } catch (error) {
        console.error('Error loading case:', error);
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

  // Ensure tags is an array
  const tags = Array.isArray(caseItem.tags) ? caseItem.tags : [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-2 sm:mb-4 hover:bg-gray-100"
      >
        <ArrowLeft className="mr-2 w-4 h-4" />
        Terug naar cases
      </Button>

      {/* Header */}
      <div className="bg-gradient-to-r from-black to-[#280bc4] rounded-xl shadow-lg p-6 sm:p-8 text-white">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-[#7ef769]" />
          {caseItem.industrie && (
            <Badge className="bg-white/20 text-white border-white/30 text-xs sm:text-sm">
              {caseItem.industrie}
            </Badge>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">{caseItem.klant}</h1>
        <h2 className="text-xl sm:text-2xl text-white/90 mb-2 sm:mb-3">{caseItem.titel}</h2>
      </div>

      {/* Meta Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          <span className="font-medium">{caseItem.eigenaar}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <span>{caseItem.datum ? formatDate(caseItem.datum) : 'Geen datum'}</span>
        </div>
        {caseItem.projectDuur && (
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>{caseItem.projectDuur}</span>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {caseItem.roi && (
          <Card className="border-2 border-[#7ef769]/30 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col gap-4">
                <div className="w-14 h-14 bg-[#7ef769]/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-[#7ef769]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">ROI</p>
                  <p className="text-3xl font-bold text-gray-900">{caseItem.roi}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {caseItem.budget && (
          <Card className="border-2 border-[#280bc4]/30 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col gap-4">
                <div className="w-14 h-14 bg-[#280bc4]/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-[#280bc4]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Budget</p>
                  <p className="text-2xl font-bold text-gray-900">{caseItem.budget}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {caseItem.team && caseItem.team.length > 0 && (
          <Card className="border-2 border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Team</p>
                  <p className="text-2xl font-bold text-gray-900">{caseItem.team.length} leden</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Team Members */}
      {caseItem.team && caseItem.team.length > 0 && (
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              Team Leden
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {caseItem.team.map((member: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="text-base px-5 py-2 bg-blue-50 text-blue-700 font-medium"
                >
                  {member.trim()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Challenge & Solution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-red-600" />
              </div>
              Uitdaging
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
              {caseItem.uitdaging || 'Geen uitdaging beschikbaar'}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              Oplossing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
              {caseItem.oplossing || 'Geen oplossing beschikbaar'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <Card className="border-2 border-[#7ef769]/50 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-11 h-11 bg-[#7ef769] rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-black" />
            </div>
            Resultaten
          </CardTitle>
        </CardHeader>
        <CardContent>
          {caseItem.resultaten && caseItem.resultaten.length > 0 ? (
            <div className="space-y-4">
              {caseItem.resultaten.map((result: string, index: number) => (
                <div key={index} className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-[#7ef769] mt-0.5 flex-shrink-0" />
                  <p className="text-gray-800 leading-relaxed text-base font-medium">
                    {result}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700 leading-relaxed text-base">
              Geen resultaten beschikbaar
            </p>
          )}
        </CardContent>
      </Card>

      {/* Referenties */}
      {caseItem.referenties && caseItem.referenties.length > 0 && (
        <Card className="shadow-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center">
                <Quote className="w-6 h-6 text-purple-600" />
              </div>
              Referenties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {caseItem.referenties.map((referentie: string, index: number) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                  <Quote className="w-8 h-8 text-purple-300 mb-3" />
                  <p className="text-gray-800 leading-relaxed text-base italic">
                    "{referentie}"
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="text-sm px-4 py-2 font-medium"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Back Button Bottom */}
      <div className="flex justify-center pt-2">
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








