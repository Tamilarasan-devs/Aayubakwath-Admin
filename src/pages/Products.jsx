import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProducts, deleteProduct } from "../services/productService";
import { useDebounce } from "../hooks/useDebounce";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";
import { Badge } from "../components/ui/Badge";
import { useToast } from "../context/ToastContext";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PAGE_LIMIT = 8;

function ProductCard({ product, onEdit, onDelete }) {
  const [imgError, setImgError] = useState(false);
  const productTags = useMemo(() => {
    const rawTags = product?.productTags;

    if (Array.isArray(rawTags)) {
      return rawTags.filter(
        (tag) => typeof tag === "string" && tag.trim().length > 0,
      );
    }

    if (typeof rawTags === "string") {
      const trimmed = rawTags.trim();
      if (!trimmed) return [];

      // Handle serialized arrays from inconsistent API payloads.
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            return parsed.filter(
              (tag) => typeof tag === "string" && tag.trim().length > 0,
            );
          }
        } catch {
          // Fallback below to comma-separated parsing.
        }
      }

      return trimmed
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }

    return [];
  }, [product?.productTags]);

  const imageUrl = !imgError
    ? product.productImages?.[0]?.url || product.productImages?.[0] || null
    : null;

  const discountPct =
    product.price &&
    product.finalPrice &&
    parseFloat(product.finalPrice) < parseFloat(product.price)
      ? Math.round(((product.price - product.finalPrice) / product.price) * 100)
      : null;

  return (
    <Card
      variant="elevated"
      className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="relative h-48 bg-gray-100 overflow-hidden rounded-t-xl">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.productName}
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Package className="w-10 h-10" />
          </div>
        )}
        {discountPct && (
          <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {discountPct}% OFF
          </span>
        )}
        {product.offerTags?.includes("new") && (
          <span className="absolute top-3 left-3 bg-gray-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
            New
          </span>
        )}
        {product.grabCode && (
          <span
            className={`absolute ${product.offerTags?.includes("new") ? "top-8" : "top-3"} left-3 bg-orange-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide animate-pulse`}
          >
            Grab
          </span>
        )}
      </div>
      <CardBody className="flex flex-col gap-2">
        <h3
          className="font-semibold text-gray-900 text-sm leading-tight truncate"
          title={product.productName}
        >
          {product.productName}
        </h3>
        {product.productDescription && (
          <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
            {product.productDescription}
          </p>
        )}
        {productTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {productTags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="bg-gray-100 text-gray-500 text-[10px] font-semibold px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        {product.category?.category && (
          <Badge variant="info" className="self-start">
            {product.category.category}
          </Badge>
        )}
        <div className="flex items-center justify-between pt-1">
          {product.price && parseFloat(product.price) > 0 ? (
            <span className="text-xs text-gray-300 line-through">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
          ) : (
            <span />
          )}
          {product.finalPrice && (
            <span className="text-base font-semibold text-gray-900">
              ₹{Number(product.finalPrice).toLocaleString("en-IN")}
            </span>
          )}
        </div>
        {product.grabCode && product.grabPrice && (
          <div className="bg-sky-50 rounded-md p-2 flex justify-between items-center text-sky-700">
            <span className="text-[10px] font-black uppercase tracking-wider">
              {product.grabCode}
            </span>
            <span className="text-xs font-black">
              ₹{Number(product.grabPrice).toLocaleString("en-IN")}
            </span>
          </div>
        )}
        <div className="flex gap-2 pt-1">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(product.id)}
            icon={<Edit2 className="w-3.5 h-3.5" />}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="flex-1"
            onClick={() => onDelete(product)}
            icon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Delete
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

function Pagination({ page, totalPages, onChange }) {
  const pages = useMemo(() => {
    const arr = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
      if (totalPages <= 5) return i + 1;
      if (page <= 3) return i + 1;
      if (page >= totalPages - 2) return totalPages - 4 + i;
      return page - 2 + i;
    });
    return arr;
  }, [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {pages[0] > 1 && (
        <>
          <button
            onClick={() => onChange(1)}
            className="w-9 h-9 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100"
          >
            1
          </button>
          {pages[0] > 2 && (
            <span className="text-gray-300 text-sm px-1">…</span>
          )}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${p === page ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
        >
          {p}
        </button>
      ))}
      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="text-gray-300 text-sm px-1">…</span>
          )}
          <button
            onClick={() => onChange(totalPages)}
            className="w-9 h-9 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100"
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function Products() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const debouncedSearch = useDebounce(search, 350);

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", page, debouncedSearch],
    queryFn: () =>
      getAllProducts({ page, limit: PAGE_LIMIT, search: debouncedSearch }),
  });

  const products = data?.data ?? data?.products ?? [];
  const totalCount = data?.totalCount ?? data?.total ?? 0;
  const totalPages =
    data?.totalPages ?? Math.ceil(totalCount / PAGE_LIMIT) ?? 1;

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      addToast("Product deleted successfully", "success");
      setDeleteTarget(null);
    } catch {
      addToast("Failed to delete product", "error");
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, queryClient, addToast]);

  const handleEdit = useCallback(
    (id) => {
      navigate(`/products/${id}/edit`);
    },
    [navigate],
  );

  if (error) {
    return (
      <EmptyState
        icon={<Package className="w-8 h-8" />}
        title="Failed to load products"
        description="Something went wrong while fetching your catalogue."
        action={{
          label: "Try Again",
          onClick: () =>
            queryClient.invalidateQueries({ queryKey: ["products"] }),
        }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Products
          </h1>
          {!isLoading && (
            <p className="text-sm text-gray-400 mt-0.5">
              {totalCount} product{totalCount !== 1 ? "s" : ""} total
            </p>
          )}
        </div>
        <Button
          variant="primary"
          onClick={() => navigate("/products/new")}
          icon={<Plus className="w-4 h-4" />}
        >
          New Product
        </Button>
      </div>

      <div className="max-w-sm">
        <Input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
            <Card key={i} variant="elevated">
              <Skeleton
                variant="rect"
                height="192px"
                className="rounded-t-xl"
              />
              <CardBody className="space-y-3">
                <Skeleton variant="text" width="75%" />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="50%" />
              </CardBody>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <Card variant="elevated">
          <EmptyState
            icon={<Package className="w-8 h-8" />}
            title="No products yet"
            description="Your catalogue is empty. Add your first product to get started."
            action={{
              label: "Add First Product",
              onClick: () => navigate("/products/new"),
            }}
          />
        </Card>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      <Modal
        open={!!deleteTarget}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        title="Delete Product"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={isDeleting}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-900">
            &quot;{deleteTarget?.productName}&quot;
          </span>
          ? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
