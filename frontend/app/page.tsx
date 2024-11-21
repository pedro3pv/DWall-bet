"use client"
import { CalendarIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams } from 'next/navigation'
import { fetchDataEventsInSchedule } from '@/lib/services/matches'
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode, useState, useEffect } from 'react'

export default function Component() { 
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [matches, setMatches] = useState([])

  useEffect(() => {
    async function fetchMatches() {
      const data = await fetchDataEventsInSchedule(Number(id))
      setMatches(data)
    }
    fetchMatches()
  }, [id])

  return (
    <div className="dark min-h-screen bg-background text-foreground p-4">
      <video className="w-full h-60 object-cover" controls preload="none" autoPlay muted loop>
        <source src="DWall.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Card className="w-full max-w-3xl mx-auto mt-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Próximos Jogos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {matches.map((match: { id: Key | null | undefined; homeTeam: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; awayTeam: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; date: string | number | Date }) => (
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