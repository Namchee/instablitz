import * as vscode from 'vscode';

const PAYLOAD_TEMPLATE = `<html lang="en">
<head>
</head>

<body>
  <form id="mainForm" method="post" action="https://stackblitz.com/run" target="_self">
    {content}
  </form>

  <script>
    document.getElementById("mainForm").submit();
  </script>
</body>
</html>`;

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'extension.instablitz',
    async () => {
      const name = vscode.workspace.name;

      const files = await vscode.workspace.findFiles('**/*.*', 'node_modules');
      const gitignore = files.find((file) => file.path.endsWith('.gitignore'));
    },
  );

  context.subscriptions.push(disposable);
}
