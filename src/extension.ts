import * as vscode from 'vscode';
import { evaluate } from 'mathjs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'calculator.evaluate',
    () => {
      vscode.window
        .showInputBox({
          title: 'Calculator',
          placeHolder: 'type an expression to evaluate',
          prompt: 'Evaluate expression',
        })
        .then((input) => {
          if (input) {
            try {
              const evaluated = evaluate(input);
              vscode.window.showInformationMessage(
                `Result of expression: ${evaluated}`
              );
            } catch {
              vscode.window.showErrorMessage(
                `ERROR: unable to evaluate '${input}'!`
              );
            }
          }
        });
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
