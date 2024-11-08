(ns app.middleware
  (:require [cheshire.core :as json]
            [io.pedestal.interceptor :as interceptor]
            [io.pedestal.http :as http]))

(defn parse-json-body [context]
  "Interceptor para converter o corpo JSON da requisição para uma estrutura Clojure."
  (let [json-body? (some-> context :request :headers (get "content-type") (= "application/json"))]
    (if json-body?
      (update context :request assoc
              :json-body (json/parse-stream (clojure.java.io/reader (get-in context [:request :body])) true))
      context)))

(defn generate-json-response [context]
  "Interceptor para converter respostas de estruturas Clojure para JSON."
  (let [body (:response context)]
    (if (or (map? (:body body)) (vector? (:body body)))
      (assoc-in (update context :response update :body json/generate-string)
                [:response :headers "Content-Type"] "application/json")
      context)))

(def json-interceptor
  "Combina os dois interceptors em um único para Pedestal."
  (interceptor/interceptor
    {:name ::json-interceptor
     :enter parse-json-body
     :leave generate-json-response}))
