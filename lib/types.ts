export interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
  is_split: boolean
  split_parts: number
  created_at: string
  updated_at: string
}

export interface ExpenseParticipant {
  id: string
  expense_id: string
  name: string
  parts: number
  amount_owed: number
  is_paid: boolean
  created_at: string
}

export interface Debt {
  id: string
  name: string
  total_amount: number
  paid_amount: number
  due_date: string | null
  is_split: boolean
  split_parts: number
  is_paid: boolean
  created_at: string
  updated_at: string
}

export interface DebtParticipant {
  id: string
  debt_id: string
  name: string
  parts: number
  amount_owed: number
  is_paid: boolean
  created_at: string
}

export interface Installment {
  id: string
  name: string
  total_amount: number
  installment_count: number
  paid_installments: number
  installment_value: number
  is_split: boolean
  split_parts: number
  participants?: InstallmentParticipant[]
  payments?: InstallmentPayment[]
  created_at: string
  updated_at: string
}

export interface InstallmentPayment {
  id: string
  installment_id: string
  payment_number: number
  due_date: string
  is_paid: boolean
  paid_date: string | null
  created_at: string
}

export interface InstallmentParticipant {
  id: string
  installment_id: string
  name: string
  parts: number
  amount_owed: number
  created_at: string
}

export interface Income {
  id: string
  source: string
  amount: number
  date: string
  is_recurring: boolean
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  description: string
  amount: number
  type: "income" | "expense" | "debt" | "installment"
  date: string
  created_at: string
}

export interface Category {
  id: string
  name: string
  type: "all" | "expense" | "debt" | "installment"
  color: string
  created_at: string
}
