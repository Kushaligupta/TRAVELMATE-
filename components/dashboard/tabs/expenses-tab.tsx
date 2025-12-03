"use client"

import { useState, useMemo } from "react"
import { useAppData } from "@/context/app-data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Receipt, Trash2, Users, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import type { ExpenseCategory } from "@/lib/types"

const categories: { value: ExpenseCategory; label: string }[] = [
  { value: "transport", label: "Transport" },
  { value: "stay", label: "Accommodation" },
  { value: "food", label: "Food & Dining" },
  { value: "activities", label: "Activities" },
  { value: "other", label: "Other" },
]

const categoryColors: Record<ExpenseCategory, string> = {
  transport: "bg-chart-1/10 text-chart-1",
  stay: "bg-chart-2/10 text-chart-2",
  food: "bg-chart-3/10 text-chart-3",
  activities: "bg-chart-4/10 text-chart-4",
  other: "bg-chart-5/10 text-chart-5",
}

export function ExpensesTab() {
  const { expenses, addExpense, removeExpense } = useAppData()

  // Form state
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState<ExpenseCategory>("food")
  const [groupMembers, setGroupMembers] = useState("")
  const [paidBy, setPaidBy] = useState("")

  const handleAddExpense = () => {
    if (!description || !amount || !paidBy) return

    addExpense({
      description,
      amount: Number.parseFloat(amount),
      category,
      groupMembers: groupMembers
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean),
      paidBy: paidBy.trim(),
    })

    setDescription("")
    setAmount("")
    setGroupMembers("")
    setPaidBy("")
  }

  // Calculate totals and balances
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)

  const balances = useMemo(() => {
    const balanceMap: Record<string, number> = {}

    expenses.forEach((expense) => {
      const members = expense.groupMembers.length > 0 ? expense.groupMembers : [expense.paidBy]

      const splitAmount = expense.amount / members.length

      // Payer gets credit for full amount
      balanceMap[expense.paidBy] = (balanceMap[expense.paidBy] || 0) + expense.amount

      // Each member owes their share
      members.forEach((member) => {
        balanceMap[member] = (balanceMap[member] || 0) - splitAmount
      })
    })

    return Object.entries(balanceMap)
      .filter(([_, balance]) => Math.abs(balance) > 0.01)
      .sort((a, b) => b[1] - a[1])
  }, [expenses])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Expense Tracking</h1>
        <p className="text-muted-foreground">Track spending and split costs with travel companions</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">{expenses.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => {
                const count = expenses.filter((e) => e.category === cat.value).length
                if (count === 0) return null
                return (
                  <Badge key={cat.value} variant="secondary" className={categoryColors[cat.value]}>
                    {cat.label}: {count}
                  </Badge>
                )
              })}
              {expenses.length === 0 && <span className="text-sm text-muted-foreground">No expenses yet</span>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Expense Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="e.g., Dinner at restaurant"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Amount ($)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Paid By</Label>
              <Input placeholder="e.g., John" value={paidBy} onChange={(e) => setPaidBy(e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <Label>Group Members (comma-separated)</Label>
              <Input
                placeholder="e.g., John, Jane, Bob"
                value={groupMembers}
                onChange={(e) => setGroupMembers(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddExpense} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Expense List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              All Expenses
            </CardTitle>
            <CardDescription>Your recorded expenses</CardDescription>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Receipt className="h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-sm text-muted-foreground">No expenses recorded yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-start justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-foreground">{expense.description}</p>
                        <Badge className={categoryColors[expense.category]} variant="secondary">
                          {categories.find((c) => c.value === expense.category)?.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Paid by <span className="font-medium">{expense.paidBy}</span>
                        {expense.groupMembers.length > 0 && <> • Split with {expense.groupMembers.join(", ")}</>}
                      </p>
                      <p className="text-xs text-muted-foreground">{new Date(expense.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="font-bold text-foreground whitespace-nowrap">${expense.amount.toFixed(2)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeExpense(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Group Split */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Group Split
            </CardTitle>
            <CardDescription>Who owes what</CardDescription>
          </CardHeader>
          <CardContent>
            {balances.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-sm text-muted-foreground">Add expenses with group members to see splits</p>
              </div>
            ) : (
              <div className="space-y-3">
                {balances.map(([name, balance]) => (
                  <div key={name} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-2 ${balance > 0 ? "bg-success/10" : "bg-destructive/10"}`}>
                        {balance > 0 ? (
                          <TrendingUp className="h-4 w-4 text-success" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <span className="font-medium text-foreground">{name}</span>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold ${balance > 0 ? "text-success" : "text-destructive"}`}>
                        {balance > 0 ? "+" : ""}${balance.toFixed(2)}
                      </span>
                      <p className="text-xs text-muted-foreground">{balance > 0 ? "Should receive" : "Should pay"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
