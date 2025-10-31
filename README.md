# MyWeatherWebPart (SPFx 1.18) — Weather Web Part (React)

This project contains a SharePoint Framework (SPFx) web part built using SPFx 1.18 and React 18 that displays the current weather for the signed-in user's location. It attempts navigator.geolocation first, then falls back to an IP-based geolocation service. Weather data is fetched from OpenWeatherMap using an API key stored as a web part property.

Localization: English (en-US) and French (Canada) (fr-CA).

Prerequisites
- Node.js 18.17.1 (recommended)
- npm
- Yeoman/SharePoint generator installed globally if you prefer to scaffold and compare
- Gulp CLI (optional for global usage)

Build / Run
1. npm install
2. gulp trust-dev-cert
3. gulp serve

Set the OpenWeatherMap API key:
- Open the web part property pane in Workbench or the page and enter your OpenWeatherMap API key.

Files included
- package.json, tsconfig.json, gulpfile.js, config/*, and full src/ folder with web part and components.
- Localization files under src/webparts/myWeatherWebPart/loc for en-us and fr-ca.

Notes
- Keep your API key secure. This sample stores the key in web part properties for simplicity.
- You can publish a tenant-level solution package by running gulp bundle --ship and gulp package-solution --ship.
