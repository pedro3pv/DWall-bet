(ns app.core
  (:require [io.pedestal.http :as http]
            [io.pedestal.http.route :as route]
            [app.middleware :refer [json-interceptor]]
            [app.service.rundown :refer [sport-list get-open-odds]]
            [app.saldo :refer [deposito get-saldo]]))

(defn funcao-hello [request]
  {:status 200
   :body "Hello World"})

(defn json-handler [request]
  (println "Dados recebidos:" (:json-body request))
  {:status 200
   :body {:mensagem "Dados recebidos com sucesso!"}})

(def routes (route/expand-routes
              #{["/hello" :get funcao-hello :route-name :hello-world]
                ["/json" :post [json-interceptor json-handler] :route-name :json]
                ["/get-sport" :get [json-interceptor sport-list] :route-name :get-sport]
                ["/events" :post [json-interceptor get-open-odds] :route-name :events]
                ["/deposito" :post [json-interceptor deposito] :route-name :deposito]
                ["/saldo" :get [json-interceptor get-saldo] :route-name :saldo]}))

(def http-server
  {::http/routes routes
   ::http/port 8080
   ::http/type :jetty
   ::http/join? false})

(println "Server started on port 8080")
(http/start (http/create-server http-server))
