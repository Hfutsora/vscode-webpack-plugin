
import * as vscode from "vscode";
import { DialogType, promptForOpenOutputChannel } from "../utils/uiUtils";
import { getActiveFilePath } from "../utils/workspaceUtils";

import * as cp from 'child_process';
import { createEnvOption } from "../utils/cpUtils";

import * as webpack from 'webpack';

import { renderChannel } from "../renderChannel";
import { getRootPath } from "../utils/pathUtils";

export async function previewComponent(uri?: vscode.Uri): Promise<void> {
  let filePath: string | undefined;

  console.log('uri', uri);

  try {
    filePath =  uri?.path ?? await getActiveFilePath(uri);
  } catch(err) {
    console.log(err);
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

    const childProc: cp.ChildProcess = cp.spawn('npm.cmd', ['run', 'build'], { cwd: rootPath });

    childProc.stdout?.on('data', (data) => {
      console.log(`stdout: ${data}`);

      renderChannel.appendLine(data);
    });

    childProc.stderr?.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    
    childProc.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  } catch (error) {
    console.log('error', error);
    await promptForOpenOutputChannel("Failed to preview the component. Please open the output channel for details.", DialogType.error);
    return;
  }
}
