import { useState } from "react";
import { Edit, Trash } from "lucide-react";
import placeholder from "../../assets/images/placeholder.jpg";

const initialAnnouncements = [
  {
    id: 1,
    title: "Schedule Update",
    image: placeholder,
    description: "We have updated our ferry schedules for the upcoming season.",
    details: "Our new schedule includes additional trips on weekends...",
  },
  {
    id: 2,
    title: "New Route Added",
    image: placeholder,
    description: "Introducing a new route connecting more destinations.",
    details: "Starting next month, we will operate a new route...",
  },
];

export default function AdminAnnounce() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ id: null, title: "", image: "placeholder", description: "", details: "" });
  const [errors, setErrors] = useState({});

  const openEdit = (announcement) => {
    setErrors({});
    setForm(announcement);
    setSelected(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: URL.createObjectURL(file) }); // Set image preview
    }
  };

  const validateForm = () => {
    let formErrors = {};
    if (!form.title) formErrors.title = "Title is required.";
    if (!form.description) formErrors.description = "Description is required.";
    if (form.image === "placeholder") formErrors.image = "Image is required.";
    return formErrors;
  };

  const saveAnnouncement = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setAnnouncements(announcements.map(a => a.id === form.id ? form : a));
    setSelected(null);
    setErrors({}); // Clear errors on save
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const addAnnouncement = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    const newAnnouncement = { ...form, id: Date.now() };
    setAnnouncements([...announcements, newAnnouncement]);
    setForm({ id: null, title: "", image: "placeholder", description: "", details: "" }); // Reset form with placeholder image
    setSelected(null);
    setErrors({}); // Clear errors on add
  };

  return (
    <div className="bg-[#f5f5f5] p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-[#0D3A73] mb-6">Manage Announcements</h1>
      <button
        onClick={() => openEdit({ id: null, title: "", image: "placeholder", description: "", details: "" })}
        className="px-6 py-3 bg-[#0D3A73] text-white rounded-lg hover:bg-[#f0c808] transition duration-300 mb-6"
      >
        Add Announcement
      </button>
      <div className="space-y-6">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="p-4 border rounded-lg flex justify-between items-center shadow hover:shadow-lg transition duration-300">
            <div>
              <h2 className="text-xl font-semibold text-[#0D3A73]">{announcement.title}</h2>
              <p className="text-gray-500">{announcement.description}</p>
              <img
                src={announcement.image || placeholder}
                alt="Announcement"
                className="w-20 h-20 object-cover rounded-lg mt-3"
              />
            </div>
            <div className="space-x-4 flex">
              <button onClick={() => openEdit(announcement)} className="text-[#0D3A73] hover:text-[#f0c808] transition duration-300">
                <Edit size={22} />
              </button>
              <button onClick={() => deleteAnnouncement(announcement.id)} className="text-red-600 hover:text-red-700 transition duration-300">
                <Trash size={22} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-96 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-[#0D3A73]">{form.id ? "Edit Announcement" : "Add Announcement"}</h2>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full p-3 border rounded-lg mb-4 text-[#0D3A73] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f0c808] resize-none"
            />
            {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}

            <input
              name="image"
              type="file"
              onChange={handleImageChange}
              className="w-full p-3 border rounded-lg mb-4 text-[#0D3A73] file:border-0 file:bg-[#f0c808] file:text-white focus:outline-none"
            />
            {form.image && form.image !== "placeholder" ? (
              <div className="mb-4">
                <img src={form.image} alt="Preview" className="w-24 h-24 object-cover rounded-lg" />
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-4">No image selected</p>
            )}
            {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-3 border rounded-lg mb-4 text-[#0D3A73] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f0c808] resize-none"
            />
            {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}

            <textarea
              name="details"
              value={form.details}
              onChange={handleChange}
              placeholder="Details"
              className="w-full p-3 border rounded-lg mb-6 text-[#0D3A73] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f0c808] resize-none"
            />

            <div className="flex justify-end space-x-4">
              <button onClick={() => setSelected(null)} className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition duration-300">
                Cancel
              </button>
              <button onClick={form.id ? saveAnnouncement : addAnnouncement} className="px-6 py-2 bg-[#f0c808] text-white rounded-lg hover:bg-[#f0c808] transition duration-300">
                {form.id ? "Save Changes" : "Add Announcement"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
