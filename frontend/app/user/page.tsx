"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Team {
  name: string;
}

interface Moneyline {
  moneyline_home: string;
  moneyline_away: string;
}

interface Line {
  moneyline?: Moneyline;
}

interface EventDetails {
  teams: Team[];
  event_date: string;
  lines: Line[];
}

interface Aposta {
  status: string;
  "event-details": EventDetails;
  valor: number;
  mercado: number;
}

const mercados: { [key: number]: string } = {
  0: "Vitória do Time de Fora",
  1: "Vitória do Time da Casa",
  2: "Handicap do Time da Casa",
  3: "Handicap do Time de Fora",
};

export default function Component() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deposito, setDeposito] = useState("");
  const [apostas, setApostas] = useState<Aposta[]>([]);
  const [saldo, setSaldo] = useState<number | null>(null);

  const fetchApostas = async () => {
    try {
      const response = await fetch("http://localhost:8080/listar-apostas");
      const data = await response.json();
      if (data.apostas) {
        setApostas(data.apostas);
      }
    } catch (error) {
      console.error("Erro ao buscar apostas:", error);
    }
  };

  const fetchSaldo = async () => {
    try {
      const response = await fetch("http://localhost:8080/saldo");
      const data = await response.json();
      setSaldo(data.saldo);
    } catch (error) {
      console.error("Erro ao buscar saldo:", error);
    }
  };

  const realizarDeposito = async () => {
    try {
      const response = await fetch("http://localhost:8080/deposito", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valor: parseFloat(deposito) }),
      });

      if (response.ok) {
        fetchSaldo();
      } else {
        console.error("Erro ao realizar depósito:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao realizar depósito:", error);
    }
  };

  useEffect(() => {
    fetchApostas();
    fetchSaldo();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 relative">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400">pedroarg_</p>
          </div>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8"
            onClick={() => setIsModalOpen(true)}
          >
            Depositar
          </Button>
        </div>

        <div>
          <p className="text-gray-400">Saldo Disponível</p>
          <p className="text-2xl font-bold">
            {saldo !== null ? `R$${saldo.toFixed(2)}` : "Carregando..."}
          </p>
        </div>

        <div className="space-y-4">
          {apostas.map((aposta, index) => (
            <Card key={index} className="bg-zinc-900 border-gray-800 p-4">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">
                    {aposta["event-details"].teams[0].name} vs{" "}
                    {aposta["event-details"].teams[1].name}
                  </h2>
                  <span
                    className={`text-sm font-bold px-2 py-1 rounded 
                      ${aposta.status === "vencido"
                        ? "bg-green-600 text-white"
                        : aposta.status === "perdido"
                          ? "bg-red-600 text-white"
                          : "bg-yellow-600 text-white"
                      }`}
                  >
                    {aposta.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  {new Date(aposta["event-details"].event_date).toLocaleString()}
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>
                      Mercado:{" "}
                      {mercados[aposta.mercado as keyof typeof mercados] ||
                        "Desconhecido"}
                    </span>
                    <span>Valor Apostado: R${aposta.valor}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-zinc-900 text-white p-6 rounded-lg space-y-4 w-80">
            <h2 className="text-xl font-bold">Digite o valor do depósito</h2>
            <input
              type="number"
              value={deposito}
              onChange={(e) => {
                const valor = e.target.value;
                if (parseFloat(valor) >= 0 || valor === "") {
                  setDeposito(valor);
                }
              }}
              className="w-full p-2 rounded bg-zinc-800 text-white outline-none border border-zinc-700 focus:ring focus:ring-green-600"
              placeholder="Ex: 100.00"
            />
            <div className="flex justify-end space-x-4">
              <Button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={() => {
                  setIsModalOpen(false);
                  setDeposito("");
                }}
              >
                Cancelar
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={() => {
                  realizarDeposito();
                  setIsModalOpen(false);
                  setDeposito("");
                }}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
