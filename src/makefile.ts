import * as vscode from 'vscode';

class MakefileSymbolProvider implements vscode.DocumentSymbolProvider {
  private readonly specialTargets = [
    '.PHONY', '.SUFFIXES', '.DEFAULT', '.PRECIOUS', '.INTERMEDIATE', '.NOTINTERMEDIATE',
    '.SECONDARY', '.SECONDEXPANSION', '.DELETE_ON_ERROR', '.IGNORE', '.LOW_RESOLUTION_TIME',
    '.SILENT', '.EXPORT_ALL_VARIABLES', '.NOTPARALLEL', '.ONESHELL', '.POSIX',
  ];
  private readonly targetPattern = /^([^#\s]+)\s*:[^=]*$/;
  private readonly variablePattern = /^([^:#=\s]+)\s*(=|:=|::=|:::=|[?]=).*$/;
  private readonly functionPattern = /^define ([^:#=\s]+)\s*$/;

  provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken)
    : Thenable<vscode.SymbolInformation[]> {
    return new Promise((resolve, reject) => {
      const symbols: vscode.SymbolInformation[] = [];

      for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        if (this.matchTarget(document, line, symbols)) {
          continue;
        }
        if (this.matchVariable(document, line, symbols)) {
          continue;
        }
        this.matchFunction(document, line, symbols);
      }

      resolve(symbols);
    });
  }

  private matchTarget(
    document: vscode.TextDocument,
    line: vscode.TextLine,
    symbols: vscode.SymbolInformation[],
  ): boolean {
    const match = line.text.match(this.targetPattern);
    if (!match) {
      return false;
    }

    const target = match[1];
    // exclude special targets from outline
    if (this.specialTargets.includes(target)) {
      return true;
    }

    symbols.push(new vscode.SymbolInformation(
      target,
      vscode.SymbolKind.Field,
      '',
      new vscode.Location(document.uri, line.range)
    ));
    return true;
  }

  private matchVariable(
    document: vscode.TextDocument,
    line: vscode.TextLine,
    symbols: vscode.SymbolInformation[],
  ): boolean {
    const match = line.text.match(this.variablePattern);
    if (!match) {
      return false;
    }

    const variable = match[1];

    symbols.push(new vscode.SymbolInformation(
      variable,
      vscode.SymbolKind.Variable,
      '',
      new vscode.Location(document.uri, line.range)
    ));
    return true;
  }

  private matchFunction(
    document: vscode.TextDocument,
    line: vscode.TextLine,
    symbols: vscode.SymbolInformation[],
  ): boolean {
    const match = line.text.match(this.functionPattern);
    if (!match) {
      return false;
    }

    const func = match[1];

    symbols.push(new vscode.SymbolInformation(
      func,
      vscode.SymbolKind.Function,
      '',
      new vscode.Location(document.uri, line.range)
    ));
    return true;
  }
}

export default MakefileSymbolProvider;
