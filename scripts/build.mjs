import { rollup } from "rollup";
import terser from "@rollup/plugin-terser";
import path from "path";
import fs from "fs/promises";
import postcss from "@rollup/plugin-postcss";

const packages = ["core"];
const globalNames = {
  "core": "Turtle"
};
const distFolder = path.resolve(__dirname, "../dist");

function createBuildConfig(packageName) {
  const packageJsonPath = path.resolve(__dirname, "../packages", packageName);
  const inputDevelopment = path.resolve(packageJsonPath, "development.js");
  const inputProduction = path.resolve(packageJsonPath, "production.js");

  const packageDistFolder = path.resolve(distFolder, packageName);

  return {
    input: inputDevelopment,
    outputs: [
      { file: path.resolve(packageDistFolder, "development", `${packageName}.development.min.cjs`), format: "cjs" },
      { file: path.resolve(packageDistFolder, "production", `${packageName}.production.min.cjs`), format: "cjs" },
      { file: path.resolve(packageDistFolder, "development", `${packageName}.development.min.js`), format: "umd", name: globalNames[packageName] },
      { file: path.resolve(packageDistFolder, "production", `${packageName}.production.min.js`), format: "umd", name: globalNames[packageName] },
      { file: path.resolve(packageDistFolder, "development", `${packageName}.development.min.mjs`), format: "esm" },
      { file: path.resolve(packageDistFolder, "production", `${packageName}.production.min.mjs`), format: "esm" },
    ],
    plugins: [
      postcss({
        extract: true,
        minimize: true,
        sourceMap: true
      }),
      terser(),
    ],
  };
}

async function createIndexFile(packageDistFolder, packageName) {
  const indexPath = path.resolve(packageDistFolder, "index.js");

  const content = `
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
      Object.assign(exports, require("./production/${packageName}.production.min.cjs"));
    } else {
      Object.assign(exports, require("./development/${packageName}.development.min.cjs"));
    }

    module.exports = exports;
  `;

  try {
    await fs.writeFile(indexPath, content);
    console.log(`✅ Created index.js for ${packageName} at ${packageDistFolder}`);
  } catch (error) {
    console.error(`❌ Error creating index.js for ${packageName}`);
    console.error(error);
  }
}

async function buildPackage(packageName) {
  const config = createBuildConfig(packageName);

  const packageDistFolder = path.resolve(distFolder, packageName);

  try {
    const bundle = await rollup({
      input: config.input,
      plugins: config.plugins,
    });

    // Create directories for development and production folders
    await fs.mkdir(path.resolve(packageDistFolder, "development"), { recursive: true });
    await fs.mkdir(path.resolve(packageDistFolder, "production"), { recursive: true });

    for (const output of config.outputs) {
      await bundle.write({ ...output, sourcemap: true });
    }

    // Create index.js file after the build
    await createIndexFile(packageDistFolder, packageName);

    console.log(`✅ Built package: ${packageName}`);
  } catch (error) {
    console.error(`❌ Error building package: ${packageName}`);
    console.error(error);
  }
}

async function buildAllPackages() {
  try {
    await fs.mkdir(distFolder, { recursive: true });
  } catch (err) {
    console.error("❌ Error creating dist folder:", err);
  }

  for (const packageName of packages) {
    const packageDistFolder = path.resolve(distFolder, packageName);
    try {
      await fs.mkdir(packageDistFolder, { recursive: true });
    } catch (err) {
      console.error(`❌ Error creating folder for ${packageName}:`, err);
    }
    await buildPackage(packageName);
  }
}

buildAllPackages()
  .then(() => console.log("🎉 All packages built successfully into 'dist/packageName/!"))
  .catch((error) => console.error("❌ Error building packages:", error));