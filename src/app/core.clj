(ns app.core
    (:require [io.pedestal.http :as http]
      [io.pedestal.http.route :as route]))

(defn funcao-hello [request]
  {:status 200
   :body "Hello World"})

(def routes (route/expand-routes
              #{["/hello" :get funcao-hello :route-name :hello-world]}))

(def http-server {
                  ::http/routes routes
                  ::http/port 8080
                  ::http/type :jetty
                  ::http/join? false
                  })
(http/start (http/create-server http-server))
(println "Server started on port 8080")