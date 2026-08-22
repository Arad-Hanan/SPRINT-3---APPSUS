import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'
import { NoteHeader } from '../cmps/NoteHeader.jsx'
import { showErrorMsg } from '../../../services/event-bus.service.js'

const { useState, useEffect } = React
const { useNavigate } = ReactRouterDOM

export function NoteIndex() {

    const [notes, setNotes] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        loadNotes()
    }, [])

    function loadNotes() {
        noteService.query()
            .then(fetchedNotes => setNotes(fetchedNotes))
            .catch(err => console.log('Had issues loading notes:', err))
    }

    function onRemoveNote(noteId) {
        noteService.remove(noteId)
            .then(() => { setNotes(prev => prev.filter(note => note.id !== noteId)) })
            .catch(err => showErrorMsg(`Couldn't remove ${noteId}`, err))
    }

    function onPinClick(noteId) {
        noteService.getById(noteId)
            .then(note => {
                note.isPinned = !note.isPinned
                return noteService.save(note)
            })
            .then(updatedNote => {
                setNotes(prev => prev.map(note => note.id === updatedNote.id ? updatedNote : note))
            })
            .catch(err => showErrorMsg(`Couldn't edit ${noteId}`, err))
    }

    function onEditClick(noteId) {
        navigate(`/noteEdit/${noteId}`)
    }

    if (!notes) return <div className="notes-loading">Loading...</div>

    return (
        <section className="notes_index">
            <NoteHeader />

            <section className="notes_container">
                <NoteList notes={notes}
                    onRemoveNote={onRemoveNote}
                    onPinClick={onPinClick}
                    onEditClick={onEditClick} />
            </section>

        </section >
    )
}
