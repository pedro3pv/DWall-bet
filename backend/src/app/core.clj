(ns app.core
  (:require [io.pedestal.http :as http]
            [io.pedestal.http.route :as route]
            [app.middleware :refer [json-interceptor]]
            [app.service.rundown :refer [sport-list get-open-odds get-event-details get-schedule]]
            [app.saldo :refer [deposito saldo retirada]]
            [app.aposta :refer [criar-aposta listar-apostas update-bets]]
            [app.db.db-apostas :refer [loading-apostas-mongodb]]
            [app.db.db-saldo :refer [loading-saldo-mongodb]]))

(defn funcao-hello [request]
  {:status 200
   :body "Hello World"})

(defn json-handler [request]
  (println "Dados recebidos:" (:json-body request))
  {:status 200
   :body {:mensagem "Dados recebidos com sucesso!"}})

(defn event-details-handler [request]
  (let [event-details (:body (get-event-details request))]
    {:status 200
     :body event-details}))

(def routes (route/expand-routes
              #{["/hello" :get funcao-hello :route-name :hello-world]
                ["/json" :post [json-interceptor json-handler] :route-name :json]
                ["/get-sport" :get [json-interceptor sport-list] :route-name :get-sport]
                ["/events" :post [json-interceptor get-open-odds] :route-name :events]
                ["/event-details" :post [json-interceptor event-details-handler] :route-name :event-details]
                ["/deposito" :post [json-interceptor deposito] :route-name :deposito]
                ["/saldo" :get [json-interceptor saldo] :route-name :saldo]
                ["/retirada" :post [json-interceptor retirada] :route-name :retirada]
                ["/criar-aposta" :post [json-interceptor criar-aposta] :route-name :criar-aposta]
                ["/listar-apostas" :get [json-interceptor listar-apostas] :route-name :listar-apostas]
                ["/update-bets" :get [json-interceptor update-bets] :route-name :update-bets]
                ["/schedule" :post [json-interceptor get-schedule] :route-name :schedule]}))

(def http-server
  {::http/routes routes
   ::http/port 8080
   ::http/type :jetty
   ::http/join? false})

(loading-apostas-mongodb)
(loading-saldo-mongodb)
(println "Bets and cash from MongoDB loaded")
(println "Server started on port 8080")
(http/start (http/create-server http-server))
