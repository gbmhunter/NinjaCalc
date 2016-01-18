using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

// USER INCLUDES
using NinjaCalc.Core;
using NinjaCalc.Calculators.Electronics.Basic.ResistorDivider;

namespace NinjaCalc.Calculators.Electronics.Basic.ResistorDivider {

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
            "pack://application:,,,/Calculators/Electronics/Basic/ResistorDivider/grid-icon.png",
            new string[] { "Electronics", "Basic" },
            new string[] { "resistor, resistance, voltage, divider, reduce" },
            new ResistorDividerCalcView()) {

            // Re-cast the view so we can access it's unique properties
            ResistorDividerCalcView view = (ResistorDividerCalcView)this.View;

            //===============================================================================================//
            //================================================= Vin =========================================//
            //===============================================================================================//

            this.Vin = new CalcVarNumerical(
                    "vIn",
                    view.VinValue,
                    view.VinUnits,
                    view.VinRadioButton,                
                    () => {
                        var vOut = this.Vout.RawVal;
                        var rTop = this.Rtop.RawVal;
                        var rBot = this.Rbot.RawVal;

                        return ((vOut * (rTop + rBot)) / rBot);                        
                    },
                    new NumberUnit[]{
                        new NumberUnit("mV", 1e-3),
                        new NumberUnit("V", 1e0, NumberPreference.DEFAULT),
                        new NumberUnit("kV", 1e3),
                    },
                    4,
                    Directions.Input,
                    null);

            // Add validators
            this.Vin.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.Vin.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            this.CalcVars.Add(this.Vin);

            //===============================================================================================//
            //=============================================== Rtop ==========================================//
            //===============================================================================================//

            this.Rtop = new CalcVarNumerical(
                    "rTop",
                    view.RtopValue,
                    view.RtopUnits,
                    view.RtopRadioButton,
                    () => {
                        var vIn = this.Vin.RawVal;
                        var rBot = this.Rbot.RawVal;
                        var vOut = this.Vout.RawVal;                                                

                        return ((rBot * (vIn - vOut)) / vOut);
                    },
                    new NumberUnit[]{
                        new NumberUnit("mΩ", 1e-3),
                        new NumberUnit("Ω", 1e0),
                        new NumberUnit("kΩ", 1e3, NumberPreference.DEFAULT),
                        new NumberUnit("MΩ", 1e6),
                        new NumberUnit("GΩ", 1e9),
                    },
                    4,
                    Directions.Input,
                    null);

            // Add validators
            this.Rtop.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.Rtop.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            this.CalcVars.Add(this.Rtop);

            //===============================================================================================//
            //=============================================== Rbot ==========================================//
            //===============================================================================================//

            this.Rbot = new CalcVarNumerical(
                    "rBot",
                    view.RbotValue,
                    view.RbotUnits,
                    view.RbotRadioButton,
                    () => {
                        var vIn = this.Vin.RawVal;
                        var rTop = this.Rtop.RawVal;
                        var vOut = this.Vout.RawVal;

                        return ((rTop * vOut) / (vIn - vOut));
                    },
                    new NumberUnit[]{
                        new NumberUnit("mΩ", 1e-3),
                        new NumberUnit("Ω", 1e0),
                        new NumberUnit("kΩ", 1e3, NumberPreference.DEFAULT),
                        new NumberUnit("MΩ", 1e6),
                        new NumberUnit("GΩ", 1e9),
                    },
                    4,
                    Directions.Input,
                    null);

            // Add validators
            this.Rbot.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.Rbot.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            this.CalcVars.Add(this.Rbot);

            //===============================================================================================//
            //================================================= Vout =========================================//
            //===============================================================================================//

            this.Vout = new CalcVarNumerical(
                    "vOut",
                    view.VoutValue,
                    view.VoutUnits,
                    view.VoutRadioButton,
                    () => {
                        var vIn = this.Vin.RawVal;
                        var rTop = this.Rtop.RawVal;
                        var rBot = this.Rbot.RawVal;

                        return ((vIn * rBot) / (rTop + rBot));
                    },
                    new NumberUnit[]{
                        new NumberUnit("mV", 1e-3),
                        new NumberUnit("V", 1e0, NumberPreference.DEFAULT),
                        new NumberUnit("kV", 1e3),
                    },
                    4,
                    Directions.Output,
                    null);

            // Add validators
            this.Vout.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.Vout.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            this.CalcVars.Add(this.Vout);

            //===============================================================================================//
            //======================================= Iq (Quescent Current) =================================//
            //===============================================================================================//

            this.Iq = new CalcVarNumericalOutput(
                "iQ",
                view.IqValue,
                view.IqUnits,
                () => {
                    var vIn = this.Vin.RawVal;
                    var rTop = this.Rtop.RawVal;
                    var rBot = this.Rbot.RawVal;

                    return (vIn / (rTop + rBot));
                },
                new NumberUnit[]{
                        new NumberUnit("pA", 1e-12),
                        new NumberUnit("nA", 1e-9),
                        new NumberUnit("uA", 1e-6),
                        new NumberUnit("mA", 1e-3, NumberPreference.DEFAULT),
                        new NumberUnit("A", 1e0),
                },
                4);

            // Add validators
            this.Iq.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.Iq.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            this.CalcVars.Add(this.Iq);

            //===============================================================================================//
            //============================================== FINAL ==========================================//
            //===============================================================================================//

            this.FindDependenciesAndDependants();
            this.RecalculateAllOutputs();
            this.ValidateAllVariables();

        }
    }
}
