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

## FAQ

### This extension doesn't work when I use Visual Studio Code inside [WSL](https://learn.microsoft.com/en-us/windows/wsl/)

There are 2 ways to solve this problem:

1. Install a web browser on the WSL environment and use it as the default handler for `.html` files
2. Use [`wslview`](https://wslutiliti.es/wslu/) to allow WSL to access host's browser.

## License

[MIT](./LICENSE.md) License © 2024 [Namchee](https://github.com/Namchee)
