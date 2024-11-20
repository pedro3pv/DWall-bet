export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "DWallBet",
  description:
    "DWallBet é uma bet Entendeu ? tigrinho, tá sabendo ? aquele que paga",
  mainNav: [
    { title: "Principal", href: "/", security: "public" },
    { title: "Contrato", href: "/contrato", security: "private" },
    { title: "Cadastro", href: "/cadastro", security: "private" },
    { title: "Juridico", href: "/juridico", security: "private" },
    { title: "Parceiros", href: "/parceiros", security: "private" },
    { title: "Financeiro", href: "/financeiro", security: "private" },
    { title: "AFTER", href: "/after", security: "private" },
    { title: "Relatorios", href: "/relatorios", security: "private" },
    {
      title: "Contag",
      href: "",
      security: "private",
      type: "dropdown",
      links: [
        {
          title: "Pessoa Fundo",
          href: "/contag/personFund",
        },
        {
          title: "Obito",
          href: "/contag/obito/searchdeath",
        },
      ],
    },
    { title: "Usuario", href: "/usuario", security: "private" },
  ],
  links: {
    home: "/",
    // dashboard: "/dash",
  },
}