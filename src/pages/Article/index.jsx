import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select } from 'antd'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import './index.scss'
import { Table, Tag, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { http } from '../../utils/http'
import { useEffect, useState } from 'react'
import img404 from '../../assets/logo192.png'
import { useNavigate } from 'react-router-dom'

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
  const [channelList, setChannelList] = useState([])

  useEffect(() => {
    const loadChannelList = async () => {
      const res = await http.get('/channels')
      console.log('loadChannelList res', res)
      if (res.status === 200) {
        const { channels } = res.data.data
        setChannelList(channels)
      }
    }
    loadChannelList()
  }, [])

  // 文章列表, 统一管理数据
  const [articleData, setArticleData] = useState({
    list: [],
    total: 0,
  })
  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
  })

  // 文章列表数据
  /* 异步请求需要依赖一些数据变化而重新执行, 推荐写到useEffect内部 */
  useEffect(() => {
    const loadArticleList = async () => {
      console.log('loadArticleList params', params)
      const res = await http.get('/mp/articles', { params })
      console.log('loadArticleList res', res)
      if (res.status === 200) {
        const { total_count, results } = res.data.data
        setArticleData({
          list: results,
          total: total_count,
        })
      }
    }
    loadArticleList()
  }, [params])
  const renderStatus = (status) => {
    console.log('renderStatus', status)
    console.log('type of status', typeof status)
    switch (status) {
      case 0:
        return <Tag color="red">草稿</Tag>
      case 1:
        return <Tag color="orange">待审核</Tag>
      case 2:
        return <Tag color="green">审核通过</Tag>
      case 3:
        return <Tag color="blue">审核失败</Tag>
      default:
        break
    }
  }
  const navigate = useNavigate()
  const editArticle = async (id) => {
    console.log('editArticle', id)
    // 跳转到编辑页面
    //window.location.href = `/article/edit/${id}`
    //navigate(`/publish/${id}`)
    navigate(`/publish`)
  }
  const deleteArticle = async (id) => {
    console.log('deleteArticle', id)
    // 删除文章
    //window.location.href = `/article/delete/${id}`
    await http.delete(`/mp/articles/${id}`)

    setParams({ ...params })
  }
  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width: 120,
      render: (cover) => {
        return (
          <img src={cover.images[0] || img404} width={80} height={60} alt="" />
        )
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => renderStatus(status),
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate',
    },
    {
      title: '阅读数',
      dataIndex: 'read_count',
    },
    {
      title: '评论数',
      dataIndex: 'comment_count',
    },
    {
      title: '点赞数',
      dataIndex: 'like_count',
    },
    {
      title: '操作',
      render: (record) => {
        return (
          <Space size="middle">
            <Button
              onClick={() => {
                editArticle(record.id)
              }}
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
            />
            <Button
              onClick={() => {
                deleteArticle(record.id)
              }}
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
            />
          </Space>
        )
      },
    },
  ]
  const onFormFinish = (value) => {
    console.log('onFinish', value)
    const { status, channel_id, date } = value
    const _params = {}
    if (status !== -1) {
      _params.status = status
    }
    if (channel_id) {
      _params.channel_id = channel_id
    }
    if (date) {
      _params.begin_pubdate = date[0].format('YYYY-MM-DD')
      _params.end_pubdate = date[1].format('YYYY-MM-DD')
    }
    setParams({ ...params, ..._params })
  }
  const pageChange = (page, pageSize) => {
    console.log('pageChange', page, pageSize)
    // 拿到当前页参数 修改params 引起接口更新
    setParams({
      ...params,
      page: page,
      per_page: pageSize,
    })
  }
  return (
    <div>
      <Card
        title={
          <Breadcrumb
            separator=">"
            items={[
              { title: <a href="/">首页</a> },
              { title: '内容管理' },
            ]}></Breadcrumb>
        }
        variant="borderless"
        style={{ marginBottom: 20 }}>
        <Form
          initialValues={{ status: -1 }}
          onFinish={(value) => onFormFinish(value)}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={-1}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              /* defaultValue="lucy" */
              style={{ width: 120 }}>
              {channelList.map((channel) => {
                return (
                  <Option key={channel.id} value={channel.id}>
                    {channel.name}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title={`根据筛选条件查询到 ${articleData.total} 条结果`}>
        <Table
          rowKey={(record) => record.id}
          dataSource={articleData.list}
          columns={columns}
          pagination={{
            position: ['bottomCenter', 'topCenter'],
            total: articleData.total,
            current: params.page,
            pageSize: params.per_page,
            onChange: pageChange,
          }}></Table>
      </Card>
    </div>
  )
}

export default Article
