import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getHomeBanners,
  createHomeBanner,
  deleteHomeBanner,
  deleteAllHomeBanners,
  getOfferBanners,
  createOfferBanner,
  deleteOfferBanner,
  deleteAllOfferBanners,
  getCategoryBanners,
  createCategoryBanner,
  deleteCategoryBanner,
  deleteAllCategoryBanners,
} from "../services/bannerService";
import { getAllCategories } from "../services/categoryService";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useToast } from "../context/ToastContext";
import { Image, Trash2, Upload, Plus, XOctagon } from "lucide-react";

const tabs = [
  { key: "home", label: "Homepage" },
  { key: "offer", label: "Offer" },
  { key: "category", label: "Category" },
];

const bannerHooks = {
  home: {
    get: getHomeBanners,
    create: createHomeBanner,
    delete: deleteHomeBanner,
    deleteAll: deleteAllHomeBanners,
    queryKey: "homeBanners",
  },
  offer: {
    get: getOfferBanners,
    create: createOfferBanner,
    delete: deleteOfferBanner,
    deleteAll: deleteAllOfferBanners,
    queryKey: "offerBanners",
  },
  category: {
    get: getCategoryBanners,
    create: createCategoryBanner,
    delete: deleteCategoryBanner,
    deleteAll: deleteAllCategoryBanners,
    queryKey: "categoryBanners",
  },
};

export default function Banners() {
  const [activeTab, setActiveTab] = useState("home");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const fileInputRef = useState(null); // We'll use a real ref below
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const hook = bannerHooks[activeTab];

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const { data: banners = [], isLoading } = useQuery({
    queryKey: [hook.queryKey],
    queryFn: hook.get,
    enabled: true,
  });

  const createMutation = useMutation({
    mutationFn: hook.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [hook.queryKey] });
      addToast("Banner uploaded", "success");
      setImage(null);
      setPreview(null);
      if (document.getElementById("banner-upload-input")) {
        document.getElementById("banner-upload-input").value = "";
      }
    },
    onError: () => addToast("Failed to upload banner", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: hook.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [hook.queryKey] });
      addToast("Banner deleted", "success");
    },
    onError: () => addToast("Failed to delete banner", "error"),
  });

  const deleteAllMutation = useMutation({
    mutationFn: hook.deleteAll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [hook.queryKey] });
      addToast("All banners deleted", "success");
    },
    onError: () => addToast("Failed to delete all banners", "error"),
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image) return;
    if (activeTab === "category" && !categoryId) {
      addToast("Please select a category", "error");
      return;
    }
    const formData = new FormData();
    formData.append("image", image);
    if (activeTab === "category") formData.append("categoryId", categoryId);
    createMutation.mutate(formData);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm("Are you sure you want to delete ALL banners in this tab? This cannot be undone.")) {
      deleteAllMutation.mutate();
    }
  };

  const switchTab = (key) => {
    setActiveTab(key);
    setImage(null);
    setPreview(null);
    setCategoryId("");
    if (document.getElementById("banner-upload-input")) {
      document.getElementById("banner-upload-input").value = "";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Banners
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage homepage, offer, and category banners
          </p>
        </div>
        {banners.length > 0 && (
          <Button
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleDeleteAll}
            loading={deleteAllMutation.isPending}
            icon={<XOctagon className="w-4 h-4" />}
          >
            Delete All
          </Button>
        )}
      </div>

      <Card variant="elevated">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => switchTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <CardBody>
          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-gray-300 transition-colors">
              <input
                id="banner-upload-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-4 block mx-auto text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
              {activeTab === "category" && (
                <div className="mb-4 max-w-md mx-auto text-left">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg mx-auto mb-4"
                />
              )}
              <Button
                type="submit"
                variant="primary"
                loading={createMutation.isPending}
                disabled={!image || (activeTab === "category" && !categoryId)}
                icon={<Upload className="w-4 h-4" />}
              >
                Upload Banner
              </Button>
            </div>
          </form>

          {/* Banner Grid */}
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-56 bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : banners.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              No banners uploaded
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden group"
                >
                  <img
                    src={banner.image}
                    alt="Banner"
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Banner Image</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(banner.id)}
                      loading={deleteMutation.isPending}
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
