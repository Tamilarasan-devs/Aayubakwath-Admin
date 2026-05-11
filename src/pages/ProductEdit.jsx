import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "../services/categoryService";
import { getProduct, updateProduct } from "../services/productService";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useToast } from "../context/ToastContext";
import { Package, ChevronRight, Edit2 } from "lucide-react";

const INITIAL_FORM = {
  productName: "",
  productDescription: "",
  productTags: "",
  offerTags: "",
  forWhom: "",
  withWhom: "",
  categoryId: "",
  price: "",
  finalPrice: "",
  priceTiers: [{ quantity: "", price: "", finalPrice: "", label: "" }],
  grabCode: "",
  grabPrice: "",
};

const MAX_IMAGES = 20;

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

function TagChips({ value, color = "text-sky-700", bg = "bg-sky-50" }) {
  const tags = useMemo(
    () =>
      value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [value],
  );
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {tags.map((t, i) => (
        <span
          key={i}
          className={`${bg} ${color} text-[11px] font-semibold px-2.5 py-1 rounded-lg`}
        >
          #{t}
        </span>
      ))}
    </div>
  );
}

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState(INITIAL_FORM);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProduct(id);
        setForm({
          productName: product.productName ?? "",
          productDescription: product.productDescription ?? "",
          productTags: Array.isArray(product.productTags)
            ? product.productTags.join(", ")
            : (product.productTags ?? ""),
          offerTags: Array.isArray(product.offerTags)
            ? product.offerTags.join(", ")
            : (product.offerTags ?? ""),
          forWhom: product.forWhom ?? "",
          withWhom: product.withWhom ?? "",
          categoryId: product.categoryId ?? "",
          price: product.price ?? "",
          finalPrice: product.finalPrice ?? "",
          priceTiers:
            Array.isArray(product.priceTiers) && product.priceTiers.length > 0
              ? product.priceTiers
              : [
                  {
                    quantity: product.price ?? "",
                    price: product.price ?? "",
                    finalPrice: product.finalPrice ?? "",
                    label: "",
                  },
                ],
          grabCode: product.grabCode ?? "",
          grabPrice: product.grabPrice ?? "",
        });
        setExistingImages(
          Array.isArray(product.productImages) ? product.productImages : [],
        );
      } catch {
        addToast("Failed to load product", "error");
        navigate("/products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id, addToast, navigate]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleTierChange = useCallback((index, field, value) => {
    setForm((prev) => {
      const tiers = [...prev.priceTiers];
      tiers[index] = { ...tiers[index], [field]: value };
      return { ...prev, priceTiers: tiers };
    });
    setErrors((prev) => ({ ...prev, priceTiers: "" }));
  }, []);

  const addTier = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      priceTiers: [
        ...prev.priceTiers,
        { quantity: "", price: "", finalPrice: "", label: "" },
      ],
    }));
  }, []);

  const removeTier = useCallback((index) => {
    setForm((prev) => {
      if (prev.priceTiers.length <= 1) return prev;
      return {
        ...prev,
        priceTiers: prev.priceTiers.filter((_, i) => i !== index),
      };
    });
  }, []);

  const removeExistingImage = useCallback((index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const validate = useCallback(() => {
    const errs = {};
    if (!form.productName.trim()) errs.productName = "Product name is required";
    if (!form.categoryId) errs.categoryId = "Please select a category";
    if (!form.price || parseFloat(form.price) <= 0)
      errs.price = "Base price is required";

    const tierErrs = [];
    form.priceTiers.forEach((tier, i) => {
      if (!tier.quantity || parseFloat(tier.quantity) <= 0)
        tierErrs.push(`Tier ${i + 1}: invalid quantity`);
      if (!tier.price || parseFloat(tier.price) <= 0)
        tierErrs.push(`Tier ${i + 1}: invalid price`);
    });
    if (tierErrs.length) errs.priceTiers = tierErrs.join(". ");

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      addToast("Please fix the errors below", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "priceTiers") fd.append(k, JSON.stringify(v));
        else if (v !== "" && v !== null && v !== undefined) fd.append(k, v);
      });
      newImages.forEach((img) => fd.append("images", img));
      fd.append("existingImages", JSON.stringify(existingImages));

      await updateProduct(id, fd);
      addToast("Product updated successfully", "success");
      navigate("/products");
    } catch (err) {
      addToast(
        err.response?.data?.message || "Failed to update product",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
          <Edit2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Edit Product
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Modify product details below
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Card variant="elevated">
            <CardBody>
              <SectionHeader num="1" title="Basic Information" />
              <div className="space-y-4">
                <Input
                  label="Product Name"
                  name="productName"
                  value={form.productName}
                  onChange={handleChange}
                  error={errors.productName}
                  required
                />
                <Input
                  label="Description"
                  name="productDescription"
                  as="textarea"
                  value={form.productDescription}
                  onChange={handleChange}
                  rows={4}
                />
                <Input
                  label="Category"
                  name="categoryId"
                  as="select"
                  value={form.categoryId}
                  onChange={handleChange}
                  error={errors.categoryId}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Input>
              </div>
            </CardBody>
          </Card>

          <Card variant="elevated">
            <CardBody>
              <SectionHeader num="2" title="Tags & Audience" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Input
                    label="Product Tags"
                    name="productTags"
                    value={form.productTags}
                    onChange={handleChange}
                    placeholder="cotton, breathable"
                  />
                  <TagChips value={form.productTags} />
                </div>
                <div>
                  <Input
                    label="Offer Tags"
                    name="offerTags"
                    value={form.offerTags}
                    onChange={handleChange}
                    placeholder="new, bestseller"
                  />
                  <TagChips
                    value={form.offerTags}
                    color="text-emerald-700"
                    bg="bg-emerald-50"
                  />
                </div>
                <Input
                  label="For Whom"
                  name="forWhom"
                  value={form.forWhom}
                  onChange={handleChange}
                />
                <Input
                  label="With Whom"
                  name="withWhom"
                  value={form.withWhom}
                  onChange={handleChange}
                />
              </div>
            </CardBody>
          </Card>

          <Card variant="elevated">
            <CardBody>
              <SectionHeader num="3" title="Pricing" />
              <div className="grid gap-4 sm:grid-cols-2 mb-6">
                <Input
                  label="Base Price"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="₹0.00"
                  required
                />
                <Input
                  label="Sale Price (Optional)"
                  name="finalPrice"
                  type="number"
                  value={form.finalPrice}
                  onChange={handleChange}
                  placeholder="₹0.00"
                />
              </div>
              <p className="text-xs text-gray-400 mb-4">
                Define pricing based on quantity. Add multiple tiers for bulk
                savings.
              </p>
              {form.priceTiers.map((tier, index) => (
                <div
                  key={index}
                  className="bg-gray-50/80 rounded-xl p-4 mb-3 relative group"
                >
                  {form.priceTiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTier(index)}
                      className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-400 flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all"
                      title="Remove tier"
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
                  )}
                  <div className="mb-3">
                    <Input
                      label="Label (Optional)"
                      value={tier.label}
                      onChange={(e) =>
                        handleTierChange(index, "label", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Input
                      label="Quantity"
                      type="number"
                      value={tier.quantity}
                      onChange={(e) =>
                        handleTierChange(index, "quantity", e.target.value)
                      }
                      required
                    />
                    <Input
                      label="Original Price"
                      type="number"
                      value={tier.price}
                      onChange={(e) =>
                        handleTierChange(index, "price", e.target.value)
                      }
                      required
                    />
                    <Input
                      label="Sale Price"
                      type="number"
                      value={tier.finalPrice}
                      onChange={(e) =>
                        handleTierChange(index, "finalPrice", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={addTier}
                className="w-full border-dashed border-2"
              >
                + Add Price Tier
              </Button>
              {errors.priceTiers && (
                <p className="mt-2 text-xs text-red-600 font-medium">
                  {errors.priceTiers}
                </p>
              )}
            </CardBody>
          </Card>

          <Card variant="elevated">
            <CardBody>
              <SectionHeader num="4" title="Grab Deal (Optional)" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Grab Code"
                  name="grabCode"
                  value={form.grabCode}
                  onChange={handleChange}
                />
                <Input
                  label="Grab Price"
                  name="grabPrice"
                  type="number"
                  value={form.grabPrice}
                  onChange={handleChange}
                />
              </div>
            </CardBody>
          </Card>

          <Card variant="elevated">
            <CardBody>
              <SectionHeader num="5" title="Product Images" />

              {/* Existing images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                    Existing Images
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {existingImages.map((url, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group"
                      >
                        <img
                          src={typeof url === "string" ? url : url?.url}
                          alt={`Product ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeExistingImage(i)}
                            className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-red-50 hover:text-red-500 transition-all"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New images */}
              <Input
                label="Add New Images"
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setNewImages((prev) => [...prev, ...files]);
                }}
              />
              {newImages.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {newImages.map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt={img.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1">
                        <span className="text-[9px] font-semibold bg-emerald-500 text-white px-1.5 py-0.5 rounded">
                          New
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="mt-6 flex items-center justify-between bg-white rounded-xl border border-gray-200 px-6 py-4">
          <p className="text-xs text-gray-400">
            <span className="text-red-500">*</span> Required fields
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              icon={<ChevronRight className="w-4 h-4" />}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
