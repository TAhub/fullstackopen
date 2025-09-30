import axios from 'axios'
import { useState, useEffect } from 'react'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api' // TODO: break out networking into service

const App = () => {
  const [countries, setCountries] = useState(null)
  const [search, setSearch] = useState('')

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  }
  
  const handleExpandButton = (name) => {
    setSearch(name);
  }

  useEffect(() => {
    axios.get(`${baseUrl}/all`).then(response => setCountries(response.data))
  }, [])

  return (
    <div>
      <SearchField search={search} onSearchChange={handleSearchChange} />
      <SearchResults countries={countries} onExpandButton={handleExpandButton} search={search} />
    </div>
  )
}

const SearchResults = ({countries, search, onExpandButton}) => {
  if (!search || !countries) {
    return null
  }

  const filteredCountries = countries.filter((country) => country.name.common.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
  
  if (filteredCountries.length == 0) {
    return null
  }

  if (filteredCountries.length > 10) {
    return (
      <div>
        Too many matches! Please change your filter.
      </div>
    )
  }
  
  if (filteredCountries.length > 1) {
    return (
      <div>
        {filteredCountries.map(country => <CountryListEntry country={country} onExpandButton={onExpandButton} key={country.cca2} />)}
      </div>
    )
  }

  return (
    <CountryInfo country={filteredCountries[0]} />
  )
}

const CountryListEntry = ({country, onExpandButton}) => {
  return (
    <div>
      {country.name.common} <button onClick={() => onExpandButton(country.name.common)}>Show</button>
    </div>
  )
}

const CountryInfo = ({country}) => {
  const languages = []
  for (const language in country.languages) {
    languages.push(country.languages[language])
  }

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>{country.flag}</div>
      <div>Capital: {country.capital}</div>
      <div>Area: {country.area}</div>
      <h2>Languages</h2>
      <table>
        <tbody>
          {languages.map(language => <tr key={language}><td>{language}</td></tr>)}
        </tbody>
      </table>
      <WeatherInfo country={country} />
    </div>
  )
}

const WeatherInfo = ({country}) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const latlng = country.capitalInfo.latlng
    const baseWeatherUrl = 'https://api.open-meteo.com/v1/forecast?'
    const weatherParameters = [
      'latitude=' + latlng[0],
      'longitude=' + latlng[1],
      'hourly=temperature_2m,wind_speed_10m',
      'wind_speed_unit=ms'
    ]
    const finalWeatherUrl = baseWeatherUrl + weatherParameters.join('&');
    axios.get(finalWeatherUrl).then(response => setWeather(response.data.hourly))
  }, [])

  if (!weather) {
    return null;
  }
  
  return (
    <>
      <h2>Weather in {country.capital}</h2>
      <div>Temperature: {weather.temperature_2m[0]} Celsius</div>
      <div>Wind: {weather.wind_speed_10m[0]} m/s</div>
    </>
  )
}

const SearchField = ({search, onSearchChange}) => {
  return (
    <form>
      <div>
        find countries: <input value={search} onChange={onSearchChange} />
      </div>
    </form>
  )
}

export default App