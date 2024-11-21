(ns app.middleware
  (:require [cheshire.core :as json]
            [io.pedestal.interceptor :as interceptor]))

(defn parse-json-body [context]
  "Interceptor para converter o corpo JSON da requisição para uma estrutura Clojure."
  (let [json-body? (some-> context :request :headers (get "content-type") (= "application/json"))]
    (if json-body?
      (update context :request assoc
              :json-body (json/parse-stream (clojure.java.io/reader (get-in context [:request :body])) true))
      context)))

(defn generate-json-response [context]
  "Interceptor para converter respostas de estruturas Clojure para JSON e adicionar headers CORS."
  (let [body (:response context)
        origin (get-in context [:request :headers "origin"])]
    (-> context
        (assoc-in [:response :headers "Access-Control-Allow-Origin"] "*")
        (assoc-in [:response :headers "Access-Control-Allow-Headers"] "Content-Type, Origin, Accept")
        (assoc-in [:response :headers "Access-Control-Allow-Methods"] "GET, POST, PUT, DELETE, OPTIONS")
        (assoc-in [:response :headers "Access-Control-Max-Age"] "3600")
        (assoc-in [:response :headers "Access-Control-Expose-Headers"] "Location, Content-Location")
        (update :response update :body json/generate-string)
        (assoc-in [:response :headers "Content-Type"] "application/json"))))

(def json-interceptor
  "Combina os dois interceptors em um único para Pedestal."
  (interceptor/interceptor
    {:name ::json-interceptor
     :enter parse-json-body
     :leave generate-json-response}))