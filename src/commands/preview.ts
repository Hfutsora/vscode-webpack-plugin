
import * as vscode from "vscode";
import { DialogType, promptForOpenOutputChannel } from "../utils/uiUtils";
import { getActiveFilePath } from "../utils/workspaceUtils";

import * as cp from 'child_process';
import { createEnvOption } from "../utils/cpUtils";

import * as webpack from 'webpack';

import { renderChannel } from "../renderChannel";

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

  const fileName = filePath.match(/.+\/(.+).vue$/)?.[1];

  if(!fileName) {
    return;
  }
  
  try {
    process.env.comp = fileName;

    const childProc: cp.ChildProcess = cp.spawn('npm.cmd', ['run', 'build', `--foo=${fileName}`], { cwd: '' });

    childProc.stdout?.on('data', (data) => {
      console.log(`stdout: ${data}`);
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
