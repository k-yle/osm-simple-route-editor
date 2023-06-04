import { ELI } from "../../types";

// based on https://github.com/andrewharvey/osm-editor-layer-index-qgis/blob/63366ac/index.js#L64-L68
export function convertTileUrl(url: string) {
  return url.replace("{zoom}", "{z}").replace(/{switch:([^,}]+)[^}]*}/, "$1");
}

function escapeText(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function attributionToHtml(a: ELI["attribution"]) {
  if (!a?.text) return undefined;

  return a.url
    ? `<a href="${encodeURI(
        a.url
      )}" target="_blank" rel="noopener noreferrer">${escapeText(a.text)}</a>`
    : a.text;
}
