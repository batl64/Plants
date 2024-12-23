const DEFAULT_PORT = 3000;
import * as dotenv from "dotenv";

dotenv.config();

export const CONFIGURATIONS = {
  DB: {
    user: process.env.user,
    host: process.env.host,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  },
};
export default {
  CONFIGURATIONS,
};
