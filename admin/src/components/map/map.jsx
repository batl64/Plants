import React, { useState, useEffect, useRef } from "react";
import { withTranslate } from "react-redux-multilingual";

import L from "leaflet";

import { fetchKyivRegion, respons } from "../../servises";
import osmtogeojson from "osmtogeojson";
import "leaflet/dist/leaflet.css";
import "./map.css";

const Mapp = (props) => {
  const { translate } = props;
  const mapRef = useRef(null);
  const [kyivRegion, setKyivRegion] = useState(null);
  const [plants, setPlants] = useState([]);

  const ChangeSelect = async (dat) => {
    const reg = await respons(
      "get",
      "/changeLogsList?" + new URLSearchParams({ id: dat.target.value })
    ).then((data) => data);
    console.log(reg);
    let query = ``;
    for (const element of reg) {
      if (element.regType === "Область") {
        query += `relation["admin_level"="4"]["name"="${element.RegionName}"];`;
      } else {
        query += `relation["admin_level"="6"]["name"="${element.RegionName}"];`;
      }
    }
    setKyivRegion(await fetchKyivRegion(query));
  };

  useEffect(async () => {
    await respons("get", "/plantsList").then((data) => {
      setPlants(data);
    });
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

      L.geoJSON(
        {
          type: "FeatureCollection",
          features: geoJsonData.features.filter(
            (feature) => feature.geometry.type !== "Point"
          ),
        },
        {
          style: {
            color: "blue",
            fillOpacity: 0.2,
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
        <select
          name="name_of_select"
          id="id_of_select"
          style={{}}
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
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", height: "500px" }} ref={mapRef}></div>
        </div>
      </div>
    </>
  );
};

export default withTranslate(Mapp);
