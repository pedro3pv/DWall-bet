'use client';
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { LogOut, Menu } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export function SiteHeader() {

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const hasPermission = (role: string) => {
    return role === 'admin' || role === 'supervisor';
  };

  // Renderiza os links apenas se for público ou se o usuário tiver permissão (administrador ou supervisor)
  const renderLinks = (item: any, role: string, index: number) => {
    if (item.security === 'public' || hasPermission(role)) {
      return (
        <Link
          key={index}
          href={item.href}
          onClick={toggleMenu}
          className="hover:bg-red-500 flex items-center rounded border-b px-2 py-4 text-sm font-medium text-white md:border-0 lg:border-0"

        >
          {item.title}
        </Link>
      );
    }
    return null;
  };


  return (
    <header className="bg-black sticky top-0 z-40 w-full shadow" id="noprint">
    <nav className="container flex h-16 items-center space-x-4 text-muted-foreground sm:justify-between sm:space-x-0">
      <div className="mr-4 flex items-center gap-2">
        <Link href={token !== '' ? '/' : '/login'}>
          <Image 
            src="/logo_exataweb.png" 
            alt="EXATAWEB Logo" 
            width={150} 
            height={40} 
          />
        </Link>
      </div>

      <div className="flex w-full flex-col md:flex-row">
        <div className="self-end md:hidden">
          <Button variant="ghost" onClick={toggleMenu}>
            <Menu className="text-white" />
          </Button>
        </div>
  
        <div
            className={`${menuOpen ? 'absolute md:static' : 'hidden'
              }   right-0 top-12 flex-col gap-2 rounded  bg-background p-4 md:top-0 md:flex  md:w-full md:flex-row md:gap-0 md:bg-transparent lg:relative lg:top-0  lg:w-full lg:bg-transparent lg:p-0`}
          >

            {siteConfig.mainNav?.map(
              (item, index) =>
                item.href && item.links == null ?
                  renderLinks(item, role, index)
                  :
                  (
                    hasPermission(role) &&
                    <DropdownMenu key={index}>
                      <DropdownMenuTrigger className="hover:bg-red-500 flex items-center rounded border-b px-2 py-4 text-sm font-medium text-white md:border-0 lg:border-0">Contag</DropdownMenuTrigger>
                      <DropdownMenuContent collisionPadding={15} className="flex flex-col">

                        {item.links?.map(
                          (item, index) =>
                            <DropdownMenuItem key={index}>
                              <Link

                                className={cn(
                                  `flex w-full  items-center whitespace-nowrap rounded border-b p-3 text-sm font-medium text-slate-500 hover:text-red-500  md:border-0 lg:border-0${token == '' && 'hidden'}`,
                                )} href={item.href}>
                                {item.title}
                              </Link>
                            </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
            )}

            <div className="flex  w-fit items-center justify-end gap-2 md:w-full lg:w-full">
              <ThemeToggle  />
              {token !== '' ? (
                <Button
                variant="ghost"
                className="text-white hover:text-red-500"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
              ) : null}
              
            </div>
          </div>
      </div>
    </nav>
  </header>
  );
}