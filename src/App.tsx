import { BrowserRouter, Routes, Route, useParams, Navigate } from 'react-router-dom'
import { AppFrame } from './components/AppFrame'
import { HomePageContent } from './components/AppFrame/HomePageContent'
import { PatientsPage } from './components/AppFrame/PatientsPage'
import { PatientProfilePage } from './components/AppFrame/PatientProfilePage'
import { TodayPatientsContent } from './components/AppFrame/TodayPatientsContent'
import { MOCK_PATIENTS } from './data/mockPatients'
import './App.css'

function PatientProfileRoute() {
  const { patientId } = useParams<{ patientId: string }>()
  const patient = patientId ? MOCK_PATIENTS.find((p) => p.id === patientId) : null
  if (!patient) return <Navigate to="/patients" replace />
  return <PatientProfilePage patient={patient} />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppFrame />}>
          <Route index element={<HomePageContent />} />
          <Route path="patients" element={<PatientsPage />}>
            <Route index element={<TodayPatientsContent />} />
            <Route path=":patientId" element={<PatientProfileRoute />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
