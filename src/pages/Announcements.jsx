import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../services/announcementService";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useToast } from "../context/ToastContext";
import { Megaphone, Edit2, Trash2 } from "lucide-react";

export default function Announcements() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: getAllAnnouncements,
  });
console.log('announcements :',announcements)
  const createMutation = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      addToast("Announcement created", "success");
      setTitle("");
    },
    onError: () => addToast("Failed to create announcement", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, title }) => updateAnnouncement(id, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      addToast("Announcement updated", "success");
      resetForm();
    },
    onError: () => addToast("Failed to update announcement", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      addToast("Announcement deleted", "success");
    },
    onError: () => addToast("Failed to delete announcement", "error"),
  });

  const resetForm = () => {
    setTitle("");
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (editId) {
      updateMutation.mutate({ id: editId, title });
    } else {
      createMutation.mutate(title);
    }
  };

  const handleEdit = useCallback((item) => {
    setTitle(item.title);
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
          Announcements
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Create and manage site-wide announcements
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
              placeholder="Enter announcement..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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

          {isLoading ? (
            <p className="text-center text-gray-400 py-8 text-sm">Loading...</p>
          ) : announcements.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">
              No announcements
            </p>
          ) : (
            <div className="space-y-2">
              {announcements.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <p className="text-gray-700 font-medium flex-1">
                    {item.title}
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
