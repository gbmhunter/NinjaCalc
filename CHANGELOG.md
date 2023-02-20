# Changelog

## [v3.4.6]

* Fixed incorrect imperial unit display of 'mill' to 'mil' in the IPC2151 track current calculator.
* Plane proximity input value is disabled if "is plane present" select is set to False in the IPC2151 track current calculator.

## [v3.4.5](https://github.com/gbmhunter/NinjaCalc/tree/v3.4.5) (2023-02-19)

### Features

* Added mill (imperial) units to the Minimum Track Width variable of the IPC-2152 Calculator.
* Added a CHANGELOG.

## [v3.4.2](https://github.com/gbmhunter/NinjaCalc/tree/v3.4.2) (2018-04-27)

### Features

* Provided useful template code for 'custom process' option in the PID tuner, closes #172.
* Added info section to the PID tuner.

### Fixed

* Fixed bug where deployment did not work correctly without first deleting everything under ninja-calc dir on server, closes #160. Fixed by removing '--ignore-existing' flag in call to rsync.
* Default process for PID tuner is now the spring-mass-damper system.
* Fixed bug in where changes to process code was not being loaded into the PID tuner.