"use strict";
import checker from "license-checker";

function licenseChecker(path) {
  return new Promise((resolve, reject) => {
    checker.init(
      {
        start: path,
      },
      function (err, packages) {
        if (err) {
          reject(err);
        } else {
          resolve(packages);
        }
      }
    );
  });
}

export default licenseChecker;
