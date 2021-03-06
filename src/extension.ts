import * as vscode from 'vscode';
import { parser } from 'mathjs';

export function activate(context: vscode.ExtensionContext) {
  const myParser = parser();

  let resetCommand = vscode.commands.registerCommand('calculator.reset', () => {
    myParser.clear();
    vscode.window.showInformationMessage('Calculator cleared!');
  });

  let evaluateCommand = vscode.commands.registerCommand(
    'calculator.evaluate',
    async () => {
      const config = vscode.workspace.getConfiguration('calculator');
      const notifications = !config.get('disableResultNotifications');
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

          const saveToClipboard = config.get('saveToClipboard');

          if (notifications) {
            vscode.window.showInformationMessage(
              `Result of expression: ${evaluated}${
                saveToClipboard ? ' (saved to clipboard)' : ''
              }`
            );
          }

          if (saveToClipboard) {
            await vscode.env.clipboard.writeText(String(evaluated));
          }
        } catch {
          if (notifications) {
            vscode.window.showErrorMessage(
              `ERROR: unable to evaluate '${input}'!`
            );
          }
        }
      }
    }
  );

  context.subscriptions.push(evaluateCommand, resetCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {}
