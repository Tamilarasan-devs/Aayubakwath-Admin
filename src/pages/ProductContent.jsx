import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllProducts } from "../services/productService";
import {
  getAllProductContents,
  getProductContent,
  saveProductContent,
  deleteProductContent,
} from "../services/productContentService";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useToast } from "../context/ToastContext";
import { FileText, Plus, Trash2, Edit2 } from "lucide-react";

function SectionHeader({ num, title }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-7 h-7 rounded-lg bg-gray-900 text-white text-xs font-semibold flex items-center justify-center shrink-0">
        {num}
      </div>
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-900">
        {title}
      </span>
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

      // We need to import axiosInstance or use a service. 
      // Since it's a component, I'll use axiosInstance directly or pass a service.
      // For simplicity and following existing patterns, I'll use axiosInstance.
      const { data } = await axiosInstance.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onChange(data.data.url);
      addToast("Image uploaded successfully", "success");
    } catch (err) {
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
        <label className={`px-3 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg cursor-pointer hover:bg-gray-800 transition-colors whitespace-nowrap flex items-center gap-2 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
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
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}

const emptyContent = {
  benefits: [],
  ingredients: { list: [], pills: [], details: [] },
  warnings: [],
  howToUse: [],
  beforeAfter: [],
  descriptionImages: [],
  description: "",
};

import { axiosInstance } from "../utils/axiosInstance";

export default function ProductContent() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [content, setContent] = useState(emptyContent);

  const isEditing = useRef(false);

  const { data: products = [] } = useQuery({
    queryKey: ["products-all"],
    queryFn: () => getAllProducts({ limit: 1000 }),
    select: (d) => d.data ?? d.products ?? [],
  });

  const { data: contentList = [] } = useQuery({
    queryKey: ["product-contents"],
    queryFn: getAllProductContents,
  });

  // Fetch content when product selected via dropdown
  useEffect(() => {
    if (!selectedProductId) {
      setContent(emptyContent);
      return;
    }

    // Skip fetch if we just set the data via handleEdit
    if (isEditing.current) {
      isEditing.current = false;
      return;
    }

    const fetch = async () => {
      try {
        const res = await getProductContent(selectedProductId);
        // The API returns the Prisma record, actual JSON is in 'content' field
        const data = res?.content || res || emptyContent;
        
        setContent({
          ...emptyContent,
          ...data,
          ingredients: {
            ...emptyContent.ingredients,
            ...(data.ingredients || {})
          }
        });
      } catch (err) {
        console.error("Fetch content error:", err);
        setContent(emptyContent);
      }
    };
    fetch();
  }, [selectedProductId]);

  const updateContent = useCallback((field, value) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  }, []);

  const addBenefit = () =>
    updateContent("benefits", [
      ...(content.benefits || []),
      { icon: "✨", key: "", val: "", image: "" },
    ]);
  const updateBenefit = (i, field, val) => {
    const list = [...(content.benefits || [])];
    list[i] = { ...list[i], [field]: val };
    updateContent("benefits", list);
  };

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

  const addStep = () =>
    updateContent("howToUse", [
      ...(content.howToUse || []),
      { step: "", title: "", desc: "", icon: "📖", image: "" },
    ]);
  const updateStep = (i, field, val) => {
    const list = [...(content.howToUse || [])];
    list[i] = { ...list[i], [field]: val };
    updateContent("howToUse", list);
  };

  const addBA = () =>
    updateContent("beforeAfter", [
      ...(content.beforeAfter || []),
      { image: "", title: "" },
    ]);
  const updateBA = (i, field, val) => {
    const list = [...(content.beforeAfter || [])];
    list[i] = { ...list[i], [field]: val };
    updateContent("beforeAfter", list);
  };

  const updateIng = (field, val) => {
    const currentIng = content.ingredients || emptyContent.ingredients;
    updateContent("ingredients", { ...currentIng, [field]: val });
  };

  const addIngList = () => {
    const currentList = content.ingredients?.list || [];
    updateIng("list", [...currentList, { key: "", val: "" }]);
  };

  const updateIngList = (i, field, val) => {
    const list = [...(content.ingredients?.list || [])];
    list[i] = { ...list[i], [field]: val };
    updateIng("list", list);
  };

  const addIngDetail = () => {
    const currentDetails = content.ingredients?.details || [];
    updateIng("details", [
      ...currentDetails,
      { name: "", desc: "", image: "" },
    ]);
  };

  const updateIngDetail = (i, field, val) => {
    const list = [...(content.ingredients?.details || [])];
    list[i] = { ...list[i], [field]: val };
    updateIng("details", list);
  };

  const removeAt = (field, index) => {
    if (field.startsWith("ingredients.")) {
      const sub = field.split(".")[1];
      const list = content.ingredients?.[sub] || [];
      updateIng(
        sub,
        list.filter((_, i) => i !== index),
      );
    } else {
      const list = content[field] || [];
      updateContent(
        field,
        list.filter((_, i) => i !== index),
      );
    }
  };

  const saveMutation = useMutation({
    mutationFn: () => {
      // Clean up ingredients pills to avoid empty strings
      const cleanedContent = {
        ...content,
        ingredients: {
          ...content.ingredients,
          pills: (content.ingredients?.pills || []).filter(Boolean)
        }
      };
      return saveProductContent(selectedProductId, cleanedContent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-contents"] });
      addToast("Content saved successfully", "success");
      setContent(emptyContent);
      setSelectedProductId("");
    },
    onError: (err) => {
      addToast(err.response?.data?.message || "Failed to save content", "error");
    },
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
    
    // The list already contains the full content data
    const data = item.content || item;
    
    setContent({
      ...emptyContent,
      ...data,
      ingredients: {
        ...emptyContent.ingredients,
        ...(data.ingredients || {})
      }
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Product Content
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Enhance products with rich sections like ingredients, benefits, and
          guides
        </p>
      </div>

      <Card variant="elevated">
        <CardBody>
          <SectionHeader num="0" title="Target Product" />
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
          {/* Description */}
          <Card variant="elevated">
            <CardBody>
              <SectionHeader num="1" title="Description & Visual Assets" />
              <Input
                label="Detailed Description"
                as="textarea"
                value={content.description}
                onChange={(e) => updateContent("description", e.target.value)}
                rows={6}
                placeholder="Provide a deep dive into the product..."
              />
              <div className="mt-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Description Gallery
                </label>
                <div className="flex flex-wrap gap-3">
                  {content.descriptionImages?.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 group"
                    >
                      <img
                        src={img}
                        alt="Gallery"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() =>
                            updateContent(
                              "descriptionImages",
                              content.descriptionImages.filter(
                                (_, i) => i !== idx,
                              ),
                            )
                          }
                          className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center text-gray-700 hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  <FileUploadField
                    value=""
                    onChange={(url) =>
                      updateContent("descriptionImages", [
                        ...(content.descriptionImages || []),
                        url,
                      ])
                    }
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Benefits */}
          <Card variant="elevated">
            <CardBody>
              <SectionHeader num="2" title="Key Benefits" />
              {content.benefits.map((b, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-gray-700">
                      Benefit #{i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAt("benefits", i)}
                      className="text-red-500 text-xs font-semibold hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3 mb-3">
                    <Input
                      value={b.icon}
                      onChange={(e) => updateBenefit(i, "icon", e.target.value)}
                      placeholder="⚡"
                    />
                    <Input
                      className="sm:col-span-2"
                      value={b.key}
                      onChange={(e) => updateBenefit(i, "key", e.target.value)}
                      placeholder="Benefit title"
                    />
                  </div>
                  <FileUploadField
                    label="Feature Image"
                    value={b.image}
                    onChange={(url) => updateBenefit(i, "image", url)}
                  />
                  <Input
                    as="textarea"
                    value={b.val}
                    onChange={(e) => updateBenefit(i, "val", e.target.value)}
                    rows={2}
                    placeholder="Brief description..."
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

          {/* Ingredients */}
          <Card variant="elevated">
            <CardBody>
              <SectionHeader num="3" title="Ingredients" />
              <Input
                label="Ingredient Tags"
                value={content.ingredients.pills?.join(", ")}
                onChange={(e) =>
                  updateIng(
                    "pills",
                    e.target.value.split(",").map((s) => s.trim()),
                  )
                }
                placeholder="Ashwagandha, Giloy, Tulsi..."
              />
              <div className="mt-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Quick Facts
                </label>
                {content.ingredients.list?.map((ing, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <Input
                      value={ing.key}
                      onChange={(e) => updateIngList(i, "key", e.target.value)}
                      placeholder="Key"
                      className="flex-1"
                    />
                    <Input
                      value={ing.val}
                      onChange={(e) => updateIngList(i, "val", e.target.value)}
                      placeholder="Value"
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeAt("ingredients.list", i)}
                      className="text-red-500 text-xs font-semibold px-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addIngList}
                  className="w-full border-dashed border-2"
                >
                  + Add Fact
                </Button>
              </div>
              <div className="mt-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Ingredient Deep-Dive
                </label>
                {content.ingredients.details?.map((det, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-700">
                        Detail #{i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAt("ingredients.details", i)}
                        className="text-red-500 text-xs font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                    <Input
                      value={det.name}
                      onChange={(e) =>
                        updateIngDetail(i, "name", e.target.value)
                      }
                      placeholder="Name"
                      className="mb-3"
                    />
                    <FileUploadField
                      label="Image"
                      value={det.image}
                      onChange={(url) => updateIngDetail(i, "image", url)}
                    />
                    <Input
                      as="textarea"
                      value={det.desc}
                      onChange={(e) =>
                        updateIngDetail(i, "desc", e.target.value)
                      }
                      rows={2}
                      placeholder="Description..."
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addIngDetail}
                  className="w-full border-dashed border-2"
                >
                  + Add Detail
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Warnings */}
          <Card variant="elevated">
            <CardBody>
              <SectionHeader num="4" title="Safety & Warnings" />
              {content.warnings.map((w, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-700">
                      Warning #{i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAt("warnings", i)}
                      className="text-red-500 text-xs font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                  <Input
                    value={w.key}
                    onChange={(e) => updateWarning(i, "key", e.target.value)}
                    placeholder="Type"
                    className="mb-3"
                  />
                  <FileUploadField
                    label="Image"
                    value={w.image}
                    onChange={(url) => updateWarning(i, "image", url)}
                  />
                  <Input
                    as="textarea"
                    value={w.val}
                    onChange={(e) => updateWarning(i, "val", e.target.value)}
                    rows={2}
                    placeholder="Details..."
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={addWarning}
                className="w-full border-dashed border-2"
              >
                + Add Warning
              </Button>
            </CardBody>
          </Card>

          {/* How to Use */}
          <Card variant="elevated">
            <CardBody>
              <SectionHeader num="5" title="How to Use" />
              {content.howToUse.map((s, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-700">
                      Step #{i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAt("howToUse", i)}
                      className="text-red-500 text-xs font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-4 mb-3">
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
                      className="sm:col-span-2"
                      value={s.title}
                      onChange={(e) => updateStep(i, "title", e.target.value)}
                      placeholder="Step title"
                    />
                  </div>
                  <FileUploadField
                    label="Step Image"
                    value={s.image}
                    onChange={(url) => updateStep(i, "image", url)}
                  />
                  <Input
                    as="textarea"
                    value={s.desc}
                    onChange={(e) => updateStep(i, "desc", e.target.value)}
                    rows={2}
                    placeholder="Instructions..."
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

          {/* Before & After */}
          <Card variant="elevated">
            <CardBody>
              <SectionHeader num="6" title="Results (Before & After)" />
              {content.beforeAfter.map((ba, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-700">
                      Result #{i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAt("beforeAfter", i)}
                      className="text-red-500 text-xs font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                  <Input
                    value={ba.title}
                    onChange={(e) => updateBA(i, "title", e.target.value)}
                    placeholder="Title"
                    className="mb-3"
                  />
                  <FileUploadField
                    label="Comparison Image"
                    value={ba.image}
                    onChange={(url) => updateBA(i, "image", url)}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={addBA}
                className="w-full border-dashed border-2"
              >
                + Add Result
              </Button>
            </CardBody>
          </Card>

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

      {/* Managed Content List */}
      <Card variant="elevated">
        <CardBody>
          <SectionHeader num="L" title="Managed Content" />
          {contentList.length === 0 ? (
            <p className="text-center text-gray-400 py-6 text-sm">
              No dynamic content created yet
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
                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded mr-1">
                          BENEFITS: {item.benefits?.length || 0}
                        </span>
                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded mr-1">
                          STEPS: {item.howToUse?.length || 0}
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
                            icon={
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            }
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
