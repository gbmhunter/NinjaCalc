===========
NinjaCalc
===========

------------------------------------------------------------------------------------------
A embedded engineering calculator suite for doing calculations in a breeze.
------------------------------------------------------------------------------------------

- Author: gbmhunter <gbmhunter@gmail.com> (http://www.mbedded.ninja)
- Created: 2015-11-02
- Last Modified: 2016-01-31
- Version: v1.0.0
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

The goal of this is to provide a easy-to-use desktop application to help you with all those small, frequent calculations you do while doing embedded engineering (or other forms of engineering). Whether it be a low-pass LC filter, a resistor divider, or even just Ohm's law (o.k., I hope you don't forget that one, but it is included none-the-less), this app makes them easy to find, use, and have confidence in the answers.


Features
--------

See the `project home page`_ for a list of features.

Installation
============

#. Download the latest installer-based release from http://mbedded-ninja.github.io/NinjaCalc/.
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

#. A Dimension object


Creating A Calculator Diagram
-----------------------------

Creating a static diagram image and laying the calculator variable UI elements overtop of this is the easiest method to create a diagram when dynamic visual changes to the diagram are not required.

All calculators that use static images for their background diagrams have a Visio file called :code:`diagram.vsd` in their respective folder. Microsoft Visio is used to create the diagram, which is then exported as an image and used inside the NinjaCalc application.

Creating An Installable Package
-------------------------------

The team at `ej-technologies <https://www.ej-technologies.com/>`_ have graciously donated me an open-source licensed version of |install4j|, `the multi-platform installer builder for Java applications 
<http://www.ej-technologies.com/products/install4j/overview.html>`_.

Myself (gbmhunter) currently holds the license for this software, and so I am the only one that can currently create installable packages for NinjaCalc releases.

The install4j script is located at :code:`/NinjaCalc.install4j`.

.. |install4j| image:: https://www.ej-technologies.com/images/product_banners/install4j_small.png


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

.. _`project home page`: http://mbedded-ninja.github.io/NinjaCalc/