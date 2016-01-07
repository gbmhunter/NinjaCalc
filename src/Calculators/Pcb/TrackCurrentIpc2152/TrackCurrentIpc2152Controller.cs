using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

using NinjaCalc.Core;
using NinjaCalc.Calculators.Pcb.TrackCurrentIpc2152;

namespace NinjaCalc.Calculators.Pcb.TrackCurrentIpc2152 {
    class TrackCurrentIpc2152Controller : Calculator {

        Calculators.Pcb.TrackCurrentIpc2152.TrackCurrentIpc2152View view;

        public TrackCurrentIpc2152Controller()
            : base(
            "Track Current (IPC-2152)",
            "PCB track current carrying capability calculator, using IPC-2152.",
            "pack://application:,,,/Calculators/Basic/OhmsLaw/icon.png") {

            // Create the view for this calculator
            this.view = new TrackCurrentIpc2152View();

            //===============================================================================================//
            //============================================ VOLTAGE ==========================================//
            //===============================================================================================//

            //! @todo, Move these into the constructor for the base object?
            this.CalcVars.Add(
                "voltage",
                new CalcVar(
                    "voltage",
                    view.TextBoxVoltageValue,
                    view.VoltageUnits,
                    view.RadioButtonVoltage,
                    this.CalcVars,
                    (calcVars) => {
                        var current = calcVars["current"].RawVal;
                        var resistance = calcVars["resistance"].RawVal;
                        return current * resistance;
                    },
                    new NumberUnit[]{
                        new NumberUnit("mV", 0.001),
                        new NumberUnit("V", 1.0, NumberPreference.DEFAULT),
                    },
                    0.0));

            // Add validators
            this.CalcVars["voltage"].AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.CalcVars["voltage"].AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
        }

        /// <summary>
        /// Returns the Ohm's Law calculator view.
        /// </summary>
        /// <returns></returns>
        /// @todo Turn into parameter?
        public override Control GetView() {
            return view;
        }

    }
}
