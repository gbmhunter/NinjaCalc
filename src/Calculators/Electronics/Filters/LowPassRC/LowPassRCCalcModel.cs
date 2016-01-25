using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

// USER INCLUDES
using NinjaCalc.Core;
using NinjaCalc.Calculators.Electronics.Filters.LowPassRC;

namespace NinjaCalc.Calculators.Electronics.Filters.LowPassRC {

    class LowPassRCCalcModel : Calculator {

        CalcVarNumerical R {
            get;
            set;
        }
        
        CalcVarNumerical C {
            get;
            set;
        }

        CalcVarNumerical Fc {
            get;
            set;
        }

        //===============================================================================================//
        //========================================== CONSTRUCTORS =======================================//
        //===============================================================================================//

        public LowPassRCCalcModel()
            : base(
            "Low-pass RC Filter",
            "The low-pass RC filter is probably the simplist and most used electronic filter. Great for input signal filtering and adding to the output of a PWM signal to make a cheap DAC.",
            "pack://application:,,,/Calculators/Electronics/Filters/LowPassRC/grid-icon.png",
            new string[] { "Electronics", "Filters" },
            new string[] { "rc, filters, low-pass" },
            new LowPassRCCalcView()) {

            // Re-cast the view so we can access it's unique properties
            LowPassRCCalcView view = (LowPassRCCalcView)this.View;

            //===============================================================================================//
            //================================================= Vin =========================================//
            //===============================================================================================//

            this.R = new CalcVarNumerical(
                    "R",                // Variable name (used for debugging)
                    view.RValue,        // Textbox for value (UI object)
                    view.RUnits,        // Combobox for units (UI object) 
                    view.RRadioButton,  // Radio button for changing direction (UI object)
                    () => {             // Equation when an output
                        var fc = this.Fc.RawVal;
                        var c = this.C.RawVal;
                        
                        return (1.0 / (2*Math.PI*fc*c));                        
                    },
                    new NumberUnit[]{   // Units
                        new NumberUnit("mΩ", 1e-3),
                        new NumberUnit("Ω", 1e0),
                        new NumberUnit("kΩ", 1e3, NumberPreference.DEFAULT),
                        new NumberUnit("MΩ", 1e6),
                        new NumberUnit("GΩ", 1e9),
                    },
                    4,                  // Num. digits to round to
                    Directions.Input,   // Default direction
                    null,               // Default value
                    "The resistance of the resistor in the low-pass LC filter." // Help text
                    );

            // Add validators
            this.R.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.R.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            this.CalcVars.Add(this.R);

            //===============================================================================================//
            //============================================ C (i/o) ==========================================//
            //===============================================================================================//

            this.C = new CalcVarNumerical(
                    "C",                // Variable name (used for debugging)
                    view.CValue,        // Textbox for value (UI object)
                    view.CUnits,        // Combobox for units (UI object)
                    view.CRadioButton,  // Radio button for changing direction (UI object)
                    () => {             // Equation when an output
                        var r = this.R.RawVal;                        
                        var fc = this.Fc.RawVal;

                        return (1.0 / (2 * Math.PI * fc * r));  
                    },
                    new NumberUnit[]{   // Units
                        new NumberUnit("pF", 1e-12),
                        new NumberUnit("nF", 1e-9, NumberPreference.DEFAULT),
                        new NumberUnit("uF", 1e-6),
                        new NumberUnit("mF", 1e-3),
                        new NumberUnit("F", 1e0),
                    },
                    4,                  // Num. digits to round to
                    Directions.Input,   // Default direction
                    null,               // Default value
                    "The capacitance of the capacitor in the low-pass LC filter." // Help text
                    );

            // Add validators
            this.C.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.C.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            this.CalcVars.Add(this.C);
          

            //===============================================================================================//
            //============================================== fc (i/o) =======================================//
            //===============================================================================================//

            this.Fc = new CalcVarNumerical(
                    "fc",               // Variable name (used for debugging)
                    view.FcValue,       // Textbox for value (UI object)
                    view.FcUnits,       // Combobox for units (UI object)
                    view.FcRadioButton, // Radio button for changing direction (UI object)
                    () => {             // Equation when an output
                        var r = this.R.RawVal;
                        var c = this.C.RawVal;

                        return (1.0 / (2 * Math.PI * r * c)); 
                    },
                    new NumberUnit[]{   // Units
                        new NumberUnit("mHz", 1e-3),
                        new NumberUnit("Hz", 1e0),
                        new NumberUnit("kHz", 1e3, NumberPreference.DEFAULT),
                        new NumberUnit("MHz", 1e6),
                        new NumberUnit("GHz", 1e9),
                    },
                    4,                  // Num. digits to round to
                    Directions.Output,  // Default direction
                    null,               // Default value
                    "The cut-off frequency of the low-pass RC filter. This is the point where the output signal is attenuated by -3dB (70.7%) of the input. Also known as the corner or breakpoint frequency.");

            // Add validators
            this.Fc.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.Fc.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            this.CalcVars.Add(this.Fc);         

            //===============================================================================================//
            //============================================== FINAL ==========================================//
            //===============================================================================================//

            this.FindDependenciesAndDependants();
            this.RecalculateAllOutputs();
            this.ValidateAllVariables();

        }
    }
}
