#!/bin/bash

DATE=$(date +%Y-%m-%d_%H-%M)
mkdir -p ./figma-snapshots/$DATE

curl "http://localhost:3000/api/figma-analytics/component-insertions" > ./figma-snapshots/$DATE/component-insertions.json
curl "http://localhost:3000/api/figma-analytics/component-usages" > ./figma-snapshots/$DATE/component-usages.json
curl "http://localhost:3000/api/figma-analytics/health" > ./figma-snapshots/$DATE/health.json

echo "Snapshots saved to ./figma-snapshots/$DATE"
