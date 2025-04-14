import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NewFeedback from './pages/NewFeedback'
import EditFeedback from './pages/EditFeedback'
import Roadmap from './pages/Roadmap'
import FeedbackDetail from './pages/FeedbackDetail'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-feedback" element={<NewFeedback />} />
        <Route path="/edit-feedback/:id" element={<EditFeedback />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/feedback/:id" element={<FeedbackDetail />} />
      </Routes>
    </Router>
  )
}

export default App