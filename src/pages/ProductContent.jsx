import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllProducts } from "../services/productService";
import {
  getAllProductContents,
  getProductContent,
  saveProductContent,
  deleteProductContent,
} from "../services/productContentService";
import { axiosInstance } from "../utils/axiosInstance";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useToast } from "../context/ToastContext";
import { Trash2, Edit2, Star, BookOpen, Leaf, AlertTriangle } from "lucide-react";

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function SectionHeader({ icon: Icon, color = "#111827", title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: color + "18", color }}
      >
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-900 leading-none">
          {title}
        </p>
        {subtitle && (
          <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

function FileUploadField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const { addToast } = useToast();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await axiosInstance.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(data.data.url);
      addToast("Image uploaded successfully", "success");
    } catch {
      addToast("Failed to upload image", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-3">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        <input
          className="flex-1 w-full rounded-lg border border-gray-300 bg-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL..."
        />
        <label
          className={`px-3 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg cursor-pointer hover:bg-gray-800 transition-colors whitespace-nowrap flex items-center gap-2 ${
            uploading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {uploading ? (
            <>
              <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload"
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
      {value && (
        <div className="mt-2 w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}

/* ─── Empty state ─────────────────────────────────────────────────────────── */

const emptyContent = {
  benefits: [],
  benefitsImage: "",
  howToUse: [],
  howToUseImage: "",
  ingredients: { list: [], pills: [], details: [] },
  warnings: [],
};

/* ─── Main component ──────────────────────────────────────────────────────── */

export default function ProductContent() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [content, setContent] = useState(emptyContent);
  const isEditing = useRef(false);

  /* ── Queries ── */
  const { data: products = [] } = useQuery({
    queryKey: ["products-all"],
    queryFn: () => getAllProducts({ limit: 1000 }),
    select: (d) => d.data ?? d.products ?? [],
  });

  const { data: contentList = [] } = useQuery({
    queryKey: ["product-contents"],
    queryFn: getAllProductContents,
  });

  /* ── Fetch when product selected ── */
  useEffect(() => {
    if (!selectedProductId) {
      setContent(emptyContent);
      return;
    }
    if (isEditing.current) {
      isEditing.current = false;
      return;
    }
    const fetch = async () => {
      try {
        const res = await getProductContent(selectedProductId);
        const data = res?.content || res || emptyContent;
        setContent({
          ...emptyContent,
          ...data,
          ingredients: {
            ...emptyContent.ingredients,
            ...(data.ingredients || {}),
          },
        });
      } catch {
        setContent(emptyContent);
      }
    };
    fetch();
  }, [selectedProductId]);

  /* ── Generic updater ── */
  const updateContent = useCallback((field, value) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  }, []);

  /* ─────── BENEFITS ─────── */
  const addBenefit = () =>
    updateContent("benefits", [
      ...(content.benefits || []),
      { icon: "✨", key: "", val: "" },
    ]);
  const updateBenefit = (i, field, val) => {
    const list = [...(content.benefits || [])];
    list[i] = { ...list[i], [field]: val };
    updateContent("benefits", list);
  };
  const removeBenefit = (i) =>
    updateContent(
      "benefits",
      (content.benefits || []).filter((_, idx) => idx !== i)
    );

  /* ─────── HOW TO USE ─────── */
  const addStep = () =>
    updateContent("howToUse", [
      ...(content.howToUse || []),
      { step: "", icon: "📖", title: "", desc: "" },
    ]);
  const updateStep = (i, field, val) => {
    const list = [...(content.howToUse || [])];
    list[i] = { ...list[i], [field]: val };
    updateContent("howToUse", list);
  };
  const removeStep = (i) =>
    updateContent(
      "howToUse",
      (content.howToUse || []).filter((_, idx) => idx !== i)
    );

  /* ─────── INGREDIENTS ─────── */
  const updateIng = (field, val) => {
    const current = content.ingredients || emptyContent.ingredients;
    updateContent("ingredients", { ...current, [field]: val });
  };

  const addIngList = () =>
    updateIng("list", [...(content.ingredients?.list || []), { key: "", val: "" }]);
  const updateIngList = (i, field, val) => {
    const list = [...(content.ingredients?.list || [])];
    list[i] = { ...list[i], [field]: val };
    updateIng("list", list);
  };
  const removeIngList = (i) =>
    updateIng(
      "list",
      (content.ingredients?.list || []).filter((_, idx) => idx !== i)
    );

  const addIngDetail = () =>
    updateIng("details", [
      ...(content.ingredients?.details || []),
      { name: "", desc: "", image: "" },
    ]);
  const updateIngDetail = (i, field, val) => {
    const list = [...(content.ingredients?.details || [])];
    list[i] = { ...list[i], [field]: val };
    updateIng("details", list);
  };
  const removeIngDetail = (i) =>
    updateIng(
      "details",
      (content.ingredients?.details || []).filter((_, idx) => idx !== i)
    );

  /* ─────── IMPORTANT / WARNINGS ─────── */
  const addWarning = () =>
    updateContent("warnings", [
      ...(content.warnings || []),
      { key: "", val: "", image: "" },
    ]);
  const updateWarning = (i, field, val) => {
    const list = [...(content.warnings || [])];
    list[i] = { ...list[i], [field]: val };
    updateContent("warnings", list);
  };
  const removeWarning = (i) =>
    updateContent(
      "warnings",
      (content.warnings || []).filter((_, idx) => idx !== i)
    );

  /* ─────── SAVE / DELETE ─────── */
  const saveMutation = useMutation({
    mutationFn: () => {
      const cleanedContent = {
        ...content,
        ingredients: {
          ...content.ingredients,
          pills: (content.ingredients?.pills || []).filter(Boolean),
        },
      };
      return saveProductContent(selectedProductId, cleanedContent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-contents"] });
      addToast("Content saved successfully", "success");
      setContent(emptyContent);
      setSelectedProductId("");
    },
    onError: (err) =>
      addToast(err.response?.data?.message || "Failed to save content", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-contents"] });
      addToast("Content deleted", "success");
    },
    onError: () => addToast("Failed to delete content", "error"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProductId) return addToast("Please select a product", "error");
    saveMutation.mutate();
  };

  const handleEdit = (item) => {
    isEditing.current = true;
    setSelectedProductId(item.productId);
    const data = item.content || item;
    setContent({
      ...emptyContent,
      ...data,
      ingredients: {
        ...emptyContent.ingredients,
        ...(data.ingredients || {}),
      },
    });
  };

  /* ─────── COUNTS (for list summary) ─────── */
  const sectionCount = (item) => {
    const c = item.content || {};
    const parts = [];
    if (c.benefits?.length) parts.push(`${c.benefits.length} Benefits`);
    if (c.howToUse?.length) parts.push(`${c.howToUse.length} Steps`);
    if (c.ingredients?.details?.length || c.ingredients?.list?.length)
      parts.push("Ingredients");
    if (c.warnings?.length) parts.push(`${c.warnings.length} Important`);
    return parts.join(" · ") || "—";
  };

  /* ─────────── UI ─────────── */
  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Product Content
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Manage Benefits, How to Use, Ingredients &amp; Important info for each product
        </p>
      </div>

      {/* Product selector */}
      <Card variant="elevated">
        <CardBody>
          <SectionHeader
            icon={Leaf}
            color="#6b7280"
            title="Target Product"
            subtitle="Choose a product to add or edit content"
          />
          <Input
            label="Select Product"
            as="select"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            <option value="">Choose a product...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.productName}
              </option>
            ))}
          </Input>
        </CardBody>
      </Card>

      {selectedProductId && (
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ── 1. BENEFITS ── */}
          <Card variant="elevated">
            <CardBody>
              <SectionHeader
                icon={Star}
                color="#f59e0b"
                title="Benefits"
                subtitle="Key advantages shown in the Benefits tab"
              />

              {/* Single section image for Benefits */}
              <div className="mb-5 pb-5 border-b border-gray-100">
                <FileUploadField
                  label="Benefits Section Image (shown beside all benefit items)"
                  value={content.benefitsImage}
                  onChange={(url) => updateContent("benefitsImage", url)}
                />
              </div>

              {(content.benefits || []).map((b, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-gray-700">
                      Benefit #{i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeBenefit(i)}
                      className="text-red-500 text-xs font-semibold hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[80px_1fr] mb-3">
                    <Input
                      value={b.icon}
                      onChange={(e) => updateBenefit(i, "icon", e.target.value)}
                      placeholder="⚡"
                    />
                    <Input
                      value={b.key}
                      onChange={(e) => updateBenefit(i, "key", e.target.value)}
                      placeholder="Benefit title (e.g. Energy & Stamina)"
                    />
                  </div>
                  <Input
                    as="textarea"
                    value={b.val}
                    onChange={(e) => updateBenefit(i, "val", e.target.value)}
                    rows={2}
                    placeholder="Short description of this benefit..."
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={addBenefit}
                className="w-full border-dashed border-2"
              >
                + Add Benefit
              </Button>
            </CardBody>
          </Card>

          {/* ── 2. HOW TO USE ── */}
          <Card variant="elevated">
            <CardBody>
              <SectionHeader
                icon={BookOpen}
                color="#3b82f6"
                title="How to Use"
                subtitle="Step-by-step usage guide shown in the How To Use tab"
              />

              {/* Single section image for How to Use */}
              <div className="mb-5 pb-5 border-b border-gray-100">
                <FileUploadField
                  label="How to Use Section Image (shown beside all steps)"
                  value={content.howToUseImage}
                  onChange={(url) => updateContent("howToUseImage", url)}
                />
              </div>

              {(content.howToUse || []).map((s, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-gray-700">
                      Step #{i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeStep(i)}
                      className="text-red-500 text-xs font-semibold hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[80px_80px_1fr] mb-3">
                    <Input
                      value={s.icon}
                      onChange={(e) => updateStep(i, "icon", e.target.value)}
                      placeholder="📖"
                    />
                    <Input
                      value={s.step}
                      onChange={(e) => updateStep(i, "step", e.target.value)}
                      placeholder="01"
                    />
                    <Input
                      value={s.title}
                      onChange={(e) => updateStep(i, "title", e.target.value)}
                      placeholder="Step title (e.g. Morning Routine)"
                    />
                  </div>
                  <Input
                    as="textarea"
                    value={s.desc}
                    onChange={(e) => updateStep(i, "desc", e.target.value)}
                    rows={2}
                    placeholder="Instructions for this step..."
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={addStep}
                className="w-full border-dashed border-2"
              >
                + Add Step
              </Button>
            </CardBody>
          </Card>

          {/* ── 3. INGREDIENTS ── */}
          <Card variant="elevated">
            <CardBody>
              <SectionHeader
                icon={Leaf}
                color="#10b981"
                title="Ingredients"
                subtitle="Ingredient tags, quick facts, and detail cards shown in the Ingredients tab"
              />

              {/* Pills / tags */}
              <Input
                label="Ingredient Tags (comma-separated)"
                value={(content.ingredients?.pills || []).join(", ")}
                onChange={(e) =>
                  updateIng(
                    "pills",
                    e.target.value.split(",").map((s) => s.trim())
                  )
                }
                placeholder="Ashwagandha, Giloy, Tulsi..."
              />

              {/* Quick facts list */}
              <div className="mt-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Quick Facts (key → value pairs)
                </label>
                {(content.ingredients?.list || []).map((ing, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <Input
                      value={ing.key}
                      onChange={(e) => updateIngList(i, "key", e.target.value)}
                      placeholder="Key (e.g. Serving Size)"
                      className="flex-1"
                    />
                    <Input
                      value={ing.val}
                      onChange={(e) => updateIngList(i, "val", e.target.value)}
                      placeholder="Value (e.g. 2 capsules)"
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeIngList(i)}
                      className="text-red-500 text-xs font-semibold px-2 shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addIngList}
                  className="w-full border-dashed border-2"
                >
                  + Add Quick Fact
                </Button>
              </div>

              {/* Ingredient detail cards */}
              <div className="mt-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Ingredient Cards (name + image + description)
                </label>
                {(content.ingredients?.details || []).map((det, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-700">
                        Ingredient #{i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeIngDetail(i)}
                        className="text-red-500 text-xs font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                    <Input
                      value={det.name}
                      onChange={(e) => updateIngDetail(i, "name", e.target.value)}
                      placeholder="Ingredient name (e.g. Ashwagandha)"
                      className="mb-3"
                    />
                    <FileUploadField
                      label="Ingredient Image"
                      value={det.image}
                      onChange={(url) => updateIngDetail(i, "image", url)}
                    />
                    <Input
                      as="textarea"
                      value={det.desc}
                      onChange={(e) => updateIngDetail(i, "desc", e.target.value)}
                      rows={2}
                      placeholder="Brief description of this ingredient..."
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addIngDetail}
                  className="w-full border-dashed border-2"
                >
                  + Add Ingredient Card
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* ── 4. IMPORTANT ── */}
          <Card variant="elevated">
            <CardBody>
              <SectionHeader
                icon={AlertTriangle}
                color="#ef4444"
                title="Important"
                subtitle="Safety & precaution items shown in the Important tab"
              />
              {(content.warnings || []).map((w, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-gray-700">
                      Item #{i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeWarning(i)}
                      className="text-red-500 text-xs font-semibold hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <Input
                    value={w.key}
                    onChange={(e) => updateWarning(i, "key", e.target.value)}
                    placeholder="Heading (e.g. Pregnancy / Nursing)"
                    className="mb-3"
                  />
                  <FileUploadField
                    label="Item Image"
                    value={w.image}
                    onChange={(url) => updateWarning(i, "image", url)}
                  />
                  <Input
                    as="textarea"
                    value={w.val}
                    onChange={(e) => updateWarning(i, "val", e.target.value)}
                    rows={2}
                    placeholder="Details about this precaution..."
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={addWarning}
                className="w-full border-dashed border-2"
              >
                + Add Important Item
              </Button>
            </CardBody>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="submit"
              variant="primary"
              loading={saveMutation.isPending}
              className="flex-1"
            >
              Save Content
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setContent(emptyContent);
                setSelectedProductId("");
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* ── Content list ── */}
      <Card variant="elevated">
        <CardBody>
          <SectionHeader
            icon={Leaf}
            color="#6b7280"
            title="Managed Content"
            subtitle="All products with saved content"
          />
          {contentList.length === 0 ? (
            <p className="text-center text-gray-400 py-6 text-sm">
              No content created yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left">Product</th>
                    <th className="px-6 py-3 text-left">Sections</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contentList.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {item.product?.productName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[11px] text-gray-500">
                          {sectionCount(item)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            icon={<Edit2 className="w-3.5 h-3.5" />}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMutation.mutate(item.productId)}
                            icon={<Trash2 className="w-3.5 h-3.5 text-red-500" />}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
