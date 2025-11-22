'use client';
import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area,
  LineChart, Line, ComposedChart, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Analytics } from '@/types';
import { sampleTransactions } from '@/data/transactions';
import { sampleBudget } from '@/data/budget';
import { processFinanceData } from '@/lib/dataProcessor';
import { 
  formatCurrency, 
  getMonthName, 
  getCategoryColor
} from '@/utils/helpers';

// Previous period data for comparison
const previousPeriodData = {
  totalSpending: 2150.75,
  topCategories: [
    ['Mortgage & Rent', 1247.44],
    ['Dining', 320.45],
    ['Groceries', 180.30],
    ['Shopping', 145.67],
    ['Utilities', 95.20],
    ['Transportation', 65.89],
    ['Entertainment', 55.90],
    ['Other', 39.90]
  ],
  monthlySpending: {
    '2017-12': 1950.25,
    '2018-01': 2150.75,
    '2018-02': 1980.45
  }
};

const FinanceDashboard = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y'>('1Y');
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison' | 'analytics'>('overview');
  const [comparisonType, setComparisonType] = useState<'previous' | 'budget' | 'average'>('previous');

  useEffect(() => {
    const analyticsData = processFinanceData(sampleTransactions, sampleBudget);
    setAnalytics(analyticsData);
  }, []);

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading financial dashboard...</p>
        </div>
      </div>
    );
  }

  // Prepare data for professional charts
  const budgetComparisonData = analytics.budgetComparison
    .filter(item => item.Budget > 0 || item.Actual > 0)
    .sort((a, b) => b.Budget - a.Budget);

  // Comparison Data
  const comparisonChartData = analytics.topCategories
    .slice(0, 8)
    .map(([name, value]) => {
      const previousValue = previousPeriodData.topCategories.find(([prevName]) => prevName === name)?.[1] || 0;
      const change = ((value - previousValue) / previousValue) * 100;
      
      return {
        name: name.length > 10 ? name.substring(0, 10) + '...' : name,
        Current: value,
        Previous: previousValue,
        Change: change,
        fill: getCategoryColor(name)
      };
    });

  const monthlyComparisonData = analytics.monthlyTrend.map(item => ({
    month: getMonthName(item.month),
    Current: item.spending,
    Previous: previousPeriodData.monthlySpending[item.month] || 0,
    Change: item.spending - (previousPeriodData.monthlySpending[item.month] || 0)
  }));

  const budgetPerformanceData = budgetComparisonData
    .filter(item => item.Budget > 0)
    .map(item => ({
      subject: item.Category,
      Actual: Math.min(item.Percentage, 150),
      Budget: 100,
      fullMark: 150,
    }));

  const spendingByCategory = analytics.topCategories
    .slice(0, 8)
    .map(([name, value]) => ({ 
      name: name.length > 10 ? name.substring(0, 10) + '...' : name,
      value,
      fill: getCategoryColor(name)
    }));

  const monthlyTrend = analytics.monthlyTrend.map(item => ({
    month: getMonthName(item.month),
    spending: item.spending,
    income: item.income,
    budget: 1800
  }));

  // Custom Tooltip Components
  const ComparisonTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const current = payload.find((p: any) => p.dataKey === 'Current')?.value || 0;
      const previous = payload.find((p: any) => p.dataKey === 'Previous')?.value || 0;
      const change = ((current - previous) / previous) * 100;
      
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <p className="text-blue-600 text-sm">Current: {formatCurrency(current)}</p>
          <p className="text-gray-600 text-sm">Previous: {formatCurrency(previous)}</p>
          <p className={`text-sm font-medium ${change < 0 ? 'text-green-600' : 'text-red-600'}`}>
            Change: {change > 0 ? '+' : ''}{change.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const RadarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate comparison metrics
  const totalSpendingChange = ((analytics.totalSpending - previousPeriodData.totalSpending) / previousPeriodData.totalSpending) * 100;
  const averageMonthlyChange = ((analytics.totalSpending / 12) - (previousPeriodData.totalSpending / 12)) / (previousPeriodData.totalSpending / 12) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Financial Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Professional Budget Tracking & Spending Analysis</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['1M', '3M', '6M', '1Y'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range as any)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      timeRange === range 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8 mt-6">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: '📊' },
              { id: 'comparison', label: 'Spending Comparison', icon: '⚖️' },
              { id: 'analytics', label: 'Advanced Analytics', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-3 border-b-2 transition-all font-medium ${
                  activeTab === tab.id 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics with Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide">Total Spending</h3>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-lg">💰</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(analytics.totalSpending)}</p>
                <p className={`text-sm font-medium ${totalSpendingChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalSpendingChange < 0 ? '↓' : '↑'} {Math.abs(totalSpendingChange).toFixed(1)}% from previous
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide">Monthly Average</h3>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-lg">📅</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(analytics.totalSpending / 12)}</p>
                <p className={`text-sm font-medium ${averageMonthlyChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {averageMonthlyChange < 0 ? '↓' : '↑'} {Math.abs(averageMonthlyChange).toFixed(1)}% vs previous
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide">Savings Rate</h3>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-lg">🎯</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">22.5%</p>
                <p className="text-green-600 text-sm font-medium">+2.5% improvement</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide">Budget Efficiency</h3>
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 text-lg">📊</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">78%</p>
                <p className="text-green-600 text-sm font-medium">+8% from last period</p>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Spending Trend Comparison */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Spending Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      fontSize={12}
                      tick={{ fill: '#6b7280' }}
                    />
                    <YAxis 
                      fontSize={12}
                      tick={{ fill: '#6b7280' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<ComparisonTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="Current" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#3b82f6' }}
                      name="Current Period"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Previous" 
                      stroke="#9ca3af" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#9ca3af', r: 3 }}
                      name="Previous Period"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Category Spending Comparison */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Category Spending Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80}
                      fontSize={12}
                      tick={{ fill: '#6b7280' }}
                    />
                    <YAxis 
                      fontSize={12}
                      tick={{ fill: '#6b7280' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<ComparisonTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="Current" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                      name="Current Period"
                    />
                    <Bar 
                      dataKey="Previous" 
                      fill="#9ca3af" 
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                      name="Previous Period"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="space-y-8">
            {/* Comparison Type Selector */}
            <div className="flex justify-center">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {[
                  { id: 'previous', label: 'vs Previous Period' },
                  { id: 'budget', label: 'vs Budget Target' },
                  { id: 'average', label: 'vs Historical Average' }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setComparisonType(type.id as any)}
                    className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
                      comparisonType === type.id 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Comparison Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center">
                <div className="text-3xl mb-2">📈</div>
                <h3 className="font-semibold text-gray-900 mb-2">Spending Change</h3>
                <p className={`text-2xl font-bold ${totalSpendingChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalSpendingChange < 0 ? '↓' : '↑'} {Math.abs(totalSpendingChange).toFixed(1)}%
                </p>
                <p className="text-gray-600 text-sm">vs previous period</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center">
                <div className="text-3xl mb-2">💰</div>
                <h3 className="font-semibold text-gray-900 mb-2">Amount Saved</h3>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(previousPeriodData.totalSpending - analytics.totalSpending)}
                </p>
                <p className="text-gray-600 text-sm">Compared to last period</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-semibold text-gray-900 mb-2">Budget Improvement</h3>
                <p className="text-2xl font-bold text-green-600">+15%</p>
                <p className="text-gray-600 text-sm">More categories on track</p>
              </div>
            </div>

            {/* Advanced Comparison Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Radar Chart - Budget Performance */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Budget Performance Radar</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={budgetPerformanceData.slice(0, 6)}>
                    <PolarGrid stroke="#f0f0f0" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: '#6b7280', fontSize: 11 }}
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 150]}
                      tick={{ fill: '#6b7280', fontSize: 10 }}
                    />
                    <Radar
                      name="Actual Spending %"
                      dataKey="Actual"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Budget Target"
                      dataKey="Budget"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.1}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                    <Tooltip content={<RadarTooltip />} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Stacked Area Chart - Trend Analysis */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Spending Trend Analysis</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={monthlyComparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#9ca3af" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      fontSize={12}
                      tick={{ fill: '#6b7280' }}
                    />
                    <YAxis 
                      fontSize={12}
                      tick={{ fill: '#6b7280' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<ComparisonTooltip />} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="Current" 
                      stroke="#3b82f6" 
                      fillOpacity={1}
                      fill="url(#colorCurrent)" 
                      strokeWidth={2}
                      name="Current Period"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Previous" 
                      stroke="#9ca3af" 
                      fillOpacity={1}
                      fill="url(#colorPrevious)" 
                      strokeWidth={2}
                      name="Previous Period"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Comparison Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Detailed Category Comparison</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Category</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-900">Current</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-900">Previous</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-900">Change</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-900">% Change</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-900">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonChartData.map((item, index) => (
                      <tr key={item.name} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-900">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-3"
                              style={{ backgroundColor: item.fill }}
                            ></div>
                            {item.name}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right font-semibold text-gray-900">
                          {formatCurrency(item.Current)}
                        </td>
                        <td className="py-4 px-6 text-right text-gray-600">
                          {formatCurrency(item.Previous)}
                        </td>
                        <td className={`py-4 px-6 text-right font-medium ${
                          item.Change < 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.Change < 0 ? '↓' : '↑'} {formatCurrency(Math.abs(item.Current - item.Previous))}
                        </td>
                        <td className={`py-4 px-6 text-right font-medium ${
                          item.Change < 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.Change < 0 ? '↓' : '↑'} {Math.abs(item.Change).toFixed(1)}%
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            item.Change < -10 ? 'bg-green-100 text-green-800 border border-green-200' :
                            item.Change > 10 ? 'bg-red-100 text-red-800 border border-red-200' :
                            'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          }`}>
                            {item.Change < -10 ? 'Significant Decrease' :
                             item.Change > 10 ? 'Significant Increase' : 'Stable'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📈</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced Analytics</h2>
            <p className="text-gray-600">Deep analytics and forecasting tools</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceDashboard;