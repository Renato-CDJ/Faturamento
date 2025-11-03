# 🚀 Quick Start - Fix Firebase Permissions Error

## Current Error
\`\`\`
Missing or insufficient permissions
\`\`\`

This happens because your Firestore database doesn't have security rules configured yet.

---

## ✅ Fix in 3 Steps (5 minutes)

### Step 1: Open Firebase Console

1. Go to: **https://console.firebase.google.com/**
2. Select project: **faturamento-7d690**

### Step 2: Configure Firestore Security Rules

1. Click **Firestore Database** in the left menu
2. If you haven't created the database yet:
   - Click **Create database**
   - Choose **Start in production mode**
   - Select location: `southamerica-east1` (São Paulo) or closest to you
   - Click **Enable**

3. Click the **Rules** tab at the top
4. **Delete everything** and paste this:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /debts/{debtId} {
      allow read, write: if true;
    }
    match /debt_participants/{participantId} {
      allow read, write: if true;
    }
    match /expenses/{expenseId} {
      allow read, write: if true;
    }
    match /expense_participants/{participantId} {
      allow read, write: if true;
    }
    match /installments/{installmentId} {
      allow read, write: if true;
    }
    match /categories/{categoryId} {
      allow read, write: if true;
    }
  }
}
\`\`\`

5. Click **Publish** button

### Step 3: Add Initial Categories

1. In Firestore Database, click **Start collection**
2. Collection ID: `categories`
3. Add first document:
   - Document ID: (leave as auto-generated)
   - Add fields:
     - `name` (string): `Alimentação`
     - `type` (string): `expense`
     - `color` (string): `#10b981`
     - `created_at` (timestamp): Click clock icon → "Set to current time"
4. Click **Save**

5. Add more categories by clicking **Add document**:
   - Transporte | expense | #3b82f6
   - Moradia | expense | #8b5cf6
   - Saúde | expense | #ef4444
   - Lazer | expense | #f59e0b
   - Outros | expense | #6b7280

---

## ✅ Test Your App

1. Refresh your app in the browser
2. The permission errors should be gone
3. You can now add expenses, debts, and installments

---

## ⚠️ IMPORTANT: Security Warning

**These rules allow ANYONE to read/write your data!**

This is OK for:
- ✅ Local development
- ✅ Testing
- ✅ Learning

**DO NOT use in production!**

Before deploying to production, you MUST:
1. Implement Firebase Authentication
2. Add user login/registration
3. Update security rules to require authentication
4. Add `user_id` field to all documents

See `FIREBASE_RULES.md` for production-ready security rules.

---

## 🆘 Still Having Issues?

### Error: "Missing or insufficient permissions"
- Make sure you clicked **Publish** after pasting the rules
- Wait 10-30 seconds for rules to propagate
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)

### Error: "Collection doesn't exist"
- Create at least one document in the `categories` collection
- The collection is created automatically when you add the first document

### Other errors
- Check browser console for detailed error messages
- Verify your Firebase config in `lib/firebase/config.ts` matches your project
- Make sure Firestore is enabled in your Firebase project
