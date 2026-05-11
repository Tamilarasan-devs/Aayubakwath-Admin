import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllOfferBars,
  createOfferBar,
  updateOfferBar,
  deleteOfferBar,
} from "../services/topBarService";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useToast } from "../context/ToastContext";
import { AlignStartHorizontal, Edit2, Trash2 } from "lucide-react";

export default function TopBar() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["offerBars"],
    queryFn: getAllOfferBars,
  });

  const createMutation = useMutation({
    mutationFn: createOfferBar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offerBars"] });
      addToast("Offer bar created", "success");
      setText("");
    },
    onError: () => addToast("Failed to create offer bar", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, text }) => updateOfferBar(id, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offerBars"] });
      addToast("Offer bar updated", "success");
      resetForm();
    },
    onError: () => addToast("Failed to update offer bar", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOfferBar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offerBars"] });
      addToast("Offer bar deleted", "success");
    },
    onError: () => addToast("Failed to delete offer bar", "error"),
  });

  const resetForm = () => {
    setText("");
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (editId) {
      updateMutation.mutate({ id: editId, text });
    } else {
      createMutation.mutate(text);
    }
  };

  const handleEdit = useCallback((item) => {
    setText(item.text);
    setEditId(item.id);
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
          Top Bar
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Manage scrolling offers displayed at the top of your website
        </p>
      </div>

      <Card variant="elevated">
        <CardBody>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 mb-6"
          >
            <Input
              type="text"
              placeholder="Enter offer text (e.g. Free shipping on orders above ₹999)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1"
              required
            />
            <div className="flex gap-2">
              <Button type="submit" variant="primary" loading={isSubmitting}>
                {editId ? "Update" : "Add"}
              </Button>
              {editId && (
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>

          {text && (
            <div className="mb-6 bg-gray-900 text-white py-2 px-4 rounded-lg text-center text-sm overflow-hidden">
              <span className="inline-block animate-pulse">{text}</span>
            </div>
          )}

          {isLoading ? (
            <p className="text-center text-gray-400 py-8 text-sm">Loading...</p>
          ) : offers.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">
              No offers added
            </p>
          ) : (
            <div className="space-y-2">
              {offers.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <p className="text-gray-700 font-medium flex-1">
                    {item.text}
                  </p>
                  <div className="flex gap-2 ml-4">
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
                      onClick={() => handleDelete(item.id)}
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
