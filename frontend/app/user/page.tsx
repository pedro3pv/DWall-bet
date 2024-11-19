"use client"; // Adicione essa linha no início do arquivo

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Component() {
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar a visibilidade do modal
  const [deposito, setDeposito] = useState(""); // Estado para o valor do depósito

  // Dados de exemplo de apostas
  const apostas = [
    {
      times: ["Flamengo", "Palmeiras"],
      dataEvento: "20/11/2024 - 18:00",
      mercados: [
        { nome: "Vencedor do Jogo", valor: "R$50,00" },
        { nome: "Total de Gols", valor: "R$30,00" },
      ],
      status: "Pendente",
    },
    {
      times: ["Corinthians", "São Paulo"],
      dataEvento: "22/11/2024 - 20:00",
      mercados: [
        { nome: "Ambos Marcam", valor: "R$40,00" },
        { nome: "Handicap Asiático", valor: "R$20,00" },
      ],
      status: "Vencida",
    },
    {
      times: ["Internacional", "Grêmio"],
      dataEvento: "25/11/2024 - 21:00",
      mercados: [
        { nome: "Primeiro Gol", valor: "R$25,00" },
      ],
      status: "Perdida",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 relative">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400">pedroarg_</p>
            <h1 className="text-4xl font-bold flex items-center gap-2">
              R$13,08
            </h1>
          </div>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8"
            onClick={() => setIsModalOpen(true)} // Abrir o modal
          >
            Depositar
          </Button>
        </div>

        {/* Balance Info */}
        <div>
          <p className="text-gray-400">Disponível</p>
          <p className="text-2xl font-bold">R$13,08</p>
        </div>

        {/* Lista de Apostas */}
        <div className="space-y-4">
          {apostas.map((aposta, index) => (
            <Card key={index} className="bg-zinc-900 border-gray-800 p-4">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-400">
                    {aposta.times[0]} vs {aposta.times[1]}
                  </h2>
                  <span
                    className={`text-sm font-bold px-2 py-1 rounded ${
                      aposta.status === "Vencida"
                        ? "bg-green-600 text-white"
                        : aposta.status === "Perdida"
                        ? "bg-red-600 text-white"
                        : "bg-yellow-600 text-white"
                    }`}
                  >
                    {aposta.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{aposta.dataEvento}</p>
                <div className="space-y-1">
                  {aposta.mercados.map((mercado, mercadoIndex) => (
                    <div
                      key={mercadoIndex}
                      className="flex justify-between text-sm text-gray-300"
                    >
                      <span>{mercado.nome}</span>
                      <span>{mercado.valor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal de Depósito */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-zinc-900 text-white p-6 rounded-lg space-y-4 w-80">
            <h2 className="text-xl font-bold">Digite o valor do depósito</h2>
            <input
              type="number"
              value={deposito}
              onChange={(e) => setDeposito(e.target.value)}
              className="w-full p-2 rounded bg-zinc-800 text-white outline-none border border-zinc-700 focus:ring focus:ring-green-600"
              placeholder="Ex: 100.00"
            />
            <div className="flex justify-end space-x-4">
              <Button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={() => {
                  setIsModalOpen(false); // Fechar o modal
                  setDeposito(""); // Limpar o valor do depósito
                }}
              >
                Cancelar
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={() => {
                  setIsModalOpen(false); // Fechar o modal
                  setDeposito(""); // Limpar o valor do depósito
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
