import * as vscode from "vscode";
import * as wsl from "./wslUtils";

export async function getActiveFilePath(uri?: vscode.Uri): Promise<string | undefined> {
  let textEditor: vscode.TextEditor | undefined;
  if (uri) {
    textEditor = await vscode.window.showTextDocument(uri, { preview: false });
  } else {
    textEditor = vscode.window.activeTextEditor;
  }

  if (!textEditor) {
    return undefined;
  }
  if (textEditor.document.isDirty && !await textEditor.document.save()) {
    vscode.window.showWarningMessage("Please save the extend file first.");
    return undefined;
  }
  return wsl.useWsl() ? wsl.toWslPath(textEditor.document.uri.fsPath) : textEditor.document.uri.fsPath;
}
