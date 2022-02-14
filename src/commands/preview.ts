
import * as vscode from "vscode";
import { DialogType, promptForOpenOutputChannel } from "../utils/uiUtils";
import { getActiveFilePath } from "../utils/workspaceUtils";

import * as cp from 'child_process';
import { createEnvOption, executeCommandWithProgress } from "../utils/cpUtils";

import * as webpack from 'webpack';

import { renderChannel } from "../renderChannel";
import { getRootPath } from "../utils/pathUtils";
import { readdir, readdirSync } from "fs";

export async function buildComponent(uri?: vscode.Uri): Promise<void> {
  let filePath: string | undefined;

  try {
    filePath = uri?.path ?? await getActiveFilePath(uri);
  } catch(err) {
    console.error(err);
  }
  if (!filePath) {
    return;
  }
  
  const vuePathMatch = filePath.match(/(.+)\/(.+).vue$/);

  const currentPath = vuePathMatch?.[1].slice(1);
  const fileName = vuePathMatch?.[2];

  if(!fileName || !currentPath) {
    return;
  }

  try {
    const rootPath = await getRootPath(currentPath);

    if(!rootPath) {return;}
    
    process.env._buildComponent = fileName;
    process.env._relativePath = currentPath.replace(rootPath, '');

    executeCommandWithProgress(`Building the component ${fileName}...`, 'npm.cmd', ['run', 'build'], { cwd: rootPath });
  } catch (error) {
    console.error('error', error);
    await promptForOpenOutputChannel("Failed to build the component. Please open the output channel for details.", DialogType.error);
    return;
  }
}

export async function buildCatalog(uri?: vscode.Uri): Promise<void> {
  let filePath: string | undefined;

  try {
    filePath =  uri?.path ?? await getActiveFilePath(uri);
  } catch(err) {
    console.error(err);
  }
  if (!filePath) {
    return;
  }

  const currentPath = filePath.slice(1);

  const files = readdirSync(currentPath);
  const vueFiles = files.filter(file => /\.vue$/.test(file));
  
  try {
    const rootPath = await getRootPath(currentPath);

    if(!rootPath) {return;}
    
    process.env._buildComponent = vueFiles.join("$@$");
    process.env._relativePath = currentPath.replace(rootPath, '');

    const splits = currentPath.split('/');
    const catalogName = splits[splits.length - 1];

    executeCommandWithProgress(`Building the components under ${catalogName}...`, 'npm.cmd', ['run', 'build'], { cwd: rootPath });
  } catch (error) {
    console.log('error', error);
    await promptForOpenOutputChannel("Failed to build the components. Please open the output channel for details.", DialogType.error);
    return;
  }
}
