# Guia de Migração: Supabase → Firebase

Este guia mostra como migrar seus componentes do Supabase para o Firebase.

## 🎯 Estratégia de Migração

Você tem 3 opções:

### Opção 1: Migração Completa (Recomendado para novos projetos)
Substitua todos os hooks do Supabase pelos do Firebase.

### Opção 2: Migração Gradual
Migre componente por componente, mantendo ambos funcionando.

### Opção 3: Modo Híbrido
Use Supabase para alguns recursos e Firebase para outros.

## 📝 Passo a Passo - Migração Completa

### 1. Atualizar `components/debts-list.tsx`

\`\`\`typescript
// ANTES
import { useDebts } from "@/lib/hooks/use-debts"

// DEPOIS
import { useDebts } from "@/lib/hooks/use-debts-firebase"
\`\`\`

### 2. Atualizar `components/add-debt-dialog.tsx`

\`\`\`typescript
// ANTES
import { useDebts } from "@/lib/hooks/use-debts"

// DEPOIS
import { useDebts } from "@/lib/hooks/use-debts-firebase"
\`\`\`

### 3. Atualizar `components/edit-debt-dialog.tsx`

\`\`\`typescript
// ANTES
import { useDebts } from "@/lib/hooks/use-debts"

// DEPOIS
import { useDebts } from "@/lib/hooks/use-debts-firebase"
\`\`\`

### 4. Atualizar componentes de Installments

Repita o processo para:
- `components/installments-list.tsx`
- `components/add-installment-dialog.tsx`
- Qualquer outro componente que use `use-installments`

\`\`\`typescript
// ANTES
import { useInstallments } from "@/lib/hooks/use-installments"

// DEPOIS
import { useInstallments } from "@/lib/hooks/use-installments-firebase"
\`\`\`

### 5. Atualizar componentes de Expenses

\`\`\`typescript
// ANTES
import { useExpenses } from "@/lib/hooks/use-expenses"

// DEPOIS
import { useExpenses } from "@/lib/hooks/use-expenses-firebase"
\`\`\`

## 🔄 Migração de Dados

### Exportar Dados do Supabase

1. Acesse o Supabase Dashboard
2. Vá para **Table Editor**
3. Para cada tabela, clique em **Export** → **CSV**

### Importar Dados para Firebase

Crie um script de migração:

\`\`\`typescript
// scripts/migrate-to-firebase.ts
import { getFirebaseDb } from "@/lib/firebase/config"
import { collection, addDoc, Timestamp } from "firebase/firestore"

// Dados exportados do Supabase
const supabaseDebts = [
  // Cole seus dados aqui
]

async function migrateDebts() {
  const db = getFirebaseDb()
  const debtsRef = collection(db, "debts")
  
  for (const debt of supabaseDebts) {
    await addDoc(debtsRef, {
      ...debt,
      created_at: Timestamp.fromDate(new Date(debt.created_at)),
      updated_at: Timestamp.fromDate(new Date(debt.updated_at)),
      due_date: debt.due_date ? Timestamp.fromDate(new Date(debt.due_date)) : null,
    })
  }
  
  console.log("Migração concluída!")
}

migrateDebts()
\`\`\`

## ⚠️ Diferenças Importantes

### 1. IDs de Documentos

**Supabase**: IDs são UUIDs gerados pelo PostgreSQL
\`\`\`typescript
id: "550e8400-e29b-41d4-a716-446655440000"
\`\`\`

**Firebase**: IDs são strings aleatórias geradas pelo Firestore
\`\`\`typescript
id: "9JKHgf8dKJHgf8dKJHgf"
\`\`\`

### 2. Timestamps

**Supabase**: Strings ISO 8601
\`\`\`typescript
created_at: "2024-01-15T10:30:00.000Z"
\`\`\`

**Firebase**: Objetos Timestamp
\`\`\`typescript
created_at: Timestamp.now()
\`\`\`

### 3. Queries

**Supabase**: SQL-like
\`\`\`typescript
const { data } = await supabase
  .from("debts")
  .select("*")
  .eq("user_id", userId)
\`\`\`

**Firebase**: SDK do Firestore
\`\`\`typescript
const q = query(
  collection(db, "debts"),
  where("user_id", "==", userId)
)
const snapshot = await getDocs(q)
\`\`\`

## ✅ Checklist de Migração

- [ ] Adicionar regras de segurança no Firebase Console
- [ ] Atualizar imports em `debts-list.tsx`
- [ ] Atualizar imports em `add-debt-dialog.tsx`
- [ ] Atualizar imports em `edit-debt-dialog.tsx`
- [ ] Atualizar imports em `installments-list.tsx`
- [ ] Atualizar imports em `add-installment-dialog.tsx`
- [ ] Atualizar imports em componentes de expenses
- [ ] Migrar dados existentes (se houver)
- [ ] Testar todas as funcionalidades
- [ ] Adicionar autenticação (opcional)
- [ ] Remover dependências do Supabase (opcional)

## 🧪 Testando a Migração

1. **Teste de Leitura**: Verifique se os dados são carregados
2. **Teste de Criação**: Adicione uma nova dívida/despesa
3. **Teste de Atualização**: Edite um registro existente
4. **Teste de Exclusão**: Delete um registro
5. **Teste de Validação**: Tente criar dados inválidos

## 🔙 Rollback (Se Necessário)

Se algo der errado, você pode voltar para o Supabase:

1. Reverta os imports para os hooks originais
2. Seus dados no Supabase permanecerão intactos
3. O Firebase não afeta o Supabase

## 💡 Dicas

- Faça a migração em um branch separado do Git
- Teste em ambiente de desenvolvimento primeiro
- Mantenha backups dos dados do Supabase
- Documente quaisquer customizações feitas
