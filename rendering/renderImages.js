import path from "path";
import { exit } from "process";
import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import { deleteAsync } from "del";
import * as url from 'url';
// const { exit } = require("process");
// const puppeteer = require('puppeteer');
// const fs = require("fs").promises;
// const del = require("del");

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const SpiritDataRoot = path.join(__dirname, '../greg-spirits');
const SpiritImageOutput = path.join(__dirname, '../greg-spirit-images');

const CardFront = ["card-front.html", { width: 2035, height: 750 }];
const CardBack = ["card-back.html", { width: 2035, height: 750 }];
const BoardFront = ["board-front.html", { width: 1827, height: 1237 }];
const BoardLore = ["board-lore.html", { width: 1827, height: 1237 }];
const SourceFiles = [CardFront, CardBack, BoardFront, BoardLore];

(async () => {
  const exists = async (file) => {
    try {
      await fs.access(file);
      return true;
    } catch (error) {
      return false;
    }
  };

  const assertExists = async (file) => {
    const fileExists = await exists(SpiritDataRoot);
    if (!fileExists) {
      console.log("Could not find " + file);
      exit(1);
    }
  };

  const screenshot = async (sourceHtml, destinationFile, screensize) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("file://" + sourceHtml);
    await page.setViewport(screensize)
    await new Promise((resolve, reject) => setTimeout(() => resolve(), 1000))
    await page.screenshot({ path: destinationFile });

    await browser.close();
  };

  assertExists(SpiritDataRoot);
  assertExists(SpiritImageOutput);

  // Remove existing renders
  const folderNames = await fs.readdir(SpiritImageOutput);
  for (const name of folderNames) {
    const folder = path.join(SpiritImageOutput, name);
    await deleteAsync(folder, { force: true });
  }

  // Get existing spirit names
  const spiritNames = await fs.readdir(SpiritDataRoot);

  for (const spiritName of spiritNames) {
    console.log("Rendering " + spiritName)
    const spiritDir = path.join(SpiritDataRoot, spiritName)
    const destDir = path.join(SpiritImageOutput, spiritName)
    const destExists = await exists(destDir);
    if (!destExists) {
      await fs.mkdir(destDir);
    }
    for (const [sourceType, windowSize] of SourceFiles) {
      const source = path.join(spiritDir, sourceType);
      const sourceExists = await exists(source);
      console.log(source);
      if (!sourceExists) {
        continue;
      }
      const destPng = sourceType.substring(0, sourceType.length - 5) + ".png";
      const destImage = path.join(destDir, destPng);
      await screenshot(source, destImage, windowSize);
    }
  }
})();
