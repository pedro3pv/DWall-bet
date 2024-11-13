(ns app.db.db-apostas)

(def db-apostas (atom []))

(defn add-aposta [aposta]
  (let [last-id (if (empty? @db-apostas)
                  0
                  (:id (last @db-apostas)))
        aposta (if (:id aposta)
                 aposta
                 (assoc (assoc aposta :status "ativo") :id (inc last-id)))]
    (swap! db-apostas conj aposta)))

(defn get-aposta [id]
  (first (filter #(= id (:id %)) @db-apostas)))

(defn remove-aposta [id]
  (swap! db-apostas #(remove (fn [aposta] (= id (:id aposta))) %)))

(defn disable-aposta [id]
  (remove-aposta id)
  (swap! db-apostas conj (assoc (dissoc (get-aposta id) :status) :status "inativo")))