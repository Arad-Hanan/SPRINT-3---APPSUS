import { NotePreview } from './NotePreview.jsx'

export function NoteList({ notes }) {

  if (!notes.length) return <div className="no-notes">No notes saved</div>

  return notes.map(note => (
    <div key={note.id} className={`note ${note.type}${note.isPinned ? ' pinned' : ''}`}>
      <NotePreview note={note} />
    </div>
  ))
}