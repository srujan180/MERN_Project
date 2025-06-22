import api from '../lib/axios';
import { ArrowLeftIcon } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import {Link, useNavigate} from 'react-router';

const CreatePage = () => {
  const[title, setTitle] = useState('');
  const[content, setContent] = useState('');
  const[loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const handleSubmit = async(e)=>{
    e.preventDefault();
  if(!title.trim() || !content.trim() ){
    toast.error("All fields are required before submission of notes")
    return;
  }
  setLoading(true)
  try {
    await api.post("/notes",{title,content})
    toast.success("Notes created successfully!")
    navigate("/")
  } catch (error) {
    console.log(error,"error in creating note")
    toast.error("failed to create a note pls try again later")
    navigate("/")
  }finally{
  setLoading(false)}


}
  return (
    <div className='min-h-screen bg-base-200'>
      <div className='container mx-auto px-4 py-8'>
<div className='max-w-2xl mx-auto'>
<Link to={'/'} className='btn btn-ghost mb-6'>
<ArrowLeftIcon className='size-5'/>Back to Notes</Link>

<div className='card bg-base-100'>
  <div className='card-body'>
<h2 className='card-title text-2xl mb-4'>
Create new note
</h2>
<form onSubmit={handleSubmit}>
  <div className='form-control mb-4'>
<label className='label'>
  <span className='label-text'>Title</span>
  <input type='text' placeholder='Enter your Notes Title here'className='input input-bordered e-32'
  onChange={(e)=>setTitle(e.target.value)}
  ></input>
</label>

  </div>

  <div className='form-control mb-4'>
<label className='label'>
  <span className='label-text'>Content</span>
  <input type='text' placeholder='Enter your Notes here'className='input input-bordered h-32'
  onChange={(e)=>setContent(e.target.value)}
  ></input>
</label>

  </div>
  <div className='card-actions justify-end'>
    <button type='submit' className='btn btn-primary'disabled={loading}> {loading ? "Creating...." : "Create Note"}</button>
    
  </div>

</form>
  </div>
</div>
</div>
      </div>
    </div>
  )
}

export default CreatePage
