import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { withTranslate } from "react-redux-multilingual";
import ChangeLogs from "../../components/getinfo/changeLogs.jsx";
import Regions from "../../components/getinfo/regions.jsx";
import Plants from "../../components/getinfo/plants.jsx";
import Categories from "../../components/getinfo/categories.jsx";
import Areaplants from "../../components/getinfo/areaplants.jsx";
import Mapp from "../../components/map/map.jsx";
const Users = React.lazy(() => import("../../components/getinfo/users.jsx"));

const MainPage = (props) => {
  const { translate } = props;
  return (
    <div className="main-page">
      <Tabs
        variant="pills"
        defaultActiveKey="users"
        id="admin-tab"
        className="mb-3"
        justify
        {...props}
      >
        <Tab eventKey="users" title={translate("users")}>
          <Users {...props} />
        </Tab>
        <Tab eventKey="changeLogs" title={translate("changeLogs")}>
          <ChangeLogs {...props} />
        </Tab>
        <Tab eventKey="regions" title={translate("regions")}>
          <Regions {...props} />
        </Tab>
        <Tab eventKey="plants" title={translate("plants")}>
          <Plants {...props} />
        </Tab>
        <Tab eventKey="categories" title={translate("categories")}>
          <Categories {...props} />
        </Tab>
        <Tab eventKey="areaplants" title={translate("areaplants")}>
          <Areaplants {...props} />
        </Tab>
        <Tab eventKey="map" title={translate("map")}>
          <Mapp {...props} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default withTranslate(MainPage);
