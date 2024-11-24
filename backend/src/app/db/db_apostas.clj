(ns app.db.db-apostas
  (:require [app.db.mongodb :refer [add-aposta-mongodb get-apostas-mongodb remove-aposta-mongodb]]))

(def db-apostas (atom []))

(defn add-aposta [aposta]
  (let [last-id (if (empty? @db-apostas)
                  0
                  (count @db-apostas))
        aposta (if (:id aposta)
                 aposta
                 (assoc (assoc aposta :status "ativo") :id (inc last-id)))]
    (swap! db-apostas conj aposta)
    (add-aposta-mongodb aposta)))

(defn get-aposta [id]
  (first (filter #(= id (:id %)) @db-apostas)))

(defn remove-aposta [id]
  (swap! db-apostas #(remove (fn [aposta] (= id (:id aposta))) %))
  (remove-aposta-mongodb id))

(defn disable-aposta [id]
  (remove-aposta id)
  (swap! db-apostas conj (assoc (dissoc (get-aposta id) :status) :status "inativo")))

(defn loading-apostas-mongodb []
  (def apostas-mongodb (get-apostas-mongodb))
  (def apostas (map #(-> % :aposta) apostas-mongodb))
  (reset! db-apostas apostas))