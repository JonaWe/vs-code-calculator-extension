import * as vscode from 'vscode';
import { parser } from 'mathjs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const myParser = parser();

  let disposable = vscode.commands.registerCommand(
    'calculator.evaluate',
    async () => {
      const title = 'Calculator';
      const placeHolder =
        'type an expression to evaluate (e.g. 42*3 or 12 cm in feet)';
      const prompt = 'Evaluate expression';

      const input = await vscode.window.showInputBox({
        title,
        placeHolder,
        prompt,
      });

      if (input) {
        try {
          const evaluated = myParser.evaluate(input);

          const config = vscode.workspace.getConfiguration('calculator');
          const saveToClipboard = config.get('saveToClipboard');

          vscode.window.showInformationMessage(
            `Result of expression: ${evaluated}${
              saveToClipboard ? ' (saved to clipboard)' : ''
            }`
          );

          if (saveToClipboard) {
            await vscode.env.clipboard.writeText(String(evaluated));
          }
        } catch {
          vscode.window.showErrorMessage(
            `ERROR: unable to evaluate '${input}'!`
          );
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
