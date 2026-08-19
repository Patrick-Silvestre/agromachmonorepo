# Nex Rural Frontend

Frontend do Nex Rural: o cockpit operacional de uma fazenda (funcionarios, maquinas,
pasto/talhao/confinamento, avisos de manejo e clima) mais uma rede de contatos de
veterinarios, agronomos e fornecedores.

Este repositorio contem somente o frontend Next.js conectado a uma REST API.
Quando a API ainda nao retorna dados, o app usa mocks locais de demonstracao.
Assim que o backend devolve registros reais, os mocks deixam de aparecer.

---

## 1. Objetivo Do Projeto

O Nex Rural foi reduzido de proposito a duas frentes, depois de uma revisao de
escopo (o projeto comecou maior, incluindo marketplace de maquinas/insumos e um
feed social - ambos removidos):

- **Cockpit da fazenda**: visao unica de equipe, maquinario por status,
  ocupacao de pasto/talhao/confinamento, avisos de manejo e previsao do tempo.
- **Rede de contatos**: diretorio de veterinarios, agronomos e fornecedores
  (insumo/semente e gado, com ou sem rastreabilidade) - contato direto via
  WhatsApp, sem carrinho nem pedido.

O frontend tambem possui area privada com controle de acesso por perfil. Isso
significa que cada usuario enxerga somente os modulos permitidos para seu papel
(`CLIENTE`, `PRESTADOR` ou `ADMIN` - os unicos que o backend realmente emite).

---

## 2. Stack E Por Que Cada Tecnologia Foi Escolhida

### Next.js

O Next.js foi escolhido porque organiza rotas, layouts e paginas dentro do
`src/app`. Ele facilita criar telas publicas e privadas sem configurar roteador
manual.

No projeto:

- `src/app/(public)` contem home, login e cadastro;
- `src/app/(app)` contem dashboard e modulos autenticados;
- `src/app/layout.tsx` aplica fontes, estilos globais e contexto de auth.

### React

React e a base de componentes. Cada parte visual reutilizavel fica isolada em
componentes pequenos.

No projeto:

- formularios ficam em `src/components/auth`;
- menu privado fica em `src/components/layout`;
- tabela generica (modulos legados) fica em `src/components/modules`;
- UI base (Button, Card, Input, Select, Field) fica em `src/components/ui`.

### TypeScript

TypeScript foi escolhido para documentar contratos e reduzir erro de integracao
com a API.

No projeto:

- `src/types/auth.ts` define login, cadastro e sessao;
- `src/types/dashboard.ts` define o shape do cockpit (`GET /api/dashboard`);
- `src/types/operacao.ts` define os requests de Area de Producao, Aviso e Profissional;
- `src/types/api.ts` define erro padronizado;
- `src/types/user.ts` define dados do usuario.

### Tailwind CSS

Tailwind CSS foi escolhido para estilizar rapido, mantendo consistencia visual.
O tema e escuro, minimalista e com poucas cores (fundo quase preto, um verde
vibrante como acento, tipografia limpa) - a ideia e parecer premium sem virar
"arvore de natal" cheia de gradiente e brilho em tudo.

Toda a paleta vive em dois lugares: `tailwind.config.ts` (tokens de cor/sombra)
e `src/app/globals.css` (classes compartilhadas como `.surface`, `.status-chip`,
`.reveal`, `.skeleton`). Mudar o tema todo comeca por esses dois arquivos -
como cada tela usa as mesmas classes, a mudanca se propaga sozinha.

Animacao e propositalmente simples: sem biblioteca externa. `.reveal` (CSS
`@keyframes`) faz os cards entrarem com fade+slide em cascata, e o hook
`useCountUp` anima numeros de KPI com `requestAnimationFrame` puro.

### Axios

Axios foi escolhido para concentrar chamadas HTTP, base URL e interceptors.

No projeto:

- `src/services/api.ts` cria uma unica instancia HTTP;
- o token JWT e enviado automaticamente no header `Authorization`;
- resposta `401` limpa a sessao local.

### PNPM

PNPM foi escolhido por ser rapido e previsivel para instalar dependencias.

---

## 3. Estrutura Atual

```text
nex-rural-frontend/
  src/
    app/
      (public)/               # Home, login e cadastro
      (app)/                  # Dashboard e rotas privadas
        dashboard/            # Cockpit operacional
        areas-producao/       # CRUD de pasto/talhao/confinamento
        avisos/               # CRUD de avisos de manejo
        profissionais/        # CRUD do diretorio de contatos
        fazendas/ maquinas/ funcionarios/ usuarios/   # Telas legadas (tabela generica)
      globals.css             # Estilos globais e classes de layout
      layout.tsx              # Layout raiz
    components/
      auth/                   # Login, cadastro e provider de autenticacao
      backend/                # Card de diagnostico da API
      layout/                 # Navegacao privada
      modules/                # Tela generica de modulo/tabela (fazendas/maquinas/funcionarios/usuarios)
      ui/                     # Button, Card, Input, Select, Field e cn
    hooks/
      useAuth.ts              # Acesso simples ao contexto de auth
      useBackendStatus.ts      # Consulta endpoints de diagnostico
      useModuleResource.ts     # Busca API e aplica fallback mock (telas legadas)
      useDashboard.ts          # Busca GET /api/dashboard com fallback mock
      useCrudResource.ts       # CRUD generico (list/create/update/remove) - areas/avisos/profissionais
      useFazendas.ts           # Lista fazendas do usuario (seletores de formulario)
      useCountUp.ts            # Anima numeros de KPI
    lib/
      access-control.ts       # Modulos, endpoints e permissoes por perfil
      env.ts                  # Le e valida variaveis de ambiente
      errors.ts                # Normaliza erros da API
      mock-content.ts         # Dados locais de demonstracao (telas legadas)
      mock-dashboard.ts        # Dashboard de demonstracao
      storage.ts               # Sessao e token no localStorage
    services/
      api.ts                  # Cliente Axios
      authService.ts           # Login/cadastro/logout
      userService.ts           # Endpoint de status
    types/
      api.ts / auth.ts / user.ts / dashboard.ts / operacao.ts
  .env.local.example
  package.json
  tailwind.config.ts
  tsconfig.json
```

---

## 4. Como Rodar

Instale o Node.js LTS. Depois habilite o PNPM via Corepack:

```bash
corepack enable
corepack prepare pnpm@10.18.3 --activate
```

Instale as dependencias:

```bash
pnpm install
```

Rode o frontend:

```bash
pnpm dev
```

Abra:

```text
http://localhost:3000
```

Build de producao:

```bash
pnpm build
```

Lint:

```bash
pnpm lint
```

Se `pnpm` nao for reconhecido, o problema esta no Node/Corepack do ambiente
(pode usar `npm install` / `npm run dev` como alternativa - o projeto nao usa
nenhum recurso exclusivo do pnpm).

---

## 5. Variaveis De Ambiente

Crie um arquivo `.env.local` na raiz ou copie o exemplo:

```bash
cp .env.local.example .env.local
```

Exemplo:

```env
NEXT_PUBLIC_API_URL=http://localhost:8081
NEXT_PUBLIC_STATUS_PATH=/api/usuarios
NEXT_PUBLIC_STATUS_PATHS=/api/usuarios,/api/fazendas,/api/maquinas,/api/funcionarios,/api/areas-producao,/api/avisos,/api/profissionais,/api/dashboard
```

O que cada variavel faz:

- `NEXT_PUBLIC_API_URL`: URL base da REST API (o backend em `InteliJ_AgroMach/AgroMach`).
- `NEXT_PUBLIC_STATUS_PATH`: endpoint principal usado em `/backend-check`.
- `NEXT_PUBLIC_STATUS_PATHS`: lista de endpoints para testar no diagnostico.

---

## 6. Fluxo De Autenticacao

1. Usuario envia email e senha (ou nome/email/senha/perfil no cadastro).
2. `LoginForm`/`SignupForm` chamam `login`/`register` pelo hook `useAuth`.
3. `AuthProvider` chama `authService.login`/`authService.register`.
4. `authService` envia `POST /auth/login` ou `POST /auth/register`.
5. O token e o `role` (`CLIENTE`/`PRESTADOR`/`ADMIN`) sao extraidos da resposta.
6. A sessao e salva em `localStorage`.
7. `api.ts` passa o token em todas as proximas requisicoes.
8. O usuario e enviado para `/dashboard`, ja com o menu filtrado pelo seu perfil.

No cadastro publico, so existem duas opcoes de perfil: **Produtor/Cliente** e
**Prestador de servico** - o backend ignora qualquer outro valor e cria como
`CLIENTE` por padrao (proposital, e uma protecao contra escalonamento de
privilegio: ver README do backend).

Arquivos principais:

- `src/components/auth/login-form.tsx`
- `src/components/auth/signup-form.tsx`
- `src/components/auth/auth-provider.tsx`
- `src/services/authService.ts`
- `src/lib/storage.ts`

---

## 7. O Cockpit (Dashboard)

`GET /api/dashboard` devolve, para a fazenda do usuario, tudo que a tela
inicial precisa numa unica resposta: total de funcionarios, maquinas agrupadas
por status, areas de producao com ocupacao atual, avisos pendentes (com os
atrasados destacados) e o clima da propriedade.

O hook `useDashboard` busca esse endpoint e, se a API ainda nao responder
(backend fora do ar, sem fazenda cadastrada), cai para um mock local
(`src/lib/mock-dashboard.ts`) - mesma logica de "modo demonstracao" das telas
legadas, so que tipada para esse formato especifico em vez do formato
generico de tabela.

Arquivos principais:

- `src/app/(app)/dashboard/page.tsx`
- `src/hooks/useDashboard.ts`
- `src/lib/mock-dashboard.ts`
- `src/types/dashboard.ts`

---

## 8. CRUD De Area De Producao, Aviso E Profissional

Essas tres telas (`/areas-producao`, `/avisos`, `/profissionais`) sao CRUD de
verdade (criar/editar/remover), diferente das telas legadas que so listam
dados. Elas compartilham o hook `useCrudResource<TResponse, TRequest>(endpoint)`,
que encapsula `list/create/update/remove` contra o mesmo formato de API nos
tres casos.

Padrao de cada pagina:

1. Card de cabecalho com titulo e botao "Novo/Nova ...".
2. Formulario (aparece/some) reusando `Field`, `Input` e `Select` de `components/ui`.
3. Grid ou lista dos registros, com acao de Editar/Remover em cada item.

`areas-producao` e `avisos` tambem usam `useFazendas` para o seletor de
fazenda (cada area/aviso pertence a uma fazenda), e `avisos` filtra as areas
disponiveis pela fazenda selecionada no formulario.

Arquivos principais:

- `src/app/(app)/areas-producao/page.tsx`
- `src/app/(app)/avisos/page.tsx`
- `src/app/(app)/profissionais/page.tsx`
- `src/hooks/useCrudResource.ts`
- `src/hooks/useFazendas.ts`
- `src/types/operacao.ts`

---

## 9. Telas Legadas (Tabela Generica)

`fazendas`, `maquinas`, `funcionarios` e `usuarios` ainda usam o padrao antigo:
`ModuleResourceScreen` + `useModuleResource`, que so lista dados (sem criar/
editar/remover pela UI ainda). Isso funciona bem para visualizar dados vindos
do backend, mas se algum dia precisar de criar/editar essas entidades pela UI,
o caminho recomendado e portar a tela para o mesmo padrao de
`useCrudResource` usado em Area de Producao/Aviso/Profissional (ver secao 13).

Arquivos principais:

- `src/hooks/useModuleResource.ts`
- `src/lib/mock-content.ts`
- `src/components/modules/module-resource-screen.tsx`

---

## 10. Controle De Acesso

O arquivo `src/lib/access-control.ts` concentra:

- lista oficial de modulos (`ModuleKey`, `ALL_MODULES`);
- rota e endpoint de cada modulo;
- permissoes por papel de usuario (`ROLE_PERMISSIONS`);
- ordem visual do menu (`NAV_MODULE_ORDER`).

O backend so emite tres papeis (`com.agromach.entity.Role`): `CLIENTE`,
`PRESTADOR` e `ADMIN`. O mapa de permissoes foi simplificado para essas tres
chaves (antes tinha varias chaves - `PRODUTOR`, `OPERADOR`, `COMERCIAL`,
`GESTOR` etc. - que o backend nunca emitia de verdade, entao nunca tinham
efeito nenhum).

```ts
CLIENTE: ['dashboard', 'fazendas', 'maquinas', 'funcionarios', 'areas-producao', 'avisos', 'profissionais', 'backend']
```

---

## 11. Guia Visual

Tema escuro, minimalista, com um verde vibrante como unico acento forte e
poucas cores no total - o objetivo e sensacao premium sem poluir a tela.

Decisoes visuais aplicadas:

- fundo quase preto com leve gradiente radial verde nos cantos;
- cards com borda fina translucida e sombra suave (`.surface`);
- topbar/sidebar com efeito de vidro fosco (`backdrop-filter: blur`);
- entrada de cards em cascata (`.reveal`) e numeros de KPI animados (`useCountUp`);
- selo "ao vivo" com ponto pulsante no card de clima;
- paleta: verde (acento/primario), ambar (avisos/destaque secundario), vermelho (alerta/atraso).

---

## 12. Teste De Conexao Com Backend

1. Inicie a REST API (`InteliJ_AgroMach/AgroMach`, ver README de la).
2. Configure `.env.local`.
3. Rode `pnpm dev`.
4. Entre em `/backend-check`.
5. Escolha um endpoint e clique em `Recarregar`.

Resultados possiveis:

- sucesso: JSON do backend aparece na tela;
- erro: a mensagem HTTP aparece no card;
- modulo sem API: dados mock aparecem com aviso de demonstracao.

---

## 13. Como Evoluir O Projeto

Para adicionar uma tela de **CRUD de verdade** (recomendado, mesmo padrao de
Area de Producao/Aviso/Profissional):

1. adicione a chave em `ModuleKey` e o objeto em `ALL_MODULES` (`access-control.ts`);
2. adicione a chave nas permissoes de `ROLE_PERMISSIONS` que devem ver o modulo;
3. crie o tipo de request/response em `src/types/`;
4. crie a pagina em `src/app/(app)/novo-modulo/page.tsx` usando `useCrudResource`
   (copie a estrutura de `areas-producao/page.tsx` - e o exemplo mais simples).

Para adicionar uma tela **so de leitura** (padrao legado, mais rapido de
escrever mas sem criar/editar/remover):

1. adicione a chave em `ModuleKey`/`ALL_MODULES`/`ROLE_PERMISSIONS`;
2. crie a pagina reaproveitando `ModuleResourceScreen`;
3. opcionalmente adicione mock em `mock-content.ts`.

```tsx
import { ModuleResourceScreen } from '@/components/modules/module-resource-screen';
import { getModuleByKey } from '@/lib/access-control';

const moduleConfig = getModuleByKey('fazendas');

export default function FazendasPage() {
  if (!moduleConfig) {
    return null;
  }

  return <ModuleResourceScreen module={moduleConfig} />;
}
```

---

## 14. Resumo Da Arquitetura

```text
Browser
  -> Next.js App Router
  -> AuthProvider
  -> api.ts / Axios
  -> REST API (Spring Boot)
  -> resposta real
  -> cockpit / CRUD / tabela

Se API falhar ou vier vazia:
  -> mock-dashboard.ts / mock-content.ts
  -> UI mostra aviso de demonstracao
```

O objetivo final e simples: manter o frontend bonito, navegavel e didatico
durante o desenvolvimento, mas pronto para usar dados reais assim que a REST
API estiver disponivel.
