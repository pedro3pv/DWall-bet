(ns app.db.mongodb
(:require [monger.core :as mg]
            [monger.collection :as mc])
  (:import [org.bson.types ObjectId]
           [com.mongodb DB WriteConcern]))

(defn start-connection []
  (def uri "mongodb+srv://pedro3pv:#&Hx2qsapVxwN)V1@dwall.rmj4r.mongodb.net/?retryWrites=true&w=majority&appName=DWall")
  (def {:keys [conn db]} (mg/connect-via-uri uri))
  [conn db]
)

(defn disconnect [conn]
  (mg/disconnect conn)
)

(defn add-aposta-mongodb [aposta]
(def db_array (start-connection))
(def db (second db_array))
(mc/insert db "apostas" { :_id (:id aposta) :aposta aposta})
(disconnect (first db_array))
)

(defn get-apostas-mongodb []
(def db_array (start-connection))
(def db (second db_array))
(mc/find db "apostas" {})
(disconnect (first db_array))
)

(defn remove-aposta-mongodb [id]
(def db_array (start-connection))
(def db (second db_array))
(mc/remove db "apostas" {:_id id})
(disconnect (first db_array))
)

(defn add-saldo-mongodb [saldo]
(def db_array (start-connection))
(def db (second db_array))
(mc/insert db "saldos" { :_id 0 :saldo saldo})
(disconnect (first db_array))
)

(defn get-saldo-mongodb []
(def db_array (start-connection))
(def db (second db_array))
(mc/find db "saldos" {})
(disconnect (first db_array))
)

(defn update-saldo-mongodb [saldo]
(def db_array (start-connection))
(def db (second db_array))
(mc/update db "saldos" {:_id 0} { :$set { :saldo saldo}})
(disconnect (first db_array))
)