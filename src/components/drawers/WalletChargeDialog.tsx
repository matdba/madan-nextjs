"use client";

import { Wallet2 } from "@solar-icons/react";
import CustomInput from "@/components/widgets/CustomInput";
import CustomButton from "@/components/widgets/CustomButton";

export type WalletChargeForm = {
  amount: string;
};

type WalletChargeDialogProps = {
  open: boolean;
  onClose: () => void;
  form: WalletChargeForm;
  setForm: (value: WalletChargeForm) => void;
  onSubmit: (payload: { amount: number }) => void;
  saving: boolean;
};

const MIN_WALLET_CHARGE = 1000;
const PRESET_AMOUNTS = [500000, 1000000, 2000000];

export default function WalletChargeDialog({
  open,
  onClose,
  form,
  setForm,
  onSubmit,
  saving,
}: WalletChargeDialogProps) {
  if (!open) return null;

  const amount = Number(form.amount || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4">
      <div className="w-full max-w-[32rem] rounded-4xl bg-card-light dark:bg-card-dark border border-gray-light dark:border-gray-dark p-6">
        <div className="flex items-center justify-center mb-6">
          <p className="text-lg font-semibold text-center">شارژ کیف پول</p>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 px-1">
            حداقل مبلغ شارژ ۱,۰۰۰ تومان است.
          </p>
          <CustomInput
            placeholder="مبلغ به تومان"
            icon={<Wallet2 />}
            value={form.amount}
            setValue={(value) => setForm({ amount: value })}
            handleAction={() => {
              if (amount >= MIN_WALLET_CHARGE) onSubmit({ amount });
            }}
            type="number"
            moneyInput
            background="bg-background-light dark:bg-background-dark"
          />
          <div className="flex flex-wrap gap-2">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setForm({ amount: String(preset) })}
                className="px-3 py-2 rounded-full border border-gray-light dark:border-gray-dark bg-background-light dark:bg-background-dark hover:bg-secondary/20 transition-colors cursor-pointer text-sm font-medium"
              >
                {preset.toLocaleString()} تومان
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-2">
          <CustomButton
            onClick={onClose}
            title="بستن"
            background="bg-gray-200"
            foreground="text-gray-700"
          />
          <CustomButton
            onClick={() => onSubmit({ amount })}
            title={saving ? "در حال شارژ..." : "شارژ کیف پول"}
            loading={saving}
            disabled={amount < MIN_WALLET_CHARGE || saving}
          />
        </div>
      </div>
    </div>
  );
}
