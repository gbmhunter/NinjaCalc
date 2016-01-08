v0.3.1
------

- Added first unit tests using the inbuilt Microsoft Unit Testing framework.
- Added IsGreaterThanZero() validator factory method, and added this constraint to all variables in the Ohm's Law calculator.
- Tooltips on calculator variable textboxes are now displaying the results from value validation.
- Added ComboBox-style calculator variable.
- Added Track Current (IPC2152) calculator.

v0.3.0
------

- Switched from Electron/Javascript/Node.js to C#/.NET platform.
- Updated the README appropriately (due to C# switch).
- Implemented basic "Ohm's Law" calculator.
- Validation working.
- Unit selection working correctly.
- Added basic InnoSetup installer script.

v0.2.1
------

- Added track width calculator (not operational yet).
- NinjaCalc app now has proper icon.
- Nav menu teaser is now bigger and with "justified text" button.

v0.2.0
------

- New modal view for selecting new calculator.
- Calculators are now filterable by category.
- New initial view when there are no calculators open.
- New left drawer menu with small teaser bar.
- Renamed app title to "NinjaCalc", closes #20.

v0.1.0
-------

- First release.
- Got "calc what" radio buttons working again (using Immutable-JS), closes #1.
- Made the imageSrc path variable within each calculator relative to the calculator, closes #3.
- Added expanding functionality to the calculator intros and hided them by default, closes #6.
- Stopped calculators re-rendering unless they have to (fixed serious performance issues), closes #5.
- Centered the calculator tables in the middle of their tabs, closes #11.
- Centered the text in the calculator table for the variable name and symbol, closes #10.
- Added the ability to specify the size of a calculator (e.g. small, medium, large), closes #8.
- Added rounding to calculator outputs, closes #12.
- Multiple instances of the same calculator type are now allowed to be open, closes #15.
- Clicking 'Open' on a calculator in the grid view now opens it's tab, closes #14.