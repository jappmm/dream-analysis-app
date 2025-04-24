const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "frontend", "src");

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else if (fullPath.match(/\.(js|jsx)$/)) {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

function getCorrectFilename(dir, importName) {
  const files = fs.readdirSync(dir);
  return files.find((f) => f.toLowerCase() === importName.toLowerCase()) || null;
}

function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let updated = false;

  const importRegex = /from\s+['"](.+?)['"]/g;
  content = content.replace(importRegex, (match, importPath) => {
    if (
      importPath.startsWith(".") &&
      !importPath.endsWith(".css") &&
      !importPath.endsWith(".json")
    ) {
      const dir = path.resolve(path.dirname(filePath), importPath);
      const fullPath = dir + ".js";
      const folderIndex = path.join(dir, "index.js");

      try {
        if (fs.existsSync(fullPath)) {
          const realName = path.basename(fs.realpathSync(fullPath));
          if (realName !== path.basename(fullPath)) {
            updated = true;
            const corrected = importPath.replace(/[^/\\]+$/, realName.replace(/\.js$/, ""));
            return `from '${corrected}'`;
          }
        } else if (fs.existsSync(folderIndex)) {
          const realName = path.basename(path.dirname(fs.realpathSync(folderIndex)));
          const currentName = path.basename(dir);
          if (realName !== currentName) {
            updated = true;
            const corrected = importPath.replace(/[^/\\]+$/, realName);
            return `from '${corrected}'`;
          }
        }
      } catch (err) {
        console.error(`Error verifying path: ${dir}`, err);
      }
    }
    return match;
  });

  if (updated) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log("✅ Fixed imports in:", filePath);
  }
}

function runFix() {
  const files = getAllFiles(srcDir);
  files.forEach(fixImportsInFile);
  console.log("🎉 Import fix complete.");
}

runFix();
