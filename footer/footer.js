const scriptPath = document.currentScript.src;
const footerDir = scriptPath.substring(0, scriptPath.lastIndexOf('/'));

fetch(`${footerDir}/footer.html`)
  .then(r => r.text())
  .then(html => {
    document.getElementById('footer').innerHTML = html;
  });
