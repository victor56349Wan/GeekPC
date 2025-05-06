import { Card, Form, Input, Checkbox, Button } from 'antd'
import logo from '../../assets/logo192.png'
import './index.scss'
import { useStore } from '../../store'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const { loginStore } = useStore()
  const handleFinish = async (value) => {
    console.log('onFinish', value)
    const { code, mobile } = value
    try {
      await loginStore.login({ mobile, code })
      navigate('/')
    } catch (e) {
      console.log('登录失败', e)
      //message.error('login failed')
    }
  }
  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        <Form
          validateTrigger={['onBlur', 'onChange']}
          onFinish={(value) => handleFinish(value)}
          initialValues={{
            mobile: '13911111111',
            code: '246810',
            remember: true,
          }}>
          <Form.Item
            name="mobile"
            rules={[
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '手机号码格式不对',
                //validateTrigger: 'onBlur',
              },
              { required: true, message: '请输入手机号' },
            ]}>
            <Input size="large" placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="code"
            rules={[
              {
                len: 6,
                message: '验证码6个字符',
                //validateTrigger: 'onBlur'
              },
              { required: true, message: '请输入验证码' },
            ]}>
            <Input size="large" placeholder="请输入验证码" />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox className="login-checkbox-label">
              我已阅读并同意「用户协议」和「隐私条款」
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <div>this is Login</div>
    </div>
  )
}
export default Login
