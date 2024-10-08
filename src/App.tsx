import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home'
import Dashboard from './pages/Dashboard/Dashboard'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
