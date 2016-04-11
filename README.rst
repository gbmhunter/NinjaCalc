===========
NinjaCalc
===========

------------------------------------------------------------------------------------------
A embedded engineering calculator suite for doing calculations in a breeze.
------------------------------------------------------------------------------------------

- Author: gbmhunter <gbmhunter@gmail.com> (http://www.mbedded.ninja)
- Created: 2015-11-02
- Last Modified: 2016-03-27
- Version: v1.1.0
- Company: mbedded.ninja
- Project: NinjaTerm
- Language: Java
- IDE: IntelliJ IDEA
- uC Model: n/a
- Computer Architecture: Any
- Operating System: Any
- Documentation Format: n/a
- License: GPLv3


Motivation
==========

The goal of this is to provide a easy-to-use desktop application to help you with all those small, frequent calculations you do while doing embedded engineering (or other forms of engineering). Whether it be a low-pass LC filter, a resistor divider, trying to find PCB track current, or even just Ohm's law (o.k., I hope you don't forget that one, but it is included none-the-less), this app makes them easy to find, use, and have confidence in the answers.


Features
========

See the `project home page`_ for a list of features.


Installation
============

#. Download the latest installer-based release from http://mbedded-ninja.github.io/NinjaCalc/.
#. Run the installer and play (or work, right?)!

Installing a newer version of NinjaCalc should automatically overwrite the old one.


Developing
==========

#. Download/clone this repository into a folder on your computer.
#. Open the project in IntelliJ (:code:`.idea/workspace.xml` file included in repo).
#. Develop!

Making Your Own Calculators
---------------------------

There are many pre-built calculator view objects to make development faster and keep a consistent look and feel across the application. These are located in :code:`src/Core/View`. This includes:

#. A Dimension object


Creating A Calculator Diagram
-----------------------------

Creating a static diagram image and laying the calculator variable UI elements overtop of this is the easiest method to create a diagram when dynamic visual changes to the diagram are not required.

All calculators that use static images for their background diagrams have a Visio file called :code:`diagram.vsd` in their respective folder. Microsoft Visio is used to create the diagram, which is then exported as an image and used inside the NinjaCalc application.

Creating Installable Packages
-----------------------------

The team at `ej-technologies <https://www.ej-technologies.com/>`_ have graciously donated me an open-source licensed version of |install4j|, `the multi-platform installer builder for Java applications 
<http://www.ej-technologies.com/products/install4j/overview.html>`_.

Myself (gbmhunter) currently holds the license for this software, and so I am the only one that can currently create installable packages for NinjaCalc releases.

The install4j script is located at :code:`/NinjaCalc.install4j`.

.. |install4j| image:: https://www.ej-technologies.com/images/product_banners/install4j_small.png

#. Open the :code:`/NinjaCalc.install4j` file in "install4j Multi-Platform Edition".
#. Update the "Version" field as appropriate.
#. Click the "Build Project" button.
#. Wait until build completes. install4j should have created installer files for each supported platform (currently Windows and Mac OS) in the :code:`install` directory.
#. Upload the installable packages to GitHub as a new release (if appropriate).
#. Update the download button links on the homepage in the :code:`gh-pages` branch of the repo to point to the new release files.

Debugging A Deployed App (Locally)
----------------------------------

You can get the :code:`System.out` and :code:`System.err` streams by running the NinjaCalc.jar file from the commandline. For example, in Windows you would type at the command-line:

::
    C:\Program Files (x86)\NinjaCal\java -jar NinjaCalc.jar

File Structure 
==============

Sorted by alphabetical order.

(root level)
------------

Contains the install4j script for generating single-file installable packages for the various operating systems.

install/
--------

The install4j script in the repo's root directory will instruct install4j to place deployment-ready NinjaCalc installers for the various operating systems here.

out/
----

IntelliJ IDEA will place output Java files when debugging/building in this directory.

src/
----

Contains the source code. This is split into the following sub-directories:

calculators/ - Contains all of the data to create each calculator type.

Core/ - Contains all the "core", non-calculator specific classes that make up the backend calculator engine and front-end visual elements.

Img/ - Contains images which are incorporated into the app.

MainWindow/ - Contains the Java code and .fxml file describing the main window of NinjaCalc.

test/ - Unit tests for each of the calculators, core modules and utility modules. The unit tests include the testing of the UI (more on this below).

Utility/ - Contains helper Java classes which are not considered "core", but still used by multiple calculators. This includes things such as a library to help you find the closest standard E-series resistance (preferred value), and a library to convert from doubles to strings with metric prefixes and back again.

Unit Tests
==========

Unit tests are under the :code:`src/test/` directory. They use the `TestFX library<https://github.com/TestFX/TestFX>`_ to test the JavaFX UI for each calculator.

Changelog
=========

See changelog.md.

Contributors
============

See the `project home page`_ for a list of contributors.

.. _`project home page`: http://mbedded-ninja.github.io/NinjaCalc/