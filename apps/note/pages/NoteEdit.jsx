import { noteService } from '../services/note.service.js'

const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM
const imgLoader = '../../assets/img/Loading_icon.gif'

function getYoutubeEmbedUrl(url) {
    try {
        const parsedUrl = new URL(url)
        let videoId = parsedUrl.searchParams.get('v')

        if (parsedUrl.hostname === 'youtu.be') videoId = parsedUrl.pathname.slice(1)
        if (parsedUrl.pathname.startsWith('/embed/')) videoId = parsedUrl.pathname.split('/')[2]
        if (parsedUrl.pathname.startsWith('/shorts/')) videoId = parsedUrl.pathname.split('/')[2]

        return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
    } catch (err) {
        return ''
    }
}

export function NoteEdit() {

    const { noteId } = useParams()
    const [currNote, setCurrNote] = useState(null)
    const navigate = useNavigate()

    const [todos, setTodos] = useState([])

    const [imgSrc, setImgSrc] = useState(imgLoader)
    const [imgFailed, setImgFailed] = useState(false)

    const [vidSrc, setVidSrc] = useState('')
    const [vidFailed, setVidFailed] = useState(false)

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

    useEffect(() => {
        if (!currNote || currNote.type !== 'NoteVid') {
            setVidSrc('')
            setVidFailed(false)
            return
        }

        const embedUrl = getYoutubeEmbedUrl(currNote.info.url)
        setVidSrc(embedUrl)
        setVidFailed(!embedUrl)
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
            editBody = <div className="edit-vid-wrapper">
                <label>
                    Title:
                    <input name="title" type="text" value={currNote.info.title || ''} onChange={handleChange} />
                </label>
                <label>
                    Video URL:
                    <input name="url" type="url" value={currNote.info.url || ''} onChange={handleChange} />
                </label>
                {!currNote.info.url || vidFailed
                    ? <p>There was a problem loading the video</p>
                    : <iframe className="note_video"
                        src={vidSrc}
                        title={currNote.info.title || 'YouTube video'}
                        onError={() => setVidFailed(true)}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen>
                    </iframe>}
            </div>
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

    function onTypeButton(type) {
        if (currNote.type === type) return

        setCurrNote(prevNote => {
            const currentInfo = prevNote.info || {}

            switch (type) {
                case 'NoteTxt':
                    return {
                        ...prevNote,
                        type,
                        info: { txt: currentInfo.txt || '' }
                    }
                case 'NoteTodos':
                    return {
                        ...prevNote,
                        type,
                        info: {
                            title: currentInfo.title || '',
                            todos: currentInfo.todos || []
                        }
                    }
                case 'NoteImg':
                case 'NoteVid':
                    return {
                        ...prevNote,
                        type,
                        info: {
                            title: currentInfo.title || '',
                            url: currentInfo.url || ''
                        }
                    }
                default:
                    return prevNote
            }
        })
    }

    const getTypeButtonClass = (type) => currNote.type === type ? 'selectedType' : ''

    return <form onSubmit={onSave} className="note_edit_container">

        {editBody}

        <section className="note-edit-btn">
            <div className="edit-type-btn">
                <button
                    title='Text memo'
                    type="button"
                    className={getTypeButtonClass('NoteTxt')}
                    onClick={() => onTypeButton('NoteTxt')}>📝</button>
                <button
                    title='Todo checklist'
                    type="button"
                    className={getTypeButtonClass('NoteTodos')}
                    onClick={() => onTypeButton('NoteTodos')}>📋</button>
                <button
                    title='Image'
                    type="button"
                    className={getTypeButtonClass('NoteImg')}
                    onClick={() => onTypeButton('NoteImg')}>🖼️</button>
                <button
                    title='Video'
                    type="button"
                    className={getTypeButtonClass('NoteVid')}
                    onClick={() => onTypeButton('NoteVid')}>🎬</button>
            </div>

            <div className="edit-end-btn">
                <button>Save</button>
                <button type="button" onClick={() => navigate('/note')}>Cancel</button>
            </div>
        </section>
    </form>
}