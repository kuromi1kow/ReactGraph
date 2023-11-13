import React, { useEffect, useRef } from 'react';
import Papa from 'papaparse';
import ReactECharts from 'echarts-for-react';

const Chart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
 
    const upColor = '#00da3c';
    const downColor = '#ec0000';

    function splitData(rawData) {
      let categoryData = [];
      let values = [];
      let volumes = [];
      for (let i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i].splice(0, 1)[0]);
        values.push(rawData[i]);
        volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1]);
      }
      return {
        categoryData: categoryData,
        values: values,
        volumes: volumes,
      };
    }

    function calculateMA(dayCount, data) {
      var result = [];
      for (var i = 0, len = data.values.length; i < len; i++) {
        if (i < dayCount) {
          result.push('-');
          continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
          sum += data.values[i - j][1];
        }
        result.push(+(sum / dayCount).toFixed(3));
      }
      return result;
    }

    const fetchData = async () => {
      const response = await fetch('/stockdata.csv');
      const stockdata = await response.text();
      
      const parsedData = Papa.parse(stockdata, { header: true }).data;

      
      // const rawData = parsedData.map((entry) => [
      //   entry.date,
      //   parseFloat(entry.open),
      //   parseFloat(entry.close),
      //   parseFloat(entry.low),
      //   parseFloat(entry.high),
      //   parseFloat(entry.volume),
      // ]);
      const rawData = [
        ['2010-01-01', 100, 110, 95, 105, 150000],
  ['2010-02-01', 105, 115, 98, 108, 180000],
  ['2010-03-01', 108, 120, 100, 112, 200000],
  ['2010-04-01', 112, 125, 105, 116, 220000],
  ['2010-05-01', 116, 130, 108, 120, 240000],
  ['2010-06-01', 120, 135, 112, 125, 260000],
  ['2010-07-01', 125, 140, 115, 130, 280000],
  ['2010-08-01', 130, 145, 120, 135, 300000],
  ['2010-09-01', 135, 150, 125, 140, 320000],
  ['2010-10-01', 140, 155, 130, 145, 340000],
  ['2010-11-01', 145, 160, 135, 150, 360000],
  ['2010-12-01', 150, 165, 140, 155, 380000],
  // Continue the pattern for subsequent years
  ['2016-01-01', 180, 200, 170, 190, 450000],
  ['2016-02-01', 185, 205, 175, 195, 470000],
  ['2016-03-01', 190, 210, 180, 200, 490000],
  ['2016-04-01', 195, 215, 185, 205, 510000],
  ['2016-05-01', 200, 220, 190, 210, 530000],
  ['2016-06-01', 205, 225, 195, 215, 550000]
      ];

      console.log(response);
      const data = splitData(rawData);
      console.log('Fetched stock data:', data);


      const myChart = chartRef.current.getEchartsInstance();
      myChart.setOption({
        animation: false,
        legend: {
          bottom: 10,
          left: 'center',
          data: ['OPEN', 'HIGH', 'LOW', 'TURNOVER', 'VOLATILITY'],
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          textStyle: {
            color: '#000'
          },
          position: function (pos, params, el, elRect, size) {
            const obj = {
              top: 10
            };
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
            return obj;
          }
        },
        axisPointer: {
          link: [
            {
              xAxisIndex: 'all'
            }
          ],
          label: {
            backgroundColor: '#777'
          }
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: false
            },
            brush: {
              type: ['lineX', 'clear']
            }
          }
        },
        brush: {
          xAxisIndex: 'all',
          brushLink: 'all',
          outOfBrush: {
            colorAlpha: 0.1
          }
        },
        visualMap: {
          show: false,
          seriesIndex: 5,
          dimension: 2,
          pieces: [
            {
              value: 1,
              color: downColor
            },
            {
              value: -1,
              color: upColor
            }
          ]
        },
        grid: [
          {
            left: '10%',
            right: '8%',
            height: '50%'
          },
          {
            left: '10%',
            right: '8%',
            top: '63%',
            height: '16%'
          }
        ],
        xAxis: [
          {
            type: 'category',
            data: data.categoryData,
            boundaryGap: false,
            axisLine: { onZero: false },
            splitLine: { show: false },
            min: 'dataMin',
            max: 'dataMax',
            axisPointer: {
              z: 100
            }
          },
          {
            type: 'category',
            gridIndex: 1,
            data: data.categoryData,
            boundaryGap: false,
            axisLine: { onZero: false },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            min: 'dataMin',
            max: 'dataMax'
          }
        ],
        yAxis: [
          {
            scale: true,
            splitArea: {
              show: true
            }
          },
         {
            gridIndex: 1,
            splitNumber: 2,
            axisLabel: {
              show: true,
              formatter: function (value) {
                return value / 1000000 + 'M';
              }
            },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0, 1],
            start: 98,
            end: 100
          },
          {
            show: true,
            xAxisIndex: [0, 1],
            type: 'slider',
            top: '85%',
            start: 98,
            end: 100
          }
        ],
        series: [
          {
            name: 'OPEN',
            type: 'line',
            data: data.values.map((item) => item[1]),
            smooth: true,
            lineStyle: {
              opacity: 0.5
            },
          },
          {
            name: 'HIGH',
            type: 'line',
            data: data.values.map((item) => item[2]),
            smooth: true,
            lineStyle: {
              opacity: 0.5
            },
          },
          {
            name: 'LOW',
            type: 'line',
            data: data.values.map((item) => item[3]),
            smooth: true,
            lineStyle: {
              opacity: 0.5
            },
          },
          {
            name: 'TURNOVER',
            type: 'candlestick',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: [
              [135, 150, 125, 140, 320000],
              [140, 155, 130, 145, 340000],
              [145, 160, 135, 150, 360000],
              [150, 165, 140, 155, 380000],
              [180, 200, 170, 190, 450000],
              [185, 205, 175, 195, 470000],
              [190, 210, 180, 200, 490000],
              [195, 215, 185, 205, 510000],
              [200, 220, 190, 210, 530000],
              [205, 225, 195, 215, 550000],
              [210, 230, 200, 220, 600000],
              [215, 235, 205, 225, 620000],
              [220, 240, 210, 230, 650000],
              [225, 245, 215, 235, 680000],
              [230, 250, 220, 240, 700000],
              [235, 255, 225, 245, 720000],
              [240, 260, 230, 250, 750000],
              [245, 265, 235, 255, 780000],
              [250, 270, 240, 260, 800000],
              [255, 275, 245, 265, 820000],
              [135, 150, 125, 140, 320000],
              [140, 155, 130, 145, 340000],
              [145, 160, 135, 150, 360000],
              [190, 165, 140, 155, 380000],
              [1980, 200, 170, 190, 450000],
              [985, 205, 175, 195, 470000],
              [990, 210, 180, 200, 490000],
              [995, 215, 185, 205, 510000],
              [900, 220, 190, 210, 530000],
              [905, 225, 195, 215, 550000],
              [910, 230, 200, 220, 600000],
              [915, 235, 205, 225, 620000],
              [920, 240, 210, 230, 650000],
              [925, 245, 215, 235, 680000],
              [930, 250, 220, 240, 700000],
              [935, 255, 225, 245, 720000],
              [940, 260, 230, 250, 750000],
              [945, 265, 235, 255, 780000],
              [850, 270, 240, 260, 800000],
              [280, 275, 245, 265, 820000],
            ],
            itemStyle: {
              color: upColor,   // Цвет свечи при положительном изменении
              color0: downColor // Цвет свечи при отрицательном изменении
            }
          },
          {
            name: 'VOLATILITY',
            type: 'line',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: calculateMA(5, data),
            smooth: true,
            lineStyle: {
              opacity: 0.5
            },
          }
        ]
      });
    };

    fetchData();
  }, []);

  const getOption = () => {
    // Return default options for the chart
   
    return {};
  };

  return (
    <div style={{ width: 'auto', height: 'auto' }}>
      <ReactECharts ref={chartRef} option={getOption()} />
    </div>
  );
};

export default Chart; 