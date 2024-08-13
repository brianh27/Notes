import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'

const App = (props) => {
  const link="http://localhost:3001/api"
  const [notes, setNotes] = useState(props.notes)

  const [newNote, setNewNote] = useState(
    'a new note...'
  ) 
  const [showAll, setShowAll] = useState(true)
  const hook = () => {
    console.log(link+'/notes')
    axios
      .get(link+'/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }
  
  useEffect(hook, [])
  const changeNote=(event)=>{
    setNewNote(event.target.value)
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: String(notes.length + 1),
    }
  
    setNotes(notes.concat(noteObject))
    setNewNote('')
  }
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  const toggleImportanceOf = (id) => {
      const url = link+`/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    axios.put(url, changedNote).then(response => {
      setNotes(notes.map(n => n.id !== id ? n : response.data))
      hook()
    })
    
  }
  
  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        
        {notesToShow.map((note, index) =>
          <Note key={note.id || index} note={note} toggleImportance={()=>toggleImportanceOf(note.id)} />
        )}

      </ul>
      <form onSubmit={addNote}>

        <input value={newNote} onChange={changeNote}/>
        <button type="submit">save</button>
      </form>   
    </div>
  )
}
export default App 