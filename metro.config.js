const { getDefaultConfig } = require("expo/metro-config");

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig(__dirname);

  return {
    resolver: {
      assetExts: [...assetExts, "db", "mp3", "ttf", "obj", "png", "jpg", "wav"],
      sourceExts: [...sourceExts, "jsx", "js", "ts", "tsx"],
    },
  };
})();
