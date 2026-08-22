import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'
import { NoteHeader } from '../cmps/NoteHeader.jsx'
import { showErrorMsg } from '../../../services/event-bus.service.js'

const { useState, useEffect } = React
const { useNavigate } = ReactRouterDOM

const initialNotesFilter = {
    onlyPinned: false,
    type: 'all',
    sortByDate: false,
    sortDir: -1
}

export function NoteIndex() {

    const [notes, setNotes] = useState(null)
    const [notesFilter, setNotesFilter] = useState(initialNotesFilter)
    const navigate = useNavigate()

    useEffect(() => {
        loadNotes()
    }, [notesFilter])

    function loadNotes() {
        noteService.query(notesFilter)
            .then(fetchedNotes => setNotes(fetchedNotes))
            .catch(err => showErrorMsg('Had issues loading notes:', err))
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

    function onColorChange(noteId, backgroundColor) {
        noteService.getById(noteId)
            .then(note => {
                note.style = { ...note.style, backgroundColor }
                return noteService.save(note)
            })
            .then(updatedNote => {
                setNotes(prev => prev.map(note => note.id === updatedNote.id ? updatedNote : note))
            })
            .catch(err => showErrorMsg(`Couldn't change the color of ${noteId}`, err))
    }

    function onEditClick(noteId) {
        navigate(`/noteEdit/${noteId}`)
    }

    if (!notes) return <div className="notes-loading">Loading...</div>

    return (
        <section className="notes_index">
            <NoteHeader filterBy={notesFilter} onSetFilterBy={setNotesFilter} />

            <section className="notes_container">
                <NoteList notes={notes}
                    onRemoveNote={onRemoveNote}
                    onPinClick={onPinClick}
                    onEditClick={onEditClick}
                    onColorChange={onColorChange} />
            </section>

        </section >
    )
}
