"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

const data: { month: string; despesas: number; receitas: number }[] = []

export function ExpenseChart() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Fluxo de Caixa</CardTitle>
        <CardDescription className="text-muted-foreground">Receitas vs Despesas nos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[300px] w-full items-center justify-center text-muted-foreground">
            Nenhum dado disponível
          </div>
        ) : (
          <ChartContainer
            config={{
              receitas: {
                label: "Receitas",
                color: "hsl(var(--chart-2))",
              },
              despesas: {
                label: "Despesas",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="month"
                  className="text-muted-foreground"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis className="text-muted-foreground" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="receitas"
                  stackId="1"
                  stroke="var(--color-receitas)"
                  fill="var(--color-receitas)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="despesas"
                  stackId="2"
                  stroke="var(--color-despesas)"
                  fill="var(--color-despesas)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
