import * as useRouterUser from "./routers/userAuth.js";
import * as useRouterFile from "./routers/file.js";
import * as useChangeLogs from "./routers/changeLogs.js";
import * as useRegions from "./routers/regions.js";
import * as useCategories from "./routers/categories.js";
import * as useAreaplants from "./routers/areaplants.js";
import * as usePlants from "./routers/plants.js";

import { checkDatabaseConnection } from "./db.js";

const express = require("express");
const cors = require("cors");
const port = process.env.DB_PORT || 8001;
const path = require("path");
const app = express();

app.use(cors());

app.use(checkDatabaseConnection);
app.use(express.json({ extends: true }));
app.use("/file", express.static(path.join(__dirname, "file")));

app.get("/", (req, res) => {
  res.json("api");
});

app.use("/api", useRouterUser);
app.use("/api", useRouterFile);
app.use("/api", useChangeLogs);
app.use("/api", useRegions);
app.use("/api", useCategories);
app.use("/api", useAreaplants);
app.use("/api", usePlants);

app.listen(port, () => console.log(`server started on post ${port}`));
