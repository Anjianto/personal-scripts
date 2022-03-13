#! /usr/bin/env node

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { EXCLUDE_FILES_AND_DIRECTORY } = require("./constants");

const recursiveReadDir = (pathRead = ".") => {
  fs.readdir(pathRead, (err, files) => {
    if (err) {
      throw new Error(err);
    }

    files.map((file) => {
      if (
        EXCLUDE_FILES_AND_DIRECTORY.includes(file) &&
        file !== "node_modules"
      ) {
        return;
      }
      if (fs.lstatSync(path.join(pathRead, file)).isDirectory()) {
        return recursiveReadDir(path.join(pathRead, file));
      }

      if (!fs.existsSync(path.join(pathRead, "node_modules"))) {
        return;
      }

      exec(
        `rm -fr ${path.join(pathRead, "node_modules")}`,
        (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
          }
          if (stdout) {
            console.log(`stdout: ${stdout}`);
            return;
          }
          console.log(
            `Success remove node_modules in ${path.resolve(
              pathRead,
              "node_modules"
            )}`
          );
          return;
        }
      );
    });
  });
};

if (process.argv[2]) {
  recursiveReadDir(path.resolve(process.argv[2]));
} else {
  throw new Error("Please give the path to run this script!");
}
