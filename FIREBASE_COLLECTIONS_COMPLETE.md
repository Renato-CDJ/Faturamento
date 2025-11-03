# Estrutura Completa das Coleções Firebase

Este documento detalha todas as coleções que você precisa criar no Firebase Firestore para o sistema de faturamento.

## 📋 Índice de Coleções

1. [categories](#1-categories) - Categorias personalizadas
2. [expenses](#2-expenses) - Despesas
3. [expense_participants](#3-expense_participants) - Participantes de despesas divididas
4. [debts](#4-debts) - Dívidas
5. [installments](#5-installments) - Parcelamentos

---

## 1. categories

Armazena as categorias personalizadas criadas pelo usuário.

### Estrutura do Documento

\`\`\`typescript
{
  name: string,           // Nome da categoria (ex: "Alimentação", "Transporte")
  icon: string,           // Emoji ou ícone da categoria (ex: "🍔", "🚗")
  created_at: Timestamp   // Data de criação
}
\`\`\`

### Exemplo de Documento

\`\`\`json
{
  "name": "Alimentação",
  "icon": "🍔",
  "created_at": "2025-01-15T10:30:00Z"
}
\`\`\`

### Regras de Segurança

\`\`\`javascript
match /categories/{categoryId} {
  allow read: if true;
  allow write: if request.auth != null;
}
\`\`\`

### Índices Necessários

- `name` (Ascending) - Para ordenação alfabética

---

## 2. expenses

Armazena todas as despesas registradas.

### Estrutura do Documento

\`\`\`typescript
{
  description: string,    // Descrição da despesa
  amount: number,         // Valor total da despesa
  category: string,       // Categoria da despesa
  date: string,          // Data da despesa (ISO 8601)
  is_split: boolean,     // Se a despesa é dividida
  split_parts: number,   // Número de partes da divisão (se is_split = true)
  created_at: Timestamp, // Data de criação do registro
  updated_at: Timestamp  // Data da última atualização
}
\`\`\`

### Exemplo de Documento

\`\`\`json
{
  "description": "Jantar no restaurante",
  "amount": 150.00,
  "category": "Alimentação",
  "date": "2025-01-15T19:30:00Z",
  "is_split": true,
  "split_parts": 3,
  "created_at": "2025-01-15T20:00:00Z",
  "updated_at": "2025-01-15T20:00:00Z"
}
\`\`\`

### Regras de Segurança

\`\`\`javascript
match /expenses/{expenseId} {
  allow read: if true;
  allow create: if request.auth != null 
    && request.resource.data.keys().hasAll(['description', 'amount', 'category', 'date', 'is_split'])
    && request.resource.data.amount is number
    && request.resource.data.amount > 0;
  allow update: if request.auth != null;
  allow delete: if request.auth != null;
}
\`\`\`

### Índices Necessários

- `date` (Descending) - Para listar despesas mais recentes primeiro
- `category` (Ascending) + `date` (Descending) - Para filtrar por categoria

---

## 3. expense_participants

Armazena os participantes de despesas divididas (subcoleção ou coleção separada).

### Estrutura do Documento

\`\`\`typescript
{
  expense_id: string,    // ID da despesa relacionada
  name: string,          // Nome do participante
  parts: number,         // Número de partes que o participante paga
  amount: number,        // Valor que o participante deve pagar
  created_at: Timestamp  // Data de criação
}
\`\`\`

### Exemplo de Documento

\`\`\`json
{
  "expense_id": "exp_123abc",
  "name": "João Silva",
  "parts": 1,
  "amount": 50.00,
  "created_at": "2025-01-15T20:00:00Z"
}
\`\`\`

### Regras de Segurança

\`\`\`javascript
match /expense_participants/{participantId} {
  allow read: if true;
  allow write: if request.auth != null;
}
\`\`\`

### Índices Necessários

- `expense_id` (Ascending) - Para buscar participantes de uma despesa específica

---

## 4. debts

Armazena as dívidas registradas.

### Estrutura do Documento

\`\`\`typescript
{
  name: string,          // Nome/descrição da dívida
  total_amount: number,  // Valor total da dívida
  paid_amount: number,   // Valor já pago
  due_date: string,      // Data de vencimento (ISO 8601) - opcional
  category: string,      // Categoria da dívida
  created_at: Timestamp, // Data de criação
  updated_at: Timestamp  // Data da última atualização
}
\`\`\`

### Exemplo de Documento

\`\`\`json
{
  "name": "Cartão de Crédito",
  "total_amount": 5000.00,
  "paid_amount": 1500.00,
  "due_date": "2025-02-15T00:00:00Z",
  "category": "Financeiro",
  "created_at": "2025-01-10T10:00:00Z",
  "updated_at": "2025-01-15T14:30:00Z"
}
\`\`\`

### Regras de Segurança

\`\`\`javascript
match /debts/{debtId} {
  allow read: if true;
  allow create: if request.auth != null 
    && request.resource.data.keys().hasAll(['name', 'total_amount', 'paid_amount'])
    && request.resource.data.total_amount is number
    && request.resource.data.paid_amount is number
    && request.resource.data.paid_amount >= 0
    && request.resource.data.paid_amount <= request.resource.data.total_amount;
  allow update: if request.auth != null;
  allow delete: if request.auth != null;
}
\`\`\`

### Índices Necessários

- `due_date` (Ascending) - Para ordenar por vencimento
- `created_at` (Descending) - Para listar dívidas mais recentes

---

## 5. installments

Armazena os parcelamentos registrados.

### Estrutura do Documento

\`\`\`typescript
{
  name: string,              // Nome do parcelamento
  total_amount: number,      // Valor total parcelado
  total_installments: number,// Número total de parcelas
  current_installment: number,// Parcela atual
  installment_value: number, // Valor de cada parcela
  due_date: string,          // Data de vencimento da próxima parcela (ISO 8601)
  category: string,          // Categoria do parcelamento
  paid: boolean,             // Se a parcela atual está paga
  created_at: Timestamp,     // Data de criação
  updated_at: Timestamp      // Data da última atualização
}
\`\`\`

### Exemplo de Documento

\`\`\`json
{
  "name": "Notebook Dell",
  "total_amount": 3600.00,
  "total_installments": 12,
  "current_installment": 5,
  "installment_value": 300.00,
  "due_date": "2025-02-05T00:00:00Z",
  "category": "Eletrônicos",
  "paid": false,
  "created_at": "2024-09-01T10:00:00Z",
  "updated_at": "2025-01-15T08:00:00Z"
}
\`\`\`

### Regras de Segurança

\`\`\`javascript
match /installments/{installmentId} {
  allow read: if true;
  allow create: if request.auth != null 
    && request.resource.data.keys().hasAll(['name', 'total_amount', 'total_installments', 'current_installment', 'installment_value', 'due_date', 'paid'])
    && request.resource.data.total_installments is number
    && request.resource.data.current_installment is number
    && request.resource.data.current_installment <= request.resource.data.total_installments;
  allow update: if request.auth != null;
  allow delete: if request.auth != null;
}
\`\`\`

### Índices Necessários

- `due_date` (Ascending) - Para ordenar por vencimento
- `paid` (Ascending) + `due_date` (Ascending) - Para filtrar parcelas pendentes

---

## 🔐 Regras de Segurança Completas

Copie e cole estas regras no Firebase Console (Firestore Database > Rules):

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Categories
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Expenses
    match /expenses/{expenseId} {
      allow read: if true;
      allow create: if request.auth != null 
        && request.resource.data.keys().hasAll(['description', 'amount', 'category', 'date', 'is_split'])
        && request.resource.data.amount is number
        && request.resource.data.amount > 0;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }
    
    // Expense Participants
    match /expense_participants/{participantId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Debts
    match /debts/{debtId} {
      allow read: if true;
      allow create: if request.auth != null 
        && request.resource.data.keys().hasAll(['name', 'total_amount', 'paid_amount'])
        && request.resource.data.total_amount is number
        && request.resource.data.paid_amount is number
        && request.resource.data.paid_amount >= 0
        && request.resource.data.paid_amount <= request.resource.data.total_amount;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }
    
    // Installments
    match /installments/{installmentId} {
      allow read: if true;
      allow create: if request.auth != null 
        && request.resource.data.keys().hasAll(['name', 'total_amount', 'total_installments', 'current_installment', 'installment_value', 'due_date', 'paid'])
        && request.resource.data.total_installments is number
        && request.resource.data.current_installment is number
        && request.resource.data.current_installment <= request.resource.data.total_installments;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }
  }
}
\`\`\`

---

## 📝 Categorias Padrão Sugeridas

Adicione estas categorias iniciais manualmente no Firestore:

\`\`\`javascript
// Categorias sugeridas
const defaultCategories = [
  { name: "Alimentação", icon: "🍔" },
  { name: "Transporte", icon: "🚗" },
  { name: "Moradia", icon: "🏠" },
  { name: "Saúde", icon: "💊" },
  { name: "Lazer", icon: "🎮" },
  { name: "Educação", icon: "📚" },
  { name: "Vestuário", icon: "👕" },
  { name: "Eletrônicos", icon: "💻" },
  { name: "Financeiro", icon: "💰" },
  { name: "Outros", icon: "📁" }
];
\`\`\`

---

## ✅ Checklist de Configuração

- [ ] Criar projeto no Firebase Console
- [ ] Ativar Firestore Database
- [ ] Criar as 5 coleções listadas acima
- [ ] Configurar as regras de segurança
- [ ] Criar os índices necessários (Firebase criará automaticamente quando necessário)
- [ ] Adicionar categorias padrão
- [ ] Testar operações CRUD em cada coleção
- [ ] (Opcional) Configurar Firebase Authentication se necessário

---

## 🚀 Próximos Passos

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto ou selecione o existente
3. Vá em **Firestore Database** > **Create database**
4. Escolha o modo de produção e a localização
5. Copie as regras de segurança acima
6. Adicione as categorias padrão manualmente ou via script
7. Teste a aplicação!
