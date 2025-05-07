import Bar from '../../components/Bar'
import './index.scss'

const Home = () => {
  const yData = [5, 20, 36]
  const xData = ['React', 'Vue', 'Angular']
  const title = 'ECharts entry example'
  const style = { width: '500px', height: '400px' }
  return (
    <div>
      <h2>Home</h2>
      {/* <ReactECharts option={option} style={style} />
      <ReactECharts option={option} style={style} /> */}
      <Bar
        title="主流框架使用满意度"
        xData={xData}
        yData={yData}
        style={style}
      />
      <Bar
        title="主流框架使用满意度2"
        xData={xData}
        yData={yData}
        style={style}
      />
    </div>
  )
}
export default Home
