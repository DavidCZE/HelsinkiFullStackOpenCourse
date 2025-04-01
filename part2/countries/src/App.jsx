import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [value, setValue] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [error, setError] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    console.log('Fetching all countries...')
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        console.log('All countries fetched:', response.data)
        setAllCountries(response.data)
        setError(null)
      })
      .catch(error => {
        console.error('Error fetching all countries:', error.response || error.message)
        setError('Failed to fetch country data. Please try again later.')
      })
  }, [])

  useEffect(() => {
    if (value.trim()) {
      const filtered = allCountries.filter(country =>
        country.name.common.toLowerCase().includes(value.trim().toLowerCase())
      )
      setFilteredCountries(filtered)
    } else {
      setFilteredCountries([])
    }
  }, [value, allCountries])

// const api_key = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(() => {
    if (filteredCountries.length === 1) {
      const country = filteredCountries[0]
      const capital = country.capital && country.capital[0]
      if (capital) {
        console.log(`Fetching weather for ${capital}...`)
        axios
          .get(`https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${capital}`)
          .then(response => {
            console.log('Weather data fetched:', response.data)
            setWeather(response.data)
          })
          .catch(error => {
            console.error('Error fetching weather data:', error.response || error.message)
            setWeather(null)
          })
      }
    } else {
      setWeather(null)
    }
  }, [filteredCountries])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  return (
    <div>
      <div>
        Country: <input value={value} onChange={handleChange} />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!error && filteredCountries.length > 10 && <p>Too many matches, specify another filter</p>}
      {!error && filteredCountries.length <= 10 && filteredCountries.length > 1 && (
        <ul>
          {filteredCountries.map(country => (
            country.name && country.name.common ? (
              <li key={country.name.common}>
                {country.name.common} 
                <button onClick={() => setValue(country.name.common)}>Show</button>
              </li>
            ) : null
          ))}
        </ul>
      )}
      {!error && filteredCountries.length === 1 && (
        <div>
          <h2>{filteredCountries[0].name.common}</h2>
          <p>Capital: {filteredCountries[0].capital}</p>
          <p>Population: {filteredCountries[0].population}</p>
          <p>Area: {filteredCountries[0].area} km²</p>
          <p>Languages:</p>
          <ul>
            {filteredCountries[0].languages && Object.values(filteredCountries[0].languages).map((language, index) => (
              <li key={index}>{language}</li>
            ))}
          </ul>
          <img src={filteredCountries[0].flags.png} alt={`Flag of ${filteredCountries[0].name.common}`} width="150" />
          {weather && (
            <div>
              <h3>Weather in {filteredCountries[0].capital[0]}</h3>
              <p>Temperature: {weather.current.temp_c}°C</p>
              <p>Condition: {weather.current.condition.text}</p>
              <img src={weather.current.condition.icon} alt={weather.current.condition.text} />
              <p>Wind: {weather.current.wind_kph} kph, direction {weather.current.wind_dir}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App