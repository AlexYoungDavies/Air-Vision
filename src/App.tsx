import { BrowserRouter, Routes, Route, useParams, Navigate } from 'react-router-dom'
import { AppFrame } from './components/AppFrame'
import { EmptyDemoPage } from './components/AppFrame/EmptyDemoPage'
import { VisitsPage } from './components/AppFrame/VisitsPage'
import { PreferencesPage } from './components/AppFrame/PreferencesPage'
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
          <Route path="visits" element={<VisitsPage />} />
          <Route path="messages" element={<EmptyDemoPage />} />
          <Route path="patients" element={<PatientsPage />}>
            <Route index element={<TodayPatientsContent />} />
            <Route path=":patientId" element={<PatientProfileRoute />} />
          </Route>
          <Route path="orders" element={<EmptyDemoPage />} />
          <Route path="pharmacies" element={<EmptyDemoPage />} />
          <Route path="overview" element={<EmptyDemoPage />} />
          <Route path="lead-management" element={<EmptyDemoPage />} />
          <Route path="outreach" element={<EmptyDemoPage />} />
          <Route path="reports" element={<EmptyDemoPage />} />
          <Route path="encounters" element={<EmptyDemoPage />} />
          <Route path="claims" element={<EmptyDemoPage />} />
          <Route path="remittances" element={<EmptyDemoPage />} />
          <Route path="eobs" element={<EmptyDemoPage />} />
          <Route path="payments" element={<EmptyDemoPage />} />
          <Route path="statements" element={<EmptyDemoPage />} />
          <Route path="preferences" element={<PreferencesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
