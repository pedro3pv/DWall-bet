(ns app.core
  (:require [reagent.core :as reagent]
            [app.pages.index :as index]))

(defn mount-root []
  (reagent/render [index/some-component]
                  (.getElementById js/document "app")))

(defn init []
  (mount-root))

(init)