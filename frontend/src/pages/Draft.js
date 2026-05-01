import { useEffect, useState } from 'react'
import axios from 'axios'

function Draft() {
  const [roster, setRoster] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addedIds, setAddedIds] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/api/nhl/roster/TOR')
      .then(res => {
        const allPlayers = [
          ...res.data.forwards,
          ...res.data.defensemen,
          ...res.data.goalies
        ]
        setRoster(allPlayers)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to fetch roster')
        setLoading(false)
      })
  }, [])

  const handleAdd = (player) => {
    axios.post('http://localhost:5000/api/nhl/roster/add', {
      nhlId: player.id,
      firstName: player.firstName.default,
      lastName: player.lastName.default,
      positionCode: player.positionCode,
      sweaterNumber: player.sweaterNumber,
      shootsCatches: player.shootsCatches,
      heightInInches: player.heightInInches,
      weightInPounds: player.weightInPounds,
      birthCity: player.birthCity?.default || null,
      birthCountry: player.birthCountry || null
    })
    .then(() => {
      setAddedIds(prev => [...prev, player.id])
    })
    .catch(err => {
      console.error('Failed to add player', err)
    })
  }

  if (loading) return <p className="has-text-centered mt-5">Loading roster...</p>
  if (error) return <p className="has-text-centered has-text-danger mt-5">{error}</p>

  return (
    <div className="container mt-5">
      <h1 className="title">Toronto Maple Leafs Roster</h1>
      <table className="table is-striped is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Position</th>
            <th>Shoots/Catches</th>
            <th>Height</th>
            <th>Weight</th>
            <th>Birthplace</th>
            <th>Add to Roster</th>
          </tr>
        </thead>
        <tbody>
          {roster.map(player => (
            <tr key={player.id}>
              <td>{player.sweaterNumber}</td>
              <td>{player.firstName.default} {player.lastName.default}</td>
              <td>{player.positionCode}</td>
              <td>{player.shootsCatches}</td>
              <td>{player.heightInInches} in</td>
              <td>{player.weightInPounds} lbs</td>
              <td>{player.birthCity?.default}, {player.birthCountry}</td>
              <td>
                <button
                  className={`button is-small ${addedIds.includes(player.id) ? 'is-success' : 'is-primary'}`}
                  onClick={() => handleAdd(player)}
                  disabled={addedIds.includes(player.id)}
                >
                  {addedIds.includes(player.id) ? 'Added ✓' : 'Add'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Draft