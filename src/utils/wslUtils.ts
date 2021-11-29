import * as vscode from "vscode";
import { executeCommand } from "./cpUtils";
import { isWindows } from "./osUtils";

export function useWsl(): boolean {
  return isWindows();
}

export async function toWslPath(path: string): Promise<string> {
  return (await executeCommand("wsl", ["wslpath", "-u", `"${path.replace(/\\/g, "/")}"`])).trim();
}

export async function toWinPath(path: string): Promise<string> {
  if (path.startsWith("\\mnt\\")) {
    return (await executeCommand("wsl", ["wslpath", "-w", `"${path.replace(/\\/g, "/").substr(0, 6)}"`])).trim() + path.substr(7);
  }
  return (await executeCommand("wsl", ["wslpath", "-w", "/"])).trim() + path;
}
