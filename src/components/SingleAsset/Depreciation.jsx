import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { baseURL } from '../../config.js';

function Depreciation() {
  const { group, type, tag } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const decodedGroup = decodeURIComponent(group);
    const decodedType = decodeURIComponent(type);
    const decodedTag = decodeURIComponent(tag);

    const url = `${baseURL}/backend/fetchDetailedView.php?group=${decodedGroup}&type=${decodedType}&tag=${decodedTag}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.toString());
        setLoading(false);
      });
  }, [group, type, tag]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  const assetValue = parseFloat(data?.asset_value || 0);
  const procurementDate = new Date(data?.purchase_date);
  const currentDate = new Date();
  const depreciationRate = 0.2; // 20% annual depreciation

  // Function to format dates as dd-mm-yyyy
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const calculateDepreciation = (initialValue, startDate, endDate, rate) => {
    let currentYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const values = [];
    let currentValue = initialValue;

    while (currentYear <= endYear) {
      const yearStart = new Date(currentYear, startDate.getMonth(), startDate.getDate());
      const yearEnd = new Date(currentYear + 1, startDate.getMonth(), startDate.getDate());
      const depreciationAmount = currentValue * rate;
      currentValue -= depreciationAmount;

      const isCurrentYear = currentYear === endYear;
      const actualDepreciationAmount = isCurrentYear
        ? ((depreciationAmount * (endDate.getTime() - yearStart.getTime())) / (yearEnd.getTime() - yearStart.getTime())).toFixed(2)
        : depreciationAmount.toFixed(2);

      values.push({
        year: currentYear,
        fromDate: formatDate(yearStart),
        toDate: isCurrentYear ? formatDate(endDate) : formatDate(yearEnd),
        depreciationAmount: actualDepreciationAmount,
        remainingValue: currentValue.toFixed(2),
        highlight: isCurrentYear && endDate.getTime() < yearEnd.getTime(), 
      });

      currentYear++;
    }

    return values;
  };

  const depreciationSchedule = calculateDepreciation(assetValue, procurementDate, currentDate, depreciationRate);

  return (
    <div className='font-sui mx-auto mt-2'>
      <div className="flex font-bold justify-between items-center mb-3">
        <h1 className="text-lg ">Detailed View</h1></div>

      <div className="bg-white shadow-sm gap-2 rounded-lg overflow-hidden mb-4">
        <div className="bg-gray-50 px-4 py-5 border-b border-gray-200">
          <h2 className="text-lg leading-6 font-medium text-gray-900 mb-2">Asset Details</h2>
          <p className="mt-1 text-sm font-medium text-prime">Asset Value: <span className="font-semibold text-flo">Rs. {!isNaN(assetValue) ? assetValue : 'N/A'}</span></p>
          <p className="mt-1 text-sm font-medium text-prime">Procurement Date: <span className="font-semibold text-flo">{formatDate(procurementDate)}</span></p>
        </div>
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Year</th>
              <th className="py-3 px-6 text-left">From Date</th>
              <th className="py-3 px-6 text-left">To Date</th>
              <th className="py-3 px-6 text-left">Depreciation Amount</th>
              <th className="py-3 px-6 text-left">Remaining Value</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {depreciationSchedule.map(({ year, fromDate, toDate, depreciationAmount, remainingValue, highlight }, index) => (
              <tr 
                key={index} 
                className={`border-b border-gray-200 hover:bg-gray-100 transition font-semibold duration-300 ease-in-out ${highlight ? 'text-flo' : ''}`}
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">{year}</td>
                <td className="py-3 px-6 text-left">{fromDate}</td>
                <td className="py-3 px-6 text-left">{toDate}</td>
                <td className="py-3 px-6 text-left">Rs. {depreciationAmount}</td>
                <td className="py-3 px-6 text-left">Rs. {remainingValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Depreciation;
