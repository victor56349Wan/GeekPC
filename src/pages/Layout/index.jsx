import { Layout, Menu, Popconfirm } from 'antd'
import { useEffect } from 'react'
import '@ant-design/v5-patch-for-react-19'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store'
import { useNavigate } from 'react-router-dom'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import './index.scss'
import { Link, Outlet, useLocation } from 'react-router-dom'

const { Header, Sider } = Layout

const GeekLayout = () => {
  const location = useLocation()
  console.log(location)
  const navigate = useNavigate()
  const { loginStore, userStore } = useStore()
  useEffect(() => {
    const fetchUserInfo = async () => {
      console.log('starting to fetch user info')
      try {
        const userInfo = await userStore.getUserInfo()
        if (!userStore.userInfo.name) {
          console.log('没有用户信息', userInfo)
        }
        console.log('useInfo name', userStore.userInfo.name)
      } catch (error) {
        if (error.response && error.response.status === 401) {
          loginStore.logout()
          navigate('/login')
          message.warning('登录过期，请重新登录')
        }
      }
    }
    fetchUserInfo()
  }, [])
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">数据概览</Link>,
    },
    {
      key: '/article',
      icon: <DiffOutlined />,
      label: <Link to="/article">内容管理</Link>,
    },
    {
      key: '/publish',
      icon: <EditOutlined />,
      label: <Link to="/publish">发布文章</Link>,
    },
  ]
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{userStore.userInfo.name}</span>
          <span className="user-logout">
            <Popconfirm
              title="是否确认退出？"
              okText="退出"
              cancelText="取消"
              onConfirm={() => {
                loginStore.logout()
                navigate('/login')
              }}
              onCancel={() => {
                loginStore.cancel()
              }}>
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys={[location.pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems} // 使用 items 属性
          />
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* <Link to="/home">home</Link>
          <Link to="/article">article</Link>
          <Link to="/publish">publish</Link> */}
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}

export default observer(GeekLayout)
