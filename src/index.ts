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
      const form = new FormData();
      form.append('project[name]', projectName);
      form.append('project[description]', description);
      form.append('project[dependencies]', JSON.stringify(dependencies));
      form.append('project[template]', 'node');

      const request = await fetch('https://stackblitz.com/run', {
        method: 'POST',
        body: form,
      });

      console.log(request.ok);
      const body = await request.text();

      console.log(body);

      // for (const file of files) {
      //   const content = file.query;
      //   contents.push(
      //     `<input type="hidden" name="project[files]" value="${file.path}">`,
      //   );
      // }

      // console.log(PAYLOAD_TEMPLATE.replace('{content}', contents.join('\n')));

      // const gitignore = files.find((file) => file.path.endsWith('.gitignore'));
    },
  );

  context.subscriptions.push(disposable);
}
