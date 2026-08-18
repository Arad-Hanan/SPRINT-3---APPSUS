import { noteService } from '../services/note.service.js'

const { useState, useEffect } = React
const { Link } = ReactRouterDOM
const imgLoader = '../../assets/img/Loading_icon.gif'

export function NotePreview({ note }) {
    let noteTitle = ''
    let txtToShow = ''

    const [todos, setTodos] = useState(note.info.todos || [])
    const [imgSrc, setImgSrc] = useState(imgLoader)
    const [imgFailed, setImgFailed] = useState(false)

    useEffect(imgHandler => {
        if (note.type !== 'NoteImg') {
            setImgSrc('')
            setImgFailed(false)
            return
        }

        setImgSrc(imgLoader)
        setImgFailed(false)

        const img = new Image()
        img.src = note.info.url

        img.onload = () => setImgSrc(note.info.url)
        img.onerror = () => {
            setImgFailed(true)
            setImgSrc('')
        }
    }, [])

    const handleChange = (todoIdx) => {
        setTodos(prevTodos => prevTodos.map((todo, idx) => (
            idx === todoIdx ? { ...todo, isDone: !todo.isDone } : todo
        )))
    }

    function updateModel(noteId, todoIdx) {
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

    switch (note.type) {
        case 'NoteTxt':
            txtToShow = <p>{note.info.txt}</p>
            break

        case 'NoteImg':
            noteTitle = note.info.title

            if (!note.info.url || imgFailed) {
                txtToShow = <p>{'There was a problem loading the image'}</p>
            } else {
                txtToShow = <img src={imgSrc || imgLoader} alt={noteTitle || ''} />
            }
            break

        case 'NoteTodos':
            noteTitle = note.info.title
            txtToShow = (
                <section className="todos_box">
                    {todos.map((todo, idx) => (
                        <label key={`${todo.id}:${idx}`}>
                            <input type="checkbox"
                                checked={todo.isDone}
                                onChange={() => { handleChange(idx), updateModel(note.id, idx) }} />
                            {todo.txt}
                        </label>
                    ))}
                </section>
            )
            break
    }

    return (
        <section>

            <h4>{noteTitle}</h4>
            {txtToShow}

        </section >
    )
}