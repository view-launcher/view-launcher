const EDITORS = {
  sublime: 'subl://open?url=file://{path}&line={line}&column={column}',
  textmate: 'txmt://open?url=file://{path}&line={line}&column={column}',
  emacs: 'emacs://open?url=file://{path}&line={line}&column={column}',
  macvim: 'mvim://open/?url=file://{path}&line={line}&column={column}',
  phpstorm: 'phpstorm://open?file={path}&line={line}&column={column}',
  webstorm: 'phpstorm://open?file={path}&line={line}&column={column}',
  idea: 'idea://open?file={path}&line={line}&column={column}',
  vscode: 'vscode://file/{path}:{line}:{column}',
  'vscode-remote': 'vscode://vscode-remote/{path}:{line}:{column}',
  'vscode-insiders': 'vscode-insiders://file/{path}:{line}:{column}',
  atom: 'atom://core/open/file?filename={path}&line={line}&column={column}',
}

export type Editor = keyof typeof EDITORS

export function editorUrl({
  editor,
  viewPath,
  line,
  column,
}: {
  editor: Editor
  viewPath: string
  line?: number
  column?: number
}): string {
  const url = EDITORS[editor].replace('{path}', encodeURIComponent(viewPath))

  return replaceColumnNumber(replaceLineNumber(url, line), column)
}

function replaceLineNumber(url: string, line?: number): string {
  return line
    ? url.replace('{line}', line.toString())
    : url.replace('&line={line}&column={column}', '').replace(':{line}:{column}', '')
}

function replaceColumnNumber(url: string, column?: number): string {
  return column
    ? url.replace('{column}', column.toString())
    : url.replace('&column={column}', '').replace(':{column}', '')
}
