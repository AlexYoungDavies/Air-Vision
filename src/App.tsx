import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppFrame } from './components/AppFrame'
import { HomePageContent } from './components/AppFrame/HomePageContent'
import { PatientsPage } from './components/AppFrame/PatientsPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppFrame />}>
          <Route index element={<HomePageContent />} />
          <Route path="patients" element={<PatientsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
