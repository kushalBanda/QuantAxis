import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  ColorType,
  CandlestickSeries,
  BarSeries,
  LineSeries,
  AreaSeries,
  BaselineSeries,
} from 'lightweight-charts';
import type { HistoricalDataPoint } from '../schema/historical';
import './StockChart.css';

export type TimePeriod = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y';
export type ChartType = 'Candlestick' | 'Bar' | 'Line' | 'Area' | 'Baseline';

interface StockChartProps {
  data: HistoricalDataPoint[];
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  isLoading?: boolean;
}

function StockChart({ data, selectedPeriod, onPeriodChange, isLoading }: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const [chartError, setChartError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<ChartType>('Candlestick');

  const periods: TimePeriod[] = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y'];
  const chartTypes: ChartType[] = ['Candlestick', 'Bar', 'Line', 'Area', 'Baseline'];

  useEffect(() => {
    if (!chartContainerRef.current) return;

    try {
      // Create chart
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: '#ffffff' },
          textColor: '#333',
        },
        width: chartContainerRef.current.clientWidth,
        height: 500,
        grid: {
          vertLines: { color: '#f0f0f0' },
          horzLines: { color: '#f0f0f0' },
        },
        crosshair: {
          mode: 1,
        },
        rightPriceScale: {
          borderColor: '#e5e7eb',
        },
        timeScale: {
          borderColor: '#e5e7eb',
          timeVisible: true,
          secondsVisible: false,
        },
      });

      chartRef.current = chart;

      // Handle resize
      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    } catch (error) {
      console.error('Error creating chart:', error);
      setChartError('Failed to create chart');
    }
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    // Remove existing series if any
    if (seriesRef.current) {
      chartRef.current.removeSeries(seriesRef.current);
      seriesRef.current = null;
    }

    try {
      let series: any;

      // Create the appropriate series based on chart type
      switch (chartType) {
        case 'Candlestick':
          series = chartRef.current.addSeries(CandlestickSeries, {
            upColor: '#10b981',
            downColor: '#ef4444',
            borderUpColor: '#10b981',
            borderDownColor: '#ef4444',
            wickUpColor: '#10b981',
            wickDownColor: '#ef4444',
          });
          break;

        case 'Bar':
          series = chartRef.current.addSeries(BarSeries, {
            upColor: '#10b981',
            downColor: '#ef4444',
          });
          break;

        case 'Line':
          series = chartRef.current.addSeries(LineSeries, {
            color: '#6366f1',
            lineWidth: 2,
          });
          break;

        case 'Area':
          series = chartRef.current.addSeries(AreaSeries, {
            lineColor: '#6366f1',
            topColor: 'rgba(99, 102, 241, 0.4)',
            bottomColor: 'rgba(99, 102, 241, 0.05)',
            lineWidth: 2,
          });
          break;

        case 'Baseline':
          series = chartRef.current.addSeries(BaselineSeries, {
            baseValue: { type: 'price', price: 0 },
            topLineColor: '#10b981',
            topFillColor1: 'rgba(16, 185, 129, 0.28)',
            topFillColor2: 'rgba(16, 185, 129, 0.05)',
            bottomLineColor: '#ef4444',
            bottomFillColor1: 'rgba(239, 68, 68, 0.05)',
            bottomFillColor2: 'rgba(239, 68, 68, 0.28)',
            lineWidth: 2,
          });
          break;
      }

      seriesRef.current = series;
    } catch (error) {
      console.error('Error creating series:', error);
      setChartError('Failed to create chart series');
    }
  }, [chartType]);

  useEffect(() => {
    if (!seriesRef.current || !data || data.length === 0) return;

    try {
      // Parse and sort data
      const parsedData = data
        .map((point) => {
          const [day, month, year] = point.mtimestamp.split('-');
          const monthMap: { [key: string]: number } = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
          };
          const date = new Date(parseInt(year), monthMap[month], parseInt(day));
          const time = Math.floor(date.getTime() / 1000) as any;

          return { time, point };
        })
        .sort((a, b) => a.time - b.time);

      // Convert data based on chart type
      let chartData: any[];

      if (chartType === 'Candlestick' || chartType === 'Bar') {
        chartData = parsedData.map(({ time, point }) => ({
          time,
          open: point.chOpeningPrice,
          high: point.chTradeHighPrice,
          low: point.chTradeLowPrice,
          close: point.chClosingPrice,
        }));
      } else {
        // Line, Area, and Baseline use only close price
        chartData = parsedData.map(({ time, point }) => ({
          time,
          value: point.chClosingPrice,
        }));
      }

      seriesRef.current.setData(chartData);

      // Update baseline base value to first price for better visualization
      if (chartType === 'Baseline' && chartData.length > 0) {
        seriesRef.current.applyOptions({
          baseValue: { type: 'price', price: chartData[0].value },
        });
      }

      setChartError(null);
    } catch (error) {
      console.error('Error setting chart data:', error);
      setChartError('Failed to load chart data');
    }
  }, [data, chartType]);

  // Auto-adjust visible range based on selected period
  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    try {
      const timeScale = chartRef.current.timeScale();

      // Calculate the time range for the selected period
      const now = Math.floor(Date.now() / 1000);
      let startTime: number;

      switch (selectedPeriod) {
        case '1D':
          startTime = now - (24 * 60 * 60);
          break;
        case '1W':
          startTime = now - (7 * 24 * 60 * 60);
          break;
        case '1M':
          startTime = now - (30 * 24 * 60 * 60);
          break;
        case '3M':
          startTime = now - (90 * 24 * 60 * 60);
          break;
        case '6M':
          startTime = now - (180 * 24 * 60 * 60);
          break;
        case '1Y':
          startTime = now - (365 * 24 * 60 * 60);
          break;
        case '5Y':
          startTime = now - (5 * 365 * 24 * 60 * 60);
          break;
        default:
          startTime = now - (30 * 24 * 60 * 60);
      }

      // Set visible range to show only the selected period
      timeScale.setVisibleRange({
        from: startTime as any,
        to: now as any,
      });
    } catch (error) {
      console.error('Error setting visible range:', error);
    }
  }, [selectedPeriod, data]);

  if (chartError) {
    return (
      <div className="StockChart">
        <div className="StockChart-error">{chartError}</div>
      </div>
    );
  }

  return (
    <div className="StockChart">
      <div className="StockChart-header">
        <div className="StockChart-controls">
          <div className="StockChart-control-group">
            <span className="StockChart-control-label">Chart Type:</span>
            <div className="StockChart-types">
              {chartTypes.map((type) => (
                <button
                  key={type}
                  className={`StockChart-type ${chartType === type ? 'is-active' : ''}`}
                  onClick={() => setChartType(type)}
                  disabled={isLoading}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="StockChart-control-group">
            <span className="StockChart-control-label">Time Period:</span>
            <div className="StockChart-periods">
              {periods.map((period) => (
                <button
                  key={period}
                  className={`StockChart-period ${selectedPeriod === period ? 'is-active' : ''}`}
                  onClick={() => onPeriodChange(period)}
                  disabled={isLoading}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="StockChart-container">
        {isLoading && (
          <div className="StockChart-loading">Loading chart data...</div>
        )}
        <div ref={chartContainerRef} className="StockChart-chart" />
      </div>
    </div>
  );
}

export default StockChart;
