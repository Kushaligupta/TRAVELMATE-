"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowRightLeft, DollarSign } from "lucide-react"
import { convertCurrency, currencies } from "@/lib/mock-api"

export function CurrencyConverter() {
  const [amount, setAmount] = useState("100")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EUR")
  const [result, setResult] = useState<number | null>(null)

  const handleConvert = () => {
    const converted = convertCurrency(Number.parseFloat(amount) || 0, fromCurrency, toCurrency)
    setResult(converted)
  }

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setResult(null)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
          <div className="space-y-2">
            <Label className="text-xs">From</Label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleSwap}>
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-2">
            <Label className="text-xs">To</Label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Amount</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
        </div>

        <Button onClick={handleConvert} className="w-full">
          Convert
        </Button>

        {result !== null && (
          <div className="rounded-lg bg-muted p-3 text-center">
            <p className="text-sm text-muted-foreground">
              {Number.parseFloat(amount).toLocaleString()} {fromCurrency} =
            </p>
            <p className="text-2xl font-bold text-foreground">
              {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
