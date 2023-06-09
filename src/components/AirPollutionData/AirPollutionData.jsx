import React, { useEffect, useState } from "react";
import { getAirPollution } from "../../api/openweathermap";
import styles from "./AirPollutionData.module.css";

export const CO = "co";
export const NO = "no";
export const NO2 = "no2";
export const O3 = "o3";
export const SO2 = "so2";
export const PM2_5 = "pm2_5";
export const PM10 = "pm10";
export const NH3 = "nh3";

export const labels = {
  [CO]: "Carbon monoxide",
  [NO]: "Nitrogen monoxide",
  [NO2]: "Nitrogen dioxide",
  [O3]: "Ozone",
  [SO2]: "Sulphur dioxide",
  [PM2_5]: "PM 2.5",
  [PM10]: "PM 10",
  [NH3]: "Ammonia",
};

function getPollutionObj(data) {
  return Object.entries(labels).reduce((acc, [pollutantName, label]) => {
    acc[pollutantName] = {
      label,
      value: data[pollutantName],
    };

    return acc;
  }, {});
}

function AirPollutionData(props) {
  const [airPollutionIndex, setAirPollutionIndex] = useState(null);
  const [airPollutants, setAirPollutants] = useState({});

  useEffect(() => {
    getAirPollution().then(({ list }) => {
      const [data] = list;
      const {
        components,
        main: { aqi },
      } = data;
      const airPollutants = getPollutionObj(components);

      setAirPollutants(Object.values(airPollutants));
      setAirPollutionIndex(aqi);
    });
  }, [props.city]);

  if (!airPollutionIndex) {
    return null;
  }

  const getQualityIndex = (index) => {
    switch (index) {
      case 1:
        return "Good";
      case 2:
        return "Fair";
      case 3:
        return "Moderate";
      case 4:
        return "Poor";
      case 5:
        return "Very Poor";
      default:
        return "none";
    }
  };
  return (
    <div>
      <h2>Air Pollution</h2>
      <div>Quality index: {getQualityIndex(airPollutionIndex)}</div>
      <table>
        <tbody>
          <tr>
            <th>Pollutant</th>
            <th>Concentration</th>
          </tr>
          {airPollutants.length &&
            airPollutants.map(({ label, value }, index) => (
              <tr key={index}>
                <td>{label}</td>
                <td>{value} μg/m3</td>
                {/* <div key={index}>
              <b>{pollutant.label}</b>: {pollutant.value} μg/m3
            </div> */}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default AirPollutionData;
