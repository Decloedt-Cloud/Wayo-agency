const fs = require("fs");
const http = require("http");

const port = Number(process.env.PORT || 3010);
const appPort = Number(process.env.APP_PORT || 3011);
const flagPath = process.env.MAINTENANCE_FLAG_PATH || "/var/www/wayoagency-maintenance.flag";
const htmlPath = process.env.MAINTENANCE_HTML_PATH || "/var/www/wayoagency-maintenance/index.html";

function maintenancePage() {
  try {
    return fs.readFileSync(htmlPath, "utf8");
  } catch {
    return "<!DOCTYPE html><html lang=\"fr\"><meta charset=\"utf-8\"><title>Maintenance — Wayo Agency</title><h1>Maintenance</h1><p>Wayo Agency met le site à jour.</p></html>";
  }
}

function sendMaintenance(response) {
  const html = maintenancePage();
  response.writeHead(503, {
    "Content-Type": "text/html; charset=utf-8",
    "Retry-After": "2",
    "Cache-Control": "no-store, max-age=0",
  });
  response.end(html);
}

const server = http.createServer((request, response) => {
  let active = false;
  try {
    active = fs.existsSync(flagPath);
  } catch {
    active = false;
  }
  const path = (request.url || "/").split("?")[0];
  if (path === "/_wayo/live") {
    response.writeHead(active ? 503 : 204, {
      "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
      "Content-Type": "text/plain; charset=utf-8",
      "Pragma": "no-cache",
    });
    response.end(active ? "maintenance" : "");
    return;
  }
  if (active) {
    sendMaintenance(response);
    return;
  }

  const proxy = http.request(
    {
      host: "127.0.0.1",
      port: appPort,
      method: request.method,
      path: request.url,
      headers: request.headers,
    },
    (upstream) => {
      response.writeHead(upstream.statusCode || 502, upstream.headers);
      upstream.pipe(response);
    },
  );
  proxy.on("error", () => {
    if (response.headersSent) {
      response.destroy();
      return;
    }
    response.writeHead(502, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
    response.end("Bad Gateway");
  });
  request.pipe(proxy);
});

server.listen(port, "127.0.0.1");
