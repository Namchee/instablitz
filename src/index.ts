import { defineExtension } from 'reactive-vscode'
import { window, workspace } from 'vscode'

const { activate, deactivate } = defineExtension(async () => {
  window.showInformationMessage('Hello')

  const files = await workspace.findFiles('**/*.*', 'node_modules');
  for (const file of files) {
    console.log(file.path);
    window.showInformationMessage(file.path);
  }
});

export { activate, deactivate }
