(ns app.service.rundown
  (:require [clj-http.client :as client]
            [cheshire.core :as json])
  (:import [java.time LocalDate]
           [java.time.format DateTimeFormatter]))

(defn today-date []
  (let [formatter (DateTimeFormatter/ofPattern "yyyy-MM-dd")]
    (.format (LocalDate/now) formatter)))

(defn open-odds [sport-id]
  (cond
    (nil? sport-id) {:status 404
                     :body "ID do esporte não informado"}
    (not (int? (int sport-id))) {:status 404
                               :body "ID do esporte deve ser um número inteiro"}
    :else (try
             (let [date (today-date)
                   response (client/get (str (format "https://therundown-therundown-v1.p.rapidapi.com/sports/%d/openers/%s" sport-id date))
                                        {:headers {:x-rapidapi-key "b2129be27emshdd1b420c63ed2b1p1de5bcjsn1c931c61faa8"
                                                   :x-rapidapi-host "therundown-therundown-v1.p.rapidapi.com"}
                                         :query-params {:offset "180"
                                                        :include "scores&include=all_periods"}})]
               (json/parse-string (:body response) true))
             (catch Exception e
               (println (str "Erro ao buscar odds abertas: " (.getMessage e)))
               {:status 404
                :body (str "Erro ao buscar odds abertas")})))
  )

(defn get-open-odds [request]
  (let [id (:id (:json-body request))
        odds (open-odds id)]
    {:status 200
     :body odds}))

(defn get-sport []
  (let [response (client/get "https://therundown-therundown-v1.p.rapidapi.com/sports" {:headers {:x-rapidapi-key "b2129be27emshdd1b420c63ed2b1p1de5bcjsn1c931c61faa8"
                                                                                                 :x-rapidapi-host "therundown-therundown-v1.p.rapidapi.com"}})]
    (json/parse-string (:body response) true)))

(defn sport-list [request]
  (let [sports (get-sport)]
    {:status 200
     :body sports}))