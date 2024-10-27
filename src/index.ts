import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'extension.instablitz',
    () => {
      const ws = vscode.workspace.findFiles('**/*.*', 'node_modules');
    },
  );

  context.subscriptions.push(disposable);
}
