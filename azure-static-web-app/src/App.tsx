import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import Kennisbank from './pages/Kennisbank';
import Cases from './pages/Cases';
import Trends from './pages/Trends';
import Team from './pages/Team';
import News from './pages/News';
import Admin from './pages/Admin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Overview />} />
        <Route path="kennisbank" element={<Kennisbank />} />
        <Route path="cases" element={<Cases />} />
        <Route path="trends" element={<Trends />} />
        <Route path="team" element={<Team />} />
        <Route path="nieuws" element={<News />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}

export default App;
