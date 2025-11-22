import React from 'react';

interface InsightItem {
  text: string;
  type?: 'positive' | 'negative' | 'neutral';
}

interface InsightsCardProps {
  title: string;
  insights: InsightItem[];
}

const InsightsCard: React.FC<InsightsCardProps> = ({ title, insights }) => {
  const getColorClass = (type: string = 'neutral') => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-700';
    }
  };

  const getDotColor = (type: string = 'neutral') => {
    switch (type) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start">
            <span className={`w-2 h-2 rounded-full mt-2 mr-3 ${getDotColor(insight.type)}`}></span>
            <p className={`flex-1 ${getColorClass(insight.type)}`}>
              {insight.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsCard;