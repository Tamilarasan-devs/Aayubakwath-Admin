import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllOrders, updateOrderStatus, updateOrderTracking } from "../services/orderService";
import { Card } from "../components/ui/Card";
import { Table } from "../components/ui/Table";
import { Avatar } from "../components/ui/Avatar";
import { useToast } from "../context/ToastContext";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Truck, Edit2, CheckCircle2, PackageCheck } from "lucide-react";

export default function Orders() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [updatingId, setUpdatingId] = useState(null);

  // Tracking Modal State
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);
  const [courierName, setCourierName] = useState("");
  const [trackingId, setTrackingId] = useState("");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      addToast("Order status updated successfully", "success");
      setUpdatingId(null);
    },
    onError: () => {
      addToast("Failed to update order status", "error");
      setUpdatingId(null);
    },
  });

  const trackingMutation = useMutation({
    mutationFn: ({ id, trackingId, courierName }) =>
      updateOrderTracking(id, trackingId, courierName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      addToast("Tracking details saved & shipping email notification sent!", "success");
      setSelectedOrderForTracking(null);
    },
    onError: (err) => {
      addToast(err?.response?.data?.message || "Failed to update tracking details", "error");
    },
  });

  const handleStatusChange = useCallback(
    (id, status) => {
      setUpdatingId(id);
      updateMutation.mutate({ id, status });
    },
    [updateMutation],
  );

  const columns = [
    {
      header: "Customer",
      render: (o) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={o.user?.name || "Unknown"} size="sm" />
          <span className="font-medium text-gray-700">
            {o.user?.name || "Unknown"}
          </span>
        </div>
      ),
    },
    {
      header: "Amount",
      render: (o) => (
        <span className="font-semibold text-gray-900">
          ₹{Number(o.totalAmount).toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      header: "Date",
      render: (o) => (
        <span className="text-xs text-gray-500">
          {new Date(o.createdAt).toLocaleDateString()}
        </span>
      ),
      className: "hidden lg:table-cell",
    },
    {
      header: "Status",
      render: (o) => (
        <select
          value={o.status}
          onChange={(e) => handleStatusChange(o.id, e.target.value)}
          disabled={updatingId === o.id}
          className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-gray-200 bg-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      ),
    },
    {
      header: "Tracking Details",
      render: (o) => {
        const hasTracking = o.trackingId || o.courierName;
        return (
          <div className="flex items-center gap-2">
            {hasTracking ? (
              <div className="flex flex-col gap-0.5">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-lg max-w-max">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {o.courierName || "Courier"}
                </span>
                <span className="text-[10px] font-mono text-gray-400 select-all">
                  {o.trackingId || "No ID"}
                </span>
              </div>
            ) : (
              <span className="text-xs text-gray-400 italic">No tracking info</span>
            )}
            <button
              onClick={() => {
                setSelectedOrderForTracking(o);
                setCourierName(o.courierName || "");
                setTrackingId(o.trackingId || "");
              }}
              className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-150 ml-auto"
              title="Edit tracking info"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      },
    },
    {
      header: "Items",
      render: (o) => (
        <span className="text-xs text-gray-500">
          {o.items?.length || 0} item(s)
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Orders
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {orders.length} total orders
          </p>
        </div>
      </div>

      <Card variant="elevated">
        <Table
          columns={columns}
          data={orders}
          loading={isLoading}
          emptyMessage="No orders found"
        />
      </Card>

      {/* Elegant Shipping Tracking Modal */}
      <Modal
        open={!!selectedOrderForTracking}
        onClose={() => setSelectedOrderForTracking(null)}
        title={`Update Shipping Details - Order #${selectedOrderForTracking?.id?.slice(0, 8).toUpperCase()}`}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => setSelectedOrderForTracking(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={trackingMutation.isPending}
              disabled={!courierName.trim() || !trackingId.trim()}
              onClick={() => {
                trackingMutation.mutate({
                  id: selectedOrderForTracking.id,
                  courierName,
                  trackingId,
                });
              }}
            >
              Save & Notify Customer
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-xs leading-relaxed">
            <Truck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              Updating shipping details automatically alerts the customer by sending a premium branded shipping update email containing the courier and tracking link to <strong>{selectedOrderForTracking?.user?.email || "their registered email"}</strong>.
            </div>
          </div>
          <Input
            label="Courier Name"
            placeholder="e.g. FedEx, Blue Dart, DHL, UPS"
            value={courierName}
            onChange={(e) => setCourierName(e.target.value)}
            required
            autoFocus
          />
          <Input
            label="Tracking ID"
            placeholder="e.g. FD1294829384"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            required
          />
        </div>
      </Modal>
    </div>
  );
}
