import fs from "fs/promises";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const packages = {
  "turtle-core": "core", 
};

const distFolder = path.resolve(__dirname, "../dist");

async function copyPackageJson(packageName, sourceFolder) {
  const packageJsonPath = path.resolve(__dirname, "../packages", sourceFolder, "package.json");
  const distPackageFolder = path.resolve(distFolder, packageName);

  try {
    await fs.mkdir(distPackageFolder, { recursive: true });
    await fs.copyFile(packageJsonPath, path.resolve(distPackageFolder, "package.json"));
    console.log(`✅ Copied package.json for ${packageName}`);
  } catch (error) {
    console.error(`❌ Error copying package.json for ${packageName}:`, error);
  }
}

async function copyAllPackageJsons() {
  for (const [packageName, sourceFolder] of Object.entries(packages)) {
    await copyPackageJson(packageName, sourceFolder);
  }
}

copyAllPackageJsons()
  .then(() => console.log("🎉 All package.json files have been copied to dist!"))
  .catch((error) => console.error("❌ Error copying package.json files:", error));