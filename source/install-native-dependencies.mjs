import { join } from 'node:path';
import { homedir } from 'node:os';
import { execSync, spawnSync } from 'node:child_process';

function _getElectronGypCacheDir() {
  return join(homedir(), ".electron-gyp")
}

async function _getElectronVersion () {
  const version = execSync('npm info electron version', { encoding : 'utf8' })
  return version.trim()
}

export default async function installNativeDependencies(

) {
  //const arch = 'arm64'
  const arch = 'arm64'
  const platform = 'darwin'
  const targetVersion = await _getElectronVersion()
  const runtime = 'electron' // node, napi or electron

  const options = {
    npm_config_arch: arch,
    npm_config_target_arch: arch,
    npm_config_platform: platform,
    npm_config_build_from_source: false,
    //npm_config_force: true,
    npm_config_target_libc: 
      (platform === "win32" || platform === "darwin") ? 'unknown' : '',
    // node-pre-gyp configs
    npm_config_target_platform: platform,
    npm_config_update_binary: true,
    npm_config_fallback_to_build: true,
    // electron configs
    npm_config_disturl: "https://electronjs.org/headers",
    npm_config_target: targetVersion,
    npm_config_runtime: runtime,
    npm_config_devdir: _getElectronGypCacheDir(),
  }

  try {
    spawnSync('npm', ['remove', 'better-sqlite3'], {
      stdio: 'inherit', 
      stdin: 'inherit',
    });
    spawnSync('npm', ['install', 'better-sqlite3'], {
      stdio: 'inherit', 
      stdin: 'inherit',
      env: {
        ...process.env,
        ...options
      }
    });
  } catch (error) {
    console.log('Error installing modules:', error)
  }

}

installNativeDependencies()