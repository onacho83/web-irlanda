// Simple FTP deploy script for DonWeb using basic-ftp
// Usage: create a .env file with FTP_HOST, FTP_USER, FTP_PASS, FTP_REMOTE_PATH

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ftp from 'basic-ftp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
    const envPath = path.resolve(__dirname, '..', '.env');
    if (!fs.existsSync(envPath)) {
        throw new Error('.env file not found. Create one with FTP_HOST, FTP_USER, FTP_PASS, FTP_REMOTE_PATH');
    }
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split(/\r?\n/).filter(Boolean);
    const env = {};
    for (const line of lines) {
        const [k, v] = line.split('=');
        env[k.trim()] = v.trim();
    }
    return env;
}

async function uploadFolder(client, localDir, remoteDir) {
    await client.ensureDir(remoteDir);
    await client.clearWorkingDir();
    await client.uploadFromDir(localDir);
}

async function main() {
    try {
        const env = loadEnv();
        const client = new ftp.Client();
        client.ftp.verbose = true;
        console.log('Connecting to FTP', env.FTP_HOST);
        await client.access({ host: env.FTP_HOST, user: env.FTP_USER, password: env.FTP_PASS, secure: false });
        const remotePath = env.FTP_REMOTE_PATH || '/';
        console.log('Uploading project root to', remotePath);
        await uploadFolder(client, path.resolve(__dirname, '..'), remotePath);
        console.log('Upload complete');
        client.close();
    } catch (err) {
        console.error('FTP deploy failed:', err);
        process.exit(1);
    }
}

if (process.argv[1] && process.argv[1].endsWith('ftp-deploy.js')) {
    main();
}
