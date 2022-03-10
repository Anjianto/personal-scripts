#! /usr/bin/env node

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const recursiveReadDir = (pathRead = ".") => {
  fs.readdir(pathRead, (err, files) => {
    files.map((file) => {
      if (file === "node_modules") {
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
              `Success remove node_modules in ${path.resolve(pathRead)}`
            );
            return;
          }
        );
      }
      if (
        fs.lstatSync(path.join(pathRead, file)).isDirectory() &&
        file !== "node_modules"
      ) {
        return recursiveReadDir(path.join(pathRead, file));
      }
    });
  });
};

if (process.argv[2]) {
  recursiveReadDir(path.resolve(process.argv[2]));
} else {
  throw new Error("Please give the path to run this script!");
}
