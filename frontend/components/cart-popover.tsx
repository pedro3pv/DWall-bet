"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { LuShoppingCart, LuX, LuCalendar } from "react-icons/lu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Link from "next/link"
import { useEffect, useState } from "react"

export function CartPopover() {
    interface BetItem {
        id: string;
        event_id: string;
        homeTeam: string;
        awayTeam: string;
        date: string;
        amount: number;
    }

    const [betItems, setBetItems] = useState<BetItem[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    
    function updateBetItems() {
        const storedBets = localStorage.getItem('bet');
        const convertBets = (bets: any[]) => {
            return bets.map(bet => ({
            id: bet['event-id'],
            event_id: bet['event-id'],
            homeTeam: bet['time_home'],
            awayTeam: bet['time_away'],
            date: bet['data'],
            amount: Number(bet['valor'])
            }));
        };

        if (storedBets) {
            const parsedBets = JSON.parse(storedBets);
            setBetItems(convertBets(parsedBets));
        }
    }

    const fetchSaldo = async () => {
        try {
          const response = await fetch("http://localhost:8080/saldo");
          const data = await response.json();
          setTotalAmount(data.saldo);
        } catch (error) {
          console.error("Erro ao buscar saldo:", error);
        }
      };

    useEffect(() => {
        updateBetItems();
        fetchSaldo();
    }, []);

    function removeBet(id: string) {
        const storedBets = localStorage.getItem('bet');
        if (storedBets) {
            const parsedBets = JSON.parse(storedBets);
            const bets = parsedBets.filter((bet: any) => bet['event-id'] !== id);
            localStorage.setItem('bet', JSON.stringify(bets));
            setBetItems(bets);
        }
    }

    function processAllBets() {
        const storedBets = localStorage.getItem('bet');
        if (storedBets) {
            localStorage.removeItem('bet');
            setBetItems([]);
            JSON.parse(storedBets).forEach((bet: any) => {
                fetch('http://localhost:8080/criar-aposta', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "valor": Number(bet['valor']),
                        "mercado": Number(bet['mercado']),
                        "event-id": bet['event-id'],
                      }),
                });
            });
            fetchSaldo();
    }
}

    

    return (
        <Popover onOpenChange={() => {updateBetItems()}}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-4 mr-12 text-muted-foreground hover:text-foreground">
                    <LuShoppingCart size={24} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80  bg-black">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <div className="space-y-2">
                        <h4 className="font-medium leading-none text-white">Seu boletim de apostas</h4>
                        <h4 className="font-medium leading-none text-white">Saldo Disponível: {totalAmount.toFixed(2)}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Revise e gerencie suas apostas atuais.
                        </p>
                    </div>
                    <ScrollArea className="h-[300px] rounded-md border bg-black">
                        <div className="space-y-4 p-4">
                            {betItems.map((bet, index) => (
                                <div key={`${bet.id}-${index}`} className="bg-card rounded-lg shadow p-4 border border-border">
                                    <Link href={`/bet/${bet.event_id}`}>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">{bet.homeTeam}</span>
                                                    <span className="font-semibold">{bet.awayTeam}</span>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {removeBet(bet.id)}}>
                                                    <LuX className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <LuCalendar className="w-3 h-3" />
                                                    <span>{new Date(bet.date).toLocaleDateString('pt-BR')}</span>
                                                </div>
                                                <span>R$ {bet.amount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <Separator />
                    <div className="flex justify-between items-center text-white">
                        <span className="font-semibold">Total:</span>
                        <span className="font-semibold">
                            R$ {betItems.reduce((sum, bet) => sum + bet.amount, 0).toFixed(2)}
                        </span>
                    </div>
                    <Button className="w-full" onClick={() => {processAllBets()}}>Process All Bets</Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

