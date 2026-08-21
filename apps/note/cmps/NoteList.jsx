import { NotePreview } from './NotePreview.jsx'

const { useState, useEffect } = React

export function NoteList({ notes, onRemoveNote }) {

	if (!notes.length) return <div className="no-notes">No notes saved</div>

	return notes.map(note => (
		<div key={note.id}
			className={`note ${note.type}${note.isPinned ? ' pinned' : ''}`}
			style={{ backgroundColor: `${note.style.backgroundColor}` }} >

			<span className="pinned_note">{note.isPinned ? '📌' : ''}</span>
			<NotePreview note={note} />

			<div className="note_btn">
				<button>📝</button>
				<button>🎨</button>
				<button>Copy</button>
				{note.type === 'NoteTxt' && <button>📧</button>}
				<button onClick={() => onRemoveNote(note.id)}>🗑</button>
			</div>
		</div>
	))
}