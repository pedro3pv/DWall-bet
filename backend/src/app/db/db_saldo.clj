(ns app.db.db-saldo
    (:require [app.db.mongodb :refer [add-saldo-mongodb get-saldo-mongodb]]))

(def db-saldo (atom 0))

(defn add-saldo [valor]
    (add-saldo-mongodb (+ valor @db-saldo))
    (swap! db-saldo + valor)
)

(defn get-saldo []
    @db-saldo)

(defn remove-saldo [valor]
    (add-saldo-mongodb (- @db-saldo valor))
    (swap! db-saldo - valor)
)

(defn loading-saldo-mongodb []
    (reset! db-saldo (-> (get-saldo-mongodb) first :saldo)))