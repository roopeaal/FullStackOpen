import { useEffect, useState } from 'react'
import axios from 'axios'

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const [weatherError, setWeatherError] = useState(null)

  const capital = country.capital?.[0]
  const [lat, lon] =
    country.capitalInfo?.latlng ??
    country.latlng ??
    []

  useEffect(() => {
    if (!apiKey) {
      setWeatherError('OpenWeather API key is missing')
      return
    }

    if (lat === undefined || lon === undefined) {
      setWeatherError('Weather coordinates are not available')
      return
    }

    setWeather(null)
    setWeatherError(null)

    axios
      .get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          lat,
          lon,
          appid: apiKey,
          units: 'metric',
        },
      })
      .then(response => {
        setWeather(response.data)
      })
      .catch(() => {
        setWeatherError('Weather data could not be loaded')
      })
  }, [lat, lon])

  if (weatherError) {
    return <p>{weatherError}</p>
  }

  if (!weather) {
    return <p>Loading weather...</p>
  }

  const weatherInformation = weather.weather?.[0]

  return (
    <div>
      <h2>Weather in {capital}</h2>

      <p>temperature {weather.main.temp} Celsius</p>

      {weatherInformation && (
        <img
          src={`https://openweathermap.org/img/wn/${weatherInformation.icon}@2x.png`}
          alt={weatherInformation.description}
        />
      )}

      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const Country = ({ country }) => {
  const languages = Object.values(country.languages ?? {})

  return (
    <div>
      <h1>{country.name.common}</h1>

      <p>capital {country.capital?.[0]}</p>
      <p>area {country.area}</p>

      <h2>languages</h2>

      <ul>
        {languages.map(language =>
          <li key={language}>{language}</li>
        )}
      </ul>

      <img
        src={country.flags.png}
        alt={country.flags.alt ?? `Flag of ${country.name.common}`}
        width="160"
      />

      <Weather country={country} />
    </div>
  )
}

const Countries = ({ countries, onShow }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length > 1) {
    return (
      <div>
        {countries.map(country =>
          <p key={country.cca3}>
            {country.name.common}{' '}
            <button onClick={() => onShow(country)}>
              show
            </button>
          </p>
        )}
      </div>
    )
  }

  if (countries.length === 1) {
    return <Country country={countries[0]} />
  }

  return <p>No matches</p>
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setSelectedCountry(null)
  }

  const filteredCountries = countries.filter(country =>
    country.name.common
      .toLowerCase()
      .includes(filter.toLowerCase())
  )

  const countriesToShow = selectedCountry
    ? [selectedCountry]
    : filteredCountries

  return (
    <div>
      <div>
        find countries{' '}
        <input
          value={filter}
          onChange={handleFilterChange}
        />
      </div>

      <Countries
        countries={countriesToShow}
        onShow={setSelectedCountry}
      />
    </div>
  )
}

export default App
