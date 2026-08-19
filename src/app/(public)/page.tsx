import Image from 'next/image';
import Link from 'next/link';

// Blocos de valor da proposta principal do produto.
const featureCards = [
  {
    title: 'Cockpit em tempo real',
    description: 'Funcionarios, maquinas por status, pasto/talhao/confinamento e clima da regiao numa unica tela, sem planilha.'
  },
  {
    title: 'Manejo sem esquecer nada',
    description: 'Avisos de fertilizacao, preparo de solo e vacinacao organizados por fazenda e por area de producao.'
  },
  {
    title: 'Rede de profissionais e fornecedores',
    description: 'Veterinario, agronomo, fornecedor de insumo/semente e de gado com rastreabilidade - contato direto, sem burocracia.'
  }
];

// Modulos reais da plataforma hoje.
const modules = [
  {
    title: 'Dashboard operacional',
    bullets: ['Funcionarios e maquinas por status', 'Pasto, talhao e confinamento com ocupacao atual', 'Previsao do tempo da propriedade']
  },
  {
    title: 'Manejo e avisos',
    bullets: ['Fertilizacao, preparo de solo e vacinacao', 'Vinculado a area de producao especifica', 'Alerta de prazo atrasado']
  },
  {
    title: 'Profissionais e fornecedores',
    bullets: ['Veterinarios e agronomos da regiao', 'Fornecedores de insumo/semente e de gado', 'Contato direto via WhatsApp']
  }
];

// Passo a passo simples de como comecar a usar.
const steps = [
  { step: '1', title: 'Crie sua conta', description: 'Cadastro gratuito como produtor/cliente ou prestador de servico.' },
  { step: '2', title: 'Cadastre a fazenda', description: 'Propriedade, pasto/talhao/confinamento e o que esta ocupando cada area agora.' },
  { step: '3', title: 'Acompanhe e acione', description: 'Veja o cockpit atualizado e chame veterinario, agronomo ou fornecedor quando precisar.' }
];

/**
 * Home publica.
 * Funcao: explicar o produto para quem chega pela primeira vez (busca, indicacao) e
 * conduzir ate o cadastro/login.
 */
export default function HomePage() {
  return (
    <main className="space-y-16 pb-8">
      <section className="hero-panel">
        <Image
          className="hero-image"
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80"
          alt="Campo agricola usado como contexto visual da plataforma Nex Rural"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">nex-rural</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
            O painel operacional da sua fazenda, num so lugar
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/82 sm:text-base">
            Cockpit da propriedade (funcionarios, maquinas, pasto/talhao/confinamento e clima), avisos de manejo e uma rede de
            veterinarios, agronomos e fornecedores a um contato de distancia.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/cadastro" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:brightness-110">
              Criar conta gratis
            </Link>
            <Link href="/login" className="rounded-lg border border-white/35 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/18">
              Ja tenho conta
            </Link>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="space-y-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">Por que o Nex-Rural</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {featureCards.map((card, index) => (
            <article key={card.title} className="surface reveal p-5 sm:p-6" style={{ animationDelay: `${index * 80}ms` }}>
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-lg font-bold text-primary">+</div>
              <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="modulos" className="space-y-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">O que tem na plataforma</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {modules.map((area, index) => (
            <article key={area.title} className="surface reveal p-5 sm:p-6" style={{ animationDelay: `${index * 80}ms` }}>
              <h3 className="text-lg font-semibold text-foreground">{area.title}</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {area.bullets.map((bullet) => (
                  <li key={bullet} className="rounded-lg border border-border/75 bg-background/70 px-3 py-2">
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">Como comecar</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="surface reveal space-y-2 p-5 sm:p-6">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                {item.step}
              </span>
              <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contato" className="surface p-7 text-center sm:p-9">
        <p className="mx-auto inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
          Pronto para comecar?
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">Crie sua conta e organize a operacao da fazenda hoje</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          O ambiente abre automaticamente os modulos permitidos para o seu perfil, sem rotas restritas aparecendo na navegacao.
        </p>
        <div className="mt-6">
          <Link href="/cadastro" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110">
            Criar conta gratis
          </Link>
        </div>
      </section>

      <section className="text-center text-xs text-muted-foreground">
        <p>nex-rural | cockpit operacional e rede de contatos do agro</p>
      </section>
    </main>
  );
}
