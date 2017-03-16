# NinjaCalc

#### A embedded engineering calculator suite for doing calculations in a breeze.

- Author: gbmhunter <gbmhunter@gmail.com> ([www.mbedded.ninja](http://www.mbedded.ninja))
- Created: 2015-11-02
- Last Modified: 2017-03-09
- Version: v2.0.0
- Company: mbedded.ninja
- Project: NinjaTerm
- Language: Javascript (vue.js)/HTML/CSS
- IDE: WebStorm
- Documentation Format: JSDoc
- License: GPLv3

# Motivation

The goal of this is to provide a easy-to-use web application to help you with all those small, frequent calculations you do while doing embedded engineering (or other forms of engineering). Whether it be a low-pass LC filter, a resistor divider, trying to find PCB track current, or even just Ohm's law (o.k., I hope you don't forget that one, but it is included none-the-less), this app makes them easy to find, use, and have confidence in the answers.

# To Use

Go to http://ninja-calc.mbedded.ninja/

# Features

See the [project home page](http://mbedded-ninja.github.io/NinjaCalc/) for a list of features.

# Developing

1. Download/clone this repository into a folder on your computer.
1. Run `npm install` to install dependencies (make sure node/npm is installed on your system).
1. Open the project in WebStorm (`.idea/workspace.xml` file included in repo), or your favourite text/code editor.
1. Develop!

# Releasing

1. Make sure you are on the `develop` branch and all changes from `feature/xxx` branches have been merged into it.
1. Update `changelog.md` with a list of changes since the last release, under a heading which is the new version number (e.g. `v1.2.0`).
1. Commit the changes made above to the `develop` branch.
1. Merge the `develop` branch into the `master` branch. **MAKE SURE** that you create a new commit while doing this, even if fast-forward is possible.
1. Tag the commit on the master branch with the version number (e.g. `v1.2.0`).
1. Push all branches to the remote GitHub repo. Heroku will automatically build and deploy the new version committed onto the `master` branch.

# Changelog

See [changelog.md](../blob/master/changelog.md).

# Contributors

See the [project home page](http://mbedded-ninja.github.io/NinjaCalc/) for a list of contributors.
