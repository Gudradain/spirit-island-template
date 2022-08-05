import { promises as fs } from "fs";

export async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch (error) {
    return false;
  }
}

export async function assertExists(file) {
  const fileExists = await exists(file);
  if (!fileExists) {
    console.log("Could not find " + file);
    exit(1);
  }
};
