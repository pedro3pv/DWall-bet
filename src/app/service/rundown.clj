(ns app.service.rundown
  (:require [clj-http.client :as client]
            [cheshire.core :as json]))

(defn get-sport []
  (let [response (client/get "https://therundown-therundown-v1.p.rapidapi.com/sports/2/openers/2020-09-20"
                             {:headers {:x-rapidapi-key "b2129be27emshdd1b420c63ed2b1p1de5bcjsn1c931c61faa8"
                                        :x-rapidapi-host "therundown-therundown-v1.p.rapidapi.com"}
                              :query-params {:offset "300"
                                             :include "scores&include=all_periods"}})]
    (json/parse-string (:body response) true)))

(defn sport-list [request]
  (let [sports (get-sport)]
    {:status 200
     :body sports}))