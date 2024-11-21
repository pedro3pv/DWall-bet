# DWall Bet

A Clojure library designed to ... well, that part is up to you.

## Usage

FIXME

## License

Copyright © 2024 FIXME

This program and the accompanying materials are made available under the
terms of the Eclipse Public License 2.0 which is available at
http://www.eclipse.org/legal/epl-2.0.

This Source Code may also be made available under the following Secondary
Licenses when the conditions for such availability set forth in the Eclipse
Public License, v. 2.0 are satisfied: GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or (at your
option) any later version, with the GNU Classpath Exception which is available
at https://www.gnu.org/software/classpath/license.html.

## Nível Fácil

### 1. Configuração do Projeto
- [X] Inicializar o projeto Clojure
- [X] Configurar as dependências necessárias (Leiningen ou deps.edn)

### 2. Estrutura de Dados
- [X] Implementar a estrutura de dados mapa (hash-map) para representar as transações
- [X] Configurar átomos (atom) para o gerenciamento de estado da base de dados em memória

### 3. Endpoints Básicos
- [X] Implementar função para obter o saldo da conta
- [X] Implementar função para obter os eventos esportivos
- [X] Implementar função para consultar apostas

## Nível Médio

### 4. Servidor HTTP e Roteamento
- [X] Configurar um servidor HTTP (ex: usando Ring e Compojure)
- [X] Implementar roteamento básico para os endpoints

### 5. Processamento de Requisições HTTP
- [X] Implementar middleware para parsing de JSON
- [X] Implementar funções para manipular requisições e respostas HTTP

### 6. Endpoints de Transações Financeiras
- [X] Implementar função para depositar um determinado valor na conta
- [X] Implementar função para registrar uma aposta

### 7. Endpoints de Apostas
- [X] Implementar função para obter os mercados de apostas de um determinado evento
- [X] Implementar função para liquidar apostas

## Nível Difícil

### 8. Lógica de Negócios
- [X] Implementar a lógica para processar depósitos usando átomos
- [X] Implementar a lógica para registrar apostas
- [X] Implementar a lógica para liquidar apostas

### 9. Programação Funcional
- [ ] Utilizar funções de ordem superior (map, reduce, filter) onde apropriado
- [ ] Implementar funções puras para cálculos e transformações de dados
- [ ] Utilizar recursão em cauda para operações iterativas

### 10. Concorrência e Persistência
- [ ] Implementar operações concorrentes seguras usando átomos e refs
- [ ] Otimizar o desempenho das operações com a base de dados em memória
- [X] Implementar persistência de dados (opcional, se necessário)
