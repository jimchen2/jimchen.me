const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  console.log('Installing rclone...');
  execSync('curl https://rclone.org/install.sh | bash', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to install rclone:', error);
  process.exit(1);
}

const configDir = path.join(process.env.HOME || '/vercel', '.config', 'rclone');
try {
  fs.mkdirSync(configDir, { recursive: true });
  console.log(`Created config directory: ${configDir}`);
} catch (error) {
  console.error('Failed to create config directory:', error);
  process.exit(1);
}

// Create rclone.conf file
const configFilePath = path.join(configDir, 'rclone.conf');
const configContent = `[google]
type = drive
client_id = ${process.env.RCLONE_CLIENT_ID}
client_secret = ${process.env.RCLONE_CLIENT_SECRET}
token = ${process.env.RCLONE_TOKEN}
`;

try {
  fs.writeFileSync(configFilePath, configContent);
  console.log(`Created rclone config at ${configFilePath}`);
} catch (error) {
  console.error('Failed to write config file:', error);
  process.exit(1);
}

// Copy files from Google Drive
try {
  console.log('Copying files from Google Drive...');
  execSync('rclone copy google:blog-media public/media --transfers 200', { stdio: 'inherit' });
  console.log('Files copied successfully');
} catch (error) {
  console.error('Failed to copy files:', error);
  process.exit(1);
}
