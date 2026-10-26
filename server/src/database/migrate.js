require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { pool } = require("../config/db");

async function migrate() {
  const directory = path.join(__dirname, "migrations");

  const files = fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const file of files) {
      const sql = fs.readFileSync(
        path.join(directory, file),
        "utf8"
      );

      await client.query(sql);
      console.log(`Migration complete: ${file}`);
    }

    await client.query("COMMIT");
    console.log("All migrations completed successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
