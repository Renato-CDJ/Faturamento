# Regras de Segurança do Firebase

## Firestore Security Rules

Adicione estas regras no Console do Firebase em **Firestore Database > Rules**:

\`\`\`javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Função auxiliar para verificar autenticação
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Função auxiliar para verificar se o usuário é o dono do documento
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Regras para a coleção de dívidas (debts)
    match /debts/{debtId} {
      // Permitir leitura apenas para usuários autenticados
      allow read: if isAuthenticated();
      
      // Permitir criação apenas para usuários autenticados
      // O campo user_id deve corresponder ao usuário autenticado
      allow create: if isAuthenticated() 
                    && request.resource.data.user_id == request.auth.uid
                    && request.resource.data.keys().hasAll(['name', 'total_amount', 'paid_amount'])
                    && request.resource.data.total_amount >= 0
                    && request.resource.data.paid_amount >= 0
                    && request.resource.data.paid_amount <= request.resource.data.total_amount;
      
      // Permitir atualização apenas para o dono
      allow update: if isAuthenticated() 
                    && resource.data.user_id == request.auth.uid
                    && request.resource.data.total_amount >= 0
                    && request.resource.data.paid_amount >= 0
                    && request.resource.data.paid_amount <= request.resource.data.total_amount;
      
      // Permitir exclusão apenas para o dono
      allow delete: if isAuthenticated() 
                    && resource.data.user_id == request.auth.uid;
    }
    
    // Regras para participantes de dívidas (debt_participants)
    match /debt_participants/{participantId} {
      // Permitir leitura apenas para usuários autenticados
      allow read: if isAuthenticated();
      
      // Permitir criação apenas para usuários autenticados
      allow create: if isAuthenticated()
                    && request.resource.data.keys().hasAll(['debt_id', 'name', 'parts', 'amount_owed']);
      
      // Permitir atualização apenas para usuários autenticados
      allow update: if isAuthenticated();
      
      // Permitir exclusão apenas para usuários autenticados
      allow delete: if isAuthenticated();
    }
    
    // Regras para despesas (expenses)
    match /expenses/{expenseId} {
      // Permitir leitura apenas para usuários autenticados
      allow read: if isAuthenticated();
      
      // Permitir criação apenas para usuários autenticados
      allow create: if isAuthenticated()
                    && request.resource.data.user_id == request.auth.uid
                    && request.resource.data.keys().hasAll(['description', 'amount', 'category', 'date'])
                    && request.resource.data.amount > 0;
      
      // Permitir atualização apenas para o dono
      allow update: if isAuthenticated()
                    && resource.data.user_id == request.auth.uid
                    && request.resource.data.amount > 0;
      
      // Permitir exclusão apenas para o dono
      allow delete: if isAuthenticated()
                    && resource.data.user_id == request.auth.uid;
    }
    
    // Regras para parcelamentos (installments)
    match /installments/{installmentId} {
      // Permitir leitura apenas para usuários autenticados
      allow read: if isAuthenticated();
      
      // Permitir criação apenas para usuários autenticados
      allow create: if isAuthenticated()
                    && request.resource.data.user_id == request.auth.uid
                    && request.resource.data.keys().hasAll(['name', 'total_amount', 'installment_count', 'current_installment'])
                    && request.resource.data.total_amount > 0
                    && request.resource.data.installment_count > 0
                    && request.resource.data.current_installment >= 0
                    && request.resource.data.current_installment <= request.resource.data.installment_count;
      
      // Permitir atualização apenas para o dono
      allow update: if isAuthenticated()
                    && resource.data.user_id == request.auth.uid
                    && request.resource.data.total_amount > 0
                    && request.resource.data.current_installment <= request.resource.data.installment_count;
      
      // Permitir exclusão apenas para o dono
      allow delete: if isAuthenticated()
                    && resource.data.user_id == request.auth.uid;
    }
    
    // Bloquear acesso a todas as outras coleções
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
\`\`\`

## Storage Rules (se você usar Firebase Storage)

Adicione estas regras no Console do Firebase em **Storage > Rules**:

\`\`\`javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Permitir upload apenas para usuários autenticados
    // Os arquivos devem estar em uma pasta com o ID do usuário
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
                   && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024; // Limite de 5MB
    }
    
    // Bloquear acesso a todos os outros caminhos
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
\`\`\`

## Como Aplicar as Regras

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Selecione seu projeto: **faturamento-7d690**
3. Para Firestore:
   - Vá em **Firestore Database** no menu lateral
   - Clique na aba **Rules**
   - Cole as regras do Firestore acima
   - Clique em **Publicar**
4. Para Storage (opcional):
   - Vá em **Storage** no menu lateral
   - Clique na aba **Rules**
   - Cole as regras do Storage acima
   - Clique em **Publicar**

## Observações Importantes

- **Autenticação Obrigatória**: Todas as operações requerem que o usuário esteja autenticado
- **Validação de Dados**: As regras validam que os campos obrigatórios estejam presentes
- **Propriedade dos Dados**: Usuários só podem modificar/deletar seus próprios dados
- **Validação de Valores**: Valores numéricos são validados (ex: valores não podem ser negativos)
- **Segurança**: Por padrão, todo acesso não especificado é bloqueado

## Próximos Passos

1. Adicione o campo \`user_id\` aos seus documentos ao criar novos registros
2. Implemente autenticação Firebase no seu app
3. Teste as regras usando o simulador no Console do Firebase
\`\`\`
\`\`\`

```json file="" isHidden
