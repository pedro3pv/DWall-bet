import { Award, Beer, CalendarIcon, Flag, Globe, Snowflake, Swords, Trophy } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'

const matches = [
  { id: 1, homeTeam: "Barcelona", awayTeam: "Real Madrid", date: "2024-03-15" },
  { id: 2, homeTeam: "Manchester United", awayTeam: "Liverpool", date: "2024-03-20" },
  { id: 3, homeTeam: "Bayern Munich", awayTeam: "Borussia Dortmund", date: "2024-03-25" },
  { id: 4, homeTeam: "Paris Saint-Germain", awayTeam: "Marseille", date: "2024-03-30" },
  { id: 5, homeTeam: "Juventus", awayTeam: "AC Milan", date: "2024-04-05" },
]

export default function Component() {
  return (
    <div className="dark min-h-screen bg-background text-foreground p-4">
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
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Próximos Jogos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {matches.map((match) => (
              <li key={match.id} className="bg-card rounded-lg shadow p-4 border border-border">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
                    <span className="font-semibold">{match.homeTeam}</span>
                    <span className="text-muted-foreground hidden sm:inline">vs</span>
                    <span className="font-semibold">{match.awayTeam}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(match.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}