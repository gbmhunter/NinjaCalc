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

            // Re-cast the view so we can access it's unique properties
            TrackCurrentIpc2221AView view = (TrackCurrentIpc2221AView)this.View;

            //===============================================================================================//
            //========================================= TRACE CURRENT =======================================//
            //===============================================================================================//

            //! @todo, Move these into the constructor for the base object?
            this.CalcVars.Add(
                "traceCurrent",
                new CalcVarInput(
                    "traceCurrent",
                    view.TrackCurrentValue,
                    view.TrackCurrentUnits,                    
                    this.CalcVars,                    
                    new NumberUnit[]{
                        new NumberUnit("mA", 1e-3),
                        new NumberUnit("A", 1e0, NumberPreference.DEFAULT),
                    },
                    0.0));

            // Add validators
            this.CalcVars["traceCurrent"].AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.CalcVars["traceCurrent"].AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            //===============================================================================================//
            //========================================== TEMP RISE ==========================================//
            //===============================================================================================//

            //! @todo, Move these into the constructor for the base object?
            this.CalcVars.Add(
                "tempRise",
                new CalcVarInput(
                    "tempRise",
                    view.TempRiseValue,
                    view.TempRiseUnits,                    
                    this.CalcVars,                    
                    new NumberUnit[]{
                        new NumberUnit("C", 1e0, NumberPreference.DEFAULT),                        
                    },
                    0.0));

            // Add validators
            this.CalcVars["tempRise"].AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.CalcVars["tempRise"].AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            //===============================================================================================//
            //======================================== TRACK THICKNESS ======================================//
            //===============================================================================================//

            //! @todo, Move these into the constructor for the base object?
            this.CalcVars.Add(
                "trackThickness",
                new CalcVarInput(
                    "trackThickness",
                    view.TrackThicknessValue,
                    view.TrackThicknessUnits,
                    this.CalcVars,
                    new NumberUnit[]{
                        new NumberUnit("um", 1e-6, NumberPreference.DEFAULT),                        
                        new NumberUnit("mm", 1e-3),                        
                    },
                    0.0));

            // Add validators
            this.CalcVars["trackThickness"].AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.CalcVars["trackThickness"].AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            //===============================================================================================//
            //========================================= TRACK LAYER =========================================//
            //===============================================================================================//

            // This is a combobox!!! How do we do this?
            /*enum TrackLayer_t {
                INTERNAL,
                EXTERNAL,
            }*/

            //===============================================================================================//
            //======================================== MIN. TRACK WIDTH =====================================//
            //===============================================================================================//

            //! @todo, Move these into the constructor for the base object?
            this.CalcVars.Add(
                "minTrackWidth",
                new CalcVarOutput(
                    "minTrackWidth",
                    view.MinTrackWidthValue,
                    view.MinTrackWidthUnits,
                    this.CalcVars,
                    (calcVars) => {
                        var traceCurrent = calcVars["traceCurrent"].RawVal;
                        var tempRise = calcVars["tempRise"].RawVal;
                        var trackThickness = calcVars["trackThickness"].RawVal;

                        //var trackLayer = TrackLayer_t.INTERNAL or TrackLayer_t.EXTERNAL
 
                        // EQUATION GOES HERE
                        return 0.0;
                    },
                    new NumberUnit[]{
                        new NumberUnit("um", 1e-6),                        
                        new NumberUnit("mm", 1e-3, NumberPreference.DEFAULT),                        
                    }));

            // Add validators
            this.CalcVars["minTrackWidth"].AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.CalcVars["minTrackWidth"].AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
            
        }       
    }
}
