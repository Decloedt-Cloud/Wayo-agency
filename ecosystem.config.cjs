/**
 * PM2 for Wayo Agency production.
 * Run from the project root: pm2 start ecosystem.config.cjs
 * Nginx proxies the public host to 127.0.0.1:3010. Port 3000 stays with Wayo Ads.
 */
const fs = require("fs");
const path = require("path");

function loadEnv(envPath) {
  try {
    const content = fs.readFileSync(envPath, "utf8");
    const env = {};
    for (const rawLine of content.split("\n")) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq <= 0) continue;
      const key = line.slice(0, eq).trim();
      if (!key) continue;
      let val = line.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
    return env;
  } catch {
    return {};
  }
}

const projectRoot = path.resolve(__dirname);
const env = {
  ...process.env,
  ...loadEnv(path.join(projectRoot, ".env")),
  NODE_ENV: "production",
  HOSTNAME: "127.0.0.1",
  PORT: "3010",
};

module.exports = {
  apps: [
    {
      name: "wayoagency",
      script: "server.js",
      cwd: path.join(projectRoot, ".next/standalone"),
      instances: 1,
      exec_mode: "fork",
      env,
    },
  ],
};
