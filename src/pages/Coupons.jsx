import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { useToast } from "../context/ToastContext";
import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
} from "../services/couponService";
import { Plus, Trash2 } from "lucide-react";

const initialForm = {
  code: "",
  description: "",
  discountType: "PERCENT",
  discountValue: "",
  minOrderAmount: "",
  maxDiscountAmount: "",
  usageLimit: "",
  perUserLimit: "",
  isActive: true,
};

export default function Coupons() {
  const qc = useQueryClient();
  const { addToast } = useToast();
  const [form, setForm] = useState(initialForm);

  const { data, isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: () => getCoupons(1, 100),
  });

  const coupons = data?.items || [];

  const createMut = useMutation({
    mutationFn: createCoupon,
    onSuccess: () => {
      addToast("Coupon created", "success");
      setForm(initialForm);
      qc.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (err) =>
      addToast(
        err.response?.data?.message || "Failed to create coupon",
        "error",
      ),
  });

  const toggleMut = useMutation({
    mutationFn: ({ id, isActive }) => updateCoupon(id, { isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coupons"] }),
    onError: (err) =>
      addToast(
        err.response?.data?.message || "Failed to update coupon",
        "error",
      ),
  });

  const deleteMut = useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => {
      addToast("Coupon deleted", "success");
      qc.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (err) =>
      addToast(
        err.response?.data?.message || "Failed to delete coupon",
        "error",
      ),
  });

  const payload = useMemo(
    () => ({
      code: form.code.trim().toUpperCase(),
      description: form.description.trim() || undefined,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderAmount: form.minOrderAmount
        ? Number(form.minOrderAmount)
        : undefined,
      maxDiscountAmount: form.maxDiscountAmount
        ? Number(form.maxDiscountAmount)
        : undefined,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
      perUserLimit: form.perUserLimit ? Number(form.perUserLimit) : undefined,
      isActive: form.isActive,
    }),
    [form],
  );

  const onSubmit = (e) => {
    e.preventDefault();
    createMut.mutate(payload);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Coupons
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Create and manage discount coupons
        </p>
      </div>

      <Card variant="elevated">
        <CardBody>
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Input
              label="Code"
              value={form.code}
              onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
              required
            />
            <Input
              label="Description"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
            />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                Type
              </label>
              <select
                value={form.discountType}
                onChange={(e) =>
                  setForm((p) => ({ ...p, discountType: e.target.value }))
                }
                className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-white text-sm"
              >
                <option value="PERCENT">Percent</option>
                <option value="FIXED">Fixed</option>
              </select>
            </div>
            <Input
              label="Discount Value"
              type="number"
              value={form.discountValue}
              onChange={(e) =>
                setForm((p) => ({ ...p, discountValue: e.target.value }))
              }
              required
            />
            <Input
              label="Min Order Amount"
              type="number"
              value={form.minOrderAmount}
              onChange={(e) =>
                setForm((p) => ({ ...p, minOrderAmount: e.target.value }))
              }
            />
            <Input
              label="Max Discount Amount"
              type="number"
              value={form.maxDiscountAmount}
              onChange={(e) =>
                setForm((p) => ({ ...p, maxDiscountAmount: e.target.value }))
              }
            />
            <Input
              label="Usage Limit"
              type="number"
              value={form.usageLimit}
              onChange={(e) =>
                setForm((p) => ({ ...p, usageLimit: e.target.value }))
              }
            />
            <Input
              label="Per User Limit"
              type="number"
              value={form.perUserLimit}
              onChange={(e) =>
                setForm((p) => ({ ...p, perUserLimit: e.target.value }))
              }
            />
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isActive: e.target.checked }))
                  }
                />
                Active
              </label>
            </div>
            <div className="md:col-span-3">
              <Button
                type="submit"
                variant="primary"
                loading={createMut.isPending}
                icon={<Plus className="w-4 h-4" />}
              >
                Create Coupon
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card variant="elevated">
        <CardBody>
          {isLoading ? (
            <p className="text-sm text-gray-400">Loading coupons...</p>
          ) : coupons.length === 0 ? (
            <p className="text-sm text-gray-400">No coupons yet</p>
          ) : (
            <div className="space-y-3">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">
                        {coupon.code}
                      </p>
                      <Badge variant={coupon.isActive ? "success" : "default"}>
                        {coupon.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {coupon.discountType === "PERCENT"
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`}{" "}
                      off
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        toggleMut.mutate({
                          id: coupon.id,
                          isActive: !coupon.isActive,
                        })
                      }
                    >
                      {coupon.isActive ? "Disable" : "Enable"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMut.mutate(coupon.id)}
                      icon={<Trash2 className="w-3.5 h-3.5 text-red-500" />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
