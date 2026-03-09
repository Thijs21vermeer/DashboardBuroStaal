



import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Users, UserPlus, Building2, Mail, Phone, Globe, Trash2, Edit, Save, X, Plus } from 'lucide-react';
import { baseUrl } from '../../lib/base-url';

interface TeamMember {
  id: number;
  naam: string;
  rol: string;
  email: string;
  bio: string;
  expertiseGebieden: string[];
  isEigenaar: boolean;
  volgorde: number;
}

interface Partner {
  id: number;
  naam: string;
  bedrijf: string | null;
  specialisatie: string;
  email: string;
  telefoon: string | null;
  website: string | null;
  beschrijving: string;
  expertiseGebieden: string[];
  volgorde: number;
}

export default function TeamManager() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [showMemberDialog, setShowMemberDialog] = useState(false);
  const [showPartnerDialog, setShowPartnerDialog] = useState(false);
  const [newExpertise, setNewExpertise] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [membersRes, partnersRes] = await Promise.all([
        fetch(`${baseUrl}/api/team`),
        fetch(`${baseUrl}/api/partners`)
      ]);

      if (membersRes.ok) {
        const membersData = await membersRes.json();
        setTeamMembers(membersData);
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

  // Team Member Functions
  const handleAddMember = () => {
    setEditingMember({
      id: 0,
      naam: '',
      rol: '',
      email: '',
      bio: '',
      expertiseGebieden: [],
      isEigenaar: false,
      volgorde: teamMembers.length + 1
    });
    setShowMemberDialog(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember({ ...member });
    setShowMemberDialog(true);
  };

  const handleSaveMember = async () => {
    if (!editingMember) return;

    try {
      const url = editingMember.id === 0
        ? `${baseUrl}/api/team`
        : `${baseUrl}/api/team/${editingMember.id}`;
      
      const method = editingMember.id === 0 ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMember)
      });

      if (response.ok) {
        setShowMemberDialog(false);
        setEditingMember(null);
        loadData();
      }
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (!confirm('Weet je zeker dat je dit teamlid wilt verwijderen?')) return;

    try {
      const response = await fetch(`${baseUrl}/api/team/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  const handleAddMemberExpertise = () => {
    if (!editingMember || !newExpertise.trim()) return;
    
    setEditingMember({
      ...editingMember,
      expertiseGebieden: [...editingMember.expertiseGebieden, newExpertise.trim()]
    });
    setNewExpertise('');
  };

  const handleRemoveMemberExpertise = (expertise: string) => {
    if (!editingMember) return;
    
    setEditingMember({
      ...editingMember,
      expertiseGebieden: editingMember.expertiseGebieden.filter(e => e !== expertise)
    });
  };

  // Partner Functions
  const handleAddPartner = () => {
    setEditingPartner({
      id: 0,
      naam: '',
      bedrijf: '',
      specialisatie: '',
      email: '',
      telefoon: '',
      website: '',
      beschrijving: '',
      expertiseGebieden: [],
      volgorde: partners.length + 1
    });
    setShowPartnerDialog(true);
  };

  const handleEditPartner = (partner: Partner) => {
    setEditingPartner({ ...partner });
    setShowPartnerDialog(true);
  };

  const handleSavePartner = async () => {
    if (!editingPartner) return;

    try {
      const url = editingPartner.id === 0
        ? `${baseUrl}/api/partners`
        : `${baseUrl}/api/partners/${editingPartner.id}`;
      
      const method = editingPartner.id === 0 ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPartner)
      });

      if (response.ok) {
        setShowPartnerDialog(false);
        setEditingPartner(null);
        loadData();
      }
    } catch (error) {
      console.error('Error saving partner:', error);
    }
  };

  const handleDeletePartner = async (id: number) => {
    if (!confirm('Weet je zeker dat je deze partner wilt verwijderen?')) return;

    try {
      const response = await fetch(`${baseUrl}/api/partners/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Error deleting partner:', error);
    }
  };

  const handleAddPartnerExpertise = () => {
    if (!editingPartner || !newExpertise.trim()) return;
    
    setEditingPartner({
      ...editingPartner,
      expertiseGebieden: [...editingPartner.expertiseGebieden, newExpertise.trim()]
    });
    setNewExpertise('');
  };

  const handleRemovePartnerExpertise = (expertise: string) => {
    if (!editingPartner) return;
    
    setEditingPartner({
      ...editingPartner,
      expertiseGebieden: editingPartner.expertiseGebieden.filter(e => e !== expertise)
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Laden...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="team" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="team">
            <Users className="mr-2 h-4 w-4" />
            Teamleden ({teamMembers.length})
          </TabsTrigger>
          <TabsTrigger value="partners">
            <Building2 className="mr-2 h-4 w-4" />
            Externe Partners ({partners.length})
          </TabsTrigger>
        </TabsList>

        {/* Team Members Tab */}
        <TabsContent value="team" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Teamleden</h3>
              <p className="text-sm text-muted-foreground">
                Beheer de teamleden van Buro Staal
              </p>
            </div>
            <Button onClick={handleAddMember} className="bg-[#7ef769] text-black hover:bg-[#7ef769]/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Teamlid Toevoegen
            </Button>
          </div>

          <div className="grid gap-4">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="pt-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">{member.naam}</h4>
                        {member.isEigenaar && (
                          <Badge variant="secondary">Eigenaar</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{member.rol}</p>
                      <p className="text-sm flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4" />
                        {member.email}
                      </p>
                      <p className="text-sm mb-3">{member.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {member.expertiseGebieden.map((expertise, idx) => (
                          <Badge key={idx} variant="outline">{expertise}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditMember(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Partners Tab */}
        <TabsContent value="partners" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Externe Partners</h3>
              <p className="text-sm text-muted-foreground">
                Beheer de externe partners waarmee Buro Staal samenwerkt
              </p>
            </div>
            <Button onClick={handleAddPartner} className="bg-[#7ef769] text-black hover:bg-[#7ef769]/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Partner Toevoegen
            </Button>
          </div>

          <div className="grid gap-4">
            {partners.map((partner) => (
              <Card key={partner.id}>
                <CardContent className="pt-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{partner.naam}</h4>
                      {partner.bedrijf && (
                        <p className="text-sm text-muted-foreground mb-2">{partner.bedrijf}</p>
                      )}
                      <p className="text-sm font-medium mb-2">{partner.specialisatie}</p>
                      <div className="space-y-1 mb-3">
                        <p className="text-sm flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {partner.email}
                        </p>
                        {partner.telefoon && (
                          <p className="text-sm flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {partner.telefoon}
                          </p>
                        )}
                        {partner.website && (
                          <p className="text-sm flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            {partner.website}
                          </p>
                        )}
                      </div>
                      <p className="text-sm mb-3">{partner.beschrijving}</p>
                      <div className="flex flex-wrap gap-2">
                        {partner.expertiseGebieden.map((expertise, idx) => (
                          <Badge key={idx} variant="outline">{expertise}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditPartner(partner)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeletePartner(partner.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Team Member Dialog */}
      <Dialog open={showMemberDialog} onOpenChange={setShowMemberDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMember?.id === 0 ? 'Teamlid Toevoegen' : 'Teamlid Bewerken'}
            </DialogTitle>
            <DialogDescription>
              Vul de gegevens van het teamlid in
            </DialogDescription>
          </DialogHeader>

          {editingMember && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="member-naam">Naam *</Label>
                  <Input
                    id="member-naam"
                    value={editingMember.naam}
                    onChange={(e) => setEditingMember({ ...editingMember, naam: e.target.value })}
                    placeholder="Naam"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-rol">Rol *</Label>
                  <Input
                    id="member-rol"
                    value={editingMember.rol}
                    onChange={(e) => setEditingMember({ ...editingMember, rol: e.target.value })}
                    placeholder="Rol"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="member-email">Email *</Label>
                <Input
                  id="member-email"
                  type="email"
                  value={editingMember.email}
                  onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                  placeholder="email@burostaal.nl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="member-bio">Bio</Label>
                <Textarea
                  id="member-bio"
                  value={editingMember.bio}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  placeholder="Korte beschrijving..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Expertise Gebieden</Label>
                <div className="flex gap-2">
                  <Input
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    placeholder="Voeg expertise toe..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddMemberExpertise();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddMemberExpertise}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingMember.expertiseGebieden.map((expertise, idx) => (
                    <Badge key={idx} variant="secondary" className="cursor-pointer">
                      {expertise}
                      <X
                        className="ml-2 h-3 w-3"
                        onClick={() => handleRemoveMemberExpertise(expertise)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="member-eigenaar"
                  checked={editingMember.isEigenaar}
                  onCheckedChange={(checked) => setEditingMember({ ...editingMember, isEigenaar: checked })}
                />
                <Label htmlFor="member-eigenaar">Eigenaar</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="member-volgorde">Volgorde</Label>
                <Input
                  id="member-volgorde"
                  type="number"
                  value={editingMember.volgorde}
                  onChange={(e) => setEditingMember({ ...editingMember, volgorde: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMemberDialog(false)}>
              Annuleren
            </Button>
            <Button onClick={handleSaveMember}>
              <Save className="mr-2 h-4 w-4" />
              Opslaan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Partner Dialog */}
      <Dialog open={showPartnerDialog} onOpenChange={setShowPartnerDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPartner?.id === 0 ? 'Partner Toevoegen' : 'Partner Bewerken'}
            </DialogTitle>
            <DialogDescription>
              Vul de gegevens van de externe partner in
            </DialogDescription>
          </DialogHeader>

          {editingPartner && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="partner-naam">Naam *</Label>
                  <Input
                    id="partner-naam"
                    value={editingPartner.naam}
                    onChange={(e) => setEditingPartner({ ...editingPartner, naam: e.target.value })}
                    placeholder="Naam"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partner-bedrijf">Bedrijf</Label>
                  <Input
                    id="partner-bedrijf"
                    value={editingPartner.bedrijf || ''}
                    onChange={(e) => setEditingPartner({ ...editingPartner, bedrijf: e.target.value })}
                    placeholder="Bedrijfsnaam"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="partner-specialisatie">Specialisatie *</Label>
                <Input
                  id="partner-specialisatie"
                  value={editingPartner.specialisatie}
                  onChange={(e) => setEditingPartner({ ...editingPartner, specialisatie: e.target.value })}
                  placeholder="Specialisatie"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="partner-email">Email *</Label>
                  <Input
                    id="partner-email"
                    type="email"
                    value={editingPartner.email}
                    onChange={(e) => setEditingPartner({ ...editingPartner, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partner-telefoon">Telefoon</Label>
                  <Input
                    id="partner-telefoon"
                    value={editingPartner.telefoon || ''}
                    onChange={(e) => setEditingPartner({ ...editingPartner, telefoon: e.target.value })}
                    placeholder="06-12345678"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="partner-website">Website</Label>
                <Input
                  id="partner-website"
                  value={editingPartner.website || ''}
                  onChange={(e) => setEditingPartner({ ...editingPartner, website: e.target.value })}
                  placeholder="example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partner-beschrijving">Beschrijving</Label>
                <Textarea
                  id="partner-beschrijving"
                  value={editingPartner.beschrijving}
                  onChange={(e) => setEditingPartner({ ...editingPartner, beschrijving: e.target.value })}
                  placeholder="Korte beschrijving..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Expertise Gebieden</Label>
                <div className="flex gap-2">
                  <Input
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    placeholder="Voeg expertise toe..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddPartnerExpertise();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddPartnerExpertise}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingPartner.expertiseGebieden.map((expertise, idx) => (
                    <Badge key={idx} variant="secondary" className="cursor-pointer">
                      {expertise}
                      <X
                        className="ml-2 h-3 w-3"
                        onClick={() => handleRemovePartnerExpertise(expertise)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="partner-volgorde">Volgorde</Label>
                <Input
                  id="partner-volgorde"
                  type="number"
                  value={editingPartner.volgorde}
                  onChange={(e) => setEditingPartner({ ...editingPartner, volgorde: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPartnerDialog(false)}>
              Annuleren
            </Button>
            <Button onClick={handleSavePartner}>
              <Save className="mr-2 h-4 w-4" />
              Opslaan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}




