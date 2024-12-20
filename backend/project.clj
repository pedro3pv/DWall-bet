(defproject DWall-bet "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "EPL-2.0 OR GPL-2.0-or-later WITH Classpath-exception-2.0"
            :url "https://www.eclipse.org/legal/epl-2.0/"}
  :dependencies [[org.clojure/clojure "1.11.1"]
                 [io.pedestal/pedestal.service "0.5.7"]
                 [io.pedestal/pedestal.route "0.5.7"]
                 [io.pedestal/pedestal.jetty "0.5.7"]
                 [org.clojure/data.json "0.2.6"]
                 [org.slf4j/slf4j-simple "1.7.28"]
                 [com.novemberain/monger "3.5.0"]
                 [cheshire "5.13.0"]
                 [clj-http "3.12.3"]
                 [clojure.java-time "1.4.2"]
                 [org.mongodb/mongodb-driver-sync "4.11.1"]
                 [mongo-driver-3 "0.8.0"]]
  :repl-options {:init-ns app.core}
  :main app.core)
 
