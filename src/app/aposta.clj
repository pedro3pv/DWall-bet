(ns app.aposta
  (:require [app.db.db-saldo :refer [get-saldo remove-saldo]]
            [app.db.db-apostas :refer [add-aposta db-apostas]]
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
