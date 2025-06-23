import api from "../lib/axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load note");
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the note");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Changes saved");
      navigate("/")
    } catch (error) {
      console.error(error);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !note) return <p className="text-center text-primary mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-base-100 shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-primary">Edit Note</h2>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-secondary">Title</span>
        </label>
        <input
          type="text"
          placeholder="Title"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
          className="input input-bordered input-success w-full"
        />
      </div>

      <div className="form-control mb-6">
        <label className="label">
          <span className="label-text text-secondary">Content</span>
        </label>
        <textarea
          placeholder="Content"
          value={note.content}
          onChange={(e) => setNote({ ...note, content: e.target.value })}
          rows={6}
          className="textarea textarea-bordered textarea-success w-full"
        />
      </div>

      <div className="flex justify-between">
        <button onClick={handleDelete} className="btn btn-error">
          Delete
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`btn btn-success ${saving && "loading"}`}
        >
          {saving ? "Saving" : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default NoteDetailPage;
