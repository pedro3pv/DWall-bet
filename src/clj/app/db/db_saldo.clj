(ns app.db.db-saldo)

(def db-saldo (atom 0))

(defn add-saldo [valor]
    (swap! db-saldo + valor))

(defn get-saldo []
    @db-saldo)

(defn remove-saldo [valor]
    (swap! db-saldo - valor))