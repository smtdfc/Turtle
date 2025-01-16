import { rollup } from "rollup";
import terser from "@rollup/plugin-terser";
import path from "path";
import fs from "fs/promises";
import postcss from "@rollup/plugin-postcss";

const packages = ["core"];
const distFolder = path.resolve(__dirname, "../dist");

function createBuildConfig(packageName) {
  const packageJsonPath = path.resolve(__dirname, "../packages", packageName);
  const inputDevelopment = path.resolve(basePath, "development/production.js");
  const packageDistFolder = path.resolve(distFolder, packageName, "bundles");

  return {
    input: inputDevelopment,
    outputs: [
      { file: path.resolve(packageDistFolder, `${packageName}.cjs`), format: "cjs" },
      { file: path.resolve(packageDistFolder, `${packageName}.umd.min.js`), format: "umd", name: packageName },
      { file: path.resolve(packageDistFolder, `${packageName}.esm.min.mjs`), format: "esm" },
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

async function buildPackage(packageName) {
  const config = createBuildConfig(packageName);

  try {
    const bundle = await rollup({
      input: config.input,
      plugins: config.plugins,
    });

    for (const output of config.outputs) {
      await bundle.write({ ...output, sourcemap: true });
    }
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
    const packageDistFolder = path.resolve(distFolder, packageName, "bundles");
    try {
      await fs.mkdir(packageDistFolder, { recursive: true });
    } catch (err) {
      console.error(`❌ Error creating bundles folder for ${packageName}:`, err);
    }
    await buildPackage(packageName);
  }
}

buildAllPackages()
  .then(() => console.log("🎉 All packages built successfully into 'dist/packageName/bundles'!"))
  .catch((error) => console.error("❌ Error building packages:", error));