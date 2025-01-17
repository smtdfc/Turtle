import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const distFolder = path.resolve(__dirname, "../dist");

async function publishPackage(packageFolder) {
  const packageJsonPath = path.resolve(packageFolder, "package.json");

  try {
    await fs.access(packageJsonPath);
    console.log(`Publishing ${packageFolder}...`);
    const { stdout, stderr } = await execAsync(`npm publish`, { cwd: packageFolder });
    if (stdout) console.log(`Successfully published: ${packageFolder}\n${stdout}`);
    if (stderr) console.error(`Warnings while publishing ${packageFolder}:\n${stderr}`);
  } catch (error) {
    console.error(`Failed to publish ${packageFolder}:`, error.message);
  }
}

async function publishAllPackages() {
  try {
    const packageFolders = await fs.readdir(distFolder, { withFileTypes: true });
    const directories = packageFolders.filter((dir) => dir.isDirectory()).map((dir) => dir.name);

    for (const packageName of directories) {
      const packageFolder = path.resolve(distFolder, packageName);
      await publishPackage(packageFolder);
    }
  } catch (error) {
    console.error(`Error reading dist folder:`, error.message);
  }
}

publishAllPackages()
  .then(() => console.log("All packages have been published successfully!"))
  .catch((error) => console.error("Error publishing packages:", error));