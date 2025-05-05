import { Card, Form } from 'antd'
import logo from '../../assets/logo192.png'
import './index.scss'
const Login = () => {
  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        <p> card content</p>
      </Card>

      <div>this is Login</div>
    </div>
  )
}
export default Login
