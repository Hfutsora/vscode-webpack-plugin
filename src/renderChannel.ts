import * as vscode from "vscode";

class RenderChannel implements vscode.Disposable {
  private readonly channel: vscode.OutputChannel = vscode.window.createOutputChannel("CoRender");

  public appendLine(message: string): void {
    this.channel.appendLine(message);
  }

  public append(message: string): void {
    this.channel.append(message);
  }

  public show(): void {
    this.channel.show();
  }

  public dispose(): void {
    this.channel.dispose();
  }
}

export const renderChannel: RenderChannel = new RenderChannel();