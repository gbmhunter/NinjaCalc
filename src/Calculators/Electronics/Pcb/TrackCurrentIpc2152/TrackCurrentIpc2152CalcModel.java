package Calculators.Electronics.Pcb.TrackCurrentIpc2152;



import Core.*;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.ComboBox;
import javafx.scene.control.TextField;

import java.io.IOException;

public class TrackCurrentIpc2152CalcModel extends Calculator {

    //===============================================================================================//
    //============================================ CONSTANTS ========================================//
    //===============================================================================================//


	final double NUM_MILS_PER_MM = 1000/25.4;
	//const double UNIT_CONVERSION_COPPER_THICKNESS_M_PER_OZ = 0.0000350012;
	final double UNIT_CONVERSION_M_PER_MIL = 25.4/1e6;
	final double UNIT_CONVERSION_M2_PER_MIL2 = UNIT_CONVERSION_M_PER_MIL*UNIT_CONVERSION_M_PER_MIL;

	final double UNIT_CONVERSION_THERMAL_CONDUCTIVITY_WATT_nMETER_nKELVIN_PER_BTU_nHOUR_nFT_nDEGF = 1.73;

	// UNIVERSAL CHART CONSTANTS

	// The trendlines to calculate the co-efficients for a fixed temp takes the form y = Ax^B
	// where y is the co-efficient, x is the temperature.
	// e.g. (co-efficient A) = AA * temp ^ AB
	//      (co-efficient B) = BA * temp ^ BB
	final double UNIVERSAL_CHART_TREND_LINE_COEF_AA = 8.9710902134e-02;
	final double UNIVERSAL_CHART_TREND_LINE_COEF_AB = 3.9379253898e-01;

	final double UNIVERSAL_CHART_TREND_LINE_COEF_BA = 5.0382053698e-01;
	final double UNIVERSAL_CHART_TREND_LINE_COEF_BB = 3.8495772461e-02;

	// TRACK THICKNESS MODIFIER CONSTANTS

	// The data from the track thickness modifier graph in IPS-2152 is modelled using
	// a 5th degree polynomial

	// y = C0 + C1*x^1 + C2*x^2 + C3*x^3 + C4*x^4 + C5*x^5

	final double[][] TRACK_THICKNESS_TREND_LINE_COEF_COEF_A =
	{
		{
			9.8453567795e-01,	// C0C0
			-2.2281787548e-01,	// C0C1
			2.0061423196e-01,	// C0C2
			-4.1541116264e-02,	// C0C3
		},
		{
			-1.6571949210e-02,	// C1C0
			1.7520059279e-04,	// C1C1
			-5.0615234096e-03,	// C1C2
			2.2814836340e-03,	// C1C3
		},
		{
			8.8711317661e-04,	// C2C0
			1.3631745743e-03,	// C2C1
			-2.2373309710e-04,	// C2C2
			-1.0974218613e-04	// C2C3
		},
		{
			-6.6729255031e-06,	// e.t.c...
			-1.4976736827e-04,
			5.8082340133e-05,
			-2.4728159584e-06
		},
		{
			-7.9576264561e-07,
			5.5788354958e-06,
			-2.4912026388e-06,
			2.4000295954e-07
		},
		{
			1.6619678738e-08,
			-7.1122635445e-08,
			3.3800191741e-08,
			-3.9797591878e-09
		}
	};

	// BOARD THICKNESS CONSTANTS

	final double BOARD_THICKNESS_TREND_LINE_COEF_A = 2.4929779905e+01;
	final double BOARD_THICKNESS_TREND_LINE_COEF_B = -7.5501997929e-01;

	// PLANE PROXIMITY CONSTANTS

	final double PLANE_PROXIMITY_TREND_LINE_COEF_M = 3.1298662911e-03;
	final double PLANE_PROXIMITY_TREND_LINE_COEF_C = 4.0450883823e-01;

	// THERMAL CONDUCTIVITY CONSTANTS

	final double THERMAL_CONDUCTIVITY_TREND_LINE_COEF_M = -1.4210148167e+00;
	final double THERMAL_CONDUCTIVITY_TREND_LINE_COEF_C = 1.1958174134e+00;

    //===============================================================================================//
    //========================================= FXML BINDINGS =======================================//
    //===============================================================================================//

    @FXML
    private TextField trackCurrentValue;
    @FXML
    private ComboBox trackCurrentUnits;

    @FXML
    private TextField tempRiseValue;
    @FXML
    private ComboBox tempRiseUnits;

    @FXML
    private TextField unadjustedTrackCrossSectionalAreaValue;
    @FXML
    private ComboBox unadjustedTrackCrossSectionalAreaUnits;

    @FXML
    private TextField trackThicknessValue;
    @FXML
    private ComboBox trackThicknessUnits;

    @FXML
    private TextField trackThicknessModifierValue;
    @FXML
    private ComboBox trackThicknessModifierUnits;

    @FXML
    private TextField boardThicknessValue;
    @FXML
    private ComboBox boardThicknessUnits;

    @FXML
    private TextField boardThicknessModifierValue;
    @FXML
    private ComboBox boardThicknessModifierUnits;

    @FXML
    private ComboBox isPlanePresentComboBox;

    @FXML
    private TextField planeProximityValue;
    @FXML
    private ComboBox planeProximityUnits;

    @FXML
    private TextField planeProximityModifierValue;
    @FXML
    private ComboBox planeProximityModifierUnits;

    @FXML
    private TextField thermalConductivityValue;
    @FXML
    private ComboBox thermalConductivityUnits;

    @FXML
    private TextField thermalConductivityModifierValue;
    @FXML
    private ComboBox thermalConductivityModifierUnits;

    @FXML
    private TextField adjustedTrackCrossSectionalAreaValue;
    @FXML
    private ComboBox adjustedTrackCrossSectionalAreaUnits;

    @FXML
    private TextField minTrackWidthValue;
    @FXML
    private ComboBox minTrackWidthUnits;

    //===============================================================================================//
    //============================================ VARIABLES ========================================//
    //===============================================================================================//

	CalcVarNumericalInput TrackCurrent;

	CalcVarNumericalInput TempRise;

	CalcVarNumericalOutput UnadjustedTrackCrossSectionalArea;

	CalcVarNumericalInput TrackThickness;

	CalcVarNumericalOutput TrackThicknessModifier;

	CalcVarNumericalInput BoardThickness;

	CalcVarNumericalOutput BoardThicknessModifier;

	CalcVarComboBox IsPlanePresent;

	CalcVarNumericalInput PlaneProximity;

	CalcVarNumericalOutput PlaneProximityModifier;

	CalcVarNumericalInput ThermalConductivity;

	CalcVarNumericalOutput ThermalConductivityModifier;

	CalcVarNumericalOutput AdjustedCrossSectionalArea;

	CalcVarNumericalOutput MinTrackWidth;

	//===============================================================================================//
	//========================================== CONSTRUCTORS =======================================//
	//===============================================================================================//

	public TrackCurrentIpc2152CalcModel() {

        super(
            "Track Current (IPC-2152)",
            "PCB track current carrying capability calculator, using the IPC-2152 standard.",
            "/Calculators/Electronics/Pcb/TrackCurrentIpc2152/grid-icon.png",
            new String[] { "Electronics", "PCB" },
            new String[] { "pcb, track, current, trace, width, carry, heat, temperature, ipc, ipc2221a, ipc-2221a" });

        //===============================================================================================//
        //======================================== LOAD .FXML FILE ======================================//
        //===============================================================================================//

        FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("TrackCurrentIpc2152CalcView.fxml"));
        //fxmlLoader.setRoot(this.View);
        fxmlLoader.setController(this);
        try {
            // Create a UI node from the FXML file, and save it to the View variable.
            // This will be used by the main window to create a new instance of this calculator when
            // the "Open" button is clicked.
            this.View = fxmlLoader.load();
        } catch (IOException exception) {
            throw new RuntimeException(exception);
        }

		//===============================================================================================//
		//===================================== TRACE CURRENT (input) ===================================//
		//===============================================================================================//

	   this.TrackCurrent = new CalcVarNumericalInput(
			"traceCurrent",             // Debug name
			trackCurrentValue,     // Textbox for value (UI object)
			trackCurrentUnits,     // Combobox for units (UI object)
			new NumberUnit[]{           // Units
				new NumberUnit("uA", 1e-6),
				new NumberUnit("mA", 1e-3),
				new NumberUnit("A", 1e0, NumberPreference.DEFAULT),
			},
			4,                          // Num. digits to round to
			null,                       // Default value
			"The current you want the PCB track to be able to handle." // Help info
			);

		//========== VALIDATORS ===========//
		this.TrackCurrent.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
		this.TrackCurrent.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
		this.TrackCurrent.AddValidator(
			new Validator(() -> {
				return ((this.TrackCurrent.getRawVal() < 274e-3) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
			},
			"Current is below the minimum value (274mA) extracted from the universal graph in IPC-2152." +
			" Results might not be as accurate (extrapolation will occur)."));
		this.TrackCurrent.AddValidator(
			new Validator(() -> {
				return ((this.TrackCurrent.getRawVal() > 26.0) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
			},
			"Current is above the maximum value (26A) extracted from the universal graph in IPC-2152." +
			" Results might not be as accurate (extrapolation will occur)."));

		this.CalcVars.add(this.TrackCurrent);

		//===============================================================================================//
		//====================================== TEMP RISE (input) ======================================//
		//===============================================================================================//

		this.TempRise = new CalcVarNumericalInput(
			"tempRise",             // Debug name
			tempRiseValue,     // Textbox for value (UI object)
			tempRiseUnits,     // Combobox for units (UI object)
			new NumberUnit[]{       // Units
				new NumberUnit("°C", 1e0, NumberPreference.DEFAULT),
			},
			4,                      // Num. digits to round to
			null,                   // Default value
			"The maximum desired temperature rise due to the current flowing through the track. 20-40°C is a common value for this." // Help info
			);

		//========== VALIDATORS ==========//
		this.TempRise.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
		this.TempRise.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
		this.TempRise.AddValidator(
			new Validator(() -> {
				return ((this.TempRise.getRawVal() < 1.0) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
			},
			"Temp. rise is below the minimum value (1°C) extracted from the universal graph in IPC-2152." +
			" Results might not be as accurate (extrapolation will occur)."));
		this.TempRise.AddValidator(
			new Validator(() -> {
				return ((this.TempRise.getRawVal() > 100.0) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
			},
			"Temp. rise is above the maximum value (100°C) extracted from the universal graph in IPC-2152." +
			" Results might not be as accurate (extrapolation will occur)."));

		this.CalcVars.add(this.TempRise);

		//===============================================================================================//
		//============================ UN-ADJUSTED TRACK CROSS-SECTIONAL AREA (output) ==================//
		//===============================================================================================//

		this.UnadjustedTrackCrossSectionalArea = new CalcVarNumericalOutput(
			"unadjustedTrackCrossSectionalArea",
			unadjustedTrackCrossSectionalAreaValue,
			unadjustedTrackCrossSectionalAreaUnits,
			() -> {

				// Read in variables
				Double trackCurrent = this.TrackCurrent.getRawVal();
				Double tempRise = this.TempRise.getRawVal();

				// Lets calculate the two co-efficients for the fixed-temp trend line
				Double universalChartTrendLineCoefA = UNIVERSAL_CHART_TREND_LINE_COEF_AA * Math.pow(tempRise, UNIVERSAL_CHART_TREND_LINE_COEF_AB);
				Double universalChartTrendLineCoefB = UNIVERSAL_CHART_TREND_LINE_COEF_BA * Math.pow(tempRise, UNIVERSAL_CHART_TREND_LINE_COEF_BB);

				// Now we know the two co-efficients, we can use the trend line eq. y=Ax^B to find the unadjusted cross-sectional area
				Double unadjustedTrackCrosssectionalAreaMils2 = Math.pow(trackCurrent / universalChartTrendLineCoefA, 1 / universalChartTrendLineCoefB);

				//console.log("unadjustedTrackCrosssectionalAreaMils2 = '" + unadjustedTrackCrosssectionalAreaMils2 + "'.");

				// Convert mils^2 to m^2 (store variable values in SI units)
				Double unadjustedTrackCrosssectionalAreaM2 = unadjustedTrackCrosssectionalAreaMils2 * (1 / (NUM_MILS_PER_MM * NUM_MILS_PER_MM * 1e6));

				return unadjustedTrackCrosssectionalAreaM2;

			},
			new NumberUnit[]{
				new NumberUnit("um²", 1e-12, NumberPreference.DEFAULT),
				new NumberUnit("mils²", UNIT_CONVERSION_M2_PER_MIL2),
				new NumberUnit("mm²", 1e-6),
			},
			4,
			"The unadjusted cross-sectional area. This gets multiplied by the many modifiers to give an adjusted cross-sectional area.");

		// Add validators
		this.UnadjustedTrackCrossSectionalArea.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
		this.UnadjustedTrackCrossSectionalArea.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

		this.CalcVars.add(this.UnadjustedTrackCrossSectionalArea);


		//===============================================================================================//
		//================================== TRACK THICKNESS (input) ====================================//
		//===============================================================================================//

		this.TrackThickness = new CalcVarNumericalInput(
			"trackThickness",
			trackThicknessValue,
			trackThicknessUnits,
			new NumberUnit[]{
				new NumberUnit("um", 1e-6, NumberPreference.DEFAULT),
				new NumberUnit("mm", 1e-3),
				new NumberUnit("oz", UnitConversionConstants.COPPER_THICKNESS_M_PER_OZ),
				new NumberUnit("mils", UnitConversionConstants.METERS_PER_MILS),
			},
			4,
			null,
			"The thickness (height) of the track. This is equal to the thickness of the copper layer the track is on. This is also called the copper weight. Common values are 16um (0.5oz) or 32um (1oz)." // Help text
			);

		//========== VALIDATORS ==========//
		this.TrackThickness.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
		this.TrackThickness.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
		this.TrackThickness.AddValidator(
		   new Validator(() -> {
			   return ((this.TrackThickness.getRawVal() < 17.5e-6) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
		   },
		   "Track thickness is below the minimum value (17.5um) extracted from the track thickness modififer graph in IPC-2152." +
		   " Results might not be as accurate (extrapolation will occur)."));
		this.TrackThickness.AddValidator(
			new Validator(() -> {
				return ((this.TrackThickness.getRawVal() > 105.0036e-6) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
			},
			"Track thickness is above the maximum value (105um) extracted from the track thickness modififer graph in IPC-2152." +
			" Results might not be as accurate (extrapolation will occur)."));

		this.CalcVars.add(this.TrackThickness);

		//===============================================================================================//
		//=================================== TRACK THICKNESS MODIFIER (output) =========================//
		//===============================================================================================//

		this.TrackThicknessModifier = new CalcVarNumericalOutput(
			"TrackThicknessModifier",
			trackThicknessModifierValue,
			trackThicknessModifierUnits,
			() -> {

				// Read in variables
				Double trackCurrentA = this.TrackCurrent.getRawVal();
				Double trackThicknessM = this.TrackThickness.getRawVal();

				// Convert to "oz" units, as this is what is used in IPC-2152 graphs
				Double trackThicknessOz = trackThicknessM*(1/UnitConversionConstants.COPPER_THICKNESS_M_PER_OZ);
				//console.log("trackThicknessOz = " + trackThicknessOz);

				// Lets calculate the two co-efficients for the fixed-temp trend line
				double[] trackThicknessTrendLineCoefA = new double[TRACK_THICKNESS_TREND_LINE_COEF_COEF_A.length];

				//console.log("test = " + TRACK_THICKNESS_TREND_LINE_COEF_COEF_A[0].length);


				// Outer loop calculates all co-efficients
				for(Integer i = 0; i < TRACK_THICKNESS_TREND_LINE_COEF_COEF_A.length; i++)
				{
					// Initialise array element with 0
					trackThicknessTrendLineCoefA[i] = 0;

					//console.log("i = " + i);
					//console.log("test = " + TRACK_THICKNESS_TREND_LINE_COEF_COEF_A[i].length);

					// Inner loop calculates a single co-efficient
					for(Integer j = 0; j < TRACK_THICKNESS_TREND_LINE_COEF_COEF_A[0].length; j++)
					{
						//TRACK_THICKNESS_TREND_LINE_COEF_COEF_A[0,0] = 2;
						//console.log("sum = " + TRACK_THICKNESS_TREND_LINE_COEF_COEF_A[0,0]);
						trackThicknessTrendLineCoefA[i] += TRACK_THICKNESS_TREND_LINE_COEF_COEF_A[i][j]*Math.pow(trackThicknessOz, j);
					}

					//console.log("trackThicknessTrendLineCoefA[" + i + "] = '" + trackThicknessTrendLineCoefA[i] + "'.");
				}

				// Now we have calculate the 5th degree polynomial co-efficients, we can finally calc the thickness modifier
				double trackThicknessModifierMulti = 0;

				for(Integer i = 0; i < trackThicknessTrendLineCoefA.length; i++)
				{
					trackThicknessModifierMulti += trackThicknessTrendLineCoefA[i]*Math.pow(trackCurrentA, i);
				}

				return trackThicknessModifierMulti;

			},
			new NumberUnit[]{
				new NumberUnit("no unit", 1.0, NumberPreference.DEFAULT),
			},
			4,
			"The modifier to adjust the cross-sectional area with based on the track thickness." // Help text
			);

		// Add validators
		this.TrackThicknessModifier.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
		this.TrackThicknessModifier.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

		this.CalcVars.add(this.TrackThicknessModifier);

		//===============================================================================================//
		//================================== BOARD THICKNESS (input) ====================================//
		//===============================================================================================//

		this.BoardThickness = new CalcVarNumericalInput(
			"boardThickness",
			boardThicknessValue,
			boardThicknessUnits,
			new NumberUnit[]{
				new NumberUnit("um", 1e-6),
				new NumberUnit("mm", 1e-3, NumberPreference.DEFAULT),
				new NumberUnit("mils", UnitConversionConstants.METERS_PER_MILS),
			},
			4,
			null,
			"The total thickness of the PCB that the track is on. A standard PCB thickness is 1.6mm." // Help text
			);

		//========== VALIDATORS ==========//
		this.BoardThickness.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
		this.BoardThickness.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
		this.BoardThickness.AddValidator(
		   new Validator(() -> {
			   return ((this.BoardThickness.getRawVal() < 0.72e-3) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
		   },
		   "Board thickness is below the minimum value (0.72mm) extracted from the board thickness modififer graph in IPC-2152." +
		   " Results might not be as accurate (extrapolation will occur)."));
		this.BoardThickness.AddValidator(
			new Validator(() -> {
				return ((this.BoardThickness.getRawVal() > 2.36e-3) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
			},
			"Board thickness is above the maximum value (2.36mm) extracted from the board thickness modififer graph in IPC-2152." +
			" Results might not be as accurate (extrapolation will occur)."));

		this.CalcVars.add(this.BoardThickness);

		//===============================================================================================//
		//=================================== BOARD THICKNESS MODIFIER (output) =========================//
		//===============================================================================================//

		this.BoardThicknessModifier = new CalcVarNumericalOutput(
			"boardThicknessModifier",
			boardThicknessModifierValue,
			boardThicknessModifierUnits,
			() -> {

				// Read in variables
				Double boardThicknessM = this.BoardThickness.getRawVal();

				// Convert to "mils" units, as this is what is used in IPC-2152 graphs
				double boardThicknessMils = boardThicknessM * (1 / UNIT_CONVERSION_M_PER_MIL);

				double boardThicknessModifierMulti = BOARD_THICKNESS_TREND_LINE_COEF_A *
					Math.pow(boardThicknessMils, BOARD_THICKNESS_TREND_LINE_COEF_B);

				return boardThicknessModifierMulti;

			},
			new NumberUnit[]{
				new NumberUnit("no unit", 1.0, NumberPreference.DEFAULT),
			},
			4,
			"The modifier to adjust the cross-sectional area with based on the board thickness." // Help text
			);

		// Add validators
		this.BoardThicknessModifier.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
		this.BoardThicknessModifier.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

		this.CalcVars.add(this.BoardThicknessModifier);


		//===============================================================================================//
		//========================================= IS PLANE PRESENT ====================================//
		//===============================================================================================//

		this.IsPlanePresent = new CalcVarComboBox(
			"isPlanePresent",
			isPlanePresentComboBox,
			new String[] {
				"True",
				"False",
			},
            () -> CalcVarBase.Directions.Input,
			"Set this to \"True\" if there is a copper plane either above or below the current-carrying track, and then enter the distance to it in the \"Plane Proximity\" field. If there is no plane, set this to \"False\", and the \"Plane Proximity\" variable will also dissappear.");

		this.CalcVars.add(this.IsPlanePresent);

		//===============================================================================================//
		//================================== PLANE PROXIMITY (input) ====================================//
		//===============================================================================================//

		this.PlaneProximity = new CalcVarNumericalInput(
			"planeProximity",
			planeProximityValue,
			planeProximityUnits,
			new NumberUnit[]{
				new NumberUnit("um", 1e-6),
				new NumberUnit("mm", 1e-3, NumberPreference.DEFAULT),
				new NumberUnit("mils", UnitConversionConstants.METERS_PER_MILS),
			},
			4,
			null,
			"The distance from the current-carrying track to the closest copper plane. If it is a 2-layer 1.6mm PCB, with the current-carrying track on one side and ground on the other side, then the plane proximity would be 1.6mm. For 4 or more layer boards, this value is likely to be much less." // Help text
			);

		//========== VALIDATORS ==========//
		this.PlaneProximity.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
		this.PlaneProximity.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
		this.PlaneProximity.AddValidator(
		   new Validator(() -> {
			   return ((this.PlaneProximity.getRawVal() < 144e-6) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
		   },
		   "Plane proximity is below the minimum value (144um) extracted from the plane proximity modififer graph in IPC-2152." +
		   " Results might not be as accurate (extrapolation will occur)."));
		this.PlaneProximity.AddValidator(
			new Validator(() -> {
				return ((this.PlaneProximity.getRawVal() > 2.40e-3) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
			},
			"Plane proximity is above the maximum value (2.40mm) extracted from the plane proximity modififer graph in IPC-2152." +
			" Results might not be as accurate (extrapolation will occur)."));
		// This next validator is dependent on other calculator variables
		this.PlaneProximity.AddValidator(
			new Validator(() -> {
				double planeProximityM = this.PlaneProximity.getRawVal();
				double boardThicknessM = this.BoardThickness.getRawVal();
				return ((planeProximityM > boardThicknessM) ? CalcValidationLevels.Error : CalcValidationLevels.Ok);
			},
			"Plane proximity cannot be larger than total board thickness (this just does not make sense!)."));

		this.CalcVars.add(this.PlaneProximity);

		//===============================================================================================//
		//=================================== PLANE PROXIMITY MODIFIER (output) =========================//
		//===============================================================================================//

		this.PlaneProximityModifier = new CalcVarNumericalOutput(
			"planeProximityModifier",
			planeProximityModifierValue,
			planeProximityModifierUnits,
			() -> {

				// Read in variables
				String isPlanePresent = this.IsPlanePresent.getRawVal();
				double planeProximityM = this.PlaneProximity.getRawVal();

				if (isPlanePresent == "False") {
					// Lets not modify the cross-sectional area by anything if no plane is present
					// (multiply by 1)
					return 1.0;
				}

				// Plane must be present at this point

				// Convert to "mils" units, as this is what is used in IPC-2152 graphs
				double planeProximityMils = planeProximityM * (1 / UNIT_CONVERSION_M_PER_MIL);

				double planeProximityModifierMulti = PLANE_PROXIMITY_TREND_LINE_COEF_M * planeProximityMils +
					PLANE_PROXIMITY_TREND_LINE_COEF_C;

				return planeProximityModifierMulti;

			},
			new NumberUnit[]{
				new NumberUnit("no unit", 1.0, NumberPreference.DEFAULT),
			},
			4,
			"The modifier to adjust the cross-sectional area with based on the proximity of a plane to the current-carrying track." // Help text
			);

		// Add validators
		this.PlaneProximityModifier.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
		this.PlaneProximityModifier.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

		this.CalcVars.add(this.PlaneProximityModifier);

		//===============================================================================================//
		//================================= THERMAL CONDUCTIVITY (input) ================================//
		//===============================================================================================//

		this.ThermalConductivity = new CalcVarNumericalInput(
			"boardThickness",
			thermalConductivityValue,
			thermalConductivityUnits,
			new NumberUnit[]{
				new NumberUnit("W/(m*K)", 1),
				new NumberUnit("BTU/(hour*ft*F)", UNIT_CONVERSION_THERMAL_CONDUCTIVITY_WATT_nMETER_nKELVIN_PER_BTU_nHOUR_nFT_nDEGF)
			},
			4,
			0.20,
			"The thermal conductivity of the PCB. This is normally hard to determine, but for most FR4 PCBs this is around 0.20Wm-1K-1." // Help text
			);

		//========== VALIDATORS ==========//
		this.ThermalConductivity.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
		this.ThermalConductivity.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
		this.ThermalConductivity.AddValidator(
		   new Validator(() -> {
			   return ((this.ThermalConductivity.getRawVal() < 180e-3) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
		   },
		   "Thermal conductivity is below the minimum value (180mW/m*C) extracted from the thermal conductivity modififer graph in IPC-2152." +
		   " Results might not be as accurate (extrapolation will occur)."));
		this.ThermalConductivity.AddValidator(
			new Validator(() -> {
				return ((this.ThermalConductivity.getRawVal() > 340e-3) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
			},
			"Thermal conductivity is above the maximum value (340mW/m*C) extracted from the thermal conductivity modififer graph in IPC-2152." +
			" Results might not be as accurate (extrapolation will occur)."));

		this.CalcVars.add(this.ThermalConductivity);

		//===============================================================================================//
		//================================ THERMAL CONDUCTIVITY MODIFIER (output) =======================//
		//===============================================================================================//

		this.ThermalConductivityModifier = new CalcVarNumericalOutput(
			"thermalConductivityModifier",
			thermalConductivityModifierValue,
			thermalConductivityModifierUnits,
			() -> {

				// Read in variables
				double thermalConductivityWattnMeternDegC = this.ThermalConductivity.getRawVal();

				// Convert to BTU/(ft*hour*F), as this is what the IPC-2152 graph used
				double thermalConductivityBtunFtnHournDegF = thermalConductivityWattnMeternDegC *
					(1 / UNIT_CONVERSION_THERMAL_CONDUCTIVITY_WATT_nMETER_nKELVIN_PER_BTU_nHOUR_nFT_nDEGF);

				double thermalConductivityModifierMulti = THERMAL_CONDUCTIVITY_TREND_LINE_COEF_M *
					thermalConductivityBtunFtnHournDegF + THERMAL_CONDUCTIVITY_TREND_LINE_COEF_C;

				return thermalConductivityModifierMulti;

			},
			new NumberUnit[]{
				new NumberUnit("no unit", 1.0, NumberPreference.DEFAULT),
			},
			4,
			"The modifier to adjust the cross-sectional area with based on the thermal conductivity of the PCB." // Help text
			);

		// Add validators
		this.ThermalConductivityModifier.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
		this.ThermalConductivityModifier.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

		this.CalcVars.add(this.ThermalConductivityModifier);

		//===============================================================================================//
		//================================= ADJUSTED CROSS-SECTIONAL AREA (output) ======================//
		//===============================================================================================//

		this.AdjustedCrossSectionalArea = new CalcVarNumericalOutput(
			"adjustedCrossSectionalArea",
			adjustedTrackCrossSectionalAreaValue,
			adjustedTrackCrossSectionalAreaUnits,
			() -> {

				double unadjustedTrackCrossSectionalArea = this.UnadjustedTrackCrossSectionalArea.getRawVal();
				double trackThicknessModifier = this.TrackThicknessModifier.getRawVal();
				double boardThicknessModifier = this.BoardThicknessModifier.getRawVal();
				double planeProximityModifier = this.PlaneProximityModifier.getRawVal();
				double thermalConductivityModifier = this.ThermalConductivityModifier.getRawVal();

				double adjustedTrackCrosssectionalAreaM2 =
					unadjustedTrackCrossSectionalArea *
					trackThicknessModifier *
					boardThicknessModifier *
					planeProximityModifier *
					thermalConductivityModifier;

				return adjustedTrackCrosssectionalAreaM2;

			},
			new NumberUnit[]{
				new NumberUnit("um²", 1e-12, NumberPreference.DEFAULT),
				new NumberUnit("mils²", UNIT_CONVERSION_M2_PER_MIL2),
				new NumberUnit("mm²", 1e-6),
			},
			4,
			"The adjusted cross-sectional area, which is equal to the unadjusted cross-section area multiplied by all of the modifiers." // Help text
			);

		// Add validators
		this.AdjustedCrossSectionalArea.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
		this.AdjustedCrossSectionalArea.AddValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

		this.CalcVars.add(this.AdjustedCrossSectionalArea);


		//===============================================================================================//
		//======================================== MIN. TRACK WIDTH =====================================//
		//===============================================================================================//

		this.MinTrackWidth = new CalcVarNumericalOutput(
			"minTrackWidth",
			minTrackWidthValue,
			minTrackWidthUnits,
			() -> {
				double minimumTrackWidthM = this.AdjustedCrossSectionalArea.getRawVal() / this.TrackThickness.getRawVal();

				return minimumTrackWidthM;
			},
			new NumberUnit[]{
				new NumberUnit("um", 1e-6),
				new NumberUnit("mm", 1e-3, NumberPreference.DEFAULT),
				new NumberUnit("mils", UnitConversionConstants.METERS_PER_MILS),
			},
			4,
			"The minimum track width needed to carry the specified current without exceeding the given temperature rise." // Help text
			);

		// Add validators
		this.MinTrackWidth.AddValidator(Validator.IsNumber(CalcValidationLevels.Error));
		this.MinTrackWidth.AddValidator(
		   new Validator(() -> {
			   return ((this.MinTrackWidth.getRawVal() <= 0) ? CalcValidationLevels.Error : CalcValidationLevels.Ok);
		   },
		   "Oh oh, one of the input variables is too far away from the data obtained from the IPC-2152 graphs, and the equations have produced a negative track width. Try and make sure input variables are green (or if orange, not too far away from being green)."));


		this.CalcVars.add(this.MinTrackWidth);

		//===============================================================================================//
		//=========================================== VIEW CONFIG =======================================//
		//===============================================================================================//

		// Setup the top PCB layer to dissappear if "External" is selected for the track layer,
		// and visible if "Internal" is selected.
		/*this.IsPlanePresent.RawValueChanged += (sender, e) => {
			if (this.IsPlanePresent.RawVal == "True") {
				view.Plane.Visibility = System.Windows.Visibility.Visible;
				view.PlaneProximityCanvas.Visibility = System.Windows.Visibility.Visible;
				view.BoardThicknessDimension.Length = 170;
			}
			else if (this.IsPlanePresent.RawVal == "False") {
				view.Plane.Visibility = System.Windows.Visibility.Collapsed;
				view.PlaneProximityCanvas.Visibility = System.Windows.Visibility.Collapsed;
				view.BoardThicknessDimension.Length = 120;
			}
		};*/

		//===============================================================================================//
		//============================================== FINAL ==========================================//
		//===============================================================================================//

		this.FindDependenciesAndDependants();
        this.RefreshDirectionsAndUpdateUI();
		this.RecalculateAllOutputs();
		this.ValidateAllVariables();

	} // public TrackCurrentIpc2152Calculator()
}
