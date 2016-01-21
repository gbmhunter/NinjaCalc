// SYSTEM INCLUDES
using System;
using System.Windows.Controls;
using Microsoft.VisualStudio.TestTools.UnitTesting;

using NinjaCalc;

namespace NinjaCalcUnitTests {

    [TestClass]
    public class OhmsLawCalculatorUnitTest {
        [TestMethod]
        public void TestCalcVarDefaultDirection() {

            var ohmsLawCalculator = new NinjaCalc.Calculators.Electronics.Basic.OhmsLaw.OhmsLawCalcModel();

            Assert.AreEqual(ohmsLawCalculator.Voltage.Direction, Directions.Input, "Voltage did not default to an input.");
            Assert.AreEqual(ohmsLawCalculator.Current.Direction, Directions.Input, "Current did not default to an input.");
            Assert.AreEqual(ohmsLawCalculator.Resistance.Direction, Directions.Output, "Resistance did not default to an input.");

        }

        [TestMethod]
        public void TestCalcVarDirectionChanges() {

            var ohmsLawCalculator = new NinjaCalc.Calculators.Electronics.Basic.OhmsLaw.OhmsLawCalcModel();

            ohmsLawCalculator.Resistance.Direction = Directions.Output;

            Assert.AreEqual(ohmsLawCalculator.Voltage.Direction, Directions.Input, "Voltage did not correctly change to an input.");
            Assert.AreEqual(ohmsLawCalculator.Current.Direction, Directions.Input, "Current did not correctly change to an input.");
            Assert.AreEqual(ohmsLawCalculator.Resistance.Direction, Directions.Output, "Resistance did not correctly change to an input.");

            ohmsLawCalculator.Voltage.Direction = Directions.Output;

            Assert.AreEqual(ohmsLawCalculator.Voltage.Direction, Directions.Output, "Voltage did not correctly change to an input.");
            Assert.AreEqual(ohmsLawCalculator.Current.Direction, Directions.Input, "Current did not correctly change to an input.");
            Assert.AreEqual(ohmsLawCalculator.Resistance.Direction, Directions.Input, "Resistance did not correctly change to an input.");

            ohmsLawCalculator.Current.Direction = Directions.Output;

            Assert.AreEqual(ohmsLawCalculator.Voltage.Direction, Directions.Input, "Voltage did not correctly change to an input.");
            Assert.AreEqual(ohmsLawCalculator.Current.Direction, Directions.Output, "Current did not correctly change to an input.");
            Assert.AreEqual(ohmsLawCalculator.Resistance.Direction, Directions.Input, "Resistance did not correctly change to an input.");

        }

        [TestMethod]
        public void TestOhmsLawEquation() {

            var ohmsLawCalculator = new NinjaCalc.Calculators.Electronics.Basic.OhmsLaw.OhmsLawCalcModel();           

            ohmsLawCalculator.Voltage.RawVal = 1;
            ohmsLawCalculator.Current.RawVal = 1;
            Assert.AreEqual(ohmsLawCalculator.Resistance.RawVal, 1, 0.001, "Resistance was not calculated correctly.");

            ohmsLawCalculator.Voltage.RawVal = 2;
            ohmsLawCalculator.Current.RawVal = 1;
            Assert.AreEqual(ohmsLawCalculator.Resistance.RawVal, 2, 0.001, "Resistance was not calculated correctly.");

            ohmsLawCalculator.Voltage.RawVal = 1;
            ohmsLawCalculator.Current.RawVal = 2;
            Assert.AreEqual(ohmsLawCalculator.Resistance.RawVal, 0.5, 0.001, "Resistance was not calculated correctly.");

        }

        [TestMethod]
        public void TestUnitChangeCausesRecalc() {

            var ohmsLawCalculator = new NinjaCalc.Calculators.Electronics.Basic.OhmsLaw.OhmsLawCalcModel();

            ohmsLawCalculator.Voltage.RawVal = 1;
            ohmsLawCalculator.Current.RawVal = 1;

            // Get the default unit selection for the voltage
            NinjaCalc.Core.NumberUnit selUnit = ohmsLawCalculator.Voltage.SelUnit;

            Assert.AreEqual(selUnit.Name, "V", "Ohm's law voltage units did not default to \"V\".");
            Assert.AreEqual(selUnit.Multiplier, 1.0, 0.001, "Ohm's law voltage units did not default to \"V\".");

            // Now change the units for the voltage
            ohmsLawCalculator.Voltage.SetUnits("mV");

            // Make sure the resistance has changed appropriately
            Assert.AreEqual(ohmsLawCalculator.Resistance.RawVal, 0.001, 0.001, "Resistance was not calculated correctly when voltage units where changed.");

        }
    }
}
