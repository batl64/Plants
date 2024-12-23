import * as mysql from "mysql";
import { CONFIGURATIONS } from "./const/index.js";

const db = new mysql.createPool(CONFIGURATIONS.DB);
const check = () => {
  db.getConnection((error, connection) => {
    if (error) {
      console.error("Помилка при отриманні з'єднання:", error);
      return;
    }

    connection.query("SELECT 1", (error, results) => {
      connection.release(); // Звільнення з'єднання у пул після виконання запиту

      if (error) {
        console.error("Помилка при виконанні запиту:", error);
        return;
      }
    });
  });
};

export const checkDatabaseConnection = (req, res, next) => {
  // Перевірка доступності бази даних
  db.getConnection((err, connection) => {
    if (err) {
      // Помилка підключення до бази даних
      console.error(err);
      res.status(503).json({
        error: "Database is currently unavailable. Please try again later.",
      });
    } else {
      // З'єднання успішно отримано, продовжуємо обробку запиту
      connection.release();
      next();
    }
  });
};

// Додати middleware перевірки доступності бази даних до всіх маршрутів

db.getConnection((error, connection) => {
  if (error) {
    console.error("Помилка при отриманні з'єднання:", error);
    return;
  } else {
    console.log("db connect");
  }
});

setInterval(check, 3600000);
export default db;
