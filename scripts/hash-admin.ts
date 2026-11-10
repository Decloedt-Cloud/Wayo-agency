import argon2 from "argon2";

const password = process.argv[2];
if (!password) {
  console.error("Usage: npm run admin:hash -- <mot de passe>");
  process.exit(1);
}

argon2
  .hash(password)
  .then((hash) => {
    process.stdout.write(`${hash}\n`);
  })
  .catch(() => {
    console.error("hash_failed");
    process.exit(1);
  });
