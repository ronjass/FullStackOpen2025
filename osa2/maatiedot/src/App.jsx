import { useState, useEffect } from 'react'
import countryService from './services/countries'

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [results, setResults] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    countryService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  const filterCountries = (query) => {
    const filteredCountries = countries.filter(c => c.name.common.toLowerCase().includes(query))
    setResults(filteredCountries)
  }

  const showResults = () => {
    if (selectedCountry) {
      return showCountryDetails(selectedCountry)
    }
    if (search === '') {
      return null
    }
    else if (results.length > 10) {
      return <div>Too many matches, specify another filter</div>
    } else if (results.length === 1) {
      return showCountryDetails(results[0])
    } else {
      return results.map(c => (
        <div key={c.name.common}>
          {c.name.common} <button onClick={() => setSelectedCountry(c)}>show</button>
        </div>
      ))
    }
  }

  const showCountryDetails = (country) => {
    const languages = Object.values(country.languages)

    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>Capital {country.capital} <br />
           Area {country.area}</p>
        <h2>Languages</h2>
        <ul>
        {languages.map(language => (
          <li key={language}>
          {language}</li>
        ))}
        </ul>
        <img src={country.flags.png} alt={country.flags.alt} width="200" />
      </div>
    )

  }

  const handleChange = (event) => {
    const query = event.target.value.toLowerCase()
    setSearch(query)
    setSelectedCountry(null)
    filterCountries(query)

}
  return (
    <div>
      find countries: <input value={search} onChange={handleChange}/>
      {showResults()}
      </div>
  )
}

export default App
