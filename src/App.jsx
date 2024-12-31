import React, { useState } from 'react';
    import { Line } from 'react-chartjs-2';
    import {
      Chart as ChartJS,
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend
    } from 'chart.js';

    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend
    );

    // Define initialAquacultureTypes at the top level
    const initialAquacultureTypes = {
      'Fish Farming': ['Tilapia', 'Catfish', 'Salmon'],
      'Shrimp Farming': ['Whiteleg Shrimp', 'Black Tiger Shrimp'],
      'Oyster Farming': ['Pacific Oyster', 'Eastern Oyster']
    };

    const generatePondData = () => ({
      pH: Math.random() * 14,
      DO: Math.random() * 10,
      salinity: Math.random() * 35,
      temperature: Math.random() * 40,
      history: Array.from({ length: 10 }, (_, i) => ({
        time: new Date(Date.now() - (10 - i) * 5000),
        pH: Math.random() * 14,
        DO: Math.random() * 10,
        salinity: Math.random() * 35,
        temperature: Math.random() * 40
      }))
    });

    const PondCard = ({ pond }) => {
      const latest = pond.history[pond.history.length - 1];
      return (
        <div className="pond-card">
          <h3>{pond.name}</h3>
          <div className="pond-info">
            <div className="info-item">
              <span>Type:</span> {pond.aquacultureType}
            </div>
            <div className="info-item">
              <span>Species:</span> {pond.species}
            </div>
            <div className="info-item">
              <span>Quantity:</span> {pond.quantity} {pond.unit}
            </div>
          </div>
          <div className="sensor-readings">
            <div className="sensor-value">
              <span>pH:</span> {latest.pH.toFixed(2)}
            </div>
            <div className="sensor-value">
              <span>DO:</span> {latest.DO.toFixed(2)} mg/L
            </div>
            <div className="sensor-value">
              <span>Salinity:</span> {latest.salinity.toFixed(2)} ppt
            </div>
            <div className="sensor-value">
              <span>Temp:</span> {latest.temperature.toFixed(2)} °C
            </div>
          </div>
        </div>
      );
    };

    const Analytics = ({ ponds }) => {
      const getChartData = (parameter) => ({
        labels: ponds[0].history.map((_, i) => `Reading ${i + 1}`),
        datasets: ponds.map((pond, index) => ({
          label: pond.name,
          data: pond.history.map(h => h[parameter]),
          borderColor: `hsl(${(index * 120) % 360}, 70%, 50%)`,
          backgroundColor: `hsla(${(index * 120) % 360}, 70%, 50%, 0.2)`,
        }))
      });

      return (
        <div className="analytics">
          <h2>Water Quality Analytics</h2>
          <div className="charts-grid">
            <div className="chart-container">
              <h3>pH Levels</h3>
              <Line data={getChartData('pH')} />
            </div>
            <div className="chart-container">
              <h3>Dissolved Oxygen</h3>
              <Line data={getChartData('DO')} />
            </div>
            <div className="chart-container">
              <h3>Salinity</h3>
              <Line data={getChartData('salinity')} />
            </div>
            <div className="chart-container">
              <h3>Temperature</h3>
              <Line data={getChartData('temperature')} />
            </div>
          </div>
        </div>
      );
    };

    const Settings = ({ ponds, addPond, removePond, updatePond, aquacultureTypes, setAquacultureTypes }) => {
      const [activeTab, setActiveTab] = useState('ponds');

      return (
        <div className="settings">
          <h2>Settings</h2>
          
          <div className="settings-tabs">
            <button
              onClick={() => setActiveTab('ponds')}
              className={activeTab === 'ponds' ? 'active' : ''}
            >
              Pond Management
            </button>
            <button
              onClick={() => setActiveTab('aquaculture')}
              className={activeTab === 'aquaculture' ? 'active' : ''}
            >
              Aquaculture Management
            </button>
          </div>

          <div className="settings-content">
            {activeTab === 'ponds' && (
              <PondManagement
                ponds={ponds}
                addPond={addPond}
                removePond={removePond}
                updatePond={updatePond}
                aquacultureTypes={aquacultureTypes}
              />
            )}

            {activeTab === 'aquaculture' && (
              <AquacultureManagement
                aquacultureTypes={aquacultureTypes}
                setAquacultureTypes={setAquacultureTypes}
              />
            )}
          </div>
        </div>
      );
    };

    const PondManagement = ({ ponds, addPond, removePond, updatePond, aquacultureTypes }) => {
      const [newPond, setNewPond] = useState({
        name: '',
        aquacultureType: Object.keys(aquacultureTypes)[0],
        species: aquacultureTypes[Object.keys(aquacultureTypes)[0]][0],
        quantity: 0,
        unit: 'kg'
      });
      const [editingPond, setEditingPond] = useState(null);

      const handleAddPond = () => {
        if (newPond.name.trim()) {
          addPond(newPond);
          setNewPond({
            name: '',
            aquacultureType: Object.keys(aquacultureTypes)[0],
            species: aquacultureTypes[Object.keys(aquacultureTypes)[0]][0],
            quantity: 0,
            unit: 'kg'
          });
        }
      };

      const startEditing = (pond) => {
        setEditingPond({ ...pond });
      };

      const handleUpdatePond = () => {
        if (editingPond.name.trim()) {
          updatePond(editingPond);
          setEditingPond(null);
        }
      };

      return (
        <div className="management-section">
          <h3>Pond Management</h3>
          <div className="add-pond">
            <h4>Add New Pond</h4>
            <div className="form-group">
              <label>Pond Name:</label>
              <input
                type="text"
                value={newPond.name}
                onChange={(e) => setNewPond({ ...newPond, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Aquaculture Type:</label>
              <select
                value={newPond.aquacultureType}
                onChange={(e) => setNewPond({ 
                  ...newPond, 
                  aquacultureType: e.target.value,
                  species: aquacultureTypes[e.target.value][0]
                })}
              >
                {Object.keys(aquacultureTypes).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Species:</label>
              <select
                value={newPond.species}
                onChange={(e) => setNewPond({ ...newPond, species: e.target.value })}
              >
                {aquacultureTypes[newPond.aquacultureType].map(species => (
                  <option key={species} value={species}>{species}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Quantity:</label>
              <input
                type="number"
                value={newPond.quantity}
                onChange={(e) => setNewPond({ ...newPond, quantity: parseFloat(e.target.value) })}
              />
              <select
                value={newPond.unit}
                onChange={(e) => setNewPond({ ...newPond, unit: e.target.value })}
              >
                <option value="kg">kg</option>
                <option value="tons">tons</option>
                <option value="units">units</option>
              </select>
            </div>
            <button onClick={handleAddPond}>Add Pond</button>
          </div>
          <div className="ponds-list">
            <h4>Existing Ponds</h4>
            {ponds.map(pond => (
              <div key={pond.id} className="pond-item">
                {editingPond?.id === pond.id ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Name:</label>
                      <input
                        type="text"
                        value={editingPond.name}
                        onChange={(e) => setEditingPond({ ...editingPond, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Type:</label>
                      <select
                        value={editingPond.aquacultureType}
                        onChange={(e) => setEditingPond({ 
                          ...editingPond, 
                          aquacultureType: e.target.value,
                          species: aquacultureTypes[e.target.value][0]
                        })}
                      >
                        {Object.keys(aquacultureTypes).map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Species:</label>
                      <select
                        value={editingPond.species}
                        onChange={(e) => setEditingPond({ ...editingPond, species: e.target.value })}
                      >
                        {aquacultureTypes[editingPond.aquacultureType].map(species => (
                          <option key={species} value={species}>{species}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Quantity:</label>
                      <input
                        type="number"
                        value={editingPond.quantity}
                        onChange={(e) => setEditingPond({ ...editingPond, quantity: parseFloat(e.target.value) })}
                      />
                      <select
                        value={editingPond.unit}
                        onChange={(e) => setEditingPond({ ...editingPond, unit: e.target.value })}
                      >
                        <option value="kg">kg</option>
                        <option value="tons">tons</option>
                        <option value="units">units</option>
                      </select>
                    </div>
                    <div className="form-actions">
                      <button onClick={handleUpdatePond}>Save</button>
                      <button onClick={() => setEditingPond(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="pond-info">
                      <div>{pond.name}</div>
                      <div>{pond.aquacultureType}</div>
                      <div>{pond.species}</div>
                      <div>{pond.quantity} {pond.unit}</div>
                    </div>
                    <div className="pond-actions">
                      <button onClick={() => startEditing(pond)}>Edit</button>
                      <button onClick={() => removePond(pond.id)}>Remove</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    };

    const AquacultureManagement = ({ aquacultureTypes, setAquacultureTypes }) => {
      const [newType, setNewType] = useState('');
      const [editingType, setEditingType] = useState(null);
      const [newSpecies, setNewSpecies] = useState('');
      const [selectedType, setSelectedType] = useState(Object.keys(aquacultureTypes)[0]);
      const [editingSpecies, setEditingSpecies] = useState(null);

      const addType = () => {
        if (newType.trim() && !aquacultureTypes[newType]) {
          setAquacultureTypes(prev => ({
            ...prev,
            [newType]: []
          }));
          setNewType('');
        }
      };

      const updateType = (oldType, newTypeName) => {
        if (newTypeName.trim() && !aquacultureTypes[newTypeName]) {
          const updatedTypes = { ...aquacultureTypes };
          const species = updatedTypes[oldType];
          delete updatedTypes[oldType];
          updatedTypes[newTypeName] = species;
          setAquacultureTypes(updatedTypes);
          setEditingType(null);
        }
      };

      const deleteType = (type) => {
        const updatedTypes = { ...aquacultureTypes };
        delete updatedTypes[type];
        setAquacultureTypes(updatedTypes);
      };

      const addSpecies = () => {
        if (newSpecies.trim() && !aquacultureTypes[selectedType].includes(newSpecies)) {
          setAquacultureTypes(prev => ({
            ...prev,
            [selectedType]: [...prev[selectedType], newSpecies]
          }));
          setNewSpecies('');
        }
      };

      const updateSpecies = (oldSpecies, newSpeciesName) => {
        if (newSpeciesName.trim() && !aquacultureTypes[selectedType].includes(newSpeciesName)) {
          setAquacultureTypes(prev => ({
            ...prev,
            [selectedType]: prev[selectedType].map(s => 
              s === oldSpecies ? newSpeciesName : s
            )
          }));
          setEditingSpecies(null);
        }
      };

      const deleteSpecies = (species) => {
        setAquacultureTypes(prev => ({
          ...prev,
          [selectedType]: prev[selectedType].filter(s => s !== species)
        }));
      };

      return (
        <div className="management-section">
          <h3>Aquaculture Management</h3>
          <div className="type-management">
            <h4>Manage Aquaculture Types</h4>
            <div className="form-controls">
              <input
                type="text"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="New aquaculture type"
              />
              <button onClick={addType}>Add Type</button>
            </div>
            <div className="items-list">
              {Object.keys(aquacultureTypes).map(type => (
                <div key={type} className="item-card">
                  {editingType === type ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={type}
                        onChange={(e) => updateType(type, e.target.value)}
                      />
                      <div className="form-actions">
                        <button onClick={() => setEditingType(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span>{type}</span>
                      <div className="item-actions">
                        <button onClick={() => setEditingType(type)}>Edit</button>
                        <button onClick={() => deleteType(type)}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="species-management">
            <h4>Manage Species</h4>
            <div className="form-controls">
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setEditingSpecies(null);
                }}
              >
                {Object.keys(aquacultureTypes).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <input
                type="text"
                value={newSpecies}
                onChange={(e) => setNewSpecies(e.target.value)}
                placeholder="New species"
              />
              <button onClick={addSpecies}>Add Species</button>
            </div>
            <div className="items-list">
              {aquacultureTypes[selectedType].map(species => (
                <div key={species} className="item-card">
                  {editingSpecies === species ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={species}
                        onChange={(e) => updateSpecies(species, e.target.value)}
                      />
                      <div className="form-actions">
                        <button onClick={() => setEditingSpecies(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span>{species}</span>
                      <div className="item-actions">
                        <button onClick={() => setEditingSpecies(species)}>Edit</button>
                        <button onClick={() => deleteSpecies(species)}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    const App = () => {
      const [ponds, setPonds] = useState([]);
      const [activeTab, setActiveTab] = useState('dashboard');
      const [aquacultureTypes, setAquacultureTypes] = useState(initialAquacultureTypes);

      const addPond = (pondData) => {
        setPonds(prev => [
          ...prev,
          {
            id: Date.now(),
            ...pondData,
            ...generatePondData()
          }
        ]);
      };

      const removePond = (id) => {
        setPonds(prev => prev.filter(pond => pond.id !== id));
      };

      const updatePond = (updatedPond) => {
        setPonds(prev => prev.map(pond => 
          pond.id === updatedPond.id ? updatedPond : pond
        ));
      };

      return (
        <div>
          <header>
            <h1>Aquaculture Monitoring System</h1>
            <nav>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={activeTab === 'dashboard' ? 'active' : ''}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={activeTab === 'analytics' ? 'active' : ''}
              >
                Analytics
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={activeTab === 'settings' ? 'active' : ''}
              >
                Settings
              </button>
            </nav>
          </header>
          
          <main>
            {ponds.length === 0 && activeTab !== 'settings' ? (
              <div className="no-ponds">
                <h2>No ponds available</h2>
                <p>Please create a pond in the settings to start monitoring.</p>
                <button onClick={() => setActiveTab('settings')}>Go to Settings</button>
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  <div className="ponds-grid">
                    {ponds.map(pond => (
                      <PondCard key={pond.id} pond={pond} />
                    ))}
                  </div>
                )}
                {activeTab === 'analytics' && <Analytics ponds={ponds} />}
                {activeTab === 'settings' && (
                  <Settings 
                    ponds={ponds} 
                    addPond={addPond} 
                    removePond={removePond}
                    updatePond={updatePond}
                    aquacultureTypes={aquacultureTypes}
                    setAquacultureTypes={setAquacultureTypes}
                  />
                )}
              </>
            )}
          </main>
        </div>
      );
    };

    export default App;
