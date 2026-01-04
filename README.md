# ManufacManager

Gerenciamento completo de manufatura e estoque: sistema full-stack para controlar produtos, fornecedores, clientes, pedidos, produção e estoque. Frontend em React/Next.js + Tailwind e backend em Node.js/Express com suporte a PostgreSQL/MySQL.

## Índice

- Sobre o Projeto
- Funcionalidades
	- Frontend
	- Backend
- Tecnologias Utilizadas
- Estrutura do Banco de Dados
- Melhorias Futuras
- Como Executar
- Observações

## Sobre o Projeto

O ManufacManager nasceu como um sistema para gerenciar confecções, mas foi desenvolvido de forma genérica para suportar qualquer tipo de manufatura ou loja que precise de:

- Cadastro de clientes, fornecedores e produtos
- Controle de pedidos e produção
- Controle de estoque, com histórico e saldo total
- Autenticação e autorização de usuários com diferentes papéis (Admin, Worker, HR)
- Interface amigável e responsiva

O projeto está dividido em duas partes principais:

- `manufac-backend`: API REST em Node.js/Express
- `manufac-frontend`: SPA em Next.js (App Router) + Tailwind

Comunicação entre front e back via Axios; segurança com JWT.

## Funcionalidades

**Frontend**

- Dashboard com abas de Histórico de Estoque e Estoque Total
- Tabelas dinâmicas com paginação, filtros e busca
- Modais para criar/editar registros (clientes, produtos, estoque etc.)
- Seleção múltipla e exclusão em lote
- Rotas protegidas com `ProtectedRoute` e gerenciamento de sessões

**Backend**

- APIs RESTful construídas com Node.js + Express
- CRUD completo para: Clientes, Fornecedores, Produtos, Pedidos, Produção e Estoque
- Controle de estoque automático com entradas/saídas e cálculo de saldo atual
- Autenticação via JWT com papéis (Admin, Worker, HR)
- Validação de dados e tratamento centralizado de erros

## Tecnologias Utilizadas

**Frontend**

- Next.js (App Router) + React 18
- TypeScript
- Tailwind CSS
- Axios

**Backend**

- Node.js + Express
- TypeScript
- MySQL
- JWT para autenticação

## Estrutura do Banco de Dados (exemplo simplificado)

**Clientes**

| id | nome | email | telefone | endereco |

**Fornecedores**

| id | nome | contato |

**Produtos**

| id | nome | categoria | tamanho | cor | preco | estoque | fornecedor_id |

**Pedidos**

| id | cliente_id | status | data | total |

**Produção**

| id | produto_id | quantidade | status | prazo |

**Estoque**

| id | produto_id | quantidade | tipo (Entrada/Saída) | data |

## Melhorias Futuras

- Dashboard funcional
- Painel de relatórios (vendas, produção, estoque)
- Gráficos interativos
- Melhoria no mobile

## Como Executar

1. Clone o repositório

```bash
git clone https://github.com/JGuylherme/manufacmanager.git
cd manufacmanager
```

2. Instale dependências

```bash
cd manufac-backend && npm install
cd ../manufac-frontend && npm install
```

3. Configure variáveis de ambiente

- Crie um arquivo `.env` no backend com as configurações do banco e JWT (ex: `DATABASE_URL`, `JWT_SECRET`, `PORT`).

4. Rode o backend

```bash
cd manufac-backend
npm run dev
```

5. Rode o frontend

```bash
cd manufac-frontend
npm run dev
```

6. Abra o app

Abra http://localhost:3000 no navegador (ou a porta configurada no frontend).
 
## Script para adicionar um usuário admin

O projeto inclui um script para criar um usuário diretamente no banco. O arquivo está em `manufac-backend/scripts/createUser.js` e usa o pool em `manufac-backend/config/db.js` (mysql2) e `bcryptjs` para hashear a senha.

Como usar:

1. Verifique se o banco e as variáveis em `manufac-backend/.env` estão corretas e que `manufac-backend/config/db.js` consegue conectar.
2. Instale dependências do backend (se ainda não instalou):

```bash
cd manufac-backend
npm install
```

3. Edite `manufac-backend/scripts/createUser.js` para ajustar `nome`, `email`, `senha` e `papel` conforme necessário.

4. Execute o script:

```bash
node manufac-backend/scripts/createUser.js
```

O script exibirá o `insertId` do usuário criado ou uma mensagem de erro em caso de falha.

Observações e segurança:

- Use uma senha segura ao criar contas administrativas e remova ou proteja esse script em ambientes de produção.
- Como alternativa, você pode transformar o script para aceitar argumentos de linha de comando (ex: `process.argv`) ou variáveis de ambiente.
- Se preferir, posso adaptar o script para ler `nome`, `email`, `senha` e `papel` via `process.argv` ou `readline` para evitar editar o arquivo a cada execução.
