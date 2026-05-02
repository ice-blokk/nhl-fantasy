import { useEffect, useState } from 'react'
import axios from 'axios'

function Roster() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewPlayer, setViewPlayer] = useState(null)
  const [editPlayer, setEditPlayer] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [sortField, setSortField] = useState('lastName')
  const [sortOrder, setSortOrder] = useState('asc')
  const [filterField, setFilterField] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [report, setReport] = useState(null)

  useEffect(() => {
    fetchRoster()
  }, [])

  const fetchRoster = () => {
    axios.get('/api/nhl/players')
      .then(res => {
        setPlayers(res.data)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to fetch roster')
        setLoading(false)
      })
  }

  const handleSort = () => {
    axios.get(`/api/nhl/players/sorted/${sortField}/${sortOrder}`)
      .then(res => setPlayers(res.data))
      .catch(err => console.error('Failed to sort players', err))
  }

  const handleFilter = () => {
    if (!filterField || !filterValue) return
    axios.get(`/api/nhl/players/filtered/${filterField}/${filterValue}`)
      .then(res => setPlayers(res.data))
      .catch(err => console.error('Failed to filter players', err))
  }

  const handleReset = () => {
    setFilterField('')
    setFilterValue('')
    setSortField('lastName')
    setSortOrder('asc')
    fetchRoster()
  }

  const handleDelete = (nhlId) => {
    axios.post('/api/nhl/roster/remove', { nhlId })
      .then(() => {
        setPlayers(prev => prev.filter(p => p.nhlId !== nhlId))
      })
      .catch(err => console.error('Failed to remove player', err))
  }

  const handleEdit = (player) => {
    setEditPlayer(player)
    setEditForm({
      sweaterNumber: player.sweaterNumber,
      positionCode: player.positionCode,
      shootsCatches: player.shootsCatches,
      heightInInches: player.heightInInches,
      weightInPounds: player.weightInPounds,
    })
  }

  const handleEditSubmit = () => {
    axios.patch(`/api/nhl/players/edit/${editPlayer.nhlId}`, editForm)
      .then(res => {
        setPlayers(prev => prev.map(p => p.nhlId === editPlayer.nhlId ? res.data : p))
        setEditPlayer(null)
      })
      .catch(err => console.error('Failed to update player', err))
  }

  const handleCheckbox = (id) => {
    setSelectedIds(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
    }

const handleSelectAll = (e) => {
  if (e.target.checked) {
    setSelectedIds(players.map(p => p.id))
  } else {
    setSelectedIds([])
  }
}

const handleGenerateReport = async () => {
  const selected = players.filter(p => selectedIds.includes(p.id))

  const playersWithStats = await Promise.all(
    selected.map(async player => {
      try {
        const res = await axios.get(`http://localhost:5000/api/nhl/player/${player.nhlId}/stats`)
        return { ...player, ...res.data }
      } catch {
        return { ...player, goals: 'N/A', assists: 'N/A', points: 'N/A' }
      }
    })
  )

  setReport(playersWithStats)
}

  if (loading) return <p className="has-text-centered mt-5">Loading roster...</p>
  if (error) return <p className="has-text-centered has-text-danger mt-5">{error}</p>

  return (
    <div className="container mt-5">
      <h1 className="title">My Roster</h1>

      {/* SORT & FILTER CONTROLS */}
      <div className="box">
        <div className="columns">

          {/* SORT */}
          <div className="column">
            <div className="field has-addons">
              <div className="control">
                <div className="select">
                  <select value={sortField} onChange={e => setSortField(e.target.value)}>
                    <option value="lastName">Last Name</option>
                    <option value="firstName">First Name</option>
                    <option value="sweaterNumber">Sweater #</option>
                    <option value="positionCode">Position</option>
                    <option value="heightInInches">Height</option>
                    <option value="weightInPounds">Weight</option>
                  </select>
                </div>
              </div>
              <div className="control">
                <div className="select">
                  <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
              <div className="control">
                <button className="button is-info" onClick={handleSort}>Sort</button>
              </div>
            </div>
          </div>

          {/* FILTER */}
          <div className="column">
            <div className="field has-addons">
              <div className="control">
                <div className="select">
                  <select value={filterField} onChange={e => setFilterField(e.target.value)}>
                    <option value="">Select Field</option>
                    <option value="positionCode">Position</option>
                    <option value="shootsCatches">Shoots/Catches</option>
                    <option value="birthCountry">Country</option>
                  </select>
                </div>
              </div>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Filter value..."
                  value={filterValue}
                  onChange={e => setFilterValue(e.target.value)}
                />
              </div>
              <div className="control">
                <button className="button is-warning" onClick={handleFilter}>Filter</button>
              </div>
            </div>
          </div>

          {/* RESET */}
          <div className="column is-narrow" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="button is-light" onClick={handleReset}>Reset</button>
          </div>

        </div>
      </div>

      {/* TABLE */}
      {players.length === 0 ? (
        <p className="has-text-centered">No players found.</p>
      ) : (
        <table className="table is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
                <th><input type="checkbox" onChange={handleSelectAll} /></th>
                <th>#</th>
                <th>Name</th>
                <th>Position</th>
                <th>Shoots/Catches</th>
                <th>Height</th>
                <th>Weight</th>
                <th>Birthplace</th>
                <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {players.map(player => (
              <tr key={player.id} className={selectedIds.includes(player.id) ? 'is-selected' : ''}>
                <td>
                <input
                    type="checkbox"
                    checked={selectedIds.includes(player.id)}
                    onChange={() => handleCheckbox(player.id)}
                />
                </td>
                <td>{player.sweaterNumber}</td>
                <td>{player.firstName} {player.lastName}</td>
                <td>{player.positionCode}</td>
                <td>{player.shootsCatches}</td>
                <td>{player.heightInInches} in</td>
                <td>{player.weightInPounds} lbs</td>
                <td>{player.birthCity}, {player.birthCountry}</td>
                <td className="buttons">
                  <button className="button is-info is-small" onClick={() => setViewPlayer(player)}>View</button>
                  <button className="button is-warning is-small" onClick={() => handleEdit(player)}>Edit</button>
                  <button className="button is-danger is-small" onClick={() => handleDelete(player.nhlId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

        {/* GEENERATE REPORT BUTTON */}
        <div className="mt-4">
            <button
                className="button is-primary"
                disabled={selectedIds.length === 0}
                onClick={handleGenerateReport}
            >
                Generate Report ({selectedIds.length} selected)
            </button>
        </div>

      {/* VIEW MODAL */}
      {viewPlayer && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setViewPlayer(null)}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">{viewPlayer.firstName} {viewPlayer.lastName}</p>
              <button className="delete" onClick={() => setViewPlayer(null)}></button>
            </header>
            <section className="modal-card-body">
              <table className="table is-fullwidth">
                <tbody>
                  <tr><th>Sweater #</th><td>{viewPlayer.sweaterNumber}</td></tr>
                  <tr><th>Position</th><td>{viewPlayer.positionCode}</td></tr>
                  <tr><th>Shoots/Catches</th><td>{viewPlayer.shootsCatches}</td></tr>
                  <tr><th>Height</th><td>{viewPlayer.heightInInches} in</td></tr>
                  <tr><th>Weight</th><td>{viewPlayer.weightInPounds} lbs</td></tr>
                  <tr><th>Birthplace</th><td>{viewPlayer.birthCity}, {viewPlayer.birthCountry}</td></tr>
                </tbody>
              </table>
            </section>
            <footer className="modal-card-foot">
              <button className="button" onClick={() => setViewPlayer(null)}>Close</button>
            </footer>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editPlayer && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setEditPlayer(null)}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Edit {editPlayer.firstName} {editPlayer.lastName}</p>
              <button className="delete" onClick={() => setEditPlayer(null)}></button>
            </header>
            <section className="modal-card-body">
              <div className="field">
                <label className="label">Sweater Number</label>
                <div className="control">
                  <input className="input" type="number" value={editForm.sweaterNumber}
                    onChange={e => setEditForm({ ...editForm, sweaterNumber: parseInt(e.target.value) })} />
                </div>
              </div>
              <div className="field">
                <label className="label">Position</label>
                <div className="control">
                  <input className="input" type="text" value={editForm.positionCode}
                    onChange={e => setEditForm({ ...editForm, positionCode: e.target.value })} />
                </div>
              </div>
              <div className="field">
                <label className="label">Shoots/Catches</label>
                <div className="control">
                  <input className="input" type="text" value={editForm.shootsCatches}
                    onChange={e => setEditForm({ ...editForm, shootsCatches: e.target.value })} />
                </div>
              </div>
              <div className="field">
                <label className="label">Height (in)</label>
                <div className="control">
                  <input className="input" type="number" value={editForm.heightInInches}
                    onChange={e => setEditForm({ ...editForm, heightInInches: parseInt(e.target.value) })} />
                </div>
              </div>
              <div className="field">
                <label className="label">Weight (lbs)</label>
                <div className="control">
                  <input className="input" type="number" value={editForm.weightInPounds}
                    onChange={e => setEditForm({ ...editForm, weightInPounds: parseInt(e.target.value) })} />
                </div>
              </div>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-warning" onClick={handleEditSubmit}>Save Changes</button>
              <button className="button" onClick={() => setEditPlayer(null)}>Cancel</button>
            </footer>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
        {report && (
        <div className="box mt-5">
            <h2 className="title is-5">Report — {report.length} Player(s)</h2>
            <table className="table is-fullwidth is-bordered">
            <thead>
                <tr>
                <th>#</th>
                <th>Name</th>
                <th>Position</th>
                <th>Shoots/Catches</th>
                <th>Height</th>
                <th>Weight</th>
                <th>Birthplace</th>
                <th>Goals</th>
                <th>Assists</th>
                <th>Points</th>
                </tr>
            </thead>
            <tbody>
                {report.map(player => (
                <tr key={player.id}>
                    <td>{player.sweaterNumber}</td>
                    <td>{player.firstName} {player.lastName}</td>
                    <td>{player.positionCode}</td>
                    <td>{player.shootsCatches}</td>
                    <td>{player.heightInInches} in</td>
                    <td>{player.weightInPounds} lbs</td>
                    <td>{player.birthCity}, {player.birthCountry}</td>
                    <td>{player.goals}</td>
                    <td>{player.assists}</td>
                    <td>{player.points}</td>
                </tr>
                ))}
            </tbody>
            </table>
            <button className="button is-light" onClick={() => setReport(null)}>Clear Report</button>
        </div>
        )}
    </div>

    
  )
}

export default Roster