import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { isUtf8 } from 'node:buffer';

import * as vscode from 'vscode';

const PAYLOAD_TEMPLATE = `<html lang="en">
<head>
</head>

<body>
  <script type="module">
    import sdk from 'https://unpkg.com/@stackblitz/sdk@1/bundles/sdk.m.js';

    sdk.openProject(
      {project},
      {
        newWindow: false,
      },
    );
  </script>
</body>
</html>
`;

type StackblitzProject = {
  name: string;
  description?: string;
  files: Record<string, string>;
  template: 'node';
  settings?: {
    compile?: {
      trigger?: 'auto' | 'save' | 'keystroke';
    };
  };
};

export async function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'extension.instablitz',
    async () => {
      const workspacePath = vscode.workspace.workspaceFolders;
      if (!workspacePath?.length) {
        vscode.window.showErrorMessage(
          'This extension only works on a workspace',
        );
        return;
      }

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

      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Exporting current workspace to StackBlitz...',
        },
        async () => {
          const rawMetadata = await vscode.workspace.fs.readFile(packageJson);
          const { name, description } = JSON.parse(rawMetadata.toString());

          const projectName = name || vscode.workspace.name;

          const stackblitzProject: StackblitzProject = {
            name: projectName,
            template: 'node',
            files: {},
            settings: {
              compile: {
                trigger: 'auto',
              },
            },
          };

          if (description) {
            stackblitzProject.description = description;
          }

          const promises = files.map(async (file) => {
            try {
              const buffer = await vscode.workspace.fs.readFile(file);

              if (!isUtf8(buffer)) {
                return null;
              }

              return {
                name: vscode.workspace.asRelativePath(file.fsPath),
                content: buffer.toString(),
              };
            } catch (_) {
              return null;
            }
          });

          const projectFiles = (await Promise.all(promises)).filter(
            (file) => file !== null,
          );
          for (const file of projectFiles) {
            stackblitzProject.files[file.name] = file.content;
          }

          const html = PAYLOAD_TEMPLATE.replace(
            '{project}',
            JSON.stringify(stackblitzProject, null, 2).replace(
              /<\/script>/g,
              '<\\/script>',
            ),
          );

          const tempFilePath = join(
            workspacePath[0].uri.fsPath,
            `temp-${vscode.workspace.name}.html`,
          );

          writeFileSync(tempFilePath, html);

          const fileUri = vscode.Uri.file(tempFilePath);
          await vscode.env.openExternal(fileUri);
        },
      );
    },
  );

  context.subscriptions.push(disposable);
}
