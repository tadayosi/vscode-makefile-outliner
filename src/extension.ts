import * as vscode from 'vscode';
import MakefileSymbolProvider from './makefile';

export function activate(context: vscode.ExtensionContext) {
  const makefile = vscode.languages.registerDocumentSymbolProvider(
    { language: 'makefile' }, new MakefileSymbolProvider()
  );
  context.subscriptions.push(makefile);
}

export function deactivate() {}
