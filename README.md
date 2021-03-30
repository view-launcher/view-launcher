<div align="center">
    <img src="https://user-images.githubusercontent.com/13927101/113034395-00a3f380-91cd-11eb-8c73-783c54ce2c2b.png" width="160" height="160">
    <h1>ViewLaucher</h1>A tool for inspecting and opening view files in your code editor <strong><i>from browsers directly</i></strong>.
    <img src="https://user-images.githubusercontent.com/13927101/113040393-afe3c900-91d3-11eb-89c7-c279f34ef2f5.gif" width="100%">
</div>

<div align="center">
    <img src="https://img.shields.io/npm/v/view-launcher" alt="version">
    <img src="https://img.shields.io/npm/l/view-launcher" alt="license">
    <img src="https://img.shields.io/badge/</>-TypeScript-blue.svg" alt="TypeScript">
</div>


## Motivation
When you're working on a rather large project, you may have lots of views, whenever you want to make a change to a specific view, you have to figure out where it was located first.

Even if you just want to change a single letter of the view, you have to first find out the view, to me, this is **super tedious and unproductive**‼
Especially when collaborating with other people, chances are that you'll have a hard time finding the view file…

This package provides you a simple way to locate the view file.
Just click the HTML element from the browser, it'll jump to the view file in your code editor automagically.

Kind of like a "sourcemap of markup", helps you inspect your view at light speed ⚡⚡️️

## 📦 Installation
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

For framework specific installation see:
* [Vue](https://github.com/view-launcher/vue-view-launcher)
* [Laravel Blade](https://github.com/view-launcher/blade-view-launcher)

## ✏️ Supported Editors
* `sublime`
* `textmate`
* `emacs`
* `macvim`
* `phpstorm`
* `idea`
* `vscode`
* `vscode-insiders`
* `atom`

## How does it work?
Elements have the `data-tag-info` attribute will be marked as "inspectable elements".

An example of the value of `data-tag-info` attribute may look like this:
```json
{
  "view": "/path/to/the/view/file",
  "line": 100,
  "column": 23,
  "component": "Modal"
}
```

view-launcher uses the information taken from `data-tag-info` to open the view files. 
