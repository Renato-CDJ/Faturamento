# Faturamento Auth App

## Descrição

O **Faturamento Auth App** é uma aplicação React que implementa um sistema de autenticação utilizando Firebase. O projeto permite que usuários se registrem, façam login e acessem suas informações de perfil de forma segura. Além disso, inclui proteção de rotas para garantir que apenas usuários autenticados possam acessar determinadas páginas.

## Estrutura do Projeto

A estrutura do projeto é organizada da seguinte forma:

```
faturamento-auth-app
├── src
│   ├── index.tsx                # Ponto de entrada da aplicação
│   ├── App.tsx                  # Componente principal da aplicação
│   ├── firebase
│   │   └── config.ts            # Configuração do Firebase
│   ├── components
│   │   ├── auth
│   │   │   ├── Login.tsx        # Componente de login
│   │   │   ├── Register.tsx     # Componente de registro
│   │   │   └── Logout.tsx       # Componente de logout
│   │   ├── Profile.tsx          # Componente de perfil do usuário
│   │   └── ProtectedRoute.tsx   # Componente para proteção de rotas
│   ├── contexts
│   │   └── AuthContext.tsx      # Contexto de autenticação
│   ├── hooks
│   │   └── useAuth.ts           # Hook personalizado para autenticação
│   ├── services
│   │   └── userService.ts       # Serviços de autenticação
│   ├── pages
│   │   ├── Home.tsx             # Página inicial
│   │   └── Dashboard.tsx        # Página do dashboard
│   ├── routes
│   │   └── index.tsx            # Configuração das rotas
│   ├── types
│   │   └── index.ts             # Tipos e interfaces TypeScript
│   └── styles
│       └── global.css           # Estilos globais
├── public
│   └── index.html               # HTML principal da aplicação
├── .env.example                  # Exemplo de variáveis de ambiente
├── package.json                  # Configuração do npm
├── tsconfig.json                 # Configuração do TypeScript
└── README.md                     # Documentação do projeto
```

## Funcionalidades

- **Registro de Usuário**: Permite que novos usuários se registrem na aplicação.
- **Login de Usuário**: Usuários existentes podem fazer login com email e senha.
- **Logout de Usuário**: Usuários podem sair da aplicação.
- **Perfil do Usuário**: Exibe informações do usuário autenticado.
- **Proteção de Rotas**: Restringe o acesso a páginas específicas para usuários autenticados.

## Como Começar

1. Clone o repositório:
   ```
   git clone <URL_DO_REPOSITORIO>
   ```
2. Navegue até o diretório do projeto:
   ```
   cd faturamento-auth-app
   ```
3. Instale as dependências:
   ```
   npm install
   ```
4. Configure suas variáveis de ambiente no arquivo `.env` com base no `.env.example`.
5. Inicie a aplicação:
   ```
   npm start
   ```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.