import React, { useState, useEffect } from 'react';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from '@material-ui/core';
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCounties] = useState([]);
  const [casesType, setCasesType] = useState('cases');

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then(response => response.json())
        .then(data => {
          const countries = data.map(country => ({
            name: country.country,
            value: country.countryInfo.iso2
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCounties(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  useEffect(() => {
    const getCovidData = async () => {
      const url =
        country === 'worldwide'
          ? 'https://disease.sh/v3/covid-19/all'
          : `https://disease.sh/v3/covid-19/countries/${country}`;

      await fetch(url)
        .then(response => response.json())
        .then(data => {
          setCountryInfo(data);
          if (data.countryInfo && data.countryInfo.long) {
            setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
            setMapZoom(4);
          }
        });
    };

    getCovidData();
  }, [country]);

  const onCountryChange = async event => {
    const countryCode = event.target.value;
    console.log(`Country selected: ${countryCode}`);
    setCountry(countryCode);
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID 19 tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem key="worldwide" value="worldwide">
                Worldwide
              </MenuItem>
              {countries.map(country => (
                <MenuItem key={country.value} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === 'cases'}
            onClick={e => setCasesType('cases')}
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            active={casesType === 'recovered'}
            onClick={e => setCasesType('recovered')}
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            isRed
            active={casesType === 'deaths'}
            onClick={e => setCasesType('deaths')}
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>

        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new {casesType}</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
