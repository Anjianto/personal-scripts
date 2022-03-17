#! /usr/bin/env node

const { exec, spawn } = require("child_process");

exec("git rev-parse --abbrev-ref HEAD", (err, stdout, stderr) => {
  if (err) {
    console.error(err);
  }

  if (typeof stdout === "string") {
    const gitPush = spawn("git", ["push", "origin", stdout.trim()]);
    gitPush.stdout.on("data", function (data) {
      console.log(data.toString());
    });

    gitPush.stderr.on("data", function (data) {
      console.error(data.toString());
    });

    gitPush.on("exit", function (code) {
      console.log("child process exited with code " + code.toString());
    });
  }
});
