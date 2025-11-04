"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, CreditCard } from "lucide-react"
import { useExpenses } from "@/lib/hooks/use-expenses-firebase"
import { useIncome } from "@/lib/hooks/use-income-firebase"
import { useDebts } from "@/lib/hooks/use-debts-firebase"
import { ExpensesDetailModal } from "@/components/expenses-detail-modal"
import { IncomeDetailModal } from "@/components/income-detail-modal"
import { DebtsDetailModal } from "@/components/debts-detail-modal"

interface FinancialOverviewProps {
  selectedMonth: string
}

export function FinancialOverview({ selectedMonth }: FinancialOverviewProps) {
  const { expenses } = useExpenses()
  const { incomes } = useIncome()
  const { debts } = useDebts()
  const [expensesModalOpen, setExpensesModalOpen] = useState(false)
  const [incomeModalOpen, setIncomeModalOpen] = useState(false)
  const [debtsModalOpen, setDebtsModalOpen] = useState(false)

  const monthExpenses = expenses.filter((expense) => {
    const expenseMonth = expense.date.substring(0, 7)
    return expenseMonth === selectedMonth
  })

  const monthIncomes = incomes.filter((income) => {
    const incomeMonth = income.date.substring(0, 7)
    return incomeMonth === selectedMonth
  })

  const totalExpenses = monthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
  const totalIncome = monthIncomes.reduce((sum, income) => sum + Number(income.amount), 0)
  const totalDebts = debts
    .filter((debt) => !debt.is_paid)
    .reduce((sum, debt) => sum + Number(debt.total_amount - debt.paid_amount), 0)

  const balance = totalIncome - totalExpenses

  console.log("[v0] Financial Overview - Month:", selectedMonth)
  console.log("[v0] Total Expenses:", totalExpenses, "Count:", monthExpenses.length)
  console.log("[v0] Total Income:", totalIncome, "Count:", monthIncomes.length)
  console.log("[v0] Balance:", balance)

  const stats = [
    {
      title: "Saldo Total",
      value: balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
      change: monthIncomes.length === 0 ? "Adicione receitas" : "Receitas - Despesas",
      trend: balance >= 0 ? "up" : "down",
      icon: Wallet,
      color: balance >= 0 ? "text-accent" : "text-destructive",
      onClick: undefined,
    },
    {
      title: "Despesas do Mês",
      value: totalExpenses.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
      change: `${monthExpenses.length} despesas`,
      trend: "down",
      icon: TrendingDown,
      color: "text-destructive",
      onClick: () => setExpensesModalOpen(true),
    },
    {
      title: "Receitas do Mês",
      value: totalIncome.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
      change: `${monthIncomes.length} receitas`,
      trend: "up",
      icon: TrendingUp,
      color: "text-accent",
      onClick: () => setIncomeModalOpen(true),
    },
    {
      title: "Dívidas Totais",
      value: totalDebts.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
      change: `${debts.filter((d) => !d.is_paid).length} ativas`,
      trend: "down",
      icon: CreditCard,
      color: "text-chart-4",
      onClick: () => setDebtsModalOpen(true),
    },
  ]

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className={`border-border ${stat.onClick ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}`}
              onClick={stat.onClick}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className={`text-sm font-medium ${stat.color}`}>{stat.change}</p>
                  </div>
                  <div className={`rounded-lg bg-muted p-2 ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <ExpensesDetailModal
        open={expensesModalOpen}
        onOpenChange={setExpensesModalOpen}
        expenses={expenses}
        month={selectedMonth}
      />

      <IncomeDetailModal
        open={incomeModalOpen}
        onOpenChange={setIncomeModalOpen}
        incomes={incomes}
        month={selectedMonth}
      />

      <DebtsDetailModal open={debtsModalOpen} onOpenChange={setDebtsModalOpen} debts={debts} />
    </>
  )
}
