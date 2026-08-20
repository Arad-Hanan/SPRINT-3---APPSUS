export function MailSort({ filterBy, onSetFilterBy }) {

    function onSetSortBy(sortBy) {
        onSetFilterBy(prevFilter => {
            if (prevFilter.sortBy === sortBy) {
                return { ...prevFilter, sortDir: prevFilter.sortDir * -1 }
            }
            return { ...prevFilter, sortBy, sortDir: (sortBy === 'date') ? -1 : 1 }
        })
    }

    function getArrow(sortBy) {
        if (filterBy.sortBy !== sortBy) return ''
        return (filterBy.sortDir === 1) ? ' ▲' : ' ▼'
    }

    return (
        <div className="mail-sort">
            <span>Sort</span>

            <button
                className={(filterBy.sortBy === 'date') ? 'active' : ''}
                onClick={() => onSetSortBy('date')}>
                Date{getArrow('date')}
            </button>

            <button
                className={(filterBy.sortBy === 'subject') ? 'active' : ''}
                onClick={() => onSetSortBy('subject')}>
                Subject{getArrow('subject')}
            </button>
        </div>
    )
}
