# Danielle Medicações 💊

Sistema web para controle de medicamentos e horários, com alarme automático que avisa 5 minutos antes de cada dose.

O administrador cadastra os medicamentos e seus horários; a aplicação verifica continuamente se algum remédio está próximo do horário e dispara um alerta sonoro e visual, que permanece na tela até ser confirmado manualmente.

## Índice

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como rodar localmente](#como-rodar-localmente)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Rotas da API](#rotas-da-api)
- [Como funciona o alarme](#como-funciona-o-alarme)
- [Roadmap](#roadmap)

## Funcionalidades

- Cadastro e login de administrador, com senha criptografada e sessão via token (JWT)
- Cadastro, edição e exclusão de medicamentos (nome, dose, observações)
- Cadastro e exclusão de horários por medicamento (um medicamento pode ter vários horários no dia)
- Alarme automático: 5 minutos antes de cada horário, uma notificação sonora e visual aparece na tela e só é dispensada ao clicar em "OK"
- Cada administrador só acessa e gerencia os próprios medicamentos
- Rotas protegidas tanto no backend quanto no frontend

## Tecnologias

**Backend**
- Node.js + Express
- SQLite (via `better-sqlite3`)
- JWT (`jsonwebtoken`) para autenticação
- `bcryptjs` para criptografia de senha
- `cors`, `dotenv`

**Frontend**
- React 19 + Vite
- React Router (`react-router-dom`)
- Axios
- Web Audio API (som do alarme, gerado nativamente, sem arquivos de áudio externos)
- CSS puro, com variáveis de design (paleta, tipografia)

## Estrutura do projeto

```
Danielle-medicacoes/
├── backend/
│   ├── src/
│   │   ├── config/         # conexão com o banco e criação das tabelas
│   │   ├── middleware/      # middleware de autenticação (JWT)
│   │   ├── models/          # Administrador, Medicamento, Horario
│   │   ├── routes/          # authRoutes, medicamentoRoutes, horarioRoutes
│   │   └── server.js        # ponto de entrada do servidor Express
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Alarme, RotaProtegida
    │   ├── pages/            # Login, Cadastro, Painel
    │   ├── services/         # api.js, authService, medicamentoService, horarioService
    │   ├── App.jsx            # definição das rotas
    │   └── main.jsx
    ├── .env.example
    └── package.json
```

## Como rodar localmente

### Pré-requisitos
- Node.js instalado (`node -v` para conferir)

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

O servidor sobe em `http://localhost:3001`.

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

> Backend e frontend precisam estar rodando ao mesmo tempo, em terminais separados.

## Variáveis de ambiente

**backend/.env**
| Variável | Descrição |
|---|---|
| `PORT` | Porta em que o servidor Express roda (padrão: 3001) |
| `JWT_SECRET` | Chave secreta usada para assinar os tokens de autenticação |

**frontend/.env**
| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API do backend (padrão: `http://localhost:3001/api`) |

## Rotas da API

Todas as rotas abaixo (exceto cadastro/login) exigem o cabeçalho `Authorization: Bearer <token>`.

**Autenticação**
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/cadastro` | Cria um novo administrador |
| POST | `/api/auth/login` | Autentica e devolve um token |
| GET | `/api/auth/me` | Retorna os dados do administrador logado |

**Medicamentos**
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/medicamentos` | Cadastra um medicamento |
| GET | `/api/medicamentos` | Lista os medicamentos do administrador logado |
| PUT | `/api/medicamentos/:id` | Atualiza um medicamento |
| DELETE | `/api/medicamentos/:id` | Exclui um medicamento (e seus horários) |

**Horários**
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/horarios` | Lista todos os horários ativos do administrador |
| GET | `/api/horarios/medicamento/:medicamentoId` | Lista os horários de um medicamento específico |
| POST | `/api/horarios` | Adiciona um horário a um medicamento |
| DELETE | `/api/horarios/:id` | Remove um horário |

## Como funciona o alarme

1. A cada 20 segundos, o painel consulta a rota `GET /api/horarios`
2. Para cada horário ativo, calcula o instante "5 minutos antes"
3. Se o horário atual estiver dentro dessa janela (entre 5 minutos antes e o horário exato), o alarme é exibido: uma mensagem em tela cheia com o nome do medicamento, acompanhada de um som gerado via Web Audio API que se repete a cada segundo
4. O alarme só é dispensado ao clicar em "OK" — o clique é salvo no `localStorage` do navegador, para que o mesmo alarme não volte a aparecer no mesmo dia

## Roadmap

Funcionalidades planejadas para as próximas etapas:
- Segundo tipo de conta (usuário comum): cadastrado pelo administrador, com acesso somente leitura aos medicamentos e horários
- Perfil de usuário com foto

---

Projeto construído em conjunto com o Claude (Anthropic), passo a passo, arquivo por arquivo.