import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import MatpriserPage from "./pages/MatPriserPage"
import BottomNavbar from "./components/BottomNavbar"

export default function App() {
  return (
    <Router>
      <div className="pb-20 min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/matpriser" element={<MatpriserPage />} />
        </Routes>
        <BottomNavbar />
      </div>
    </Router>
  )
}