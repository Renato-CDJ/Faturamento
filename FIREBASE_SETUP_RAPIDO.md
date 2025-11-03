# 🚀 Setup Rápido do Firebase - Corrigir Erro de Permissões

## ❌ Erro Atual
\`\`\`
Missing or insufficient permissions
\`\`\`

Este erro acontece porque o Firebase está bloqueando o acesso aos dados. Você precisa configurar as regras de segurança.

---

## ✅ Solução Rápida (Desenvolvimento)

### Passo 1: Acessar o Console do Firebase

1. Acesse: https://console.firebase.google.com/
2. Selecione seu projeto: **faturamento-7d690**

### Passo 2: Configurar Firestore

1. No menu lateral, clique em **Firestore Database**
2. Se ainda não criou o banco, clique em **Criar banco de dados**
   - Escolha **Modo de produção** (vamos mudar as regras depois)
   - Selecione a localização mais próxima (ex: `southamerica-east1` para São Paulo)
3. Clique na aba **Regras** (Rules)
4. **Copie e cole** o conteúdo do arquivo `firebase-rules-development.rules`
5. Clique em **Publicar** (Publish)

### Passo 3: Criar as Coleções Iniciais

Agora você precisa criar as coleções no Firestore. Você pode fazer isso de duas formas:

#### Opção A: Manualmente no Console (Mais Rápido)

1. No Firestore Database, clique em **Iniciar coleção**
2. Crie a coleção `categories` com um documento de exemplo:
   \`\`\`
   ID do documento: (deixe automático)
   Campos:
   - name: "Alimentação" (string)
   - type: "all" (string)
   - color: "#10b981" (string)
   - createdAt: (timestamp - clique no relógio e selecione "agora")
   - updatedAt: (timestamp - clique no relógio e selecione "agora")
   \`\`\`
3. Repita para criar mais categorias:
   - Transporte (#3b82f6)
   - Moradia (#8b5cf6)
   - Saúde (#ef4444)
   - Lazer (#f59e0b)
   - Outros (#6b7280)

#### Opção B: Via Script (Recomendado)

Vou criar um script para você adicionar as categorias automaticamente.

---

## ⚠️ IMPORTANTE: Segurança

As regras que você acabou de adicionar permitem que **QUALQUER PESSOA** leia e escreva no seu banco de dados. Isso é **APENAS PARA DESENVOLVIMENTO LOCAL**.

### Antes de colocar em produção, você DEVE:

1. Implementar autenticação Firebase
2. Substituir as regras por regras seguras (veja `FIREBASE_RULES.md`)
3. Adicionar o campo `user_id` em todos os documentos

---

## 🔐 Próximos Passos (Produção)

Quando estiver pronto para produção, siga o guia completo em `FIREBASE_AUTH_SETUP.md` para:

1. Implementar Firebase Authentication
2. Adicionar login/registro de usuários
3. Proteger os dados com regras de segurança adequadas
4. Associar dados aos usuários autenticados

---

## 🧪 Testar Agora

Depois de aplicar as regras de desenvolvimento:

1. Recarregue seu app
2. Os erros de permissão devem desaparecer
3. Você poderá adicionar despesas, dívidas e parcelamentos

Se ainda houver erros, verifique:
- As regras foram publicadas corretamente no Console
- O Firestore Database foi criado
- A configuração do Firebase no código está correta
