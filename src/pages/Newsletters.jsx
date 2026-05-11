import React, { useState, useEffect } from "react";
import { Mail, Trash2, Search, Download, Filter, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { getSubscribers, deleteSubscriber } from "../services/newsletterService";

export default function Newsletters() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchSubscribers();
  }, [page]);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const data = await getSubscribers(page);
      setSubscribers(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this subscriber?")) return;
    
    setDeletingId(id);
    try {
      await deleteSubscriber(id);
      fetchSubscribers();
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      alert("Failed to delete subscriber");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(search.toLowerCase()) || 
    (s.name && s.name.toLowerCase().includes(search.toLowerCase()))
  );

  const exportCSV = () => {
    const headers = ["Email", "Name", "Subscribed At", "Status"];
    const rows = subscribers.map(s => [
      s.email,
      s.name || "-",
      new Date(s.createdAt).toLocaleDateString(),
      s.isActive ? "Active" : "Unsubscribed"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and export your email marketing list</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Download size={16} /> Export CSV
          </button>
          <button 
            onClick={fetchSubscribers}
            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Subscribers</p>
              <h3 className="text-2xl font-bold text-gray-900">{total}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200">Email Address</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200">Name</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200">Date Subscribed</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4">
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                    No subscribers found
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs uppercase">
                          {subscriber.email[0]}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{subscriber.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{subscriber.name || "-"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{new Date(subscriber.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        subscriber.isActive 
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}>
                        {subscriber.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(subscriber.id)}
                        disabled={deletingId === subscriber.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Remove subscriber"
                      >
                        {deletingId === subscriber.id ? (
                          <RefreshCw size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex items-center justify-between">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">
            Showing {filteredSubscribers.length} of {total} subscribers
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-bold text-gray-900 px-4">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
