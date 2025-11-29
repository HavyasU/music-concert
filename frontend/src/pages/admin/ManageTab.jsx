import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { apiCall } from "../../lib/api";
import { X, Plus, Edit2, Trash2, Search, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

const ManageTab = () => {
  const [resource, setResource] = useState("concerts");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [venues, setVenues] = useState([]);
  const [artists, setArtists] = useState([]);
  const [concerts, setConcerts] = useState([]);

  useEffect(() => {
    fetchItems();
    fetchRelatedData();
    setQuery("");
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  const fetchRelatedData = async () => {
    try {
      const [venuesRes, artistsRes, concertsRes] = await Promise.allSettled([
        apiCall("/venues"),
        apiCall("/artists"),
        apiCall("/concerts"),
      ]);

      if (venuesRes.status === "fulfilled") {
        const data = venuesRes.value.data || venuesRes.value;
        setVenues(Array.isArray(data) ? data : []);
      }
      if (artistsRes.status === "fulfilled") {
        const data = artistsRes.value.data || artistsRes.value;
        setArtists(Array.isArray(data) ? data : []);
      }
      if (concertsRes.status === "fulfilled") {
        const data = concertsRes.value.data || concertsRes.value;
        setConcerts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching related data:", err);
      // Don't show toast for this as it's secondary data
    }
  };
  const fetchItems = async () => {
    try {
      setLoading(true);
      let url = "/" + resource;
      if (query) url += "?q=" + encodeURIComponent(query);
      const resp = await apiCall(url);
      const data = resp.data || resp;
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading items:", err);
      toast.error(err.message || "Failed to load items", {
        position: "top-right",
        autoClose: 3000,
      });
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({});
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ ...item });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await apiCall(`/${resource}/${id}`, { method: "DELETE" });
      toast.success("Item deleted successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      fetchItems();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error(err.message || "Failed to delete item", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing && editing._id) {
        await apiCall(`/${resource}/${editing._id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        toast.success("Item updated successfully", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        const createUrl =
          resource === "artists" || resource === "concerts"
            ? "/" + resource + "/create"
            : "/" + resource;
        await apiCall(createUrl, {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast.success("Item created successfully", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      setShowForm(false);
      fetchItems();
    } catch (err) {
      console.error("Save failed", err);
      toast.error(err.message || "Failed to save item", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const visible = items.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(items.length / pageSize);

  const resourceIcons = {
    concerts: "",
    artists: "",
    attendees: "",
    collaborations: "",
    venues: "",
    sponsors: "",
    merchandise: "",
    songs: "",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <aside className="lg:col-span-1">
        <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24 shadow-sm">
          <h4 className="text-gray-900 font-bold text-lg mb-4 flex items-center">
            <span className="text-2xl mr-2"></span> Manage Resources
          </h4>
          <div className="space-y-2">
            {[
              "concerts",
              "artists",
              "attendees",
              "collaborations",
              "venues",
              "sponsors",
              "merchandise",
              "songs",
            ].map((r) => (
              <button
                key={r}
                onClick={() => setResource(r)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 font-semibold ${
                  resource === r
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-xl">{resourceIcons[r]}</span>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:col-span-3">
        {" "}
        {/* Toolbar */}
        <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
            <div className="flex gap-2 flex-1">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-3 text-slate-400"
                  size={18}
                />
                <input
                  placeholder={`Search ${resource}...`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && fetchItems()}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <Button
                onClick={fetchItems}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-4"
              >
                <Search size={18} />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setQuery("");
                  setPage(1);
                  fetchItems();
                }}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Clear
              </Button>
              <Button
                onClick={fetchItems}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-3"
              >
                <RefreshCw size={18} />
              </Button>
              <Button
                onClick={openCreate}
                className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-700 hover:to-indigo-600 flex items-center gap-2"
              >
                <Plus size={18} />
                New
              </Button>
            </div>
          </div>
        </div>
        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-700">Loading items...</p>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-gray-600 text-lg mb-4">No items found</p>
                <Button
                  onClick={openCreate}
                  className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white"
                >
                  <Plus size={18} className="mr-2" />
                  Create first item
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((item, idx) => (
                      <tr
                        key={item._id || item.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-gray-700 font-semibold">
                          {(page - 1) * pageSize + idx + 1}
                        </td>
                        <td className="px-6 py-4 text-gray-900 font-semibold">
                          {item.name ||
                            item.attendeeName ||
                            item.title ||
                            item._id}
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {item.concertDate
                            ? new Date(item.concertDate).toLocaleDateString()
                            : item.attendeeEmail ||
                              item.type ||
                              item.price ||
                              "-"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => openEdit(item)}
                              className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            {resource !== "attendees" && (
                              <button
                                onClick={() =>
                                  handleDelete(item._id || item.id)
                                }
                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="border-t border-gray-200 px-6 py-4 flex flex-col gap-4 md:flex-row md:justify-between md:items-center bg-gray-50">
                <div className="text-gray-600 text-sm font-medium">
                  Showing {items.length === 0 ? 0 : (page - 1) * pageSize + 1} -{" "}
                  {Math.min(page * pageSize, items.length)} of {items.length}{" "}
                  items
                </div>
                <div className="flex gap-2 items-center">
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm"
                  >
                    {[5, 10, 20, 50].map((n) => (
                      <option key={n} value={n}>
                        {n} per page
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    ></button>
                    <span className="px-4 py-2 text-gray-700 text-sm font-medium">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setPage((p) => (p < totalPages ? p + 1 : p))
                      }
                      disabled={page === totalPages}
                      className="px-3 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    ></button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl shadow-2xl max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-4 flex justify-between items-center border-b border-indigo-400/20">
              <h4 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">{resourceIcons[resource]}</span>
                {editing ? "Edit" : "Create"} {resource.slice(0, -1)}
              </h4>
              <button
                onClick={() => setShowForm(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5 overflow-y-auto flex-1"
            >
              <RenderFormFields
                resource={resource}
                form={form}
                setForm={setForm}
                venues={venues}
                artists={artists}
                concerts={concerts}
              />
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
                <Button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-700 hover:to-indigo-600 px-6"
                >
                  {editing ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const FormSelect = ({
  label,
  value,
  onChange,
  options,
  optionLabel = "name",
  ...props
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-indigo-500 transition-colors"
      {...props}
    >
      <option value="">-- Select {label} --</option>
      {options.map((opt) => (
        <option key={opt._id || opt.id} value={opt._id || opt.id}>
          {opt[optionLabel] || opt.name || opt.title}
        </option>
      ))}
    </select>
  </div>
);

const FormInput = ({ label, type = "text", value, onChange, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
      {...props}
    />
  </div>
);

const FormTextArea = ({ label, value, onChange, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <textarea
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
      rows="3"
      {...props}
    />
  </div>
);

function RenderFormFields({
  resource,
  form,
  setForm,
  venues = [],
  artists = [],
  concerts = [],
}) {
  if (resource === "concerts") {
    return (
      <>
        <FormInput
          label="Concert Name"
          name="name"
          value={form.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Enter concert name"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Concert Date"
            type="date"
            name="concertDate"
            value={form.concertDate ? form.concertDate.split("T")[0] : ""}
            onChange={(e) => setForm({ ...form, concertDate: e.target.value })}
            required
          />
          <FormInput
            label="Concert Time"
            type="time"
            name="concertTime"
            value={form.concertTime || ""}
            onChange={(e) => setForm({ ...form, concertTime: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Ticket Price"
            type="number"
            name="ticketPrice"
            value={form.ticketPrice || ""}
            onChange={(e) =>
              setForm({ ...form, ticketPrice: Number(e.target.value) })
            }
            placeholder="0.00"
            step="0.01"
            required
          />
          <FormSelect
            label="Venue"
            value={form.venue || ""}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
            options={venues}
            optionLabel="name"
          />
        </div>
        <FormTextArea
          label="Description"
          name="description"
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Enter concert description"
        />
      </>
    );
  }

  if (resource === "artists") {
    return (
      <>
        <FormInput
          label="Artist Name"
          name="name"
          value={form.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Enter artist name"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Type"
            name="type"
            value={form.type || ""}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            placeholder="e.g., Solo Artist, Band"
          />
          <FormInput
            label="Genres (comma-separated)"
            name="genres"
            value={form.genres ? form.genres.join(", ") : ""}
            onChange={(e) =>
              setForm({
                ...form,
                genres: e.target.value.split(",").map((s) => s.trim()),
              })
            }
            placeholder="e.g., Rock, Pop, Jazz"
          />
        </div>
        <FormTextArea
          label="Biography"
          name="bio"
          value={form.bio || ""}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Enter artist biography"
        />
      </>
    );
  }

  if (resource === "venues") {
    return (
      <>
        <FormInput
          label="Venue Name"
          name="name"
          value={form.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Enter venue name"
          required
        />
        <FormTextArea
          label="Address"
          name="address"
          value={form.address || ""}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Enter venue address"
        />
        <FormInput
          label="Capacity"
          type="number"
          name="capacity"
          value={form.capacity || ""}
          onChange={(e) =>
            setForm({ ...form, capacity: Number(e.target.value) })
          }
          placeholder="0"
          required
        />
      </>
    );
  }

  if (resource === "sponsors") {
    return (
      <>
        <FormInput
          label="Sponsor Name"
          name="name"
          value={form.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Enter sponsor name"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Sponsorship Tier"
            name="type"
            value={form.type || ""}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            placeholder="e.g., Gold, Silver, Bronze"
          />
          <FormInput
            label="Website"
            name="website"
            value={form.website || ""}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            placeholder="https://example.com"
          />
        </div>
      </>
    );
  }

  if (resource === "merchandise") {
    return (
      <>
        <FormInput
          label="Product Name"
          name="name"
          value={form.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Enter product name"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Price ($)"
            type="number"
            name="price"
            value={form.price || ""}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
            placeholder="0.00"
            step="0.01"
            required
          />
          <FormInput
            label="Stock Quantity"
            type="number"
            name="stockQuantity"
            value={form.stockQuantity || ""}
            onChange={(e) =>
              setForm({ ...form, stockQuantity: Number(e.target.value) })
            }
            placeholder="0"
            required
          />
        </div>
      </>
    );
  }

  if (resource === "songs") {
    return (
      <>
        <FormInput
          label="Song Title"
          name="title"
          value={form.title || ""}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Enter song title"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Artist"
            name="artist"
            value={form.artist || ""}
            onChange={(e) => setForm({ ...form, artist: e.target.value })}
            placeholder="Enter artist name"
            required
          />
          <FormInput
            label="Genre"
            name="genre"
            value={form.genre || ""}
            onChange={(e) => setForm({ ...form, genre: e.target.value })}
            placeholder="Enter genre"
          />
        </div>
        <FormInput
          label="Duration (seconds)"
          type="number"
          name="duration"
          value={form.duration || ""}
          onChange={(e) =>
            setForm({ ...form, duration: Number(e.target.value) })
          }
          placeholder="0"
        />
      </>
    );
  }

  if (resource === "attendees") {
    return (
      <>
        <FormInput
          label="Full Name"
          name="attendeeName"
          value={form.attendeeName || ""}
          onChange={(e) => setForm({ ...form, attendeeName: e.target.value })}
          placeholder="Enter full name"
          required
        />
        <FormInput
          label="Email"
          type="email"
          name="attendeeEmail"
          value={form.attendeeEmail || ""}
          onChange={(e) => setForm({ ...form, attendeeEmail: e.target.value })}
          placeholder="Enter email address"
          required
        />
        <FormInput
          label="Phone"
          name="attendeePhone"
          value={form.attendeePhone || ""}
          onChange={(e) => setForm({ ...form, attendeePhone: e.target.value })}
          placeholder="Enter phone number"
        />
      </>
    );
  }

  return (
    <p className="text-gray-600 text-center py-8 font-medium">
      Select a resource from the sidebar to manage.
    </p>
  );
}

export default ManageTab;
