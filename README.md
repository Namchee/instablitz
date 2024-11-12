# InstaBlitz

<a href="https://marketplace.visualstudio.com/items?itemName=Namchee.instablitz" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/Namchee.instablitz.svg?color=eee&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>

Export your Visual Studio Code workspace as a [StackBlitz](https://www.stackblitz.com) WebContainer project using [StackBlitz SDK](https://developer.stackblitz.com/platform/api/javascript-sdk) through the web browser.

> You still need to fork the project to your StackBlitz account to save it.

## Commands

<!-- commands -->
| Command                | Title                                             |
| ---------------------- | ------------------------------------------------- |
| `extension.instablitz` | InstaBlitz: Share current workspace on StackBlitz |
<!-- commands -->

## Caveats

1. Since StackBlitz SDK [doesn't support non plain-text files](https://developer.stackblitz.com/platform/api/javascript-sdk-options#projectfiles), all files that are not [UTF-8](https://en.wikipedia.org/wiki/UTF-8) encoded will be ignored. This behavior may cause the project to 'break'.
2. StackBlitz SDK doesn't support [Environment Variables](https://developer.stackblitz.com/teams/environment-variables#frontmatter-title) as it's a [StackBlitz Teams](https://developer.stackblitz.com/teams/what-is-stackblitz-teams) feature. Moreover, this extension will export everything that isn't `node_modules`, including secrets such as `.env` files.

## FAQ

### This extension doesn't work when I use Visual Studio Code inside [WSL](https://learn.microsoft.com/en-us/windows/wsl/)

There are 2 ways to solve this problem:

1. Install a web browser on the WSL environment and use it as the default handler for `.html` files
2. Use [`wslview`](https://wslutiliti.es/wslu/) to allow WSL to access host's browser.

## License

[MIT](./LICENSE.md) License © 2024 [Namchee](https://github.com/Namchee)
