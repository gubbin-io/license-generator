"use strict";
import licenseChecker from "./licenseChecker.js";
import fs from "fs";
import { renderFile } from "template-file";

const REPO_PATH = "../Gubbin";

async function generateDepRows(path) {
  const currPackage = JSON.parse(fs.readFileSync(`${path}/package.json`));
  const dependencies = currPackage.dependencies;
  const licenses = await licenseChecker(path);

  let res = "";

  for (const property in dependencies) {
    const depVersion = dependencies[property].replace("^", "");
    const moduleName = `${property}@${depVersion}`;
    const licenseObj = licenses[moduleName];

    if (
      !moduleName.startsWith("@testing-library/") &&
      !moduleName.startsWith("@types/") &&
      licenseObj
    ) {
      const repository = licenseObj.repository
        ? `\\href{${licenseObj.repository}}{${licenseObj.repository}}`
        : "Not provided";

      res += `    ${moduleName}   &   ${licenseObj.licenses}      & ${repository} \\\\\n`;
    }
  }

  return res;
}

try {
  const clientRows = await generateDepRows(`${REPO_PATH}/client`);
  const serverRows = await generateDepRows(`${REPO_PATH}/server`);
  const renderedString = await renderFile("template.tex", {
    clientRows,
    serverRows,
  });
  console.log(renderedString);
  fs.writeFileSync("third-party.tex", renderedString);
} catch (error) {
  console.log(error);
  console.log("Make sure this repository is placed alongside Gubbin.");
}
