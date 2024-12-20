'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname } from 'next/navigation'
import { use, useEffect, useState } from "react"
import { fetchDataEvents } from "@/lib/services/event"
import { Input } from "@/components/ui/input"

export default function Component() {

  const pathname = usePathname()
  const id = pathname.split('/').pop()
  const [inputValue, setInputValue] = useState('');
  const [event, setEvent] = useState<{
    teams: { name: string, is_home: boolean, is_away: boolean }[],
    schedule: { league_name: string },
    event_date: string,
    lines: { selected_affiliate: { moneyline: { moneyline_home: string, moneyline_away: string, moneyline_draw: string }, spread: { point_spread_home: string, point_spread_away: string } } }
  }>({
    teams: [],
    schedule: { league_name: '' },
    event_date: '',
    lines: {
      selected_affiliate: {
        moneyline: { moneyline_home: '', moneyline_away: '', moneyline_draw: '' },
        spread: {
          point_spread_home: "",
          point_spread_away: ""
        }
      }
    }
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    async function fetchEvent() {
      if (id) {
        const data = await fetchDataEvents(id)
        setEvent(data)
      } else {
        console.error('ID is undefined')
      }
    }
    fetchEvent()
  }
    , [id])

  function handleBet(type: number) {
    const dados = localStorage.getItem('bet')
    if (dados && inputValue) {
      const bets = JSON.parse(dados);
      bets.push({
        "valor": inputValue,
        "mercado": type,
        "event-id": id,
        "time_home": event.teams?.find((team: { name: string, is_home: boolean }) => team.is_home)?.name,
        "time_away": event.teams?.find((team: { name: string, is_away: boolean }) => team.is_away)?.name,
        "data": new Date(event.event_date).toISOString().split('T')[0]
      });
      console.log(bets);
      localStorage.setItem('bet', JSON.stringify(bets));
    } else if (inputValue) {
      const bets = [{
        "valor": inputValue,
        "mercado": type,
        "event-id": id,
        "time_home": event.teams?.find((team: { name: string, is_home: boolean }) => team.is_home)?.name,
        "time_away": event.teams?.find((team: { name: string, is_away: boolean }) => team.is_away)?.name,
        "data": new Date(event.event_date).toISOString().split('T')[0]
      }];
      console.log(bets);
      localStorage.setItem('bet', JSON.stringify(bets));
  }
}

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      {/* Match Header */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 border border-border">
              <AvatarImage src="/placeholder.svg" alt="Flamengo" />
              <AvatarFallback>FL</AvatarFallback>
            </Avatar>
            <span className="text-2xl font-bold">{event.teams?.find((team: { name: string, is_home: boolean }) => team.is_home)?.name}</span>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">{event.schedule.league_name}</div>
            <div className="text-sm text-muted-foreground">{new Date(event.event_date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}</div>
            <div className="text-2xl font-bold">{new Date(event.event_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold">{event.teams?.find((team: { name: string, is_away: boolean }) => team.is_away)?.name}</span>
            <Avatar className="w-12 h-12 border border-border">
              <AvatarImage src="/placeholder.svg" alt="Atlético-MG" />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsContent value="all">
            {/* Betting Options */}
            <div className="space-y-4">
              {/* Final Result */}
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4 text-primary">Resultado Final (1/2)</h3>
                  {
                    event.lines.selected_affiliate.moneyline.moneyline_home == "0.0001" || event.lines.selected_affiliate.moneyline.moneyline_away == "0.0001" ? (
                      <div className="grid grid-cols-3 gap-4">
                        <Button variant="outline" className="h-16 flex flex-col justify-center border-border hover:bg-accent hover:text-accent-foreground">
                          <span>{event.teams?.find((team: { name: string, is_home: boolean }) => team.is_home)?.name}</span>
                          <span className="text-lg font-bold text-primary">Sem ODD</span>
                        </Button>
                        <Button variant="outline" className="h-16 flex flex-col justify-center border-border hover:bg-accent hover:text-accent-foreground">
                          <span>Empate</span>
                          <span className="text-lg font-bold text-primary">Sem ODD</span>
                        </Button>
                        <Button variant="outline" className="h-16 flex flex-col justify-center border-border hover:bg-accent hover:text-accent-foreground">
                          <span>{event.teams?.find((team: { name: string, is_away: boolean }) => team.is_away)?.name}</span>
                          <span className="text-lg font-bold text-primary">Sem ODD</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-4">
                        <Button variant="outline" className="h-16 flex flex-col justify-center border-border hover:bg-accent hover:text-accent-foreground" onClick={() => {handleBet(1)}}>
                          <span>{event.teams?.find((team: { name: string, is_home: boolean }) => team.is_home)?.name}</span>
                          <span className="text-lg font-bold text-primary">{Number(event.lines.selected_affiliate.moneyline.moneyline_home) > 0 ? (Number(event.lines.selected_affiliate.moneyline.moneyline_home)) / 100 : (Math.abs(Number(event.lines.selected_affiliate.moneyline.moneyline_home)) / 100) + 1}</span>
                        </Button>
                        {
                          event.lines.selected_affiliate.moneyline.moneyline_draw == "0.0001" ? (
                            <Button variant="outline" className="h-16 flex flex-col justify-center border-border hover:bg-accent hover:text-accent-foreground">
                              <span>Empate</span>
                              <span className="text-lg font-bold text-primary">Sem ODD</span>
                            </Button>
                          ) : (
                            <Button variant="outline" className="h-16 flex flex-col justify-center border-border hover:bg-accent hover:text-accent-foreground" onClick={() => {handleBet(4)}}>
                              <span>Empate</span>
                              <span className="text-lg font-bold text-primary">{Number(event.lines.selected_affiliate.moneyline.moneyline_draw) > 0 ? (Number(event.lines.selected_affiliate.moneyline.moneyline_draw)) / 100 : (Math.abs(Number(event.lines.selected_affiliate.moneyline.moneyline_draw)) / 100) + 1}</span>
                            </Button>
                          )
                        }
                        <Button variant="outline" className="h-16 flex flex-col justify-center border-border hover:bg-accent hover:text-accent-foreground" onClick={() => {handleBet(0)}}>
                          <span>{event.teams?.find((team: { name: string, is_away: boolean }) => team.is_away)?.name}</span>
                          <span className="text-lg font-bold text-primary">{Number(event.lines.selected_affiliate.moneyline.moneyline_away) > 0 ? (Number(event.lines.selected_affiliate.moneyline.moneyline_away)) / 100 : (Math.abs(Number(event.lines.selected_affiliate.moneyline.moneyline_away)) / 100) + 1}</span>
                        </Button>
                      </div>
                    )
                  }
                </CardContent>
              </Card>

              {/* Double Chance */}
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4 text-primary">Handcaps</h3>
                  {
                    (!event.lines.selected_affiliate.spread || event.lines.selected_affiliate.spread.point_spread_home == "0.0001" || event.lines.selected_affiliate.spread.point_spread_away == "0.0001") ? (
                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-16 flex flex-col justify-center border-border hover:bg-accent hover:text-accent-foreground">
                          <span>{event.teams?.find((team: { name: string, is_home: boolean }) => team.is_home)?.name}</span>
                          <span className="text-lg font-bold text-primary">Sem ODD</span>
                        </Button>
                        <Button variant="outline" className="h-16 flex flex-col justify-center border-border hover:bg-accent hover:text-accent-foreground">
                          <span>{event.teams?.find((team: { name: string, is_away: boolean }) => team.is_away)?.name}</span>
                          <span className="text-lg font-bold text-primary">Sem ODD</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-16 flex flex-col justify-center border-border hover:bg-accent hover:text-accent-foreground" onClick={() => {handleBet(2)}}>
                          <span>{event.teams?.find((team: { name: string, is_home: boolean }) => team.is_home)?.name}</span>
                          <span className="text-lg font-bold text-primary">{Number(event.lines.selected_affiliate.spread.point_spread_home) > 0 ? (Number(event.lines.selected_affiliate.spread.point_spread_home)) / 100 : (Math.abs(Number(event.lines.selected_affiliate.spread.point_spread_home)) / 100) + 1}</span>
                        </Button>
                        <Button variant="outline" className="h-16 flex flex-col justify-center border-border hover:bg-accent hover:text-accent-foreground" onClick={() => {handleBet(3)}}>
                          <span>{event.teams?.find((team: { name: string, is_away: boolean }) => team.is_away)?.name}</span>
                          <span className="text-lg font-bold text-primary">{Number(event.lines.selected_affiliate.spread.point_spread_away) > 0 ? (Number(event.lines.selected_affiliate.spread.point_spread_away)) / 100 : (Math.abs(Number(event.lines.selected_affiliate.spread.point_spread_away)) / 100) + 1}</span>
                        </Button>
                      </div>
                    )
                  }
                </CardContent>
              </Card>

              {/* Total Goals */}
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4 text-primary text-center">Valor da aposta</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <Input
                      type="number"
                      placeholder="0"
                      className="h-16 border border-border p-4 text-center"
                      value={inputValue}
                      onChange={handleInputChange}
                    />
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