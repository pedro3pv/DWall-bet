(ns app.aposta
  (:require [app.db.db-saldo :refer [add-saldo get-saldo remove-saldo]]
            [app.db.db-apostas :refer [add-aposta db-apostas remove-aposta]]
            [app.service.rundown :refer [fetch-event-details]]
            [java-time :as jt]))

(defn criar-aposta [request]
  (let [valor-aposta (get-in request [:json-body :valor] 0)
        mercado (get-in request [:json-body :mercado] nil)
        event-id (get-in request [:json-body :event-id] nil)
        saldo-atual (get-saldo)]
    (cond
      (> valor-aposta saldo-atual)
      {:status 400 :body {:mensagem "Saldo insuficiente para realizar a aposta!"}}
      (or (<= valor-aposta 0) (nil? mercado))
      {:status 400 :body {:mensagem "Valor de aposta inválido ou mercado não especificado!"}}
      :else
      (do
        (remove-saldo valor-aposta)
        (let [detalhes-evento (fetch-event-details event-id)]
          (let [aposta {:event-details detalhes-evento
                        :mercado mercado
                        :valor valor-aposta}]
            (add-aposta aposta)
            {:status 200
             :body {:mensagem "Aposta criada com sucesso!"
                    :detalhes-aposta aposta
                    :saldo-atualizado (get-saldo)}}))))))

(defn calculate-moneyline-away [list_lines]
(if (= (get-in list_lines [:moneyline :moneyline_away]) 1.0E-4)
  (int 0)
  (do
  (def value (int (get-in list_lines [:moneyline :moneyline_away])))
  (cond
    (< value 0) (inc (double (abs (/ 100 value))))
    (> value 0) (double (/ value 100))))))

(defn calculate-moneyline-home [list_lines]
(if (= (get-in list_lines [:moneyline :moneyline_home]) 1.0E-4)
  (int 0)
  (do
  (def value (int (get-in list_lines [:moneyline :moneyline_home])))
  (cond
    (< value 0) (inc (double (abs (/ 100 value))))
    (> value 0) (double (/ value 100))))))

(defn calculate-handicap-home [pontos_home pontos_away handicap-casa odds-casa]
(if (or (= handicap-casa 1.0E-4) (= odds-casa 1.0E-4))
  0
  (cond
    (and (> pontos_home pontos_away) (> (+ pontos_home handicap-casa) pontos_away)) (double odds-casa)
    :else 0)))
  
(defn calculate-handicap-away [pontos_home pontos_away handicap-fora odds-fora]
(if (or (= handicap-fora 1.0E-4) (= odds-fora 1.0E-4))
  0
  (cond
    (and (> pontos_away pontos_home) (> (+ pontos_away handicap-fora) pontos_home)) (double odds-fora)
    :else 0)))
    

(defn calculate-odd [aposta api_result]
  (def list_lines (get-in aposta [:event-details :lines :selected_affiliate]))
  (def mercado (int (get-in aposta [:mercado])))
  (def resultado_home (int (get-in api_result [:score :winner_home])))
  (def resultado_away (int (get-in api_result [:score :winner_away])))
  (def pontos_home (int (get-in api_result [:score :score_home])))
  (def pontos_away (int (get-in api_result [:score :score_away])))
  (def handicap-casa (get-in aposta [:event-details :lines :spread :point_spread_home]))
  (def handicap-fora (get-in aposta [:event-details :lines :spread :point_spread_away]))
  (def odds-casa (get-in aposta [:event-details :lines :spread :point_spread_home_money]))
  (def odds-fora (get-in aposta [:event-details :lines :spread :point_spread_away_money]))
  (cond
    (and (= mercado 0) (= resultado_away 1)) (calculate-moneyline-away list_lines)
    (and (= mercado 1) (= resultado_home 1)) (calculate-moneyline-home list_lines)
    (and (= mercado 2) (= resultado_home 1)) (calculate-handicap-home pontos_home pontos_away handicap-casa odds-casa)
    (and (= mercado 3) (= resultado_away 1)) (calculate-handicap-away pontos_home pontos_away handicap-fora odds-fora)
    :else 0))

(defn update-bets [request]
  (try
    (def filter-bets
      (filter
        #(and
          (= (:status %) "ativo")
          (jt/before? (jt/instant (get-in % [:event-details :event_date])) (jt/instant)))
        @db-apostas))
      (def event_details (map #(fetch-event-details (get-in % [:event-details :event_id])) filter-bets))
      (def filter_event_details (filter #(= (get-in % [:score :event_status]) "STATUS_FINAL") event_details))
      (def event-ids (set (map #(get-in % [:event_id]) filter_event_details)))
      (def filtered-apostas (filter #(contains? event-ids (get-in % [:event-details :event_id])) filter-bets))
      (dorun (map #(remove-aposta (get-in % [:id])) filtered-apostas))
      (dorun (map #(add-saldo (* (double (:valor %)) (calculate-odd %1 %2))) filtered-apostas filter_event_details))
      (def final_bets (map #(if (= (calculate-odd %1 %2) 0) (assoc % :status "perdido") (assoc % :status "vencido")) filtered-apostas filter_event_details))
      (dorun (map #(add-aposta %) final_bets))
      {:status 200
       :body {:mensagem "Apostas atualizadas com sucesso!"
              :apostas final_bets
              :saldo-atualizado (get-saldo)}}
    (catch Exception e  
      {:status 500
       :body {:mensagem "Ocorreu um erro ao atualizar as apostas."
              :erro (str e)}})))


(defn listar-apostas [request]
  (update-bets request)
  {:status 200
   :body {:mensagem "Lista de apostas criadas."
          :apostas @db-apostas}})