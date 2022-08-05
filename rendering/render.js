import path from "path";
import { promises as fs } from "fs";
import * as url from "url";
import { renderImages } from "./renderImages.js";
import { assertExists } from "./utils.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import process, { exit } from "process";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const SpiritGroups = [
  ["greg-spirits", "greg-spirit-images"],
  ["shalin-hana-spirit", "shalin-hana-spirit-images"],
];
const SpiritGroupMap = new Map(SpiritGroups);

async function renderImageInSource(sourceFolder, outputFolder) {
  assertExists(sourceFolder);
  assertExists(outputFolder);

  const spiritNames = await fs.readdir(sourceFolder);
  const filtered = spiritNames.filter((n) => n !== ".DS_Store");
  for (const spiritName of filtered) {
    await renderImages(spiritName, sourceFolder, outputFolder);
  }
}

async function renderAllImages() {
  for (const [source, output] of SpiritGroups) {
    await renderImagesInSource(source, output);
  }
}

async function renderSpiritGroup(spiritGroup) {
  const output = SpiritGroupMap.get(spiritGroup);
  if (output == null) {
    console.log(`Spirit group \"${spiritGroup}\" does not exist`);
    const groups = [...SpiritGroupMap.keys()].join("\n  ");
    console.log(`Possible values are: \n  ${groups}`);
    exit();
  }
  const sourcePath = path.join(__dirname, "../", spiritGroup);
  const outputPath = path.join(__dirname, "../", output);
  await renderImageInSource(sourcePath, outputPath);
}

async function renderSpirit(spiritName) {
  const options = {};
  for (const [source, output] of SpiritGroups) {
    const sourcePath = path.join(__dirname, "../", source);
    const outputPath = path.join(__dirname, "../", output);
    const spiritNames = await fs.readdir(sourcePath);
    const filteredSpiritNames = spiritNames.filter((n) => n !== ".DS_Store");
    options[source] = filteredSpiritNames;
    if (filteredSpiritNames.indexOf(spiritName) >= 0) {
      await renderImages(spiritName, sourcePath, outputPath);
      return;
    }
  }
  console.log(`Spirit \"${spiritName}\" does not exist`);
  console.log("Possible values are:");
  for (const key in options) {
    console.log(`  ${key}:`);
    console.log(`    ${options[key].join("\n    ")}`);
  }
}

const mainArgv = yargs(hideBin(process.argv))
  .command(
    "render-all",
    "Render all spirits to hard-coded output locations",
    () => {},
    (argv) => {
      renderAllImages();
    }
  )
  .command(
    "render-group <spirit-group>",
    "Renders all of one person' spirits",
    () => {},
    (argv) => {
      renderSpiritGroup(argv["spirit-group"]);
    }
  )
  .command(
    "render-spirit <spirit-name>",
    "Renders a specific spirit",
    () => {},
    (argv) => {
      renderSpirit(argv["spirit-name"]);
    }
  )
  .strict()
  .demandCommand().argv;

// renderAllImages(SpiritDataRoot, SpiritImageOutput);
