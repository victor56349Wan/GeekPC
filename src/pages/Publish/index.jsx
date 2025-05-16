import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useEffect, useState, useRef } from 'react'
import { useStore } from '../../store'
import { observer } from 'mobx-react-lite'
import './index.scss'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css' // Import styles
import { http } from '../../utils/http'
import { useNavigate, useSearchParams } from 'react-router-dom'
const { Option } = Select

const Publish = () => {
  const [form] = Form.useForm() // 创建表单实例
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const articleId = params.get('id')

  useEffect(() => {
    async function getArticle() {
      const res = await http.get(`/mp/articles/${articleId}`)
      //console.log.log('get article res', res)
      if (res.status === 200) {
        const { cover, ...formValue } = res.data.data
        //console.log.log('formValue', formValue)
        //console.log.log('cover', cover)
        // 动态设置表单数据
        form.setFieldsValue({ ...formValue, type: cover.type })
        // 设置封面图片列表
        const imageList = cover.images.map((url) => ({ url }))
        setFileList(imageList)
        // 缓存封面图片列表
        fileListCache.current = imageList
        setCoverType(cover.type)
      }
    }
    if (articleId) {
      // 拉取数据回显
      getArticle()
    }
  }, [articleId])
  // 使用 useStore 获取 channelListStore
  const { channelListStore } = useStore()

  useEffect(() => {
    channelListStore.loadChannelList()
  }, [])

  const [fileList, setFileList] = useState([])
  const [coverType, setCoverType] = useState(1)
  const fileListCache = useRef([]) // 使用 useRef 存储缓存

  // 回调处理发布文章
  const onFinish = async (values) => {
    //console.log.log('onFinish', values)
    const { type } = values
    const params = {
      ...values,
      cover: {
        type: type,
        images: fileList.map((item) => item.url),
      },
    }
    let res = null
    if (articleId) {
      // 编辑
      res = await http.put(`/mp/articles/${articleId}?draft=false`, params)
    } else {
      // 新增
      res = await http.post('/mp/articles?draft=false', params)
    }
    if (res.status === 200) {
      //console.log.log('publish success')
      navigate('/article')
    }
  }

  // 上传成功回调
  const onUploadChange = (info) => {
    //console.log.log('info', info)
    const updatedFileList = info.fileList.map((file) => {
      if (file.response) {
        return {
          url: file.response.data.url,
        }
      }
      //console.log.log('file', file)
      return file
    })
    setFileList(updatedFileList)

    // 更新缓存的 fileListCache
    fileListCache.current = updatedFileList
    //console.log.log('fileListCache', fileListCache.current)
  }
  const onCoverTypeChange = (e) => {
    //console.log.log('radio group change', e)
    setCoverType(e.target.value)

    /*     
    if (e.target.value === 0) {
      setFileList([]) // 无图时清空 fileList
    } else {
      setFileList(fileListCache.current[e.target.value] || []) // 恢复缓存的文件列表
    } */
  }
  // 根据选中的coverType来动态设置Upload组件上渲染的文件列表fileList
  // 这里的 fileListCache.current 是一个数组，存储了所有上传的文件

  // 根据选中的类型来动态调整 fileList
  useEffect(() => {
    setFileList(fileListCache.current.slice(0, coverType))
  }, [coverType, fileListCache.current])

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb
            separator=">"
            items={[
              { title: <a href="/">首页</a> },
              { title: articleId ? '修改文章' : '发布文章' },
            ]}
          />
        }>
        <Form
          form={form} // !!!使用 form 实例
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: coverType, content: '' }}
          onFinish={(values) => onFinish(values)}>
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}>
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}>
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channelListStore.channelList.map((channel) => (
                <Option key={channel.id} value={channel.id}>
                  {channel.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group
                options={[
                  { value: 1, label: '单图' },
                  { value: 3, label: '三图' },
                  { value: 0, label: '无图' },
                ]}
                onChange={onCoverTypeChange}
              />
            </Form.Item>
            {coverType > 0 && (
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                action="http://geek.itheima.net/v1_0/upload"
                maxCount={coverType}
                multiple={coverType > 1}
                fileList={fileList}
                showUploadList
                onChange={onUploadChange}>
                {coverType !== 0 && fileList.length < coverType && (
                  <div style={{ marginTop: 8 }}>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            )}
          </Form.Item>

          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}>
            <ReactQuill theme="snow" placeholder="请输入文章内容" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                发布文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default observer(Publish)
