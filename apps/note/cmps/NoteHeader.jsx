const { Link } = ReactRouterDOM

export function NoteHeader() {

    return <h4 className="note_header">

        <Link to="/noteEdit/new" >
            <div className="new_note_input">
                <p>New Note?</p>
                <nav>
                    <input></input>
                </nav>
            </div>
        </Link>

        <div className="note_srt_containter">
            <button>Pinned</button>
            <button>Type</button>
            <button>Time</button>
        </div>
    </h4>
}