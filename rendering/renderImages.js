import path from "path";
import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import { deleteAsync } from "del";
import { SourceFiles } from "./constants.js";
import { exists } from "./utils.js";

async function screenshot(sourceHtml, destinationFile, screensize) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("file://" + sourceHtml);
  await page.setViewport(screensize);
  await new Promise((resolve, reject) => setTimeout(() => resolve(), 1000));
  await page.screenshot({ path: destinationFile });
  await browser.close();
}

export async function renderImages(spiritName, sourceFolder, outputFolder) {
  const spiritDir = path.join(sourceFolder, spiritName);
  const destDir = path.join(outputFolder, spiritName);

  // Remove existing renders
  await deleteAsync(destDir, { force: true });

  console.log("Rendering " + spiritName);
  const destExists = await exists(destDir);
  if (!destExists) {
    await fs.mkdir(destDir);
  }
  for (const [sourceType, windowSize] of SourceFiles) {
    const source = path.join(spiritDir, sourceType);
    const sourceExists = await exists(source);
    if (!sourceExists) {
      continue;
    }
    console.log(source);
    const destPng = sourceType.substring(0, sourceType.length - 5) + ".png";
    const destImage = path.join(destDir, destPng);
    await screenshot(source, destImage, windowSize);
  }
}
