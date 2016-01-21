using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

using NinjaCalc.Core;
using NinjaCalc.Calculators.Electronics.Pcb.TrackCurrentIpc2221A;

namespace NinjaCalc.Calculators.Electronics.Pcb.TrackCurrentIpc2221A {

    class TrackCurrentIpc2221ACalcModel : Calculator {

        CalcVarNumericalInput TrackCurrent {
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

        //===============================================================================================//
        //========================================== CONSTRUCTORS =======================================//
        //===============================================================================================//

        public TrackCurrentIpc2221ACalcModel()
            : base(
            "Track Current (IPC-2221A)",
            "PCB track current carrying capability calculator, using the IPC-2221A standard.",
            "pack://application:,,,/Calculators/Electronics/Pcb/TrackCurrentIpc2221A/grid-icon.png",
            new string[] { "Electronics", "PCB" },
            new string[] { "pcb, track, current, trace, width, carry, heat, temperature, ipc, ipc2221a, ipc-2221a" },
            new TrackCurrentIpc2221AView()) {

            // Re-cast the view so we can access it's unique properties
            TrackCurrentIpc2221AView view = (TrackCurrentIpc2221AView)this.View;

            //===============================================================================================//
            //========================================= TRACE CURRENT =======================================//
            //===============================================================================================//

            this.TrackCurrent = new CalcVarNumericalInput(
                 "traceCurrent",
                 view.TrackCurrentValue,
                 view.TrackCurrentUnits,
                 new NumberUnit[]{
                    new NumberUnit("mA", 1e-3),
                    new NumberUnit("A", 1e0, NumberPreference.DEFAULT),
                },
                 4,
                 null,
                 "The current you want the PCB track to be able to handle." // Help info
                 );

            //===== VALIDATORS =====//
            this.TrackCurrent.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.TrackCurrent.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
            this.TrackCurrent.AddValidator(
                new Validator(() => {
                    return ((this.TrackCurrent.RawVal > 35.0) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);                                      
                },
                "Current is above recommended maximum (35A). Equation will not be as accurate (extrapolation will occur)."));

            this.CalcVars.Add(this.TrackCurrent);

            //===============================================================================================//
            //========================================== TEMP RISE ==========================================//
            //===============================================================================================//
            
            this.TempRise = new CalcVarNumericalInput(
                "tempRise",
                view.TempRiseValue,
                view.TempRiseUnits,                                                
                new NumberUnit[]{
                    new NumberUnit("C", 1e0, NumberPreference.DEFAULT),                        
                },
                4,
                null,
                "The maximum desired temperature rise due to the current flowing through the track. 20-40°C is a common value for this." // Help info
                );

            //===== VALIDATORS =====//
            this.TempRise.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.TempRise.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
            this.TempRise.AddValidator(
                new Validator(() => {
                    return ((this.TempRise.RawVal < 10.0) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                "Temperature rise is below the recommended minimum (10°C). Equation will not be as accurate (extrapolation will occur)."));
            this.TempRise.AddValidator(
                new Validator(() => {
                    return ((this.TempRise.RawVal > 100.0) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                "Temperature rise is above the recommended maximum (100°C). Equation will not be as accurate (extrapolation will occur)."));

            this.CalcVars.Add(this.TempRise);

            //===============================================================================================//
            //====================================== TRACK THICKNESS (input) ================================//
            //===============================================================================================//
            
            this.TrackThickness = new CalcVarNumericalInput(
                "trackThickness",
                view.TrackThicknessValue,
                view.TrackThicknessUnits,                
                new NumberUnit[]{
                    new NumberUnit("um", 1e-6, NumberPreference.DEFAULT),                        
                    new NumberUnit("mm", 1e-3),                        
                },
                4,
                null,
                "The thickness (height) of the track. This is equal to the thickness of the copper layer the track is on. This is also called the copper weight. Common values are 16um (0.5oz) or 32um (1oz)." // Help text
                );

            //===== VALIDATORS =====//
            this.TrackThickness.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.TrackThickness.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
            this.TrackThickness.AddValidator(
               new Validator(() => {
                   return ((this.TrackThickness.RawVal < 17.5e-6) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
               },
               "Track thickness is below the recommended minimum (17.5um or 0.5oz). Equation will not be as accurate (extrapolation will occur)."));
            this.TrackThickness.AddValidator(
                new Validator(() => {
                    return ((this.TrackThickness.RawVal > 105.0036e-6) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                "Track thickness is above the recommended maximum (105um or 3oz). Equation will not be as accurate (extrapolation will occur)."));

            this.CalcVars.Add(this.TrackThickness);

            //===============================================================================================//
            //========================================= TRACK LAYER =========================================//
            //===============================================================================================//

            this.TrackLayer = new CalcVarComboBox(
                "trackLayer",
                view.TrackLayer,
                new string[] {
                    "Internal",
                    "External",
                });

            this.CalcVars.Add(this.TrackLayer);

            //===============================================================================================//
            //======================================== MIN. TRACK WIDTH =====================================//
            //===============================================================================================//
            
            this.MinTrackWidth = new CalcVarNumericalOutput(
                "minTrackWidth",
                view.MinTrackWidthValue,
                view.MinTrackWidthUnits,
                () => {
                    //Console.WriteLine("Equation() called for MinTrackWidth.");
                    var traceCurrent = this.TrackCurrent.RawVal;
                    var tempRise = this.TempRise.RawVal;
                    var trackThickness = this.TrackThickness.RawVal;
                    var trackLayer = this.TrackLayer.RawVal;
                    
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
                    else {
                        System.Diagnostics.Debug.Assert(false, "Track layer was invalid (should be either External or Internal).");
                        return Double.NaN;
                    }
                },
                new NumberUnit[]{
                    new NumberUnit("um", 1e-6),                        
                    new NumberUnit("mm", 1e-3, NumberPreference.DEFAULT),                        
                },
                4,
                "The minimum track width needed to carry the specified current without exceeding the given temperature rise." // Help text
                );

            // Add validators
            this.MinTrackWidth.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
            this.MinTrackWidth.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            this.CalcVars.Add(this.MinTrackWidth);

            //===============================================================================================//
            //=========================================== VIEW CONFIG =======================================//
            //===============================================================================================//

            // Setup the top PCB layer to dissappear if "External" is selected for the track layer,
            // and visible if "Internal" is selected.
            this.TrackLayer.RawValueChanged += (sender, e) => {
                if (this.TrackLayer.RawVal == "Internal") {
                    view.TopPcb.Visibility = System.Windows.Visibility.Visible;
                }
                else if (this.TrackLayer.RawVal == "External") {
                    view.TopPcb.Visibility = System.Windows.Visibility.Collapsed;
                }
            };

            //===============================================================================================//
            //============================================== FINAL ==========================================//
            //===============================================================================================//

            this.FindDependenciesAndDependants();
            this.RecalculateAllOutputs();
            this.ValidateAllVariables();
            
        }       
    }
}
