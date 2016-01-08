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

        CalcVarNumericalInput TraceCurrent {
            get;
            set;
        }

        CalcVarNumericalInput TempRise {
            get;
            set;
        }

        CalcVarNumericalInput TrackThickness {
            get;
            set;
        }

        CalcVarComboBox TrackLayer {
            get;
            set;
        }

        CalcVarNumericalOutput MinTrackWidth {
            get;
            set;
        }

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
            
           this.TraceCurrent = new CalcVarNumericalInput(
                "traceCurrent",
                view.TrackCurrentValue,
                view.TrackCurrentUnits,                    
                //this.CalcVars,                    
                new NumberUnit[]{
                    new NumberUnit("mA", 1e-3),
                    new NumberUnit("A", 1e0, NumberPreference.DEFAULT),
                },
                0.0);

            // Add validators
            this.TraceCurrent.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.TraceCurrent.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            this.CalcVars.Add(
                "traceCurrent",
                this.TraceCurrent);

            //===============================================================================================//
            //========================================== TEMP RISE ==========================================//
            //===============================================================================================//
            
            this.TempRise = new CalcVarNumericalInput(
                "tempRise",
                view.TempRiseValue,
                view.TempRiseUnits,                    
                //this.CalcVars,                    
                new NumberUnit[]{
                    new NumberUnit("C", 1e0, NumberPreference.DEFAULT),                        
                },
                0.0);

            // Add validators
            this.TempRise.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.TempRise.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            this.CalcVars.Add(
                "tempRise",
                this.TempRise);

            //===============================================================================================//
            //======================================== TRACK THICKNESS ======================================//
            //===============================================================================================//
            
            this.TrackThickness = new CalcVarNumericalInput(
                "trackThickness",
                view.TrackThicknessValue,
                view.TrackThicknessUnits,
                //this.CalcVars,
                new NumberUnit[]{
                    new NumberUnit("um", 1e-6, NumberPreference.DEFAULT),                        
                    new NumberUnit("mm", 1e-3),                        
                },
                0.0);

            // Add validators
            this.TrackThickness.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.TrackThickness.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            this.CalcVars.Add(
                "trackThickness",
                this.TrackThickness);

            //===============================================================================================//
            //========================================= TRACK LAYER =========================================//
            //===============================================================================================//

            // This is a combobox!!! How do we do this?
            this.TrackLayer = new CalcVarComboBox(
                "trackLayer",
                view.TrackLayer,
                new string[] {
                    "Internal",
                    "External",
                });

            this.CalcVars.Add(
                "trackLayer",
                this.TrackLayer);

            //===============================================================================================//
            //======================================== MIN. TRACK WIDTH =====================================//
            //===============================================================================================//
            
            this.MinTrackWidth = new CalcVarNumericalOutput(
                "minTrackWidth",
                view.MinTrackWidthValue,
                view.MinTrackWidthUnits,
                //this.CalcVars,
                () => {
                    Console.WriteLine("Equation() called for MinTrackWidth.");
                    var traceCurrent = this.TraceCurrent.RawVal;
                    var tempRise = this.TempRise.RawVal;
                    var trackThickness = this.TrackThickness.RawVal;
                    var trackLayer = this.TrackLayer.RawVal;

                    //var trackLayer = TrackLayer_t.INTERNAL or TrackLayer_t.EXTERNAL
                    if(trackLayer == "External")     
			        {
				        Console.WriteLine("External trace selected.");
				        double crossSectionalArea = (Math.Pow((traceCurrent/(0.048*Math.Pow(tempRise, 0.44))), 1/0.725));
				        Console.WriteLine("Cross-sectional area = " + crossSectionalArea.ToString());
				        double width = (crossSectionalArea/(trackThickness*1000000.0/25.4))*(25.4/1000000.0);
				        return width;
			        }
			        else if(trackLayer == "Internal")
			        {
				        Console.WriteLine("Internal trace selected.");
				        double crossSectionalArea = (Math.Pow((traceCurrent/(0.024*Math.Pow(tempRise, 0.44))), 1/0.725));
                        Console.WriteLine("Cross-sectional area = " + crossSectionalArea.ToString());
				        double width = (crossSectionalArea/(trackThickness*1000000.0/25.4))*(25.4/1000000.0);
				        return width;
			        }
 
                    // EQUATION GOES HERE
                    return 0.0;
                },
                new NumberUnit[]{
                    new NumberUnit("um", 1e-6),                        
                    new NumberUnit("mm", 1e-3, NumberPreference.DEFAULT),                        
                });

            // Add validators
            this.MinTrackWidth.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.MinTrackWidth.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            this.CalcVars.Add(
                "minTrackWidth",
                this.MinTrackWidth);

            this.FindDependenciesAndDependants();
            this.RecalculateAllOutputs();
            
        }       
    }
}
