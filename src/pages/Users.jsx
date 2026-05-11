import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../services/userService";
import { Card, CardBody } from "../components/ui/Card";
import { Table } from "../components/ui/Table";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Users as UsersIcon } from "lucide-react";

const roleVariant = {
  Admin: "error",
  Editor: "info",
  Customer: "default",
};

export default function Users() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const columns = [
    {
      header: "User",
      render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar name={u.name || "Unknown"} size="md" />
          <div>
            <p className="font-semibold text-gray-900">{u.name || "Unknown"}</p>
            <p className="text-xs text-gray-400">
              {u.email || u.phoneNumber || ""}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      render: (u) => (
        <Badge variant={roleVariant[u.role] || "default"}>{u.role}</Badge>
      ),
    },
    {
      header: "Joined",
      render: (u) => (
        <span className="text-xs text-gray-500">
          {new Date(u.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
      className: "hidden md:table-cell",
    },
    {
      header: "Orders",
      render: (u) => (
        <span className="font-semibold text-gray-900">
          {u._count?.orders || 0}
        </span>
      ),
      className: "hidden sm:table-cell",
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Users
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {users.length} registered users
        </p>
      </div>

      <Card variant="elevated">
        <Table
          columns={columns}
          data={users}
          loading={isLoading}
          emptyMessage="No users found"
        />
      </Card>
    </div>
  );
}
