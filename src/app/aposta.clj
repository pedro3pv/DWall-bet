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

(defn listar-apostas [request]
  {:status 200
   :body {:mensagem "Lista de apostas criadas."
          :apostas @db-apostas}})

(defn calculate-moneyline-away [list_lines]
  (cond
    (< (:moneyline_away list_lines) 0) (double (Math/abs (/ 100 (:moneyline_away list_lines))))
    (> (:moneyline_away list_lines) 0) (double (inc (/ (:moneyline_away list_lines) 100)))))

(defn calculate-moneyline-home [list_lines]
  (cond
    (< (:moneyline_home list_lines) 0) (double (Math/abs (/ 100 (:moneyline_home list_lines))))
    (> (:moneyline_home list_lines) 0) (double (inc (/ (:moneyline_home list_lines) 100)))))
    

(defn calculate-odd [aposta]
  (def list_lines (get-in aposta [:event-details :lines :selected_affiliate]))
  (def mercado (int (get-in aposta [:mercado])))
  (cond
    (= mercado 0) (calculate-moneyline-away list_lines)
    (= mercado 1) (calculate-moneyline-home list_lines)))

(defn update-bets [request]
  (try
    (def filter-bets
      (filter
        #(and
          (= (:status %) "ativo")
          (jt/before? (jt/instant (get-in % [:event-details :event_date])) (jt/instant)))
        @db-apostas))
      (println filter-bets)
      (def event_details (map #(fetch-event-details (get-in % [:event-details :event_id])) filter-bets))
      (println event_details)
      (def filter_event_details (filter #(= (get-in % [:score :event_status]) "STATUS_FINAL") event_details))
      (println filter_event_details)
      (def event-ids (set (map #(get-in % [:event-details :event_id]) @db-apostas)))
      (println event-ids)
      (def filtered-apostas (filter #(contains? event-ids (get-in % [:event-details :event_id])) @db-apostas))
      (println filtered-apostas)
      (def final_bets (map #(assoc % :status "finalizado") filtered-apostas))
      (println final_bets)
      (dorun (map #(remove-aposta (get-in % [:id])) filtered-apostas))
      (dorun (map #(println (calculate-odd %)) filtered-apostas))
      ;; (dorun (map #(add-saldo (calculate-odd %)) filtered-apostas))
      ;; (dorun (map #(add-aposta %) final_bets))
      {:status 200
       :body {:mensagem "Apostas atualizadas com sucesso!"
              :apostas final_bets}}
    (catch Exception e  
      {:status 500
       :body {:mensagem "Ocorreu um erro ao atualizar as apostas."
              :erro (str e)}})))
