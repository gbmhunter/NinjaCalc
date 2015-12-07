===========
NinjaCalc
===========

------------------------------------------------------------------------------------------
A embedded engineering calculator suite that's got your back.
------------------------------------------------------------------------------------------

- Author: gbmhunter <gbmhunter@gmail.com> (http://www.mbedded.ninja)
- Created: 2015-11-02
- Last Modified: 2015-12-06
- Version: v0.2.0
- Company: mbedded.ninja
- Project: NinjaTerm
- Language: HTML, js, jsx, LESS
- Compiler: gulp-based system
- uC Model: Any
- Computer Architecture: Any
- Operating System: Windows/Linux/iOS
- Documentation Format: Doxygen
- License: GPLv3

Motivation
==========

The goal of this is to provide a easy-to-use desktop application to help you with all those small, frequent calculations you do while doing embedded engineering (or other forms of engineering). Whether it be a low-pass LC filter, a resistor divider, or even just Ohm's law (o.k., I hope you don't forget that one, but it is included none-the-less), this app makes them easy to find, use, and have confidence in the answers.

Features
--------

- Suite of useful embedded-engineering related calculators.
- As-you-type updating
- Dynamic unit-changing support (including various metric and imperial units).
- Continuously checking validators which make sure calculator variables are within range and sensible.
- Powerful and compact language for describing new calculators, making it easy to add your own if so wanted!

Installation
============

The Windows method:
-------------------

#. Download the latest release installer from https://github.com/mbedded-ninja/NinjaCalc/releases.
#. Run the installer and done!

The Cross-platform Method (Windows, Linux, MacOS):
--------------------------------------------------

#. Install node (npm comes bundled with it), and make sure npm is on the system PATH variable.
#. Download/clone this repository into a folder on your computer.
#. Open a terminal/console window and navigate to the repo's root directory. All the following commands are to be executed from here.
#. Run the command :code:`npm install`. Go make yourself a hot drink, this may take 1-5minutes.
#. Run the command :code:`npm run compile`.
#. Run the command :code:`npm start`. NinjaTerm should open.

Developing
==========

#. Install node_ (npm comes bundled with it), and make sure npm is available via the system PATH.
#. Make sure git is installed and available via the system PATH.
#. Download/clone this repository into a folder on your computer.
#. Open a terminal/console window and navigate to the repo's root directory. All the following commands are to be executed from here.
#. Run the command :code:`npm install`. Go make yourself a hot drink, this may take 1-5minutes.
#. Run the command :code:`npm run compile-watch`. This should not return to the prompt (do not quit).
#. In a separate terminal window, run :code:`npm start` from the repo root directory. The NinjaTerm app should open in development mode.
#. Develop! (hit :code:`Ctrl-R` to refresh Electron window with latest code changes).

.. _node: https://nodejs.org/en/

Creating Installers
-------------------

#. Type :code:`npm run release` from the repo root directory.
#. Go make a coffee (or soy latte, no judging) and enjoy the next 5-10 minutes before coming back to find an installer! An installer will be made for the operating system you are currently running on.



File Structure 
==============

Sorted by alphabetical order.

build/
------

The output directory that compiled .less and .jsx files are placed when :code:`npm compile` is run. This folder is similar to the :code:`src/` directory, except that some files are replaced with their compiled versions.

dist/
-----

This is the folder that the platform-specific single-file installers are created in. This is last part of the build process. Squirrel is the framework used to create the installer. 

misc/
-----

Miscellaneous files.

releases/
---------

This is where the packaged files get generated, when electron-packager is run. These are platform-specific packages which can be run by double clicking the executable (or the equivalent method applicable to the operating system). This folder does not contain a single installer file (see :code:`dist/`).

src/
----

Contains the source code. This is split into the following sub-directories:

actions/ - Contains all the "actions" (aka events) that are recognised by the Redux-based state machine.

calculators/ - Contains all of the data to create each calculator type.

components/ - Contains custom re-usable react components which are used by the view objects.

img/ - Contains images which are incorporated into the app.

lib/ - Contains all 3rd party code libraries which are not managed as npm dependencies.

misc/ - Contains miscellaneous and generic Javascript helper functions (e.g. string padding functions) which are (or can be) used by many modules. 

modules/ - Non-third party javascript modules that are used by the view. Anything that is not specifically 'view' related, but is used by the view (perhaps in many places), should go in here.

reducers/ - Contains the "reducers" for the Redux-based state machine. They take in the current state and an action which has occurred, and return the next state.

style/ - Contains the :code:`.less` files which style the app. :code:`.less` files in :code:`src/` get compiled into :code:`.css` files in :code:`build/` as part of the compile step.


Code Dependencies
=================

Code dependencies are listed in the package.json, as per the typical npm way of doing things.

Changelog
=========

See changelog.md.

Contributors
============

Thanks to Phillip Abplanalp and Zac Frank for user-interaction guidance and tips!

Thanks to alexcurtis_ for the time and effort he put into the `react-treebeard`_ module.

.. _alexcurtis: https://github.com/alexcurtis
.. _`react-treebeard`: https://github.com/alexcurtis/react-treebeard

Thanks to the kids at Facebook_ for the great react framework.

.. _Facebook: https://facebook.github.io/react/