(ns app.saldo
  (:require [app.db.db-saldo :refer [add-saldo get-saldo remove-saldo]]))

(defn deposito [request]
  (let [valor (get-in request [:json-body :valor] 0)]
    (add-saldo valor)
    {:status 200
     :body {:mensagem "Deposito realizado com sucesso!"
            :novo-saldo (get-saldo)}}))

(defn saldo [request]
  {:status 200
   :body {:mensagem "O saldo atual e!"
          :saldo (get-saldo)}})

(defn retirada [request]
  (let [valor (get-in request [:json-body :valor] 0)]
    (remove-saldo valor)
    {:status 200
     :body {:mensagem "Retirada realizada com sucesso!"
            :novo-saldo (get-saldo)}}))
