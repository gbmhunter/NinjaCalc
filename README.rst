===========
NinjaCalc
===========

------------------------------------------------------------------------------------------
A embedded engineering calculator suite for doing calculations in a breeze.
------------------------------------------------------------------------------------------

- Author: gbmhunter <gbmhunter@gmail.com> (http://www.mbedded.ninja)
- Created: 2015-11-02
- Last Modified: 2016-01-07
- Version: v0.3.0
- Company: mbedded.ninja
- Project: NinjaTerm
- Language: C#, WPF, .NET
- Compiler: Visual Studio
- uC Model: n/a
- Computer Architecture: Any
- Operating System: Windows
- Documentation Format: n/a
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

Windows only...sorry Linux/iOS users!

#. Download the latest installer release from https://github.com/mbedded-ninja/NinjaCalc/releases.
#. Run the installer and play (or work, right?)!


Developing
==========

#. Download/clone this repository into a folder on your computer.
#. Open the project in Visual Studio.


File Structure 
==============

Sorted by alphabetical order.

src/
----

Contains the source code. This is split into the following sub-directories:

calculators/ - Contains all of the data to create each calculator type.

core/ - Contains all the "core", non-calculator specific classes that make up the Calculator app.

img/ - Contains images which are incorporated into the app.



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

Thanks to Michael O'Donnell (a la Mod) for sharing some of his pro-knowledge of the C#/.NET language.