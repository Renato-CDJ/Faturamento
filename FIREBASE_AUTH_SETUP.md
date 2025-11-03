# 🔐 Implementação de Autenticação Firebase (Para Produção)

## Por que você precisa de autenticação?

Atualmente, seu app usa regras de desenvolvimento que permitem acesso total aos dados. Para produção, você precisa:

1. Identificar usuários
2. Proteger dados pessoais
3. Garantir que cada usuário veja apenas seus próprios dados

---

## Passo 1: Ativar Firebase Authentication

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Selecione seu projeto: **faturamento-7d690**
3. No menu lateral, clique em **Authentication**
4. Clique em **Começar** (Get Started)
5. Na aba **Sign-in method**, ative:
   - **Email/Password** (recomendado para começar)
   - Opcionalmente: Google, Facebook, etc.

---

## Passo 2: Implementar Login/Registro

Vou criar os componentes de autenticação para você. Eles incluirão:

- Página de login
- Página de registro
- Proteção de rotas
- Contexto de autenticação
- Logout

---

## Passo 3: Atualizar Regras de Segurança

Depois de implementar autenticação, substitua as regras de desenvolvimento pelas regras seguras do arquivo `FIREBASE_RULES.md`.

---

## Passo 4: Adicionar user_id aos Dados

Todos os documentos precisarão do campo `user_id` para associar dados aos usuários:

\`\`\`typescript
// Exemplo ao criar uma despesa
await addDoc(collection(db, 'expenses'), {
  description: 'Almoço',
  amount: 50,
  category: 'Alimentação',
  date: new Date(),
  user_id: currentUser.uid, // ID do usuário autenticado
  createdAt: serverTimestamp()
})
\`\`\`

---

## Quer que eu implemente a autenticação agora?

Posso criar todo o sistema de autenticação para você, incluindo:

- ✅ Componentes de login e registro
- ✅ Proteção de rotas
- ✅ Contexto de autenticação global
- ✅ Atualização automática dos hooks para incluir user_id
- ✅ Página de perfil do usuário

Basta me pedir: "Implemente a autenticação Firebase"
