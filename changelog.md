v?.?.?
------

- Added automatic update functionality, closes #108.
- Added a generic "Scientific Calculator", closes #98.
- Added a dew point calculator based on the Magnus equation, closes #104.
- Added NTC thermistor calculator, closes #106.
- Added splash screen, closes #109.
- Added calculator template search functionality, closes #63.
- Added scrolling to the calculator selection grid, closes #105.
- Added support for NumberUnit class to use a function for unit conversion, closes #107.
- Converted README from restructured text to markdown format, closes #103.
- Added validator to Vout on resistor divider calculator to make sure it is less than Vin, closes #46.
- Added dependant tracking for validators, so dependant validators get updated when calculator variable values change, closes #110.
- Improved the tooltip help text for variables in the "Standard Resistance Finder" calculator.
- Added warning if the "Desired Resistance" in the "Standard Resistance Finder" calculator exceeds the normal purchasable resistance range, closes #96.
- Fixed bug where the MetricPrefix library did not round correctly when no prefix was required (i.e. value is between 1-1000), closes #92.
- Fixed bug where setting V = 1V, R = 1R gives I = 1E0 in the "Ohm's Law" calculator, closes #89.
- Fixed bug where math.min.js not loaded when app is deployed, but did work when app is run from IntelliJ, closes #101.
- Fixed bug where tooltip was incorrect for "Desired Resistance" variable in "Standard Resistance Finder" calculator, closes #95.


v1.1.0
------

- Fixed position of track thickness and plane proximity variables in the IPC-2152 track thickness calculator, closes #82.
- Fixed bug where capacitance and frequency UI elements were swapped in the Low-Pass RC Filter calculator, closes #80.
- Grid images can now be passed as a relative path to a calculators constructor, closes #86.
- Added "Standard Resistance Finder" calculator, closes #87.
- Closest values from all available series are listed all at once in the standard resistance calculator, closes #88.
- Added "metric-prefix" capability so that the user can use standard metric prefixes in the calculator variable textfields directly, closes #84.

v1.0.0
------

- Changed all source code file encodings to UTF-8, closes #79.
- Added Javadoc comments to all classes, closes #64.
- Removed workspace.xml from repo (it changes very frequently), closes #69.

v0.4.1
------

- Ported low-pass RC filter calculator to Java, closes #68.
- Turned the entire grid element in the calculator selection grid into an "Open" button, closes #66.
- Moved main class outside of class name "MainWindow", closes #70.
- Added logo to installed executable, closes #71.
- The scaling of the calculator diagrams now works correctly, closes #72.
- Rendered equations in info sections of calculators, closes #73.
- Added link to install4j's website to both README and website, closes #75.
- Fixed up the equations in each calculators info section, closes #62.
- Added significant figure rounding to the numerical calculator variables, closes #76.
- User is now asked if they want to open a new calculator if all tabs are closed, closes #74.
- Renamed installer files so they follow a Name -> Version -> Platform syntax, closes #78.
- Created installer for Mac OS X, closes #77.

v0.4.0
------

- Ported application from C# to Java, closes #65.

v0.3.8
------

- Renamed "MainWindow" to "NinjaCalc", closes #57.
- Improved the image for Track Current (IPC-2152) calculator, closes #48.
- Fixed bug where you couldn't see the app icon on Windows 10 task bar, closes #36.
- Signed the application so warnings don't occur on install, closes #47.
- Added "oz" as a unit for track thickness in the IPC-2221A calculator, closes #60.
- Created a static class to hold unit conversion constants which are shared among calculators, closes #61.
- Added info about the Visio calculator diagrams to the README, closes #33.
- Added low pass RC filter calculator, closes #50.

v0.3.7
------

- Added info section to IPC-2152 track current calculator, closes #49.
- Animated the expansion/collapse of the info section, closes #51.
- Made the application startup in maximised state (full screen size), closes #53.
- Made a reusable "Info" WPF user control, closes #52.
- Added note to README about how installing new version should automatically overwrite old version, closes #54.
- Fixed bug where calculator view didn't scroll when mouse was over expanded "Info" text, closes #55.
- Added variable info to tooltip on mouseover of input textbox or combobox, closes #56.

v0.3.6
------

- Added mandatory "category" and "tag" fields to the Calculator class, closes #40.
- Made the calculator selection grid scrollable, closes #41.
- Added info to README on how to generate installer, closes #29.
- Fixed bug where only the first level of dependencies in the chain are re-calculated on variable change, closes #45.
- Added automatic rounding functionality to numerical calculator output variables, closes #44.
- Added track current calculator based on IPC-2152 standard, closes #42.

v0.3.5
------

- Fixed bug where validators where not working correctly on unit change, closes #34.
- Fixed issue where current flow symbol on the Ohm's Law calculator looked to similar to a diode symbol, closes #35.
- Moved electronic-related calculators into "electronics" parent-level folder (and namespace), closes #37.
- Added test to make sure unit change to causes dependent outputs to re-calculate, closes #38.
- Calculators now scale appropriately as window is resized, closes #39.

v0.3.4
------

- Removed CalcDiagrams folder, now using Visio drawings and placing files in relevant calculator folders.
- Made calculator selection grid expand to window size (with some fixed margin size), closes #31.
- Added a resistor divider calculator, closes #30.
- Improved the appearance of the Ohm's Law calculator diagram, closes #32.

v0.3.3
------

- Added custom default button style (blue buttons) and added white button style.
- Improved the appearance of the calculator selection grid.
- Added grid icon for the IPC2221A Track Current calculator.
- Added application icon, closes #21.

v0.3.2 
------

- Improved unit tests for Ohm's Law calculator.
- Converted CalcVars object from Dictionary to List, closes #23.
- Removed input variable to validator function, #25.
- Added correct validators to IPC2221A Track Current calculator, closes #24.
- Added visual diagram to IPC2221A Track Current calculator, which includes a top PCB layer which disappears if "External" is selected as the track layer.
- Created a re-usable WPF dimension element, closes #26.
- Fixed bug where inputs with failing validators where still o.k. (green) on initial calculator start-up, closes #27.
- Output textbox-style calculator variables no longer gray when disabled, and border gets removed (to make it obvious they are outputs).
- Added drop shadow to calculator grid elements, closes #28.

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