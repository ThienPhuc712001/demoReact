const path = require('path');
const { spawn } = require('child_process');

// Load .env so PORT/REACT_PORT is honored when running via npm scripts
require('dotenv').config();

async function main() {
  const port = 3000; // Fixed port as requested
  console.log(`Starting React app on port ${port}...`);

  const startJs = path.join(
    __dirname,
    '..',
    'node_modules',
    'react-scripts',
    'scripts',
    'start.js'
  );

  const child = spawn(process.execPath, [startJs], {
    stdio: 'inherit',
    shell: false,
    env: {
      ...process.env,
      PORT: String(port),
    },
  });

  child.on('exit', (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 0);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

