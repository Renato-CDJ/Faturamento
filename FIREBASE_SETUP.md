# Guia de Integração Firebase

Este guia explica como usar o Firebase no seu projeto de dashboard financeiro.

## ✅ Configuração Concluída

O Firebase já foi integrado ao projeto com as seguintes configurações:

- **Projeto Firebase**: faturamento-7d690
- **Configuração**: Adicionada em `lib/firebase/config.ts`
- **Hooks**: Criados hooks alternativos que usam Firebase ao invés de Supabase
- **Dependências**: Firebase 12.5.0 já instalado

## 📋 Próximos Passos

### 1. Adicionar as Regras de Segurança

Acesse o [Console do Firebase](https://console.firebase.google.com/) e adicione as regras de segurança:

1. Vá para **Firestore Database > Rules**
2. Copie e cole as regras do arquivo `FIREBASE_RULES.md`
3. Clique em **Publicar**

### 2. Criar as Coleções no Firestore

O Firestore criará as coleções automaticamente quando você adicionar o primeiro documento. As coleções necessárias são:

#### **debts** (Dívidas)
\`\`\`javascript
{
  name: string,              // Nome da dívida
  total_amount: number,      // Valor total
  paid_amount: number,       // Valor já pago
  due_date: Timestamp,       // Data de vencimento
  is_split: boolean,         // Se é dividida entre pessoas
  user_id: string,           // ID do usuário (para segurança)
  created_at: Timestamp,
  updated_at: Timestamp
}
\`\`\`

#### **debt_participants** (Participantes de Dívidas)
\`\`\`javascript
{
  debt_id: string,           // ID da dívida
  name: string,              // Nome do participante
  parts: number,             // Número de partes
  amount_owed: number,       // Valor devido
  is_paid: boolean,          // Se já pagou
  created_at: Timestamp
}
\`\`\`

#### **expenses** (Despesas)
\`\`\`javascript
{
  description: string,       // Descrição da despesa
  amount: number,            // Valor
  category: string,          // Categoria
  date: Timestamp,           // Data da despesa
  user_id: string,           // ID do usuário
  created_at: Timestamp
}
\`\`\`

#### **installments** (Parcelamentos)
\`\`\`javascript
{
  name: string,              // Nome do parcelamento
  total_amount: number,      // Valor total
  installment_count: number, // Número de parcelas
  current_installment: number, // Parcela atual
  installment_value: number, // Valor de cada parcela
  start_date: Timestamp,     // Data de início
  user_id: string,           // ID do usuário
  created_at: Timestamp
}
\`\`\`

### 3. Migrar Componentes para Firebase

Para usar o Firebase ao invés do Supabase, substitua os imports nos componentes:

#### Antes (Supabase):
\`\`\`typescript
import { useDebts } from "@/lib/hooks/use-debts"
\`\`\`

#### Depois (Firebase):
\`\`\`typescript
import { useDebts } from "@/lib/hooks/use-debts-firebase"
\`\`\`

### 4. Componentes que Precisam ser Atualizados

Atualize os seguintes arquivos para usar os hooks do Firebase:

- `components/debts-list.tsx` → use `use-debts-firebase`
- `components/add-debt-dialog.tsx` → use `use-debts-firebase`
- `components/edit-debt-dialog.tsx` → use `use-debts-firebase`
- `components/installments-list.tsx` → use `use-installments-firebase`
- `components/add-installment-dialog.tsx` → use `use-installments-firebase`
- `components/expense-chart.tsx` → use `use-expenses-firebase`
- `components/recent-transactions.tsx` → use `use-expenses-firebase`

## 🔐 Autenticação (Opcional)

Se você quiser adicionar autenticação Firebase:

### 1. Habilitar Autenticação no Console

1. Vá para **Authentication** no Console do Firebase
2. Clique em **Get Started**
3. Habilite o método **Email/Password**

### 2. Criar Componentes de Login

\`\`\`typescript
// lib/firebase/auth.ts
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from "firebase/auth"
import { getFirebaseAuth } from "./config"

export async function signIn(email: string, password: string) {
  const auth = getFirebaseAuth()
  return await signInWithEmailAndPassword(auth, email, password)
}

export async function signUp(email: string, password: string) {
  const auth = getFirebaseAuth()
  return await createUserWithEmailAndPassword(auth, email, password)
}

export async function signOut() {
  const auth = getFirebaseAuth()
  return await firebaseSignOut(auth)
}

export function onAuthChange(callback: (user: any) => void) {
  const auth = getFirebaseAuth()
  return onAuthStateChanged(auth, callback)
}
\`\`\`

### 3. Adicionar user_id aos Documentos

Quando criar novos documentos, adicione o `user_id`:

\`\`\`typescript
const user = auth.currentUser
if (user) {
  await addDebt({
    ...debtData,
    user_id: user.uid  // Adicione o ID do usuário
  })
}
\`\`\`

## 🔄 Comparação: Supabase vs Firebase

| Recurso | Supabase | Firebase |
|---------|----------|----------|
| Banco de Dados | PostgreSQL (SQL) | Firestore (NoSQL) |
| Queries | SQL direto | SDK do Firestore |
| Real-time | Sim | Sim |
| Autenticação | Sim | Sim |
| Regras de Segurança | RLS (Row Level Security) | Security Rules |
| Hospedagem | Supabase | Google Cloud |

## 📊 Vantagens do Firebase

- **Escalabilidade automática**: Escala automaticamente com o uso
- **Real-time nativo**: Atualizações em tempo real sem configuração extra
- **Integração Google**: Fácil integração com outros serviços Google
- **Offline-first**: Suporte nativo para modo offline
- **Analytics integrado**: Google Analytics incluído

## 🛠️ Comandos Úteis

### Verificar Configuração
\`\`\`bash
# O Firebase já está instalado, mas se precisar reinstalar:
npm install firebase
\`\`\`

### Testar Conexão
Adicione este código temporário em qualquer componente:

\`\`\`typescript
import { getFirebaseDb } from "@/lib/firebase/config"

const db = getFirebaseDb()
console.log("Firebase conectado:", db.app.name)
\`\`\`

## 📝 Notas Importantes

1. **Segurança**: Sempre adicione as regras de segurança antes de usar em produção
2. **Índices**: O Firestore pode solicitar criação de índices para queries complexas
3. **Custos**: Monitore o uso no Console do Firebase para evitar custos inesperados
4. **Backup**: Configure backups automáticos no Console do Firebase

## 🆘 Suporte

Se encontrar problemas:

1. Verifique o Console do Firebase para erros
2. Confira as regras de segurança
3. Verifique se as variáveis de ambiente estão corretas
4. Consulte a [documentação oficial do Firebase](https://firebase.google.com/docs)

## 🚀 Modo Híbrido (Supabase + Firebase)

Você pode usar ambos simultaneamente:

- Use Supabase para dados relacionais complexos
- Use Firebase para dados em tempo real e notificações
- Mantenha ambos os hooks disponíveis e escolha por componente
