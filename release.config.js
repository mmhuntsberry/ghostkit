const name = "tokens";
const srcRoot = `packages/${name}`;

module.exports = {
  extends: "release.config.base.js",
  pkgRoot: `dist/${srcRoot}`,
  tagFormat: `${name}-v${version}`,
  commitPaths: [`${srcRoot}/*`],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        changelogFile: `packages/${name}/CHANGELOG.md`,
      },
    ],
    "@semantic-release/npm",
    {
      assets: [`${srcRoot}/package.json`, `${srcRoot}/CHANGELOG.md`],
      message:
        `release(version): Release ${name} ` +
        `${nextRelease.version} [skip ci]\n\n${nextRelease.notes}`,
    },
  ],
};
