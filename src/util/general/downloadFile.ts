export function downloadFile(fileName: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = fileName;
  document.body.append(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}
