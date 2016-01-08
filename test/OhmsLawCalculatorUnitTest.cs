using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

using NinjaCalc;

namespace NinjaCalcUnitTests {
    [TestClass]
    public class OhmsLawCalculatorUnitTest {
        [TestMethod]
        public void TestCalcVarDefaultDirection() {

            OhmsLawCalculator ohmsLawCalculator = new OhmsLawCalculator();

            Assert.AreEqual(ohmsLawCalculator.Voltage.Direction, Direction_t.Input, "Voltage did not default to an input.");
            Assert.AreEqual(ohmsLawCalculator.Current.Direction, Direction_t.Input, "Current did not default to an input.");
            Assert.AreEqual(ohmsLawCalculator.Resistance.Direction, Direction_t.Output, "Resistance did not default to an input.");

        }

        [TestMethod]
        public void TestCalcVarDirectionChanges() {

            OhmsLawCalculator ohmsLawCalculator = new OhmsLawCalculator();

            ohmsLawCalculator.Resistance.Direction = Direction_t.Output;

            Assert.AreEqual(ohmsLawCalculator.Voltage.Direction, Direction_t.Input, "Voltage did not correctly change to an input.");
            Assert.AreEqual(ohmsLawCalculator.Current.Direction, Direction_t.Input, "Current did not correctly change to an input.");
            Assert.AreEqual(ohmsLawCalculator.Resistance.Direction, Direction_t.Output, "Resistance did not correctly change to an input.");

            ohmsLawCalculator.Voltage.Direction = Direction_t.Output;

            Assert.AreEqual(ohmsLawCalculator.Voltage.Direction, Direction_t.Output, "Voltage did not correctly change to an input.");
            Assert.AreEqual(ohmsLawCalculator.Current.Direction, Direction_t.Input, "Current did not correctly change to an input.");
            Assert.AreEqual(ohmsLawCalculator.Resistance.Direction, Direction_t.Input, "Resistance did not correctly change to an input.");

            ohmsLawCalculator.Current.Direction = Direction_t.Output;

            Assert.AreEqual(ohmsLawCalculator.Voltage.Direction, Direction_t.Input, "Voltage did not correctly change to an input.");
            Assert.AreEqual(ohmsLawCalculator.Current.Direction, Direction_t.Output, "Current did not correctly change to an input.");
            Assert.AreEqual(ohmsLawCalculator.Resistance.Direction, Direction_t.Input, "Resistance did not correctly change to an input.");

        }

        [TestMethod]
        public void TestOhmsLawEquation() {

            OhmsLawCalculator ohmsLawCalculator = new OhmsLawCalculator();            

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
    }
}
