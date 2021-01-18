const path = require("path");
const fs = require("fs");

module.exports.deleteFile = (filePath) => {
  const fullPath = path.join(__dirname, "..", filePath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      throw err;
    }
  });
};
