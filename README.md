# Simple OSM Route Editor

[![Test](https://github.com/k-yle/osm-simple-route-editor/actions/workflows/ci.yml/badge.svg)](https://github.com/k-yle/osm-simple-route-editor/actions/workflows/ci.yml)
![Lines of code](https://img.shields.io/tokei/lines/github/k-yle/osm-simple-route-editor?color=green)

📍 A web editor that lets you quickly modify OpenStreetMap route relations.

Visit [osm-simple-route-editor.kyle.kiwi](https://osm-simple-route-editor.kyle.kiwi) to start editing!

<details>
<summary>Info for Software Developers (click to expand)</summary>

**Setup:**

- Install VSCode including [all the recommended extensions](.vscode/extensions.json)
- Install NodeJS v18 or newer
- Install yarn
- Clone the repo
- run `yarn` to install dependencies

**Usage:**

- run `yarn start` to start the dev server - you must use `127.0.0.1:3000`, `localhost:3000` won't work due to the way OSM OAuth works
- run `yarn lint` and `yarn test` to check the code

</details>
