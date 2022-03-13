#! /usr/bin/env node

const fs = require("fs");
const path = require("path");
const { EXCLUDE_FILES_AND_DIRECTORY } = require("./constants");

const searchBigFileRecursive = (pathRead = ".", maximumFileSize) => {
  fs.readdir(pathRead, (err, files) => {
    if (err) {
      throw new Error(err);
    }

    if (isNaN(parseInt(maximumFileSize))) {
      throw new Error("File size is not valid!");
    }

    files.map((file) => {
      try {
        if (EXCLUDE_FILES_AND_DIRECTORY.includes(file)) {
          return;
        }
        if (fs.lstatSync(path.join(pathRead, file)).isDirectory()) {
          return searchBigFileRecursive(
            path.join(pathRead, file),
            maximumFileSize
          );
        }

        const fileSize = Math.floor(
          fs.statSync(path.join(pathRead, file)).size / (1000 * 1000)
        );
        if (fileSize >= parseInt(maximumFileSize)) {
          console.log(`${path.join(pathRead, file)} is ${fileSize} MB`);
          return;
        }
      } catch (error) {
        console.log(file, " => ", error);
      }
    });
  });
};

if (process.argv[2] && process.argv[3]) {
  searchBigFileRecursive(path.resolve(process.argv[2]), process.argv[3]);
} else {
  throw new Error(
    "Please give the path and the maximum size (MB) to run this script!"
  );
}
