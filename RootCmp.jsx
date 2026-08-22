const { Route, Routes, Navigate } = ReactRouterDOM
const Router = ReactRouterDOM.HashRouter

import { AppHeader } from './cmps/AppHeader.jsx'
import { UserMsg } from './cmps/UserMsg.jsx'
import { About } from './pages/About.jsx'
import { Home } from './pages/Home.jsx'
import { MailIndex } from './apps/mail/pages/MailIndex.jsx'
import { MailDetails } from './apps/mail/pages/MailDetails.jsx'
import { NoteIndex } from './apps/note/pages/NoteIndex.jsx'
import { NoteEdit } from './apps/note/pages/NoteEdit.jsx'

export function RootCmp() {
    return <Router>
        <section className="root-cmp">
            <AppHeader />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/mail" element={<Navigate to="/mail/inbox" replace />} />
                <Route path="/mail/:folder" element={<MailIndex />}>
                    <Route path=":mailId" element={<MailDetails />} />
                </Route>
                <Route path="/note" element={<NoteIndex />} />
                <Route path="/noteEdit/:noteId" element={<NoteEdit />} />
            </Routes>
            <UserMsg />
        </section>
    </Router>
}
