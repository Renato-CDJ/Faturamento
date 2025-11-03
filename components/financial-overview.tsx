import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, CreditCard } from "lucide-react"

export function FinancialOverview() {
  const stats = [
    {
      title: "Saldo Total",
      value: "R$ 12.450,00",
      change: "+12.5%",
      trend: "up",
      icon: Wallet,
      color: "text-accent",
    },
    {
      title: "Despesas do Mês",
      value: "R$ 3.280,00",
      change: "-8.2%",
      trend: "down",
      icon: TrendingDown,
      color: "text-destructive",
    },
    {
      title: "Receitas do Mês",
      value: "R$ 8.500,00",
      change: "+5.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-accent",
    },
    {
      title: "Dívidas Totais",
      value: "R$ 15.600,00",
      change: "-15.3%",
      trend: "down",
      icon: CreditCard,
      color: "text-chart-4",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className={`text-sm font-medium ${stat.color}`}>{stat.change} vs mês anterior</p>
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
  )
}
