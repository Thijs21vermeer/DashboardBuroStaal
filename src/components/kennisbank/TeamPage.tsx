




/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react';
import { Users, Mail, Star, Award, Briefcase, ExternalLink, Phone, Globe, Sparkles, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { baseUrl } from '../../lib/base-url';
import type { TeamMember, ExternePartner } from '../../types';

export function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [partners, setPartners] = useState<ExternePartner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [teamRes, partnersRes] = await Promise.all([
          fetch(`${baseUrl}/api/team`),
          fetch(`${baseUrl}/api/partners`)
        ]);

        if (teamRes.ok) {
          const teamData = await teamRes.json();
          setTeamMembers(teamData);
        }

        if (partnersRes.ok) {
          const partnersData = await partnersRes.json();
          setPartners(partnersData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Groepeer team: eigenaresses eerst, dan anderen
  const eigenaresses = useMemo(() => 
    teamMembers.filter(member => member.isEigenaar),
    [teamMembers]
  );
  
  const teamleden = useMemo(() => 
    teamMembers.filter(member => !member.isEigenaar),
    [teamMembers]
  );

  const alleExpertise = useMemo(() => 
    Array.from(new Set(teamMembers.flatMap(m => m.expertiseGebieden))).sort(),
    [teamMembers]
  );

  if (loading) {
    return <div className="text-center py-8">Laden...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-[#280bc4] rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Users className="w-8 h-8 text-[#7ef769]" />
          <h1 className="text-3xl font-bold">Ons Team & Expertise</h1>
        </div>
        <p className="text-white/90 text-lg mb-6">
          Overzicht van ons team en wie waar expertise in heeft
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-[#7ef769]" />
              <span className="text-sm font-medium">Team Leden</span>
            </div>
            <p className="text-3xl font-bold">{teamMembers.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-5 h-5 text-[#7ef769]" />
              <span className="text-sm font-medium">Expertisegebieden</span>
            </div>
            <p className="text-3xl font-bold">
              {alleExpertise.length}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-5 h-5 text-[#7ef769]" />
              <span className="text-sm font-medium">Disciplines</span>
            </div>
            <p className="text-3xl font-bold">{Array.from(new Set(teamMembers.map(m => m.rol))).length}</p>
          </div>
        </div>
      </div>

      {/* Eigenaresses Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-6 h-6 text-[#280bc4]" />
          <h2 className="text-2xl font-bold text-gray-900">Eigenaren</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {eigenaresses.map((member) => (
            <Card 
              key={member.id} 
              className="hover:shadow-xl transition-all border-2 border-[#7ef769] bg-gradient-to-br from-white to-[#7ef769]/5"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#280bc4] to-[#280bc4]/70 flex items-center justify-center text-white text-2xl font-bold">
                        {member.naam.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-2xl mb-1">{member.naam}</CardTitle>
                        <Badge className="bg-[#7ef769] text-black font-semibold">
                          <Award className="w-3 h-3 mr-1" />
                          {member.rol}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Bio */}
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#280bc4]">
                  <p className="text-gray-700 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {/* Expertise */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#280bc4]" />
                    Expertisegebieden
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {member.expertiseGebieden?.map((expertise, idx) => (
                      <Badge 
                        key={expertise} 
                        variant="secondary"
                        className="bg-[#280bc4]/10 text-[#280bc4] border border-[#280bc4]/20"
                      >
                        {expertise}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="pt-4 border-t">
                  <Button 
                    className="w-full bg-[#7ef769] hover:bg-[#6de659] text-black font-semibold"
                    onClick={() => window.location.href = `mailto:${member.email}`}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact opnemen
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-6 h-6 text-[#280bc4]" />
          <h2 className="text-2xl font-bold text-gray-900">Het Team</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamleden.map((member) => (
            <Card 
              key={member.id} 
              className="hover:shadow-xl transition-all border-2 hover:border-[#280bc4]"
            >
              <CardHeader className="pb-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#280bc4] to-[#280bc4]/70 flex items-center justify-center text-white text-3xl font-bold mb-3">
                    {member.naam.charAt(0)}
                  </div>
                  <CardTitle className="text-xl mb-1">{member.naam}</CardTitle>
                  <Badge variant="outline" className="font-medium">
                    {member.rol}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Bio */}
                <div className="bg-gray-50 rounded-lg p-4 min-h-[80px]">
                  <p className="text-gray-700 text-sm leading-relaxed text-center">
                    {member.bio}
                  </p>
                </div>

                {/* Expertise */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2 justify-center">
                    <Star className="w-3 h-3 text-[#280bc4]" />
                    Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertiseGebieden?.map((expertise, idx) => (
                      <Badge 
                        key={expertise} 
                        variant="secondary"
                        className="text-xs"
                      >
                        {expertise}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="pt-2">
                  <Button 
                    className="w-full bg-[#7ef769] hover:bg-[#6de659] text-black font-semibold"
                    onClick={() => window.location.href = `mailto:${member.email}`}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Expertise Overview */}
      <Card className="bg-gradient-to-br from-[#280bc4]/5 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-6 h-6 text-[#280bc4]" />
            Collectieve Expertise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {alleExpertise.map((expertise) => (
                <Badge 
                  key={expertise}
                  className="bg-[#280bc4] text-white hover:bg-[#280bc4]/90 cursor-default"
                >
                  {expertise}
                </Badge>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Externe Partners Section */}
      <div className="pt-8 border-t-2 border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <ExternalLink className="w-6 h-6 text-[#280bc4]" />
          <h2 className="text-2xl font-bold text-gray-900">Externe Partners</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Specialisten waar we mee samenwerken voor specifieke projecten
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <Card 
              key={partner.id} 
              className="hover:shadow-xl transition-all border-2 hover:border-[#280bc4]/50"
            >
              <CardHeader className="pb-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-500 flex items-center justify-center text-white text-xl font-bold">
                      {partner.naam.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{partner.naam}</CardTitle>
                      {partner.bedrijf && (
                        <p className="text-sm text-gray-500">{partner.bedrijf}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="font-medium w-fit">
                    {partner.specialisatie}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Beschrijving */}
                <div className="bg-gray-50 rounded-lg p-3 min-h-[60px]">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {partner.beschrijving}
                  </p>
                </div>

                {/* Expertise */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 mb-2">
                    Expertisegebieden
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {partner.expertiseGebieden?.map((expertise, idx) => (
                      <Badge 
                        key={expertise} 
                        variant="secondary"
                        className="text-xs"
                      >
                        {expertise}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="pt-2 space-y-2">
                  <Button 
                    className="w-full bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-[#280bc4] transition-colors text-sm"
                    onClick={() => window.location.href = `mailto:${partner.email}`}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {partner.email}
                  </Button>
                  
                  {partner.telefoon && (
                    <Button 
                      className="w-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm"
                      onClick={() => window.location.href = `tel:${partner.telefoon}`}
                    >
                      <Phone className="w-3 h-3 mr-2" />
                      {partner.telefoon}
                    </Button>
                  )}
                  
                  {partner.website && (
                    <Button 
                      className="w-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm"
                      onClick={() => window.open(`https://${partner.website}`, '_blank')}
                    >
                      <Globe className="w-3 h-3 mr-2" />
                      {partner.website}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}










