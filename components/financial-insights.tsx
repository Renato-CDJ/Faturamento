import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FinancialInsights() {
  const insights: any[] = []

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Insights Financeiros</CardTitle>
        <CardDescription className="text-muted-foreground">Análises e recomendações personalizadas</CardDescription>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-muted-foreground">
            Insights serão gerados conforme você adiciona dados financeiros
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon
              return (
                <div key={index} className="flex gap-3 rounded-lg border border-border bg-muted/50 p-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      insight.type === "success"
                        ? "bg-accent/20 text-accent"
                        : insight.type === "warning"
                          ? "bg-destructive/20 text-destructive"
                          : "bg-primary/20 text-primary"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{insight.title}</p>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
