import ReactECharts from 'echarts-for-react' // or var ReactECharts = require('echarts-for-react');

function Bar({ title, xData, yData, style }) {
  const option = {
    title: {
      text: title,
    },
    tooltip: {},
    xAxis: {
      data: xData,
    },
    yAxis: {},
    series: [
      {
        name: 'sales',
        type: 'bar',
        data: yData,
      },
    ],
  }
  return <ReactECharts option={option} style={style} />
}
export default Bar
