'use client';

import { CapRateChart, OccupancyRateChart } from './index';

// Sample data for demonstration
const sampleCapRateHistories = [
  {
    id: '1',
    jReitBuildingId: 'building1',
    capRate: '4.80',
    closingDate: '2020-01-01'
  },
  {
    id: '2',
    jReitBuildingId: 'building1',
    capRate: '4.70',
    closingDate: '2020-04-01'
  },
  {
    id: '3',
    jReitBuildingId: 'building1',
    capRate: '4.55',
    closingDate: '2020-07-01'
  },
  {
    id: '4',
    jReitBuildingId: 'building1',
    capRate: '4.40',
    closingDate: '2020-10-01'
  },
  {
    id: '5',
    jReitBuildingId: 'building1',
    capRate: '4.30',
    closingDate: '2021-01-01'
  },
  {
    id: '6',
    jReitBuildingId: 'building1',
    capRate: '4.20',
    closingDate: '2021-04-01'
  },
  {
    id: '7',
    jReitBuildingId: 'building1',
    capRate: '4.15',
    closingDate: '2021-07-01'
  },
  {
    id: '8',
    jReitBuildingId: 'building1',
    capRate: '4.00',
    closingDate: '2021-10-01'
  },
  {
    id: '9',
    jReitBuildingId: 'building1',
    capRate: '3.90',
    closingDate: '2022-01-01'
  }
];

// Sample occupancy rate data
const sampleFinancials = [
  {
    leasing: {
      occupancyRate: '95.5'
    },
    closingDate: '2020-01-01'
  },
  {
    leasing: {
      occupancyRate: '96.0'
    },
    closingDate: '2020-04-01'
  },
  {
    leasing: {
      occupancyRate: '94.8'
    },
    closingDate: '2020-07-01'
  },
  {
    leasing: {
      occupancyRate: '97.2'
    },
    closingDate: '2020-10-01'
  },
  {
    leasing: {
      occupancyRate: '98.5'
    },
    closingDate: '2021-01-01'
  },
  {
    leasing: {
      occupancyRate: '99.1'
    },
    closingDate: '2021-04-01'
  },
  {
    leasing: {
      occupancyRate: '98.8'
    },
    closingDate: '2021-07-01'
  },
  {
    leasing: {
      occupancyRate: '99.2'
    },
    closingDate: '2021-10-01'
  },
  {
    leasing: {
      occupancyRate: '100.0'
    },
    closingDate: '2022-01-01'
  }
];

export default function ChartsDemoComponent() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">キャップレートチャート</h2>
        <CapRateChart capRateHistories={sampleCapRateHistories} />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">稼働率チャート</h2>
        <OccupancyRateChart financials={sampleFinancials} />
      </div>
    </div>
  );
} 