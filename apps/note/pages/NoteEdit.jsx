import { noteService } from '../services/note.service.js'

const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM
const imgLoader = '../../assets/img/Loading_icon.gif'

export function NoteEdit() {

    const { noteId } = useParams()
    const [currNote, setCurrNote] = useState(null)

    const [todos, setTodos] = useState([])

    const [imgSrc, setImgSrc] = useState(imgLoader)
    const [imgFailed, setImgFailed] = useState(false)

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

    useEffect(() => {
        setTodos(currNote && currNote.info ? currNote.info.todos || [] : [])
    }, [currNote])

    useEffect(() => {
        if (!currNote || currNote.type !== 'NoteImg') return

        setImgSrc(imgLoader)
        setImgFailed(false)

        const img = new Image()
        img.src = currNote.info.url

        img.onload = () => setImgSrc(currNote.info.url)
        img.onerror = () => {
            setImgFailed(true)
            setImgSrc('')
        }
    }, [currNote])

    if (!currNote) return <div className="notes-loading">Loading...</div>

    let editBody = ''

    switch (currNote.type) {
        case 'NoteTxt':
            editBody = <p className="note-edit-text">
                Text:
                <textarea name="txt" value={currNote.info.txt} onChange={handleChange} />
            </p>
            break

        case 'NoteTodos':
            editBody = <div className="edit-todo-wrapper">
                <h4>
                    Title:
                    <textarea name="title" value={currNote.info.title || ''} onChange={handleChange} />
                </h4>

                <section className="note-edit-todos">
                    {todos.map((todo, idx) => (
                        <label key={`${todo.id}:${idx}`}>
                            <textarea value={todo.txt || ''} onChange={ev => handleTodoTextChange(idx, ev)} />
                            <input type="checkbox"
                                checked={todo.isDone}
                                onChange={() => { handleTodoChange(idx), updateTodoModel(currNote.id, idx) }} />
                            <button type="button" onClick={ev => { ev.preventDefault(), handleRemoveTodo(idx) }}>x</button>
                        </label>
                    ))}
                    <button type="button" onClick={handleAddTodo}>+</button>
                </section>
            </div >

            break

        case 'NoteImg':
            editBody = <div className="edit-image-wrapper">
                <label>
                    Title:
                    <input name="title" type="text" value={currNote.info.title || ''} onChange={handleChange} />
                </label>
                <label>
                    Image URL:
                    <input name="url" type="url" value={currNote.info.url || ''} onChange={handleChange} />
                </label>
                {imgFailed || !currNote.info.url
                    ? <p>There was a problem loading the image</p>
                    : <img src={imgSrc || imgLoader} alt={currNote.info.title || ''} />}
            </div>
            break

        case 'NoteVid':

            break
    }

    function handleAddTodo() {
        const newTodo = { txt: '', isDone: false }

        setTodos(prevTodos => [...prevTodos, newTodo])
        setCurrNote(prevNote => ({
            ...prevNote,
            info: {
                ...prevNote.info,
                todos: [...(prevNote.info.todos || []), newTodo]
            }
        }))
    }

    function handleRemoveTodo(todoIdx) {
        setTodos(prevTodos => prevTodos.filter((todo, idx) => idx !== todoIdx))
        setCurrNote(prevNote => ({
            ...prevNote,
            info: {
                ...prevNote.info,
                todos: (prevNote.info.todos || []).filter((todo, idx) => idx !== todoIdx)
            }
        }))
    }

    const handleTodoChange = (todoIdx) => {
        setTodos(prevTodos => prevTodos.map((todo, idx) => (
            idx === todoIdx ? { ...todo, isDone: !todo.isDone } : todo
        )))
    }

    function handleTodoTextChange(todoIdx, { target }) {
        setTodos(prevTodos => prevTodos.map((todo, idx) => (
            idx === todoIdx ? { ...todo, txt: target.value } : todo
        )))

        setCurrNote(prevNote => ({
            ...prevNote,
            info: {
                ...prevNote.info,
                todos: prevNote.info.todos.map((todo, idx) => (
                    idx === todoIdx ? { ...todo, txt: target.value } : todo
                ))
            }
        }))
    }

    function updateTodoModel(noteId, todoIdx) {
        return noteService.getById(noteId)
            .then(currNote => {
                const updatedTodos = currNote.info.todos.map((todo, idx) => (
                    idx === todoIdx ? { ...todo, isDone: !todo.isDone } : todo
                ))

                const updatedNote = {
                    ...currNote,
                    info: {
                        ...currNote.info,
                        todos: updatedTodos
                    }
                }

                return noteService.save(updatedNote)
            })
            .catch(err => console.log('Had issues updating note:', err))
    }

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

    return <form onSubmit={onSave} className="note_edit_container">

        {editBody}

        <div className="note-edit-btn">
            <button>Save</button>
            <button type="button" onClick={() => navigate('/note')}>Cancel</button>
        </div>
    </form>
}