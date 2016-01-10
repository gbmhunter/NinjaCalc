using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

using NinjaCalc.Core;
using NinjaCalc.Calculators.Basic.ResistorDivider;

namespace NinjaCalc.Calculators.Basic.ResistorDivider {

    class ResistorDividerCalc : Calculator {

        CalcVarNumerical Vin {
            get;
            set;
        }
        
        CalcVarNumerical Rtop {
            get;
            set;
        }

        CalcVarNumerical Rbot {
            get;
            set;
        }

        CalcVarNumerical Vout {
            get;
            set;
        }

        CalcVarNumericalOutput Iq {
            get;
            set;
        }

        //===============================================================================================//
        //========================================== CONSTRUCTORS =======================================//
        //===============================================================================================//

        public ResistorDividerCalc()
            : base(
            "Resistor Divider",
            "Resistor dividers are a simple, widely-used circuit primitive for reducing a voltage based on a fixed ratio.",
            "pack://application:,,,/Calculators/Pcb/TrackCurrentIpc2221A/grid-icon.png",
            new ResistorDividerCalcView()) {

            // Re-cast the view so we can access it's unique properties
            ResistorDividerCalcView view = (ResistorDividerCalcView)this.View;

            //===============================================================================================//
            //========================================= TRACE CURRENT =======================================//
            //===============================================================================================//

            this.Vin = new CalcVarNumerical(
                    "vIn",
                    view.VinValue,
                    view.VinUnits,
                    view.VinRadioButton,                
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
            this.Vin.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.Vin.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            this.CalcVars.Add(this.Vin);

          

            //===============================================================================================//
            //============================================== FINAL ==========================================//
            //===============================================================================================//

            this.FindDependenciesAndDependants();
            this.RecalculateAllOutputs();
            this.ValidateAllVariables();

        }
    }
}
