const path = require("path");
const fs = require("fs");

const bucket = require("../firebaseStorage");

module.exports.deleteFile = (filePath) => {
  const fullPath = path.join(__dirname, "..", filePath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      throw err;
    }
  });
};

module.exports.deleteBucketFile = async (prefix) => {
  await bucket.deleteFiles({
    force: true,
    prefix,
  });
};
