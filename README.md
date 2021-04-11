<div align="center">
    <img src="https://user-images.githubusercontent.com/13927101/113034395-00a3f380-91cd-11eb-8c73-783c54ce2c2b.png" width="160" height="160">
    <h1>ViewLaucher</h1>A tool for inspecting and opening view files in your code editor <strong><i>from browsers directly</i></strong>.
    <img src="https://user-images.githubusercontent.com/13927101/114289081-1c05dd00-9ab0-11eb-8837-842b171f5db7.gif" width="100%">
</div>

<div align="center">
    <img src="https://img.shields.io/npm/v/view-launcher" alt="version">
    <img src="https://img.shields.io/npm/l/view-launcher" alt="license">
    <img src="https://img.shields.io/badge/</>-TypeScript-blue.svg" alt="TypeScript">
</div>

## Table of Contents
- [Motivation](#motivation)
- [Demo](#demo)
- [Usage](#-usage)
- [Options](#%EF%B8%8F-options)
- [Supported Editors](#%EF%B8%8F-supported-editors)
- [How does it work?](#-how-does-it-work)
- [Contribution](#contribution)

## Motivation
When you're working on a rather large project, you may have lots of views, whenever you want to make a change to a specific view, you have to figure out where it was located first.

Even if you just want to change a single letter of the view, you have to first find out the view, to me, this is **super tedious and unproductive**‼
Especially when collaborating with other people, chances are that you'll have a hard time finding the view file…

This package provides you a simple way to locate the view file.
Just click the HTML element from the browser, it'll jump to the view file in your code editor automagically.

Kind of like a "sourcemap of markup", helps you inspect your view at light speed ⚡⚡️️

## Demo
A full demo(for [Vue.js](https://vuejs.org/) using [Vite](https://vitejs.dev/)) can be found at the [playground](https://github.com/view-launcher/view-launcher/tree/master/playground) directory.
If you'd like to have it a try, just cd into `playground` run `yarn dev`.

The default shortcuts for inspecting elements are:

| Key   | Action                                                   |
|-------|----------------------------------------------------------|
| `A A` | Toggle inspect mode                                      |
| `C C` | Toggle inspect mode, but only inspect components         |
| `D`   | Open with your editor(the default setting is VSCode)     |
| `E`   | Inspect the parent element of current inspecting element |


## 🔰 Usage
Notice: This is the usage guide for client-side lib of ViewLauncher.  
For framework specific installation guide see:
* [Vue.js](https://github.com/view-launcher/vue-view-launcher) (Rollup/Vite/Webpack)
* [Laravel Blade](https://github.com/view-launcher/blade-view-launcher)

You can ignore this if you are using one of the above packages, you are going to have the same options in there.

```js
import { viewLauncher } from 'view-launcher'

const options = {
  theme: 'light',
  editor: 'vscode',
  shortcuts: {
    open: 'd',
    inspect: 'a a',
    inspectComponent: 'c c',
    inspectParent: 'e',
  },
}

viewLauncher(options)
```

## ⚙️ Options
The following options are available.

```ts
type Options = {
  /**
   * The color theme to be used.
   */
  theme: 'dark' | 'light'

  /**
   * The editor you'd like to use.
   */
  editor: Editor

  /**
   * The shortcuts settings.
   * see the link below for the possible values.
   * @link https://github.com/ccampbell/mousetrap
   */
  shortcuts: {
    /**
     * Open the editor.
     */
    open: string

    /**
     * Toggle inspect mode.
     */
    inspect: string

    /**
     * Toggle inspect mode, but only inspect components.
     */
    inspectComponent: string

    /**
     * Inspect the parent element of current inspecting element.
     */
    inspectParent: string
  }
}
```

## ✏️ Supported Editors
* `sublime`
* `textmate`
* `emacs`
* `macvim`
* `phpstorm`
* `webstorm`
* `idea`
* `vscode`
* `vscode-insiders`
* `atom`

## 💡 How does it work?
Elements where have the `data-tag-info` attribute will be marked as "inspectable elements".

An example of the value of `data-tag-info` attribute may look like this:
```json
{
  "view": "/path/to/the/view/file",
  "line": 100,
  "column": 23,
  "component": "Modal"
}
```

ViewLauncher(client-side lib) is going to use the information taken from `data-tag-info` to open the view files.  
The `data-tag-info` attribute should be injected automatically at the compile-time of view file.  
For instance, in the case of Vue-SFC, `data-tag-info` attributes are injected at the load/transform stage of your bundler.

## Contribution
PR is always welcomed. Let me know if you are considering implementing any new support for other template languages 🖐🏼.
