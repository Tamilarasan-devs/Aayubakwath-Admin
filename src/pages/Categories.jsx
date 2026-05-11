import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { useToast } from "../context/ToastContext";
import { Plus, Edit2, Trash2, Tags, Image as ImageIcon } from "lucide-react";

export default function Categories() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      addToast("Category created", "success");
      resetForm();
    },
    onError: () => addToast("Failed to create category", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => updateCategory(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      addToast("Category updated", "success");
      resetForm();
    },
    onError: () => addToast("Failed to update category", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      addToast("Category deleted", "success");
    },
    onError: () => addToast("Failed to delete category", "error"),
  });

  const resetForm = () => {
    setName("");
    setImage(null);
    setPreview(null);
    setEditId(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    if (editId) {
      updateMutation.mutate({ id: editId, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = useCallback((cat) => {
    setName(cat.name);
    setEditId(cat.id);
    setPreview(cat.image);
    setImage(null);
  }, []);

  const handleDelete = useCallback(
    (id) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation],
  );

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Categories
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {categories.length} categories
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card variant="elevated">
          <CardBody>
            <h3 className="font-semibold text-gray-900 mb-4">
              {editId ? "Edit Category" : "New Category"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Category Name"
                type="text"
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                  Category Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {preview && (
                  <div className="mt-3 relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setPreview(null);
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg hover:bg-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting}
                  className="flex-1"
                >
                  {editId ? "Update" : "Create"}
                </Button>
                {editId && (
                  <Button type="button" variant="secondary" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardBody>
        </Card>

        <div className="lg:col-span-2">
          <Card variant="elevated">
            <CardBody>
              <h3 className="font-semibold text-gray-900 mb-4">
                All Categories
              </h3>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg animate-pulse"
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                      <div className="h-4 bg-gray-200 rounded w-32" />
                    </div>
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm">
                  No categories found
                </p>
              ) : (
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                        <span className="font-medium text-gray-700">
                          {cat.name}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(cat)}
                          icon={<Edit2 className="w-3.5 h-3.5" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(cat.id)}
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
      </div>
    </div>
  );
}
