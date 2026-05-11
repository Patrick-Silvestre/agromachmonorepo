import Link from 'next/link';

// Blocos de valor da proposta principal do negocio.
const featureCards = [
  {
    title: 'Equipamentos verificados',
    description: 'Encontre maquinas com dados de operacao, disponibilidade e historico para aluguel ou negociacao.'
  },
  {
    title: 'Rede de servicos do campo',
    description: 'Conecte prestadores, produtores e equipes tecnicas em um fluxo unico com status de cada etapa.'
  },
  {
    title: 'Transacao com rastreabilidade',
    description: 'Pedidos, postagens e operacoes ficam registrados para facilitar gestao, auditoria e tomada de decisao.'
  }
];

// Areas operacionais centrais do marketplace agro.
const businessAreas = [
  {
    title: 'Aluguel de maquinarios',
    bullets: ['Tratores, colheitadeiras e pulverizadores por regiao', 'Filtro por janela de uso e faixa de preco', 'Contato direto entre as partes']
  },
  {
    title: 'Compra e venda',
    bullets: ['Produtos do agro organizados por categoria', 'Fluxo de pedidos com atualizacao de status', 'Visao comercial para equipe interna']
  },
  {
    title: 'Prestadores de servicos',
    bullets: ['Busca por especialidade e localidade', 'Historico de atendimento e perfil tecnico', 'Conexao com demandas ativas de produtores']
  }
];

/**
 * Home publica.
 * Funcao: apresentar identidade nex-rural e conduzir usuario para login/cadastro.
 */
export default function HomePage() {
  return (
    <main className="space-y-16 pb-8">
      <section className="surface overflow-hidden">
        <div className="px-6 py-14 text-center sm:px-10 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">webapp nex-rural</p>
          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Alugue equipamentos agricolas com facilidade
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            O nex-rural intermedia maquinas, compra e venda de itens do agro e prestadores de servicos em uma plataforma unica, com area de
            gestao para operacao interna por perfil.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/cadastro" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110">
              Comecar agora
            </Link>
            <Link href="/login" className="rounded-lg border border-border bg-white px-6 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted/45">
              Ja tenho conta
            </Link>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="space-y-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">Por que escolher o nex-rural?</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {featureCards.map((card) => (
            <article key={card.title} className="surface p-5 sm:p-6">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/12 text-lg font-bold text-primary">+</div>
              <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="equipamentos" className="space-y-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">Frentes principais da plataforma</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {businessAreas.map((area) => (
            <article key={area.title} className="surface p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-foreground">{area.title}</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {area.bullets.map((bullet) => (
                  <li key={bullet} className="rounded-xl border border-border/75 bg-background/70 px-3 py-2">
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="contato" className="surface p-7 text-center sm:p-9">
        <p className="mx-auto inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
          Pronto para comecar?
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">Crie sua conta e entre no ecossistema nex-rural</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          O ambiente de gestao abre automaticamente os modulos permitidos para cada tipo de usuario sem exibir rotas restritas na navegacao.
        </p>
        <div className="mt-6">
          <Link href="/cadastro" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110">
            Criar conta gratis
          </Link>
        </div>
      </section>

      <section className="text-center text-xs text-muted-foreground">
        <p>webapp nex-rural | intermediador digital do agro</p>
      </section>
    </main>
  );
}
