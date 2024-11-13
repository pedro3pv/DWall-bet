(ns app.core
  (:require [io.pedestal.http :as http]
            [io.pedestal.http.route :as route]
            [hiccup.core :refer [html]]
            [app.middleware :refer [json-interceptor]]
            [app.service.rundown :refer [sport-list get-open-odds get-event-details]]
            [app.saldo :refer [deposito saldo retirada]]
            [app.aposta :refer [criar-aposta listar-apostas]]
            [app.pages.index :as index]))

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

(defn index-page []
  (html
    [:html
     [:head
      [:title "My App"]
      [:script {:src "/js/compiled/app.js"}]]
     [:body
      [:div#app "Loading..."]]]))

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
                ["/" :get (fn [_] {:status 200
                                   :headers {"Content-Type" "text/html"}
                                   :body (index-page)}) :route-name :index]}))

(def http-server
  {::http/routes routes
   ::http/port 8080
   ::http/type :jetty
   ::http/join? false})

(defn -main []
  (println "Server started on port 8080")
  (http/start (http/create-server http-server)))