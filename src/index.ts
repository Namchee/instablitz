import { rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, sep } from 'node:path';
import * as vscode from 'vscode';

const PAYLOAD_TEMPLATE = `<html lang="en">
<head>
</head>

<body>
  <form id="mainForm" method="post" action="https://stackblitz.com/run" target="_self">
    {content}
    <input type="hidden" name="project[template]" value="node">
  </form>

  <script>
    document.getElementById("mainForm").submit();
  </script>
</body>
</html>`;

function getPathAsSquareBrackets(filepath: string): string {
  return filepath
    .split(sep)
    .map((p) => `[${p}]`)
    .join('');
}

export async function activate(context: vscode.ExtensionContext) {
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
      const { name, description, dependencies } = JSON.parse(
        rawMetadata.toString(),
      );

      const projectName = name || vscode.workspace.name;

      const stackblitzInputs = [
        `<input type="hidden" name="project[title]" value="${projectName}" />`,
        `<input type="hidden" name="project[description]" value="${description}" />`,
        `<input type="hidden" name="project[dependencies]" value="${JSON.stringify(dependencies)}" />`,
        `<input type="hidden" name="project[template]" value="node" />`,
      ];

      const promises = files.map(async (file) => {
        const contents = await vscode.workspace.fs.readFile(file);
        return `<input type="hidden" name="project[files]${getPathAsSquareBrackets(vscode.workspace.asRelativePath(file.fsPath))}" value="${contents.toString()}" />`;
      });

      const projectFiles = await Promise.all(promises);
      projectFiles.unshift(...stackblitzInputs);

      const html = PAYLOAD_TEMPLATE.replace(
        '{content}',
        projectFiles.join('\n'),
      );

      console.log(html);

      const tempFilePath = join(tmpdir(), `temp-${vscode.workspace.name}.html`);
      writeFileSync(tempFilePath, html);

      const fileUri = vscode.Uri.file(tempFilePath);
      await vscode.env.openExternal(fileUri);

      rmSync(tempFilePath);
    },
  );

  context.subscriptions.push(disposable);
}
