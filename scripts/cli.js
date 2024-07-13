const process = require("process");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db.sqlite3", (err) => {});

db.exec(`CREATE TABLE if not exists store( key string, value string)`);

function printHelp() {
  process.stdout.write("------------------------------\n");
  process.stdout.write("robocli at your service \n");
  process.stdout.write("usage: robocli [options]\n");
  process.stdout.write("options:\n");
  process.stdout.write(
    "  w [key] [value] - write a value to the key(override if key exists)\n",
  );
  process.stdout.write("  g [key] - get a value of given key\n");
}

function run() {
  const argvs = process.argv.slice(2);
  if (argvs[0] === "g") {
    if (!argvs[1]) {
      process.stdout.write("Please provide a key to get the value\n");
      return;
    } else {
      db.get(
        `SELECT value from store where key = ?`,
        [argvs[1]],
        (err, row) => {
          if (row) {
            process.stdout.write(`${row.value}\n`);
            return;
          } else {
            process.stdout.write("No value found for the key\n");
            return;
          }
        },
      );
    }
  } else if (argvs[0] === "w") {
    if (!argvs[1] || !argvs[2]) {
      process.stdout.write("Please provide a key and value to write\n");
      return;
    } else {
      const args = [argvs[1], argvs[2]];
      db.run(
        `INSERT OR REPLACE INTO store(key,value) VALUES(?,?)`,
        args,
        (err) => {
          if (err) {
            process.stdout.write("Error writing to database\n");
            return;
          }
          process.stdout.write("Value written successfully\n");
          return;
        },
      );
    }
  } else if (argvs[0] === "--help" || !argvs[0]) {
    printHelp();
    return;
  } else {
    process.stdout.write("Invalid command\n");
    printHelp();
    return;
  }
}

(async function main() {
  run();
  console.log();
})();
