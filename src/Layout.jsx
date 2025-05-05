import { Link, Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div>
      layout
      <Link to="/">board</Link>
      <Link to="/article">article</Link>
      <Outlet />
    </div>
  )
}

export default Layout
