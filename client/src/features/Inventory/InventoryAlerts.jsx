import React, { useEffect, useState } from 'react';

const InventoryAlerts = ({ alertsData }) => {
  const [alerts, setAlerts] = useState(alertsData);

  // Set alerts when backend data comes in
  // useEffect(() => {
  //   if (alertsData) {
  //     console.log('Alerts:', alertsData.alerts);
  //     setAlerts(alertsData.alerts);
  //   }
  // }, [alertsData]);

  return (
    <div className="mt-4 space-y-4">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`rounded-lg p-4 shadow-md ${
            alert.type === 'Low Stock'
              ? 'border-l-4 border-red-500 bg-red-100'
              : 'border-l-4 border-yellow-500 bg-yellow-100'
          }`}
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            ⚠️ {alert.type} Alert
          </h3>

          <p className="text-sm text-gray-700 dark:text-gray-300">
            {alert.type === 'Low Stock' ? (
              <>
                The item <strong>{alert.itemName}</strong> is low on stock.
                <br />
                <strong>Current Stock:</strong> {alert.currentStock}
                <br />
                <strong>Minimum Required Stock:</strong> {alert.minimumStock}
              </>
            ) : (
              <>
                The batch <strong>{alert.batchNumber}</strong> of item{' '}
                <strong>{alert.itemName}</strong> is nearing expiry.
                <br />
                <strong>Expiry Date:</strong>{' '}
                {new Date(alert.expiryDate).toLocaleDateString()}
              </>
            )}
          </p>

          <div className="mt-2 text-right">
            <a
              href={`mailto:${alert.recipient}`}
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Notify Recipient
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryAlerts;
