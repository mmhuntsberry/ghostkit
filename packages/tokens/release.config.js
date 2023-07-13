const name = "tokens";
const srcRoot = `packages/${name}`;

module.exports = {
  branches: ["main"],

  extends: "../../release.config.base.js",
  pkgRoot: `dist/${srcRoot}`,
  // tagFormat: `${name}-v\${nextRelease.version}`,
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
    [
      "@semantic-release/npm",
      {
        assets: [`${srcRoot}/package.json`, `${srcRoot}/CHANGELOG.md`],
        message: (params) => {
          console.log("PARAMS -->", params);
          return `release(version): Release ${name} ${params.nextRelease.version} [skip ci]\n\n${params.nextRelease.notes}`;
        },
      },
    ],
  ],
};
