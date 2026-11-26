import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { About } from './pages/About'
import { Athlexna } from './pages/Athlexna'
import { Contact } from './pages/Contact'
import { Home } from './pages/Home'
import { Isbi } from './pages/Isbi'
import { Programmes } from './pages/Programmes'
import { RafaNadalAcademy } from './pages/RafaNadalAcademy'
import { RisingStar } from './pages/RisingStar'
import { SportsTours } from './pages/SportsTours'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="programmes" element={<Programmes />} />
        <Route path="rising-star" element={<RisingStar />} />
        <Route path="rsdl" element={<Navigate to="/rising-star" replace />} />
        <Route path="tsl" element={<Navigate to="/rising-star" replace />} />
        <Route path="rafa-nadal-academy" element={<RafaNadalAcademy />} />
        <Route path="sports-tours" element={<SportsTours />} />
        <Route path="athlexna" element={<Athlexna />} />
        <Route path="isbi" element={<Isbi />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
