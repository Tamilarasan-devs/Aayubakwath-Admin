import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllOrders, updateOrderStatus } from "../services/orderService";
import { Card, CardBody } from "../components/ui/Card";
import { Table } from "../components/ui/Table";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { useToast } from "../context/ToastContext";
import { ClipboardList } from "lucide-react";

export default function Orders() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [updatingId, setUpdatingId] = useState(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      addToast("Order status updated", "success");
      setUpdatingId(null);
    },
    onError: () => {
      addToast("Failed to update order status", "error");
      setUpdatingId(null);
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
      header: "Order ID",
      render: (o) => (
        <span className="font-mono text-xs text-gray-400 font-medium">
          #{o.id.slice(0, 8).toUpperCase()}
        </span>
      ),
    },
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
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Orders
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {orders.length} total orders
        </p>
      </div>

      <Card variant="elevated">
        <Table
          columns={columns}
          data={orders}
          loading={isLoading}
          emptyMessage="No orders found"
        />
      </Card>
    </div>
  );
}
