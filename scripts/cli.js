const process = require("process");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db.sqlite3");

db.exec(`CREATE TABLE if not exists store( key string, value string)`);

async function executeDbCommand(sql, params = [], type = "run") {
  return new Promise((resolve, reject) => {
    db[type](sql, params, (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
  });
}

function printHelp() {
  process.stdout.write("------------------------------\n");
  process.stdout.write("robocli at your service \n");
  process.stdout.write("usage: robocli [options]\n");
  process.stdout.write("options:\n");
  process.stdout.write(
    "  [key] [value] - write a value to the key(overrides)\n",
  );
  process.stdout.write("  [key] - get a value of given key\n");
}

async function run() {
  const argvs = process.argv.slice(2);

  if (argvs.length === 2) {
    try {
      // const gSql = `SELECT value from store where key = ?`;
      // const row = await executeDbCommand(gSql, [argvs[0]], "get");

      const wSql = `INSERT OR REPLACE INTO store(key,value) VALUES(?,?)`;
      await executeDbCommand(wSql, [argvs[0], argvs[1]]);
      process.stdout.write("Value written successfully\n");
      return;
    } catch (err) {
      process.stdout.write(`Error writing the key: ${err}\n`);
      return;
    }
  } else if (argvs.length === 1 && argvs[0] !== "--help") {
    try {
      const sql = `SELECT value from store where key = ?`;
      const row = await executeDbCommand(sql, [argvs[0]], "get");
      if(!row){
        process.stdout.write("404 not found.\n");
        return;
      }
      process.stdout.write(`${row.value}\n`);
    } catch (err) {
      process.stdout.write(`Error getting the value: ${err}\n`);
      return;
    }
  } else if (argvs[0] === "--help") {
    printHelp();
  } else {
    process.stdout.write("Invalid command\n");
    printHelp();
  }
}

(async function main() {
  run();
})();
