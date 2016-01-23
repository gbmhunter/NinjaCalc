===========
NinjaCalc
===========

------------------------------------------------------------------------------------------
A embedded engineering calculator suite for doing calculations in a breeze.
------------------------------------------------------------------------------------------

- Author: gbmhunter <gbmhunter@gmail.com> (http://www.mbedded.ninja)
- Created: 2015-11-02
- Last Modified: 2016-01-21
- Version: v0.3.7
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

See the `project home page`_ for a list of features.

Installation
============

Windows only...sorry Linux/iOS users!

#. Download the latest installer release from https://github.com/mbedded-ninja/NinjaCalc/releases.
#. Run the installer and play (or work, right?)!

Installing a newer version of NinjaCalc should automatically overwrite the old one.


Developing
==========

#. Download/clone this repository into a folder on your computer.
#. Open the project in Visual Studio.
#. Develop!

Making Your Own Calculators
---------------------------

There are many pre-built calculator view objects to make development faster and keep a consistent look and feel across the application. These are located in :code:`src/Core/View`. This includes:

- CalcInfo.xaml: A WPF user control for created an expandable/collapsible "Info" section to a calculator. Supports children (normally you would add a textblock as a child element).
- ClippingBorder.cs: Support for creating rounded borders which clip their content. Used in the "Selected Calculator" grid object.
- Dimension.xaml: A WPF user control for adding a dimension to a calculator diagram. Supports the :code:`Length` property to change it's length.
- MarginSetter.cs: Add the property :code:`MarginSetter.Margin="10"` to any UI element, and it will set all the elements children to have a margin of :code:`10`. Used in the "Selected Calculator" grid object.

Creating An Installable Package
-------------------------------

This project uses the free installer `Inno Setup`_ to bundle the built application files into a single .exe installable package for Windows machines.

The Inno Setup script is stored at :code:`install/InnoSetupScript.iss`.

The easiest way to generate an installable package is to:

#. Open this project in Visual Studio.
#. Make sure the configuration is set to "Release".
#. Build the project.
#. Run "Inno Script Studio" (downloadable with Inno Setup), and open the script file :code:`install/InnoSetupScript.iss`.
#. Press the "Run" button from within Inno Script Studio.
#. Done! All going well, an executable called "setup.exe" should of been created in :code:`install/Output/`. 

.. _`Inno Setup`: http://www.jrsoftware.org/isinfo.php


File Structure 
==============

Sorted by alphabetical order.

install/
--------

Contains the Inno Setup script for generating a single-file installable package (.exe). When this .exe is generated, it is placed into :code:`install/Output/` by the setup script.

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

See the `project home page`_ for a list of contributors.

.._`project home page`: http://mbedded-ninja.github.io/NinjaCalc/