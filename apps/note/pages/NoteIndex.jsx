import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'
import { NoteHeader } from '../cmps/NoteHeader.jsx'

const { useState, useEffect } = React

export function NoteIndex() {

    const [notes, setNotes] = useState(null)

    useEffect(() => {
        loadNotes()
    }, [])

    function loadNotes() {
        noteService.query()
            .then(fetchedNotes => setNotes(fetchedNotes))
            .catch(err => console.log('Had issues loading notes:', err))
    }


    if (!notes) return <div className="notes-loading">Loading...</div>

    return (
        <section className="notes_index">
            <NoteHeader />

            <section className="notes_container">
                <NoteList notes={notes} />
            </section>

            <button className="addNote_btn">+</button>
        </section >
    )
}
