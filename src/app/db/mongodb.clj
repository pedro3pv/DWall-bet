(ns app.db.mongodb
  (:require [mongo-driver-3.client :as mcl]
            [mongo-driver-3.collection :as mc]
            [mongo-driver-3.operator :refer [$eq $set]]))

(defn start-connection []
  (let [uri "mongodb+srv://pedro3pv:wytgSg993QWwsics@dwall.rmj4r.mongodb.net/DWall?retryWrites=true&w=majority&appName=DWall"]
    (mcl/connect-to-db uri)))

(defn disconnect [client]
  (.close client))

(defn add-aposta-mongodb [aposta]
  (let [db (start-connection)
        client (:client db)
        db-name (:db db)]
    (mc/insert-one db-name "apostas" {:_id (:id aposta) :aposta aposta})
    (disconnect client)))

(defn get-apostas-mongodb []
  (def db (start-connection))
  (def client (:client db))
  (def db-name (:db db))
  (def apostas (mc/find db-name "apostas" {}))
  (disconnect client)
  apostas)

(defn remove-aposta-mongodb [id]
  (let [db (start-connection)
        client (:client db)
        db-name (:db db)]
    (mc/delete-one db-name "apostas" {:_id id})
    (disconnect client)))

(defn add-saldo-mongodb [saldo]
  (let [db (start-connection)
        client (:client db)
        db-name (:db db)]
    (if (empty? (mc/find db-name "saldos" {}))
      (mc/insert-one db-name "saldos" {:_id 0 :saldo saldo})
      (mc/update-one db-name "saldos" {:_id 0} {$set {:saldo saldo}}))
    (disconnect client)))

(defn get-saldo-mongodb []
  (def db (start-connection))
  (def client (:client db))
  (def db-name (:db db))
  (def saldo (mc/find db-name "saldos" {:_id 0}))
  (disconnect client)
  saldo)