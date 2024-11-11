(ns app.saldo)

(def saldo (atom 0))

(defn deposito [request]
  (let [valor (get-in request [:json-body :valor] 0)]
    (swap! saldo + valor)
    (println "Dados recebidos:" valor)
    {:status 200
     :body {:mensagem "Deposito realizado com sucesso!"
            :novo-saldo @saldo}}))

(defn get-saldo [request]
  (println "Consultando saldo atual:" @saldo)
  {:status 200
   :body {:mensagem "O saldo atual é!"
          :saldo @saldo}})
