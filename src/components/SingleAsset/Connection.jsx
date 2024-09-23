import React, { useState, useEffect } from 'react';

function AssetConnections({ assetId }) {
  const [connectedToData, setConnectedToData] = useState([]);
  const [connectedWithData, setConnectedWithData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  return (
    <div className="asset-connections">
      <div className="content">
        <h1>Asset Connections (Links)</h1>

        <div className="tabs">
          <ul>
            <li className="active"><button type="button">Link With</button></li>
            <li><button type="button">Link To</button></li>
          </ul>
          
          <div className="tab-content">
            <div className="tab-pane active" id="tablinkwith">
              <h2>Link With</h2>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tag</th>
                    <th>Name</th>
                    <th>Manufacturer</th>
                    <th>Model</th>
                    <th>Serial Number</th>
                    <th>Location</th>
                    <th>Office/CTI</th>
                    <th>Status</th>
                    <th>Allocated User</th>
                  </tr>
                </thead>
                <tbody>
                  {connectedWithData.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.tag}</td>
                      <td>{item.name}</td>
                      <td>{item.manufacturer}</td>
                      <td>{item.model}</td>
                      <td>{item.serialNumber}</td>
                      <td>{item.location}</td>
                      <td>{item.cti}</td>
                      <td>{item.status}</td>
                      <td>{item.allocatedUser || 'Not Allocated'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="tab-pane" id="tablinkto">
              <h2>Link To</h2>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tag</th>
                    <th>Name</th>
                    <th>Manufacturer</th>
                    <th>Model</th>
                    <th>Serial Number</th>
                    <th>Location</th>
                    <th>Office/CTI</th>
                    <th>Status</th>
                    <th>Allocated User</th>
                  </tr>
                </thead>
                <tbody>
                  {connectedToData.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.tag}</td>
                      <td>{item.name}</td>
                      <td>{item.manufacturer}</td>
                      <td>{item.model}</td>
                      <td>{item.serialNumber}</td>
                      <td>{item.location}</td>
                      <td>{item.cti}</td>
                      <td>{item.status}</td>
                      <td>{item.allocatedUser || 'Not Allocated'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetConnections;
