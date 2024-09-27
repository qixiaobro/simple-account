import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface RefundDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRefund: (amount: number, refundFee: boolean) => void
  maxAmount: number
}

export function RefundDialog({ open, onOpenChange, onRefund, maxAmount }: RefundDialogProps) {
  const [amount, setAmount] = useState<string>('')
  const [refundFee, setRefundFee] = useState(false)

  const handleRefund = () => {
    const refundAmount = parseFloat(amount)
    if (refundAmount > 0 && refundAmount <= maxAmount) {
      onRefund(refundAmount, refundFee)
      onOpenChange(false)
    }
  }

  const setFullAmount = () => {
    setAmount(maxAmount.toString())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>退款</DialogTitle>
          <DialogDescription>
            请输入退款金额并选择是否退还手续费。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="退款金额"
            />
            <Button onClick={setFullAmount} variant="outline">全部</Button>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="refund-fee"
              checked={refundFee}
              onCheckedChange={(checked) => setRefundFee(checked as boolean)}
            />
            <label
              htmlFor="refund-fee"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              退还手续费
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">取消</Button>
          <Button onClick={handleRefund}>确认退款</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
