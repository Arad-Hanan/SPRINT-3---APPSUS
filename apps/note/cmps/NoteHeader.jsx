const { Link } = ReactRouterDOM
const { useState } = React

export function NoteHeader({ filterBy, onSetFilterBy }) {

    const [openTypeBtn, setOpenTypeBtn] = useState(false)

    function togglePinned() {
        onSetFilterBy(prevFilter => ({ ...prevFilter, onlyPinned: !prevFilter.onlyPinned }))
    }

    function onTypeChange(ev) {
        onSetFilterBy(prevFilter => ({ ...prevFilter, type: ev.target.value }))
        setOpenTypeBtn(false)
    }

    function toggleSort() {
        onSetFilterBy(prevFilter => {
            if (!prevFilter.sortByDate) {
                return { ...prevFilter, sortByDate: true, sortDir: 1 }
            }

            if (prevFilter.sortDir === 1) {
                return { ...prevFilter, sortDir: -1 }
            }

            return { ...prevFilter, sortByDate: false, sortDir: -1 }
        })
    }

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

            <button className={filterBy.onlyPinned ? 'greyed-btn' : ''}
                title="Show only pinned notes"
                onClick={togglePinned}>{filterBy.onlyPinned ? 'Show all' : 'Pinned'}</button>

            <button type="button" onClick={() => setOpenTypeBtn(prevOpen => !prevOpen)}>
                Type
                {openTypeBtn && <span className="type-options">
                    <label><input type="radio" name="noteType" value="all"
                        checked={filterBy.type === 'all'} onChange={onTypeChange} />All</label>
                    <label><input type="radio" name="noteType" value="NoteTxt"
                        checked={filterBy.type === 'NoteTxt'} onChange={onTypeChange} />Text</label>
                    <label><input type="radio" name="noteType" value="NoteImg"
                        checked={filterBy.type === 'NoteImg'} onChange={onTypeChange} />Image</label>
                    <label><input type="radio" name="noteType" value="NoteTodos"
                        checked={filterBy.type === 'NoteTodos'} onChange={onTypeChange} />Todos</label>
                    <label><input type="radio" name="noteType" value="NoteVid"
                        checked={filterBy.type === 'NoteVid'} onChange={onTypeChange} />Video</label>
                </span>}
            </button>

            <button title="Sort by time created"
                onClick={toggleSort}>Time
                <span>{!filterBy.sortByDate && ' ↕'}
                    {filterBy.sortByDate && filterBy.sortDir === 1 && ' ↓'}
                    {filterBy.sortByDate && filterBy.sortDir === -1 && ' ↑'}
                </span>
            </button>
        </div>
    </h4>
}