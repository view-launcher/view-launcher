# ViewLauncher
A tiny lib for inspecting and opening view files in your code editor ***from browsers directly***.

## Why
When you're working on a rather large project, you may have lots of views, whenever you want to make a change to a specific view, you have to figure out where it was located first.

Even if you just want to change a single letter of the view, you have to first find out the view, to me, this is **super tedious and unproductive**‼
Especially when collaborating with other people, chances are that you'll have a hard time finding the view file…

This package provides you a simple way to locate the view file.
Just click the HTML element from the browser, it'll jump to the view file in your code editor automagically.

Kind of like a "sourcemap of markup", helps you inspect your view at light speed ⚡⚡️️

## Installation 📦
```js
import { viewLauncher } from 'view-launcher'

const options = {
  theme: 'light',
  editor: 'vscode',
  shortcuts: {
    open: 'd',
    inspect: 'a a',
    inspectComponent: 'c c',
    inspectParent: 'up',
  },
}

viewLauncher(options)
```

For framework specific installation see:
* [Vue](https://github.com/view-launcher/vue-view-launcher)
* [Laravel Blade](https://github.com/view-launcher/blade-view-launcher)

## Supported Editors
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
It'll find all the elements which has the `data-tag-info` attribute, make them inspectable via the `Options.shortcuts`.

An example of the value of `data-tag-info` attribute may look like this:
```json
{
  "view": "/path/to/the/view/file",
  "line": 100,
  "column": 23,
  "component": "Modal"
}
```

The lib uses the information taken from `data-tag-info` to open the view file. 
