# Configuração de Produção do Firebase

## ✅ Passos Concluídos

Seu aplicativo agora está configurado com autenticação Firebase completa para produção!

## 🔐 Configurar Regras de Segurança no Firebase Console

### 1. Acesse o Firebase Console
- Vá para: https://console.firebase.google.com
- Selecione seu projeto: **faturamento-7d690**

### 2. Configure o Firestore Security Rules

1. No menu lateral, clique em **Firestore Database**
2. Clique na aba **Regras** (Rules)
3. **Copie e cole** o conteúdo do arquivo `firestore.rules` que foi criado
4. Clique em **Publicar** (Publish)

### 3. Ative a Autenticação por Email/Senha

1. No menu lateral, clique em **Authentication**
2. Clique na aba **Sign-in method**
3. Clique em **Email/Password**
4. **Ative** o provedor Email/Password
5. Clique em **Salvar**

## 🎯 Como Funciona Agora

### Fluxo de Autenticação

1. **Usuário não autenticado** → Redirecionado para `/login`
2. **Novo usuário** → Pode criar conta em `/register`
3. **Usuário autenticado** → Acessa o dashboard `/`
4. **Logout** → Clique no ícone de usuário no header e selecione "Sair"

### Segurança dos Dados

Todas as coleções do Firestore agora estão protegidas:

- ✅ **expenses** - Cada usuário só vê suas próprias despesas
- ✅ **debts** - Cada usuário só vê suas próprias dívidas
- ✅ **installments** - Cada usuário só vê seus próprios parcelamentos
- ✅ **categories** - Cada usuário tem suas próprias categorias

### Estrutura de Dados

Todos os documentos agora incluem automaticamente o campo `userId`:

\`\`\`typescript
{
  userId: "uid-do-usuario-autenticado",
  // ... outros campos
}
\`\`\`

## 📝 Criar Categorias Iniciais

Após fazer login pela primeira vez, você precisará criar suas categorias:

1. Clique no botão **Categorias** no header
2. Adicione suas categorias personalizadas

Ou execute o script de seed (se ainda não executou):

\`\`\`bash
# No terminal do seu projeto local
npm run seed-categories
\`\`\`

## 🧪 Testar o Sistema

### 1. Criar uma Conta

1. Acesse: http://localhost:3000 (ou sua URL de produção)
2. Você será redirecionado para `/login`
3. Clique em "Cadastre-se"
4. Preencha email e senha (mínimo 6 caracteres)
5. Clique em "Criar conta"

### 2. Fazer Login

1. Use o email e senha que você criou
2. Você será redirecionado para o dashboard

### 3. Testar Funcionalidades

- ✅ Adicionar categorias
- ✅ Criar despesas
- ✅ Criar dívidas
- ✅ Criar parcelamentos
- ✅ Fazer logout
- ✅ Fazer login novamente e ver seus dados

## 🚀 Deploy para Produção

Quando estiver pronto para fazer deploy:

1. **Certifique-se** de que as regras de segurança estão publicadas no Firebase Console
2. **Verifique** que a autenticação Email/Password está ativada
3. Faça o deploy normalmente (Vercel, Netlify, etc.)

## 🔒 Segurança Adicional (Opcional)

### Configurar Domínios Autorizados

1. No Firebase Console → **Authentication** → **Settings**
2. Em **Authorized domains**, adicione seus domínios de produção
3. Remova domínios não utilizados

### Configurar Recuperação de Senha

A funcionalidade de recuperação de senha já está implementada no código. Para configurar o email:

1. No Firebase Console → **Authentication** → **Templates**
2. Personalize o template de "Password reset"
3. Configure o remetente do email

## ✅ Checklist Final

- [ ] Regras de segurança publicadas no Firestore
- [ ] Autenticação Email/Password ativada
- [ ] Conta de teste criada e funcionando
- [ ] Categorias criadas
- [ ] Dados sendo salvos corretamente
- [ ] Logout funcionando
- [ ] Login funcionando após logout

## 🆘 Problemas Comuns

### "Missing or insufficient permissions"
- Verifique se as regras de segurança foram publicadas
- Certifique-se de estar autenticado

### "Email already in use"
- Use um email diferente ou faça login com o email existente

### Redirecionamento infinito
- Limpe o cache do navegador
- Verifique se o AuthProvider está no layout.tsx

---

**Pronto!** Seu aplicativo agora está configurado para produção com autenticação segura! 🎉
