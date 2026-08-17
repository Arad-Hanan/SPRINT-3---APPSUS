import { noteService } from '../services/note.service.js'

const { useState } = React
const { Link } = ReactRouterDOM
const imgLoader = '../../assets/img/Loading_icon.gif'

export function NotePreview({ note }) {
    let noteTitle = ''
    let txtToShow = ''

    const [todos, setTodos] = useState(note.info.todos || [])
    const [imgSrc, setImgSrc] = useState(note.info.url || [])

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
            txtToShow = <img src={imgSrc}
                alt={note.info.title}
                onError={() => setImgSrc(imgLoader)} />
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

        </section>
    )
}