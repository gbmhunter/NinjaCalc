// SYSTEM INCLUDES
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

// USER INCLUDES
using NinjaCalc.Core;
using NinjaCalc.Calculators.Electronics.Basic.OhmsLaw;

namespace NinjaCalc.Calculators.Electronics.Basic.OhmsLaw
{
    public class OhmsLawCalculator : Calculator {

        public CalcVarNumerical Voltage {
            get;
            set;
        }

        public CalcVarNumerical Current {
            get;
            set;
        }

        public CalcVarNumerical Resistance {
            get;
            set;
        }

        public OhmsLawCalculator()
            : base(
            "Ohm's Law",
            "The hammer in any electrical engineers toolbox. Calculate voltage, resistance and current using Ohm's law.",
            "pack://application:,,,/Calculators/Electronics/Basic/OhmsLaw/icon.png",
            new OhmsLawView()) {

            var view = (OhmsLawView)this.View;

            //===============================================================================================//
            //============================================ VOLTAGE ==========================================//
            //===============================================================================================//
            
            this.Voltage = new CalcVarNumerical(
                    "voltage",
                    view.TextBoxVoltageValue,
                    view.VoltageUnits,
                    view.RadioButtonVoltage,
                    //this.CalcVars,
                    () => {
                        var current = this.Current.RawVal;
                        var resistance = this.Resistance.RawVal;
                        return current * resistance;
                    },
                    new NumberUnit[]{
                        new NumberUnit("mV", 1e-3),
                        new NumberUnit("V", 1e0, NumberPreference.DEFAULT),
                        new NumberUnit("kV", 1e3),
                    },
                    Directions.Input,
                    null);

            // Add validators
            this.Voltage.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.Voltage.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            this.CalcVars.Add(this.Voltage);

            //===============================================================================================//
            //============================================ CURRENT ==========================================//
            //===============================================================================================//

            
            this.Current = new CalcVarNumerical(
                    "current",
                    view.TextBoxCurrentValue,
                    view.CurrentUnits,
                    view.RadioButtonCurrent,
                    //this.CalcVars,
                    () => {
                        var voltage = this.Voltage.RawVal;
                        var resistance = this.Resistance.RawVal;
                        return voltage / resistance;
                    },
                    new NumberUnit[]{
                        new NumberUnit("pA", 1e-12),
                        new NumberUnit("nA", 1e-9),
                        new NumberUnit("uA", 1e-6),
                        new NumberUnit("mA", 1e-3),
                        new NumberUnit("A", 1e0, NumberPreference.DEFAULT),
                    },
                    Directions.Input,
                    null);

            this.Current.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.Current.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            this.CalcVars.Add(this.Current);

            //===============================================================================================//
            //========================================== RESISTANCE =========================================//
            //===============================================================================================//

            
            this.Resistance = new CalcVarNumerical(
                    "resistance",
                    view.TextBoxResistanceValue,
                    view.ResistanceUnits,
                    view.RadioButtonResistance,
                    //this.CalcVars,
                    () => {
                        var voltage = this.Voltage.RawVal;
                        var current = this.Current.RawVal;
                        return voltage / current;
                    },
                    new NumberUnit[]{
                        new NumberUnit("mΩ", 1e-3),
                        new NumberUnit("Ω", 1e0, NumberPreference.DEFAULT),
                        new NumberUnit("kΩ", 1e3),
                        new NumberUnit("MΩ", 1e6),
                        new NumberUnit("GΩ", 1e9),
                    },
                    Directions.Output,
                    null);
            
            this.Resistance.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.Resistance.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            this.CalcVars.Add(this.Resistance);

            //===============================================================================================//
            //============================================== FINAL ==========================================//
            //===============================================================================================//

            this.FindDependenciesAndDependants();
            this.RecalculateAllOutputs();
            this.ValidateAllVariables();

        }
    }
}
