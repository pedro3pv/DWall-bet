(ns app.service.rundown
  (:require [clj-http.client :as client]
            [cheshire.core :as json]))
; !!! WARNING !!!
; open-odds function is inicial implementation of the function that will be used to get the odds from the API.
; The function is not working properly and will be fixed in the next steps.
(defn open-odds []
  (let [response (client/get "https://therundown-therundown-v1.p.rapidapi.com/sports/2/openers/2020-09-20"
                             {:headers {:x-rapidapi-key "b2129be27emshdd1b420c63ed2b1p1de5bcjsn1c931c61faa8"
                                        :x-rapidapi-host "therundown-therundown-v1.p.rapidapi.com"}
                              :query-params {:offset "300"
                                             :include "scores&include=all_periods"}})]
    (json/parse-string (:body response) true)))

(defn get-sport []
  (let [response (client/get "https://therundown-therundown-v1.p.rapidapi.com/sports" {:headers {:x-rapidapi-key "b2129be27emshdd1b420c63ed2b1p1de5bcjsn1c931c61faa8"
                                                                                                 :x-rapidapi-host "therundown-therundown-v1.p.rapidapi.com"}})]
    (json/parse-string (:body response) true)))

(defn sport-list [request]
  (let [sports (get-sport)]
    {:status 200
     :body sports}))