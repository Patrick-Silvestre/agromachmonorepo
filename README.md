# Nex Rural Monorepo

Frontend do `webapp nex-rural` organizado em monorepo com Turborepo.

Objetivo de negocio do sistema:

- ser o intermediador digital do agro entre aluguel de maquinarios, compra e venda e prestadores de servicos
- oferecer area privada de gestao por perfil, sem exibir rotas restritas para usuarios sem permissao

## 1. Visao de Arquitetura

Arquitetura adotada:

- Monorepo com Turborepo + pnpm workspace
- App frontend em Next.js App Router
- Camadas separadas por responsabilidade (`app`, `components`, `hooks`, `services`, `lib`, `types`)
- Controle de acesso por papel no frontend para visibilidade de modulo

Motivo dessa arquitetura:

- centraliza codigo compartilhado e reduz duplicacao
- facilita escalar para novos apps/pacotes sem reestruturar tudo
- melhora manutencao para equipe de TCC (cada pasta tem papel claro)
- prepara o frontend para backend real (JWT, interceptors, tratamento de erro)

## 1.1 Diagrama de Fluxo (ASCII)

```text
                           +----------------------+
                           |   Usuario no Browser |
                           +----------+-----------+
                                      |
                                      v
                    +-----------------+-----------------+
                    | Rotas Publicas (/, /login, /cadastro) |
                    +-----------------+-----------------+
                                      |
                     submit login/cadastro (form)
                                      |
                                      v
                        +-------------+-------------+
                        | auth-provider + authService |
                        +-------------+-------------+
                                      |
                           POST /auth/login ou /auth/register
                                      |
                                      v
                           +----------+-----------+
                           | Backend Spring Boot  |
                           +----------+-----------+
                                      |
                         retorna token/roles/user (JWT)
                                      |
                                      v
                     +----------------+----------------+
                     | storage.ts (localStorage sessao) |
                     +----------------+----------------+
                                      |
                                      v
                     +----------------+----------------+
                     | api.ts (Axios + Interceptors)  |
                     | Authorization: Bearer <token>  |
                     +----------------+----------------+
                                      |
                                      v
             +------------------------+------------------------+
             | access-control.ts calcula modulos por perfil   |
             +------------------------+------------------------+
                                      |
                          renderiza apenas rotas permitidas
                                      |
                                      v
                 +--------------------+--------------------+
                 | Dashboard + Modulos privados            |
                 | /usuarios /fazendas /pedidos ...        |
                 +--------------------+--------------------+
                                      |
                     hooks/services consultam endpoints reais
                                      |
                                      v
                              +-------+--------+
                              | Resposta da API |
                              +-------+--------+
                                      |
                    +-----------------+-------------------+
                    | dados reais -> tabela/card normal   |
                    | falha/vazio -> erro ou fallback mock|
                    +-------------------------------------+
```

## 2. Estrutura do Monorepo

```text
nex-rural/
  apps/
    web/                  # Aplicacao Next.js principal
  packages/
    ui/                   # Componentes reutilizaveis (Button, Card, Input, cn)
    config/               # Presets compartilhados de ESLint/TS/Tailwind
  turbo.json
  pnpm-workspace.yaml
  package.json
```

Por que esta divisao:

- `apps/web`: concentra regras de tela e fluxo de usuario
- `packages/ui`: evita repetir componente visual em varios lugares
- `packages/config`: padroniza qualidade e build entre apps

## 3. Arquitetura do Frontend (`apps/web/src`)

```text
src/
  app/                    # Rotas e layouts (publico e privado)
  components/             # Componentes de tela (auth, nav, backend card, modulo)
  services/               # Comunicacao HTTP com backend (axios/auth/user)
  hooks/                  # Estado e logica reutilizavel de UI/dados
  types/                  # Contratos TypeScript da aplicacao
  lib/                    # Utilitarios de dominio (env, storage, acesso, erros, fallback)
```

Motivo de cada camada:

- `app`: define navegacao e fluxo das paginas
- `components`: reaproveita UI sem duplicar JSX
- `services`: concentra endpoints e padrao de chamada HTTP
- `hooks`: separa logica de dados da renderizacao
- `types`: evita inconsistencias entre frontend e backend
- `lib`: concentra regras tecnicas transversais

## 4. Rotas e Layouts

Rotas publicas:

- `/`
- `/login`
- `/cadastro`

Rotas privadas:

- `/dashboard`
- `/usuarios`
- `/fazendas`
- `/maquinas`
- `/funcionarios`
- `/produtos`
- `/pedidos`
- `/postagens`
- `/backend-check`

Decisao importante:

- o menu lateral e os atalhos do painel sao montados com base em permissoes
- rotas sem permissao nao aparecem na navegacao (nao mostra "acesso restrito")

Arquivos centrais:

- `apps/web/src/app/(public)/layout.tsx`
- `apps/web/src/app/(app)/layout.tsx`
- `apps/web/src/lib/access-control.ts`
- `apps/web/src/components/layout/app-navigation.tsx`

## 5. Fluxo de Autenticacao e Autorizacao

Fluxo de login:

1. Usuario envia email/senha em `login-form.tsx`
2. `auth-provider.tsx` chama `authService.login`
3. `authService.ts` autentica (`/auth/login`) e monta sessao
4. Token e sessao sao salvos em `storage.ts`
5. Interceptor de `api.ts` passa `Authorization: Bearer <token>` automaticamente
6. Permissoes sao calculadas por `access-control.ts`
7. Navegacao mostra apenas modulos permitidos

Fluxo de cadastro:

1. `signup-form.tsx` envia nome/email/senha/role
2. `authService.register` tenta `/auth/register`
3. Se 404, tenta fallback `/auth/signup`
4. Sessao e token sao persistidos igual ao login

Tratamento de sessao expirada:

- se backend responder `401`, `api.ts` limpa storage (`clearAuthStorage`)

## 6. Integracao com Backend Spring Boot

Base URL da API:

- `NEXT_PUBLIC_API_URL=http://localhost:8081`

Endpoint de diagnostico:

- `NEXT_PUBLIC_STATUS_PATH` (endpoint principal para teste GET)
- `NEXT_PUBLIC_STATUS_PATHS` (lista de endpoints para alternar no backend-check)

Arquivos principais:

- `apps/web/src/services/api.ts`
- `apps/web/src/services/authService.ts`
- `apps/web/src/services/userService.ts`
- `apps/web/src/components/backend/backend-status-card.tsx`

Motivo dessa organizacao:

- trocar ambiente fica simples via `.env.local`
- erros ficam padronizados para interface (`createApiError`)
- chamada HTTP fica centralizada e consistente

## 7. Estrategia de Dados em Telas de Modulo

Hook principal:

- `apps/web/src/hooks/useModuleResource.ts`

Comportamento:

1. tenta buscar dados reais no endpoint do modulo
2. se vier resposta valida, usa fonte `api`
3. se vier vazio ou backend cair e houver fallback local, usa fonte `mock`
4. se nao houver fallback, exibe erro normalizado

Regra de negocio para TCC:

- fallback local existe apenas para apoio de navegacao
- quando backend retornar dados, a UI passa automaticamente para dados reais

## 8. Variaveis de Ambiente

Copie o exemplo:

```bash
cp apps/web/.env.local.example apps/web/.env.local
```

Exemplo recomendado:

```env
NEXT_PUBLIC_API_URL=http://localhost:8081
NEXT_PUBLIC_STATUS_PATH=/api/usuarios
NEXT_PUBLIC_STATUS_PATHS=/api/usuarios,/api/fazendas,/api/maquinas,/api/funcionarios,/api/produtos,/api/pedidos,/api/postagens
```

Por que estas variaveis existem:

- evitar hardcode de URL e endpoint no codigo
- permitir trocar backend sem alterar source
- validar ambiente logo no startup (erros claros quando faltar config)

## 9. Scripts do Projeto

Na raiz:

```bash
pnpm install
pnpm dev
```

Scripts principais:

- `pnpm dev`: sobe apps via Turborepo
- `pnpm build`: build de todos os pacotes/apps
- `pnpm lint`: lint de todos os pacotes/apps

Frontend isolado:

```bash
pnpm --filter @nex-rural/web dev
```

URL local:

- `http://localhost:3000`

## 10. Como Testar a Conexao com o Backend

1. Garanta backend ativo em `http://localhost:8081`
2. Configure `.env.local` com `NEXT_PUBLIC_API_URL` e `NEXT_PUBLIC_STATUS_PATH`
3. Rode `pnpm --filter @nex-rural/web dev`
4. Acesse `http://localhost:3000/backend-check`
5. Clique em `Recarregar`

Resultado esperado:

- sucesso: payload JSON renderizado no card
- erro: mensagem amigavel com status HTTP

## 11. Mapa Rapido de Onde Mexer

Para layout e paginas:

- `apps/web/src/app/**`

Para formularios de auth:

- `apps/web/src/components/auth/**`

Para regras de permissao:

- `apps/web/src/lib/access-control.ts`

Para endpoints e integracao:

- `apps/web/src/services/**`

Para storage e env:

- `apps/web/src/lib/storage.ts`
- `apps/web/src/lib/env.ts`

Para componentes visuais base:

- `packages/ui/src/**`

## 12. VSCode

Ja configurado:

- `.vscode/settings.json`
- `.vscode/extensions.json`

Objetivo:

- padronizar lint, sugestoes de Tailwind e TypeScript no workspace.

## 13. Renomear Pasta Fisica para `nex-rural`

No Windows, com VSCode/terminais fechados:

```powershell
Set-Location "c:\Users\erics\OneDrive\Desktop\patrick trabalhos\Agromach"
Rename-Item -Path "agromachmonorepo" -NewName "nex-rural"
```
