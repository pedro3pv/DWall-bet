"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchDataInterface } from "@/lib/services/interface";

export function SiteHeader() {
  const [sports, setSports] = useState([]);

  useEffect(() => {
    async function fetchSports() {
      const data = await fetchDataInterface();
      setSports(data);
    }
    fetchSports();
  }, []);

  return (
    <header className="bg-black sticky top-0 z-40 w-full shadow flex-grow" id="noprint">
      {/* Sports Navigation */}
      <div className="flex items-center">
        <img src="/logo.svg" alt="Logo" className="w-fit h-14 ml-10 mr-10" />
        <nav className="bg-black p-2 border-border">
          <ul className="flex space-x-2 overflow-x-auto">
            {sports.map(({ icon: Icon, label, id }: { icon: React.ComponentType<{ className?: string }>; label: string; id: number }) => {
              if (typeof Icon !== "string") {
                return (
                  <li key={label}>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => window.location.href = `/?id=${id}`}>
                      <Icon className="w-4 h-4 mr-2" />
                      {label}
                    </Button>
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </nav>
      </div>
      <div className="flex-grow"></div>
    </header>
  );
}