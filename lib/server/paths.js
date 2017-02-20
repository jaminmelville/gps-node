// @TODO: Assets.absoluteFilePath(assetPath) maybe? ref: https://docs.meteor.com/api/assets.html
export const basePath = process.cwd().replace(/\/\.meteor.*$/, '');
export default basePath;
