import { PenSquareIcon, Trash2Icon } from 'lucide-react'
import { Link } from "react-router";
import toast from "react-hot-toast";
import api from '../lib/axios';
const NoteCard = ({ note, setNotes}) => {
  const handleDelete = async(e,id) =>{
    e.preventDefault();
    if(!window.confirm("are u sure to delete this notes"))
      return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes ((prev)=>prev.filter((note=> note._id !== id)))
      toast.success("Deleted")
    } catch (error) {
      console.log(error)
      toast.error("Try again later and delete")
    }
  }
  
  return (
    <Link
      to={`/note/${note._id}`}
      className="card bg-base-100 hover:shadow-lg transition-all duration-200 
      border-t-4 border-solid border-[#00FF9D]"
    >
      <div className="card-body">
        <h3 className="card-title text-base-content">{note.title}</h3>
        <p className="text-base-content/70 line-clamp-3">{note.content}</p>
        <div className="card-actions justify-between items-center mt-4">
          <span className="text-sm text-base-content/60">
            
          </span>
          <div className="flex items-center gap-1">
            <PenSquareIcon className="size-4" />
            <button onClick={(e)=> handleDelete(e,note._id)}><Trash2Icon className="size-4" /></button>
            
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
//2