import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import numeral from "numeral";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [country, setInputCountry] = useState("Countries");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [selectedStartDate, setSelectdStartDate] = useState(null);
  const [selectedEndDate, setSelectdEndDate] = useState(null);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  console.log(casesType);
  let countryCode;
  const onCountryChange = async (e) => {
    countryCode = e.target.value;
    console.log(countryCode);


    const url =
      countryCode === "Countries"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);

      });
  };



  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1 >COVID-19 Tracker</h1>
          
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="Countries">Countries</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
 
      </div>

      <div className="app__date-range">
      <h3> To
      <DatePicker className="app__date-picker"
        selected={selectedStartDate}
        onChange={date => setSelectdStartDate(date)}
        dateFormat='dd/MM/yyyy'
        maxDate={new Date()}
        showYearDropdown
        scrollableMonthYearDropdown
      />
      </h3>

      <h3> From
      <DatePicker className="app__date-picker"
        selected={selectedEndDate}
        onChange={date => setSelectdEndDate(date)}
        dateFormat='dd/MM/yyyy'
        maxDate={new Date()}
        showYearDropdown
        scrollableMonthYearDropdown
      />
      </h3>
      <button className="app__button"> Search</button>

      </div>

      <h4 className="app__note">(Note: Its for demo purpose only because not able to find an API which gives data between specific date range. Hence, showing data from past 3 months.)</h4>

      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>{casesType} throughout the country-</h3>
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default  App;


