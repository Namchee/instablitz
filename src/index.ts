import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import * as vscode from 'vscode';

const PAYLOAD_TEMPLATE = `<html lang="en">
<head>
</head>

<body>
  <script type="module">
    import sdk from 'https://unpkg.com/@stackblitz/sdk@1/bundles/sdk.m.js';

    sdk.openProject(
      {
        title: 'JS Starter',
        description: 'Blank starter project for building ES6 apps.',
        template: 'javascript',
        files: {
          'index.html': \`< div id = "app" > </div>\`,
          'index.js': \`import './style.css';
            const appDiv = document.getElementById('app');
            appDiv.innerHTML = '<h1>JS Starter</h1>';\`,
              'style.css': \`body { font-family: system-ui, sans-serif; }\`,
        },
        settings: {
          compile: {
            trigger: 'auto',
            clearConsole: false,
          },
        },
      },
      {
        newWindow: false,
      },
    );
  </script>
</body>
</html>`;

function getPathAsSquareBrackets(filepath: string): string {
  return filepath
    .split('/')
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
        `<input type="hidden" name="project[dependencies]" value="${JSON.stringify(dependencies).replaceAll('"', '&quot;')}" />`,
      ];

      const promises = files.map(async (file) => {
        const contents = await vscode.workspace.fs.readFile(file);
        return `<input type="hidden" name="project[files]${getPathAsSquareBrackets(vscode.workspace.asRelativePath(file.fsPath))}" value="${contents.toString().replaceAll('"', '&quot;')}" />`;
      });

      const projectFiles = await Promise.all(promises);
      projectFiles.unshift(...stackblitzInputs);

      const html = PAYLOAD_TEMPLATE.replace(
        '{content}',
        projectFiles.join('\n'),
      );

      const workspacePath = vscode.workspace.workspaceFolders;
      if (!workspacePath?.length) {
        vscode.window.showErrorMessage(
          'This extension only works on a workspace',
        );
        return;
      }

      const tempFilePath = join(
        workspacePath[0].uri.fsPath,
        `temp-${vscode.workspace.name}.html`,
      );
      writeFileSync(tempFilePath, html);

      const fileUri = vscode.Uri.file(tempFilePath);
      await vscode.env.openExternal(fileUri);
    },
  );

  context.subscriptions.push(disposable);
}
