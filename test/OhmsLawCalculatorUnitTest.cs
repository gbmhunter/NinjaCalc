using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

using NinjaCalc;

namespace NinjaCalcUnitTests {
    [TestClass]
    public class OhmsLawCalculatorUnitTest {
        [TestMethod]
        public void TestCalcVarDefaultDirection() {

            OhmsLawCalculator ohmsLawCalculator = new OhmsLawCalculator();

            Assert.AreEqual(ohmsLawCalculator.CalcVars["voltage"].Direction, Direction_t.Input, "Voltage did not default to an input.");
            Assert.AreEqual(ohmsLawCalculator.CalcVars["current"].Direction, Direction_t.Input, "Current did not default to an input.");
            Assert.AreEqual(ohmsLawCalculator.CalcVars["resistance"].Direction, Direction_t.Output, "Resistance did not default to an input.");

        }
    }
}
