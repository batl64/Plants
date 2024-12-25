import React, { useState, useEffect, useRef } from "react";
import { withTranslate } from "react-redux-multilingual";

import L from "leaflet";

import { fetchKyivRegion, respons } from "../../servises";
import osmtogeojson from "osmtogeojson";
import "leaflet/dist/leaflet.css";

const Mapp = (props) => {
  const { translate } = props;
  const mapRef = useRef(null);
  const [kyivRegion, setKyivRegion] = useState(null);
  const [plants, setPlants] = useState([]);
  const [changeLogs, setChangeLogs] = useState([]);
  const [select, setSelect] = useState(null);
  const [date, setDate] = useState(null);

  const handleSubmit = async () => {
    const reg = await respons(
      "get",
      "/changeLogsList?" + new URLSearchParams({ id: select || 1, date: date })
    ).then((data) => data);

    let query = ``;
    for (const element of reg) {
      if (element.regType === "Область") {
        query += `relation["admin_level"="4"]["name"="${element.RegionName}"];`;
      } else {
        query += `relation["admin_level"="6"]["name"="${element.RegionName}"];`;
      }
    }
    setChangeLogs(reg);
    setKyivRegion(await fetchKyivRegion(query));
  };

  const ChangeSelect = (dat) => {
    setSelect(dat.target.value);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        await respons("get", "/plantsList").then((data) => {
          setPlants(data);
        });
      } catch (e) {
        console.log(e);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (mapRef.current && kyivRegion) {
      const map = L.map(mapRef.current).setView([50.4501, 30.5236], 10);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.eachLayer((layer) => {
        if (layer instanceof L.GeoJSON) {
          map.removeLayer(layer);
        }
      });

      const geoJsonData = osmtogeojson(kyivRegion);
      const featuresData = geoJsonData.features.filter(
        (feature) => feature.geometry.type !== "Point"
      );

      const featuresWithIndex = featuresData.map((feature, index) => ({
        ...feature,
        properties: {
          ...feature.properties,
          AreaSize: changeLogs[index]?.AreaSize,
        },
      }));

      L.geoJSON(
        {
          type: "FeatureCollection",
          features: featuresWithIndex,
        },
        {
          style: {
            color: "blue",
            fillOpacity: 0.2,
          },
          onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.name) {
              layer.bindTooltip(
                feature.properties.name +
                  " (" +
                  feature.properties.AreaSize +
                  ") ",
                {
                  permanent: false,
                  direction: "top",
                }
              );
            }
          },
        }
      ).addTo(map);

      map.invalidateSize();

      return () => {
        if (mapRef.current) {
          map.remove();
        }
      };
    }
  }, [kyivRegion]);

  return (
    <>
      <div className="main-page">
        <div>
          <select
            name="name_of_select"
            id="id_of_select"
            style={{ marginLeft: "20px" }}
            onChange={ChangeSelect}
          >
            <option value="" disabled selected>
              {translate("selectPlants")}
            </option>
            {plants.map((e) => (
              <option key={e.ID_Plant} value={e.ID_Plant}>
                {e.Name}
                {e.ID_Category}
              </option>
            ))}
          </select>
          <input
            style={{ marginLeft: "20px" }}
            type="date"
            id="dateInput"
            name="date"
            onChange={(dat) => {
              setDate(dat.target.value);
            }}
          />
          <input
            type="submit"
            style={{ marginLeft: "20px" }}
            className="btn btn-success my-3 "
            value={translate("search")}
            onClick={handleSubmit}
          />
        </div>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "100%", height: "500px" }} ref={mapRef}></div>
        </div>
      </div>
    </>
  );
};

export default withTranslate(Mapp);
