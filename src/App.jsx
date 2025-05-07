import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GeekLayout from './pages/Layout'
import { AuthRoute } from './components/AuthRoute'
import Home from './pages/Home'
import Article from './pages/Article'
import Publish from './pages/Publish'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import { history, HistoryRouter } from './utils/history'
import './App.css'
const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <AuthRoute>
                <GeekLayout />
              </AuthRoute>
            }>
            {/* <Route index element={<Home />} /> */}
            <Route index element={<Home />} />
            <Route path="article" element={<Article />} />
            <Route path="publish" element={<Publish />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
export default App
