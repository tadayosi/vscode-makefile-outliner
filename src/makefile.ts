import * as vscode from 'vscode';

class MakefileSymbolProvider implements vscode.DocumentSymbolProvider {
  private readonly specialTargets = [
    '.PHONY', '.SUFFIXES', '.DEFAULT', '.PRECIOUS', '.INTERMEDIATE', '.NOTINTERMEDIATE',
    '.SECONDARY', '.SECONDEXPANSION', '.DELETE_ON_ERROR', '.IGNORE', '.LOW_RESOLUTION_TIME',
    '.SILENT', '.EXPORT_ALL_VARIABLES', '.NOTPARALLEL', '.ONESHELL', '.POSIX',
  ];
  private readonly targetPattern = /^([^#\s]+)\s*:[^=]*$/;

  provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken)
    : Thenable<vscode.SymbolInformation[]> {
    return new Promise((resolve, reject) => {
      const symbols = [];

      for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        const match = line.text.match(this.targetPattern);
        if (match) {
          const target = match[1];
          // exclude special targets from outline
          if (this.specialTargets.includes(target)) {
            continue;
          }
          symbols.push(new vscode.SymbolInformation(
            target,
            vscode.SymbolKind.Field,
            '',
            new vscode.Location(document.uri, line.range)
          ));
        }
      }

      resolve(symbols);
    });
  }
}

export default MakefileSymbolProvider;
