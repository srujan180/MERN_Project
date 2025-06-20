
import Note from '../../model/Note.js';  // correct path (go up one level)

export async function getRoutes(req,res){
    try{
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (error){
console.error("error  ", error);
res.status(500).json
    }}

export async function postRoutes(req,res){
    try{
    const {title, content} = req.body;
    const newNote   = new Note ({title,  content});
   await newNote.save() 
res.status(201).json({newNote});
if(!postRoutes) return res.status(404).json({message:"Note not found "})
    
} catch (error) {
console.error("error  ", error);
res.status(500).json({message: "internel server error"})
}}

export async function getRoutesbyid(req, res){
    try {
        const note = await Note.findById(req.params.id)
        if(!note) return res.status(404).json({message:"note is not found"})
            res.json(note);
    } catch (error) {
        console.error("error", error)
        res.status(500).json({message:"Internel error try again later "})
    }
}

export async function putRoutes(req,res){
    try {
        const {title, content} = req.body
        await Note.findByIdAndUpdate(req.params.id,{title, content})
        res.status(200).json({meassage:"note is updated succesfully"})
    } catch (error) {
        console.log("error", error)
        res.status(500).json({meassage:"Internel error note is not updated "});
    }
}

export async function deleteRoutes(req,res){
try {
    
    await Note.findByIdAndDelete(req.params.id)
    if(!deleteRoutes) return res.status(404).json({message:"Error in deleting the note not found"}) 

    res.status(200).json({message:"note deleted successfully"});
} catch (error) {
    console.error("error", error)
    res.status(500).json({message:"note is not deleted try again later"});
}

}
