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
          console.log('token过期了')
          loginStore.logout()
          navigate('/login')
        }
      }
    }
    fetchUserInfo()
  }, [])

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
            style={{ height: '100%', borderRight: 0 }}>
            <Menu.Item icon={<HomeOutlined />} key="/">
              <Link to="/">数据概览</Link>
            </Menu.Item>
            <Menu.Item icon={<DiffOutlined />} key="/article">
              <Link to="/article">内容管理</Link>
            </Menu.Item>
            <Menu.Item icon={<EditOutlined />} key="/publish">
              <Link to="/publish">发布文章</Link>
            </Menu.Item>
          </Menu>
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
