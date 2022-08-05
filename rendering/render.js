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
  ["shalin-hana-spirits", "shalin-hana-spirit-images"],
];
const SpiritGroupMap = new Map(SpiritGroups);

//TODO: replace with args
const SpiritDataRoot = path.join(__dirname, "../greg-spirits");
const SpiritImageOutput = path.join(__dirname, "../greg-spirit-images");

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
    const groups = [...SpiritGroupMap.keys()].join('\n  ');
    console.log(`Possible values are: \n  ${groups}`)
    exit();
  }
  const sourcePath = path.join(__dirname, "../", spiritGroup);
  const outputPath = path.join(__dirname, "../", output);
  await renderImageInSource(sourcePath, outputPath);
}

const mainArgv = yargs(hideBin(process.argv))
  .command(
    "render-all",
    "Render all spirits to hard-coded output locations",
    (subArgs) => {},
    (argv) => {}
  )
  .command(
    "render-group <spirit-group>",
    "Renders all of one person' spirits",
    () => {},
    (argv) => {
      renderSpiritGroup(argv['spirit-group']);
    }
  )
  .command("render-spirit", "Renders a specific spirit")
  .strict()
  .demandCommand().argv;

// renderAllImages(SpiritDataRoot, SpiritImageOutput);
