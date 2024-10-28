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

export async function activate(context: vscode.ExtensionContext) {
  const files = await vscode.workspace.findFiles('**/*.*', 'node_modules');
  const packageJson = files.find((file) => file.path.endsWith('package.json'));
  if (!packageJson) {
    vscode.window.showErrorMessage(
      'This extension only works on npm-managed projects',
    );
    return;
  }

  const rawMetadata = await vscode.workspace.fs.readFile(packageJson);
  const { dependencies } = JSON.parse(rawMetadata.toString());
  console.log(dependencies);

  const name = vscode.workspace.name;

  const disposable = vscode.commands.registerCommand(
    'extension.instablitz',
    async () => {
      const files = await vscode.workspace.findFiles('**/*.*', 'node_modules');
      const packageJson = files.find((file) =>
        file.path.endsWith('package.json'),
      );
      if (!packageJson) {
        vscode.window.showErrorMessage(
          'This extension only works on npm-managed projects',
        );
        return;
      }

      const rawMetadata = await vscode.workspace.fs.readFile(packageJson);
      const { dependencies } = JSON.parse(rawMetadata.toString());
      console.log(dependencies);

      const name = vscode.workspace.name;

      // const gitignore = files.find((file) => file.path.endsWith('.gitignore'));
    },
  );

  context.subscriptions.push(disposable);
}
