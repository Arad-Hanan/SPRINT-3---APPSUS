import { noteService } from '../services/note.service.js'

const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

export function NoteEdit() {

    const { noteId } = useParams()
    const [currNote, setCurrNote] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (noteId === 'new') {
            setCurrNote(noteService.getEmptyNot({
                type: 'NoteTxt',
                isPinned: false,
                info: { txt: '' }
            }))
            return
        }

        noteService.getById(noteId)
            .then(setCurrNote)
            .catch(err => console.log('Had issues loading note:', err))
    }, [noteId])

    console.log(currNote)

    function handleChange({ target }) {
        setCurrNote(prevNote => ({
            ...prevNote,
            info: {
                ...prevNote.info,
                [target.name]: target.value
            }
        }))
    }

    function onSave(ev) {
        ev.preventDefault()

        if ((currNote.type === 'NoteTxt') && currNote.info.txt === '') return

        noteService.save(currNote)
            .then(() => navigate('/note'))
            .catch(err => console.log('Had issues saving note:', err))
    }

    if (!currNote) return <div className="notes-loading">Loading...</div>

    const isTextNote = currNote.type === 'NoteTxt'
    const title = currNote.info.title || ''
    const text = currNote.info.txt || ''

    return <form onSubmit={onSave}
        className="note_edit_container">
        {!isTextNote && <h4>
            Title?
            <input name="title" value={title} onChange={handleChange} />
        </h4>}

        {isTextNote && <p>
            text...
            <textarea name="txt" value={text} onChange={handleChange} />
        </p>}

        <div className="note-edit-btn">
            <button>Save</button>
            <button type="button" onClick={() => navigate('/note')}>Cancel</button>
        </div>
    </form>
}