import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import z from "zod";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  // password: "senha",
  database: "trabalho01",
});

const UserSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  favorites: z
    .array(
      z.object({
        artist: z.string().min(1),
        album: z.string().min(1),
      }),
    )
    .min(1),
});

const app = express();

app.use(cors());

app.post("/api/create", bodyParser.json(), async (req, res) => {
  try {
    const user = UserSchema.parse(req.body);

    await pool.execute(
      `INSERT INTO users (name, favorites)
       VALUES (?, ?)`,
      [user.name, JSON.stringify(user.favorites)],
    );

    res.end();

    console.log(`Inserted user: ${JSON.stringify(user)}`);
  } catch (error) {
    res.status(400).send("Invalid user schema");
    console.error(error);
  }
});

app.get("/api/read", async (_, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, favorites
       FROM users
       ORDER BY id`,
    );

    res.json(rows);
  } catch (error) {
    res.status(500).send("Internal server error");
    console.error(error);
  }
});

app.get("/api/read/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const [rows] = await pool.query(
      `SELECT id, name, favorites
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [id],
    );

    // @ts-expect-error - See the `LIMIT 1` on the query.
    res.json(rows[0]);
  } catch (error) {
    res.status(500).send("Internal server error");
    console.error(error);
  }
});

app.put("/api/update/:id", bodyParser.json(), async (req, res) => {
  try {
    const user = UserSchema.parse(req.body);
    const id = parseInt(req.params.id);

    await pool.execute(
      `UPDATE users
       SET name = ?, favorites = ?
       WHERE id = ?`,
      [user.name, JSON.stringify(user.favorites), id],
    );

    res.end();

    console.log(`Updated user #${id}: ${JSON.stringify(user)}`);
  } catch (error) {
    res.status(400).send("Invalid user schema or id");
    console.error(error);
  }
});

app.delete("/api/delete", async (_, res) => {
  try {
    await pool.query("DELETE FROM users");

    res.end();
  } catch (error) {
    res.status(500).send("Internal server error");
    console.error(error);
  }
});

app.delete("/api/delete/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await pool.execute(
      `DELETE FROM users
       WHERE id = ?`,
      [id],
    );

    res.end();

    console.log(`Deleted user with id: ${id}`);
  } catch (error) {
    res.status(400).send("Invalid user id");
    console.error(error);
  }
});

if (import.meta.env.PROD) {
  const port = 3000;
  app.listen(port);
  console.log(`listening on http://localhost:${port}/`);
}

export const expressServer = app;
