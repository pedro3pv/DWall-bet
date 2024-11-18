'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Swords, Globe, Award, Beer, Snowflake, Flag } from 'lucide-react'

export default function Component() {
  return (
    <div className="min-h-screen bg-background text-foreground dark">
      {/* Sports Navigation */}
      <nav className="bg-card p-2 border-b border-border">
        <ul className="flex space-x-2 overflow-x-auto">
          {[
            { icon: Flag, label: 'NFL' },
            { icon: Flag, label: 'NBA' },
            { icon: Trophy, label: 'LaLiga' },
            { icon: Swords, label: 'UFC' },
            { icon: Globe, label: 'FIFA' },
            { icon: Award, label: 'Premier League' },
            { icon: Beer, label: 'MLB' },
            { icon: Snowflake, label: 'NHL' },
            { icon: Flag, label: 'F1' },
            { icon: Flag, label: 'Tennis' },
          ].map(({ icon: Icon, label }) => (
            <li key={label}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Match Header */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 border border-border">
              <AvatarImage src="/placeholder.svg" alt="Flamengo" />
              <AvatarFallback>FL</AvatarFallback>
            </Avatar>
            <span className="text-2xl font-bold">Flamengo</span>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Brasileirão Série A</div>
            <div className="text-sm text-muted-foreground">qua 13 nov</div>
            <div className="text-2xl font-bold">20:00</div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold">Atlético-MG</span>
            <Avatar className="w-12 h-12 border border-border">
              <AvatarImage src="/placeholder.svg" alt="Atlético-MG" />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid w-full grid-cols-5 bg-card">
            <TabsTrigger value="all">Tudo</TabsTrigger>
            <TabsTrigger value="superodds">SuperOdds</TabsTrigger>
            <TabsTrigger value="match">Partida</TabsTrigger>
            <TabsTrigger value="handicaps">Handicaps</TabsTrigger>
            <TabsTrigger value="goals">Gols</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {/* Betting Options */}
            <div className="space-y-4">
              {/* Final Result */}
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4 text-primary">Resultado Final</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Button variant="outline" className="h-16 flex flex-col justify-center border-border hover:bg-accent hover:text-accent-foreground">
                      <span>Flamengo</span>
                      <span className="text-lg font-bold text-primary">1.90</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex flex-col justify-center border-border hover:bg-accent hover:text-accent-foreground">
                      <span>Empate</span>
                      <span className="text-lg font-bold text-primary">3.30</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex flex-col justify-center border-border hover:bg-accent hover:text-accent-foreground">
                      <span>Atlético-MG</span>
                      <span className="text-lg font-bold text-primary">4.20</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Double Chance */}
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4 text-primary">Dupla Chance</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Button variant="outline" className="h-16 flex flex-col justify-center border-border hover:bg-accent hover:text-accent-foreground">
                      <span>1 ou empate</span>
                      <span className="text-lg font-bold text-primary">1.22</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex flex-col justify-center border-border hover:bg-accent hover:text-accent-foreground">
                      <span>12</span>
                      <span className="text-lg font-bold text-primary">1.32</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex flex-col justify-center border-border hover:bg-accent hover:text-accent-foreground">
                      <span>2 ou empate</span>
                      <span className="text-lg font-bold text-primary">1.85</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Total Goals */}
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4 text-primary">Total de gols</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-16 flex flex-col justify-center border-border hover:bg-accent hover:text-accent-foreground">
                      <span>Mais de (0.5)</span>
                      <span className="text-lg font-bold text-primary">1.06</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex flex-col justify-center border-border hover:bg-accent hover:text-accent-foreground">
                      <span>Menos de (0.5)</span>
                      <span className="text-lg font-bold text-primary">8.00</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          {/* Add other TabsContent for superodds, match, handicaps, and goals if needed */}
        </Tabs>
      </div>
    </div>
  )
}