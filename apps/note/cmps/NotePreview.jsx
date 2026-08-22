import { noteService } from '../services/note.service.js'

const { useState, useEffect } = React
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

export function NotePreview({ note }) {
    let noteTitle = ''
    let txtToShow = ''

    const [todos, setTodos] = useState(note.info.todos || [])

    const [imgSrc, setImgSrc] = useState(imgLoader)
    const [imgFailed, setImgFailed] = useState(false)

    const [vidSrc, setVidSrc] = useState('')
    const [vidFailed, setVidFailed] = useState(false)

    useEffect(() => {
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
    }, [note])

    useEffect(() => {
        if (note.type !== 'NoteVid') {
            setVidSrc('')
            setVidFailed(false)
            return
        }

        const embedUrl = getYoutubeEmbedUrl(note.info.url)
        setVidSrc(embedUrl)
        setVidFailed(!embedUrl)
    }, [note])

    const handleTodoChange = (todoIdx) => {
        setTodos(prevTodos => prevTodos.map((todo, idx) => (
            idx === todoIdx ? { ...todo, isDone: !todo.isDone } : todo
        )))
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

    switch (note.type) {
        case 'NoteTxt':
            txtToShow = <p>{note.info.txt}</p>
            break

        case 'NoteTodos':
            noteTitle = note.info.title
            txtToShow = (
                <section className="todos_box">
                    {todos.map((todo, idx) => (
                        <label key={`${todo.id}:${idx}`}>
                            <input type="checkbox"
                                checked={todo.isDone}
                                onChange={() => { handleTodoChange(idx), updateTodoModel(note.id, idx) }} />
                            {todo.txt}
                        </label>
                    ))}
                </section>
            )
            break

        case 'NoteImg':
            noteTitle = note.info.title

            if (!note.info.url || imgFailed) {
                txtToShow = <p>{'There was a problem loading the image'}</p>
            } else {
                txtToShow = <img src={imgSrc || imgLoader} alt={noteTitle || ''} />
            }
            break

        case 'NoteVid':
            noteTitle = note.info.title

            if (!note.info.url || vidFailed)
                txtToShow = <p>{'There was a problem loading the video'}</p>
            else {
                txtToShow = <iframe className="note_video"
                    src={vidSrc}
                    title={noteTitle || 'YouTube video'}
                    onError={() => setVidFailed(true)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen>
                </iframe>
            }
            break
    }

    return (
        <section>

            <h4>{noteTitle}</h4>
            {txtToShow}

        </section >
    )
}