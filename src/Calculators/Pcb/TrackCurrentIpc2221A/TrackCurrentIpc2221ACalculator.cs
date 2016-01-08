using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

using NinjaCalc.Core;
using NinjaCalc.Calculators.Pcb.TrackCurrentIpc2221A;

namespace NinjaCalc.Calculators.Pcb.TrackCurrentIpc2221A {
    class TrackCurrentIpc2221ACalculator : Calculator {

        public TrackCurrentIpc2221ACalculator()
            : base(
            "Track Current (IPC-2221A)",
            "PCB track current carrying capability calculator, using IPC-2221A.",
            "pack://application:,,,/Calculators/Basic/OhmsLaw/icon.png",
            new TrackCurrentIpc2221AView()) {

            TrackCurrentIpc2221AView view = (TrackCurrentIpc2221AView)this.View;

            //===============================================================================================//
            //============================================ VOLTAGE ==========================================//
            //===============================================================================================//

            //! @todo, Move these into the constructor for the base object?
            this.CalcVars.Add(
                "traceCurrent",
                new InputCalcVar(
                    "traceCurrent",
                    view.TrackCurrentValue,
                    view.TrackCurrentUnits,                    
                    this.CalcVars,                    
                    new NumberUnit[]{
                        new NumberUnit("mA", 0.001),
                        new NumberUnit("A", 1.0, NumberPreference.DEFAULT),
                    },
                    0.0));

            // Add validators
            this.CalcVars["traceCurrent"].AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.CalcVars["traceCurrent"].AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
        }
    }
}
