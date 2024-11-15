(ns app.aposta
  (:require [app.db.db-saldo :refer [get-saldo remove-saldo]]
            [app.db.db-apostas :refer [add-aposta db-apostas remove-aposta]]
            [app.service.rundown :refer [fetch-event-details]]))

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

(defn calculate-odd [aposta]
  (let [event-odds (get-in aposta [:lines :moneyline])]
    (cond
      (and (< (:moneyline_home event-odds) 0) (= (int (:mercado event-odds)) 0)) (Math/abs (/ 100 (:moneyline_home event-odds)))
      (and (> (:moneyline_home event-odds) 0) (= (int (:mercado event-odds)) 1)) (inc (/ (:moneyline_home event-odds) 100))
      (and (< (:moneyline_away event-odds) 0) (= (int (:mercado event-odds)) 2)) (Math/abs (/ 100 (:moneyline_away event-odds)))
      (and (> (:moneyline_away event-odds) 0) (= (int (:mercado event-odds)) 3)) (inc (/ (:moneyline_away event-odds) 100))
      :else 1)))

(defn update-bets [request]
  (try
    (let [apostas @db-apostas
          filter_bets (filter #(and (= (:status %) "ativo") 
                                    (<= (:event_date %) (java.time.Instant/now))) apostas)
          event_details (map #(fetch-event-details (:event-id %)) filter_bets)
          filter_event_details (filter #(= (get-in % [:score :event_status]) "STATUS_FINAL") event_details)
          event-ids (set (map :id filter_event_details))
          filtered-apostas (filter #(contains? event-ids (:id %)) apostas)
          final_bets (map #(assoc % :status "finalizado") filtered-apostas)]
      (dorun (map #(remove-aposta (:id %)) filtered-apostas))
      (dorun (map #(add-saldo (calculate-odd %)) filtered-apostas))
      (dorun (map #(add-aposta %) final_bets))
      {:status 200
       :body {:mensagem "Apostas atualizadas com sucesso!"
              :apostas final_bets}})
    (catch Exception e
      {:status 500
       :body {:mensagem "Ocorreu um erro ao atualizar as apostas."
              :erro (.getMessage e)}}))
