# Estrutura Completa das Coleções Firebase

Este documento detalha todas as coleções que você precisa criar no Firebase Firestore para o sistema de controle financeiro.

## 📋 Índice de Coleções

1. [categories](#1-categories) - Categorias personalizadas
2. [expenses](#2-expenses) - Despesas
3. [debts](#4-debts) - Dívidas
4. [debt_participants](#5-debt_participants) - Participantes de dívidas divididas
5. [installments](#6-installments) - Parcelamentos

---

## 1. categories

Armazena as categorias personalizadas criadas pelo usuário.

### Estrutura do Documento

\`\`\`typescript
{
  name: string,           // Nome da categoria (ex: "Alimentação", "Transporte")
  type: string,           // Tipo: "all", "expense", "debt", ou "installment"
  color: string,          // Cor em hexadecimal (ex: "#FF5733")
  created_at: Timestamp   // Data de criação
}
\`\`\`

### Exemplo de Documento

\`\`\`json
{
  "name": "Alimentação",
  "type": "expense",
  "color": "#FF5733",
  "created_at": "2025-01-15T10:30:00Z"
}
\`\`\`

### Categorias Padrão para Criar

\`\`\`javascript
// Copie e cole no Firestore Console
[
  { "name": "Alimentação", "type": "expense", "color": "#FF5733" },
  { "name": "Transporte", "type": "expense", "color": "#3498DB" },
  { "name": "Moradia", "type": "expense", "color": "#2ECC71" },
  { "name": "Saúde", "type": "expense", "color": "#E74C3C" },
  { "name": "Lazer", "type": "expense", "color": "#9B59B6" },
  { "name": "Educação", "type": "expense", "color": "#F39C12" },
  { "name": "Vestuário", "type": "expense", "color": "#1ABC9C" },
  { "name": "Eletrônicos", "type": "installment", "color": "#34495E" },
  { "name": "Dívidas", "type": "debt", "color": "#E67E22" },
  { "name": "Outros", "type": "all", "color": "#95A5A6" }
]
\`\`\`

---

## 2. expenses

Armazena todas as despesas registradas.

### Estrutura do Documento

\`\`\`typescript
{
  description: string,    // Descrição da despesa
  amount: number,         // Valor total da despesa
  category: string,       // Nome da categoria
  date: Timestamp,        // Data da despesa
  is_split: boolean,      // Se a despesa é dividida
  split_parts: number,    // Número de partes da divisão
  created_at: Timestamp,  // Data de criação do registro
  updated_at: Timestamp   // Data da última atualização
}
\`\`\`

### Exemplo de Documento

\`\`\`json
{
  "description": "Jantar no restaurante",
  "amount": 150.00,
  "category": "Alimentação",
  "date": "2025-01-15T19:30:00Z",
  "is_split": false,
  "split_parts": 1,
  "created_at": "2025-01-15T20:00:00Z",
  "updated_at": "2025-01-15T20:00:00Z"
}
\`\`\`

---

## 3. debts

Armazena as dívidas registradas.

### Estrutura do Documento

\`\`\`typescript
{
  name: string,           // Nome/descrição da dívida
  total_amount: number,   // Valor total da dívida
  paid_amount: number,    // Valor já pago
  due_date: Timestamp | null, // Data de vencimento (opcional)
  category: string,       // Nome da categoria
  is_split: boolean,      // Se a dívida é dividida
  split_parts: number,    // Número de partes da divisão
  is_paid: boolean,       // Se a dívida está totalmente paga
  created_at: Timestamp,  // Data de criação
  updated_at: Timestamp   // Data da última atualização
}
\`\`\`

### Exemplo de Documento

\`\`\`json
{
  "name": "Cartão de Crédito",
  "total_amount": 5000.00,
  "paid_amount": 1500.00,
  "due_date": "2025-02-15T00:00:00Z",
  "category": "Dívidas",
  "is_split": false,
  "split_parts": 1,
  "is_paid": false,
  "created_at": "2025-01-10T10:00:00Z",
  "updated_at": "2025-01-15T14:30:00Z"
}
\`\`\`

---

## 4. debt_participants

Armazena os participantes de dívidas divididas.

### Estrutura do Documento

\`\`\`typescript
{
  debt_id: string,        // ID da dívida relacionada
  name: string,           // Nome do participante
  parts: number,          // Número de partes que o participante paga
  amount_owed: number,    // Valor que o participante deve pagar
  is_paid: boolean,       // Se o participante já pagou
  created_at: Timestamp   // Data de criação
}
\`\`\`

### Exemplo de Documento

\`\`\`json
{
  "debt_id": "debt_123abc",
  "name": "João Silva",
  "parts": 1,
  "amount_owed": 2500.00,
  "is_paid": false,
  "created_at": "2025-01-10T10:00:00Z"
}
\`\`\`

---

## 5. installments

Armazena os parcelamentos registrados.

### Estrutura do Documento

\`\`\`typescript
{
  name: string,               // Nome do parcelamento
  total_amount: number,       // Valor total parcelado
  total_installments: number, // Número total de parcelas
  current_installment: number,// Parcela atual
  installment_value: number,  // Valor de cada parcela
  due_date: Timestamp,        // Data de vencimento da próxima parcela
  category: string,           // Nome da categoria
  paid: boolean,              // Se a parcela atual está paga
  is_split: boolean,          // Se o parcelamento é dividido
  split_parts: number,        // Número de partes da divisão
  created_at: Timestamp,      // Data de criação
  updated_at: Timestamp       // Data da última atualização
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
  "is_split": false,
  "split_parts": 1,
  "created_at": "2024-09-01T10:00:00Z",
  "updated_at": "2025-01-15T08:00:00Z"
}
\`\`\`

---

## 🔐 Regras de Segurança Completas

Copie e cole estas regras no Firebase Console (Firestore Database > Rules):

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Categories - Todos podem ler, apenas autenticados podem escrever
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Expenses - Todos podem ler, apenas autenticados podem escrever
    match /expenses/{expenseId} {
      allow read: if true;
      allow create: if request.auth != null 
        && request.resource.data.keys().hasAll(['description', 'amount', 'category', 'date', 'is_split'])
        && request.resource.data.amount is number
        && request.resource.data.amount > 0;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }
    
    // Debts - Todos podem ler, apenas autenticados podem escrever
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
    
    // Debt Participants - Todos podem ler, apenas autenticados podem escrever
    match /debt_participants/{participantId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Installments - Todos podem ler, apenas autenticados podem escrever
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

## ✅ Passo a Passo para Configurar

### 1. Criar o Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Dê um nome ao projeto
4. Desabilite o Google Analytics (opcional)
5. Clique em "Criar projeto"

### 2. Ativar o Firestore

1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (você mudará as regras depois)
4. Escolha a localização (recomendado: southamerica-east1 para Brasil)
5. Clique em "Ativar"

### 3. Criar as Coleções

**IMPORTANTE:** No Firestore, as coleções são criadas automaticamente quando você adiciona o primeiro documento. Siga estes passos:

#### 3.1. Criar a coleção "categories"

1. Clique em "Iniciar coleção"
2. ID da coleção: `categories`
3. Clique em "Próximo"
4. Adicione o primeiro documento:
   - ID do documento: (deixe em branco para gerar automaticamente)
   - Campos:
     - `name` (string): "Alimentação"
     - `type` (string): "expense"
     - `color` (string): "#FF5733"
     - `created_at` (timestamp): clique no relógio e selecione a data/hora atual
5. Clique em "Salvar"
6. Repita para adicionar as outras 9 categorias padrão listadas acima

#### 3.2. Criar a coleção "expenses"

1. Clique em "Iniciar coleção"
2. ID da coleção: `expenses`
3. Adicione um documento de exemplo:
   - `description` (string): "Exemplo de despesa"
   - `amount` (number): 100
   - `category` (string): "Alimentação"
   - `date` (timestamp): data atual
   - `is_split` (boolean): false
   - `split_parts` (number): 1
   - `created_at` (timestamp): data atual
   - `updated_at` (timestamp): data atual
4. Clique em "Salvar"
5. Você pode deletar este documento depois

#### 3.3. Criar a coleção "debts"

1. Clique em "Iniciar coleção"
2. ID da coleção: `debts`
3. Adicione um documento de exemplo:
   - `name` (string): "Exemplo de dívida"
   - `total_amount` (number): 1000
   - `paid_amount` (number): 0
   - `due_date` (timestamp): data futura
   - `category` (string): "Dívidas"
   - `is_split` (boolean): false
   - `split_parts` (number): 1
   - `is_paid` (boolean): false
   - `created_at` (timestamp): data atual
   - `updated_at` (timestamp): data atual
4. Clique em "Salvar"

#### 3.4. Criar a coleção "debt_participants"

1. Clique em "Iniciar coleção"
2. ID da coleção: `debt_participants`
3. Adicione um documento de exemplo (você pode deletar depois):
   - `debt_id` (string): "exemplo"
   - `name` (string): "Participante Exemplo"
   - `parts` (number): 1
   - `amount_owed` (number): 500
   - `is_paid` (boolean): false
   - `created_at` (timestamp): data atual
4. Clique em "Salvar"

#### 3.5. Criar a coleção "installments"

1. Clique em "Iniciar coleção"
2. ID da coleção: `installments`
3. Adicione um documento de exemplo:
   - `name` (string): "Exemplo de parcelamento"
   - `total_amount` (number): 1200
   - `total_installments` (number): 12
   - `current_installment` (number): 1
   - `installment_value` (number): 100
   - `due_date` (timestamp): data futura
   - `category` (string): "Eletrônicos"
   - `paid` (boolean): false
   - `is_split` (boolean): false
   - `split_parts` (number): 1
   - `created_at` (timestamp): data atual
   - `updated_at` (timestamp): data atual
4. Clique em "Salvar"

### 4. Configurar as Regras de Segurança

1. No Firestore, clique na aba "Regras"
2. Apague todo o conteúdo
3. Copie e cole as regras de segurança listadas acima
4. Clique em "Publicar"

### 5. Obter as Credenciais do Firebase

1. No Firebase Console, clique no ícone de engrenagem > "Configurações do projeto"
2. Role até "Seus aplicativos"
3. Clique no ícone da web `</>`
4. Dê um nome ao app (ex: "Controle Financeiro")
5. Copie as credenciais que aparecem:

\`\`\`javascript
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
\`\`\`

6. Cole essas credenciais nas variáveis de ambiente do seu projeto

---

## 🎯 Checklist Final

- [ ] Projeto Firebase criado
- [ ] Firestore Database ativado
- [ ] Coleção `categories` criada com 10 categorias padrão
- [ ] Coleção `expenses` criada
- [ ] Coleção `debts` criada
- [ ] Coleção `debt_participants` criada
- [ ] Coleção `installments` criada
- [ ] Regras de segurança configuradas
- [ ] Credenciais do Firebase copiadas
- [ ] Variáveis de ambiente configuradas no projeto

---

## 🚀 Pronto!

Agora seu Firebase está configurado e pronto para uso. A aplicação irá:

- Criar automaticamente novos documentos quando você adicionar despesas, dívidas ou parcelamentos
- Gerenciar as categorias através da interface
- Sincronizar todos os dados em tempo real

Se tiver algum problema, verifique:
1. As credenciais do Firebase estão corretas nas variáveis de ambiente
2. As regras de segurança foram publicadas
3. Todas as 5 coleções foram criadas
4. As categorias padrão foram adicionadas
