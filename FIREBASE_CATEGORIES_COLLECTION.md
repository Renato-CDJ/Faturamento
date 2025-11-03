# Estrutura da Coleção de Categorias no Firebase

## Coleção: `categories`

Esta coleção armazena todas as categorias que podem ser usadas em despesas, dívidas e parcelamentos.

### Estrutura do Documento

\`\`\`typescript
{
  id: string,              // ID automático do Firestore
  name: string,            // Nome da categoria (ex: "Alimentação", "Transporte")
  type: string,            // Tipo: "expense", "debt", "installment", ou "all"
  color: string,           // Cor em hexadecimal (ex: "#10b981")
  icon: string,            // Opcional: nome do ícone (para uso futuro)
  createdAt: Timestamp,    // Data de criação
  updatedAt: Timestamp     // Data da última atualização
}
\`\`\`

### Tipos de Categoria

- **`all`**: Categoria disponível para todos os tipos (despesas, dívidas e parcelamentos)
- **`expense`**: Categoria específica para despesas
- **`debt`**: Categoria específica para dívidas
- **`installment`**: Categoria específica para parcelamentos

### Exemplo de Documento

\`\`\`json
{
  "id": "abc123",
  "name": "Alimentação",
  "type": "all",
  "color": "#10b981",
  "icon": "utensils",
  "createdAt": "2025-02-11T10:00:00Z",
  "updatedAt": "2025-02-11T10:00:00Z"
}
\`\`\`

### Categorias Padrão (Seed Data)

Ao configurar o Firebase, adicione estas categorias iniciais:

\`\`\`javascript
const defaultCategories = [
  { name: "Alimentação", type: "all", color: "#10b981" },
  { name: "Transporte", type: "all", color: "#3b82f6" },
  { name: "Moradia", type: "all", color: "#8b5cf6" },
  { name: "Saúde", type: "all", color: "#ef4444" },
  { name: "Lazer", type: "all", color: "#f59e0b" },
  { name: "Educação", type: "all", color: "#06b6d4" },
  { name: "Vestuário", type: "all", color: "#ec4899" },
  { name: "Outros", type: "all", color: "#6b7280" }
]
\`\`\`

### Regras de Segurança do Firestore

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para a coleção de categorias
    match /categories/{categoryId} {
      // Permitir leitura para todos os usuários autenticados
      allow read: if request.auth != null;
      
      // Permitir criação, atualização e exclusão apenas para usuários autenticados
      allow create, update, delete: if request.auth != null;
      
      // Validação de dados
      allow create, update: if request.resource.data.name is string
                            && request.resource.data.type in ['expense', 'debt', 'installment', 'all']
                            && request.resource.data.color is string;
    }
  }
}
\`\`\`

### Índices Recomendados

Para melhor performance, crie os seguintes índices compostos no Firestore:

1. **Índice por tipo e nome**:
   - Coleção: `categories`
   - Campos: `type` (Ascending), `name` (Ascending)

### Queries Comuns

#### Buscar todas as categorias
\`\`\`typescript
const categoriesRef = collection(db, 'categories')
const q = query(categoriesRef, orderBy('name'))
const snapshot = await getDocs(q)
\`\`\`

#### Buscar categorias por tipo
\`\`\`typescript
const categoriesRef = collection(db, 'categories')
const q = query(
  categoriesRef,
  where('type', 'in', ['expense', 'all']),
  orderBy('name')
)
const snapshot = await getDocs(q)
\`\`\`

#### Adicionar nova categoria
\`\`\`typescript
const categoriesRef = collection(db, 'categories')
await addDoc(categoriesRef, {
  name: 'Nova Categoria',
  type: 'all',
  color: '#6b7280',
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
})
\`\`\`

#### Atualizar categoria
\`\`\`typescript
const categoryRef = doc(db, 'categories', categoryId)
await updateDoc(categoryRef, {
  name: 'Nome Atualizado',
  updatedAt: serverTimestamp()
})
\`\`\`

#### Excluir categoria
\`\`\`typescript
const categoryRef = doc(db, 'categories', categoryId)
await deleteDoc(categoryRef)
\`\`\`

## Integração com Outras Coleções

### Expenses (Despesas)
\`\`\`typescript
{
  // ... outros campos
  category: string  // Nome da categoria (ex: "Alimentação")
}
\`\`\`

### Debts (Dívidas)
\`\`\`typescript
{
  // ... outros campos
  category: string  // Nome da categoria (ex: "Moradia")
}
\`\`\`

### Installments (Parcelamentos)
\`\`\`typescript
{
  // ... outros campos
  category: string  // Nome da categoria (ex: "Educação")
}
\`\`\`

**Nota**: As categorias são armazenadas como strings (nome da categoria) nas outras coleções, não como referências. Isso simplifica as queries e evita a necessidade de joins.
