(ns app.core
    (:require [io.pedestal.http :as http]
      [io.pedestal.http.route :as route]))

(def routes (route/expand-routes
              ["/" {:get (fn [req] {:status 200
                                    :body "Hello, World!"})}]))

(def http-server {
                  ::http/routes routes
                  ::http/port 8080
                  ::http/type :jetty
                  ::http/join? false
                  })