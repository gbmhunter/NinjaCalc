package Calculators.Electronics.Pcb.TrackCurrentIpc2152;

import Core.*;
import Core.CalcVar.CalcVarComboBox;
import Core.CalcVar.CalcVarDirections;
import Core.CalcVar.CalcVarNumericalInput;
import Core.CalcVar.CalcVarNumericalOutput;
import Core.View.Dimension.Dimension;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.ComboBox;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.shape.Rectangle;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;

/**
 * A track current calculator based of the IPC-2152 standard.
 *
 * @author gbmhunter (www.mbedded.ninja) <gbmhunter@gmail.com>
 * @last-modified 2016-04-12
 * @since 2015-11-02
 */
public class TrackCurrentIpc2152CalcModel extends Calculator {

    //===============================================================================================//
    //============================================ CONSTANTS ========================================//
    //===============================================================================================//


    final double NUM_MILS_PER_MM = 1000 / 25.4;
    //const double UNIT_CONVERSION_COPPER_THICKNESS_M_PER_OZ = 0.0000350012;
    final double UNIT_CONVERSION_M_PER_MIL = 25.4 / 1e6;
    final double UNIT_CONVERSION_M2_PER_MIL2 = UNIT_CONVERSION_M_PER_MIL * UNIT_CONVERSION_M_PER_MIL;

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
                            9.8453567795e-01,    // C0C0
                            -2.2281787548e-01,    // C0C1
                            2.0061423196e-01,    // C0C2
                            -4.1541116264e-02,    // C0C3
                    },
                    {
                            -1.6571949210e-02,    // C1C0
                            1.7520059279e-04,    // C1C1
                            -5.0615234096e-03,    // C1C2
                            2.2814836340e-03,    // C1C3
                    },
                    {
                            8.8711317661e-04,    // C2C0
                            1.3631745743e-03,    // C2C1
                            -2.2373309710e-04,    // C2C2
                            -1.0974218613e-04    // C2C3
                    },
                    {
                            -6.6729255031e-06,    // e.t.c...
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
    private WebView infoWebView;

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
    private Label planeProximityLabel;
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

    @FXML
    private Rectangle bottomPlane;

    @FXML
    private Dimension boardThicknessDimension;

    @FXML
    private Dimension planeProximityDimension;


    //===============================================================================================//
    //===================================== CALCULATOR VARIABLES ====================================//
    //===============================================================================================//

    CalcVarNumericalInput trackCurrent = new CalcVarNumericalInput();
    CalcVarNumericalInput tempRise = new CalcVarNumericalInput();
    CalcVarNumericalOutput unadjustedTrackCrossSectionalArea = new CalcVarNumericalOutput();
    CalcVarNumericalInput trackThickness = new CalcVarNumericalInput();
    CalcVarNumericalOutput trackThicknessModifier = new CalcVarNumericalOutput();
    CalcVarNumericalInput boardThickness = new CalcVarNumericalInput();
    CalcVarNumericalOutput boardThicknessModifier = new CalcVarNumericalOutput();

    CalcVarComboBox isPlanePresent;

    CalcVarNumericalInput planeProximity = new CalcVarNumericalInput();
    CalcVarNumericalOutput planeProximityModifier = new CalcVarNumericalOutput();
    CalcVarNumericalInput thermalConductivity = new CalcVarNumericalInput();
    CalcVarNumericalOutput thermalConductivityModifier = new CalcVarNumericalOutput();
    CalcVarNumericalOutput adjustedTrackCrossSectionalArea = new CalcVarNumericalOutput();
    CalcVarNumericalOutput minTrackWidth = new CalcVarNumericalOutput();

    //===============================================================================================//
    //========================================== CONSTRUCTORS =======================================//
    //===============================================================================================//

    public TrackCurrentIpc2152CalcModel() {

        super(
                "Track Current (IPC-2152)",
                "PCB track current carrying capability calculator, using the IPC-2152 standard.",
                new String[]{"Electronics", "PCB"},
                new String[]{"pcb", "track", "net", "current", "trace", "width", "carry", "heat", "hot", "temperature", "ipc", "ipc2221a", "ipc-2221a"});

        super.setIconImagePath(getClass().getResource("grid-icon.png"));

        //===============================================================================================//
        //======================================== LOAD .FXML FILE ======================================//
        //===============================================================================================//

        FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("TrackCurrentIpc2152CalcView.fxml"));
        //fxmlLoader.setRoot(this.view);
        fxmlLoader.setController(this);
        try {
            // Create a UI node from the FXML file, and save it to the view variable.
            // This will be used by the main window to create a new instance of this calculator when
            // the "Open" button is clicked.
            this.view = fxmlLoader.load();
        } catch (IOException exception) {
            throw new RuntimeException(exception);
        }

        //===============================================================================================//
        //================================ LOAD WEB VIEW FOR INFO SECTION ===============================//
        //===============================================================================================//

        WebEngine engine = this.infoWebView.getEngine();
        final String htmlFile = "info.html";
        URL url = getClass().getResource(htmlFile);
        engine.load(url.toExternalForm());

        //===============================================================================================//
        //===================================== TRACE CURRENT (input) ===================================//
        //===============================================================================================//

	   /*this.trackCurrent = new CalcVarNumericalInput(
            "traceCurrent",             // Debug name
			trackCurrentValue,     // Textbox for value (UI object)
			trackCurrentUnits,     // Combobox for units (UI object)
			new NumberUnitMultiplier[]{           // units
				new NumberUnitMultiplier("uA", 1e-6),
				new NumberUnitMultiplier("mA", 1e-3),
				new NumberUnitMultiplier("A", 1e0, NumberPreference.DEFAULT),
			},
			4,                          // Num. digits to round to
			null,                       // Default value
			"The current you want the PCB track to be able to handle." // Help info
			);*/

        this.trackCurrent.setName("trackCurrent");
        this.trackCurrent.setValueTextField(this.trackCurrentValue);
        this.trackCurrent.setUnitsComboBox(this.trackCurrentUnits);
        this.trackCurrent.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("uA", 1e-6),
                new NumberUnitMultiplier("mA", 1e-3),
                new NumberUnitMultiplier("A", 1e0, NumberPreference.DEFAULT),
        });
        this.trackCurrent.setNumDigitsToRound(4);
        this.trackCurrent.setHelpText("The current you want the PCB track to be able to handle.");
        this.trackCurrent.setIsEngineeringNotationEnabled(true);

        //====================== VALIDATORS ===================//
        this.trackCurrent.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.trackCurrent.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
        this.trackCurrent.addValidator(
                new Validator(() -> {
                    return ((this.trackCurrent.getRawVal() < 274e-3) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Current is below the minimum value (274mA) extracted from the universal graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));
        this.trackCurrent.addValidator(
                new Validator(() -> {
                    return ((this.trackCurrent.getRawVal() > 26.0) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Current is above the maximum value (26A) extracted from the universal graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));

        this.calcVars.add(this.trackCurrent);

        //===============================================================================================//
        //====================================== TEMP RISE (input) ======================================//
        //===============================================================================================//

		/*this.tempRise = new CalcVarNumericalInput(
			"tempRise",             // Debug name
			tempRiseValue,     // Textbox for value (UI object)
			tempRiseUnits,     // Combobox for units (UI object)
			new NumberUnitMultiplier[]{       // units
				new NumberUnitMultiplier("°c", 1e0, NumberPreference.DEFAULT),
			},
			4,                      // Num. digits to round to
			null,                   // Default value
			"The maximum desired temperature rise due to the current flowing through the track. 20-40°c is a common value for this." // Help info
			);*/

        this.tempRise.setName("tempRise");
        this.tempRise.setValueTextField(this.tempRiseValue);
        this.tempRise.setUnitsComboBox(this.tempRiseUnits);
        this.tempRise.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("°C", 1e0, NumberPreference.DEFAULT),
        });
        this.tempRise.setNumDigitsToRound(4);
        this.tempRise.setHelpText("The maximum desired temperature rise due to the current flowing through the track. 20-40°c is a common value for this.");
        this.tempRise.setIsEngineeringNotationEnabled(true);

        //====================== VALIDATORS ===================//
        this.tempRise.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.tempRise.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
        this.tempRise.addValidator(
                new Validator(() -> {
                    return ((this.tempRise.getRawVal() < 1.0) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Temp. rise is below the minimum value (1°c) extracted from the universal graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));
        this.tempRise.addValidator(
                new Validator(() -> {
                    return ((this.tempRise.getRawVal() > 100.0) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Temp. rise is above the maximum value (100°c) extracted from the universal graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));

        this.calcVars.add(this.tempRise);

        //===============================================================================================//
        //============================ UN-ADJUSTED TRACK CROSS-SECTIONAL AREA (output) ==================//
        //===============================================================================================//

		/*this.unadjustedTrackCrossSectionalArea = new CalcVarNumericalOutput(
			"unadjustedTrackCrossSectionalArea",
			unadjustedTrackCrossSectionalAreaValue,
			unadjustedTrackCrossSectionalAreaUnits,
			() -> {

				// Read in variables
				Double trackCurrent = this.trackCurrent.getRawVal();
				Double tempRise = this.tempRise.getRawVal();

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
			new NumberUnitMultiplier[]{

			},
			4,
			"The unadjusted cross-sectional area. This gets multiplied by the many modifiers to give an adjusted cross-sectional area.");*/

        this.unadjustedTrackCrossSectionalArea.setName("unadjustedTrackCrossSectionalArea");
        this.unadjustedTrackCrossSectionalArea.setValueTextField(this.unadjustedTrackCrossSectionalAreaValue);
        this.unadjustedTrackCrossSectionalArea.setUnitsComboBox(this.unadjustedTrackCrossSectionalAreaUnits);
        this.unadjustedTrackCrossSectionalArea.setEquationFunction(() -> {
            // Read in variables
            Double trackCurrent = this.trackCurrent.getRawVal();
            Double tempRise = this.tempRise.getRawVal();

            // Lets calculate the two co-efficients for the fixed-temp trend line
            Double universalChartTrendLineCoefA = UNIVERSAL_CHART_TREND_LINE_COEF_AA * Math.pow(tempRise, UNIVERSAL_CHART_TREND_LINE_COEF_AB);
            Double universalChartTrendLineCoefB = UNIVERSAL_CHART_TREND_LINE_COEF_BA * Math.pow(tempRise, UNIVERSAL_CHART_TREND_LINE_COEF_BB);

            // Now we know the two co-efficients, we can use the trend line eq. y=Ax^B to find the unadjusted cross-sectional area
            Double unadjustedTrackCrosssectionalAreaMils2 = Math.pow(trackCurrent / universalChartTrendLineCoefA, 1 / universalChartTrendLineCoefB);

            //console.log("unadjustedTrackCrosssectionalAreaMils2 = '" + unadjustedTrackCrosssectionalAreaMils2 + "'.");

            // Convert mils^2 to m^2 (store variable values in SI units)
            Double unadjustedTrackCrosssectionalAreaM2 = unadjustedTrackCrosssectionalAreaMils2 * (1 / (NUM_MILS_PER_MM * NUM_MILS_PER_MM * 1e6));

            return unadjustedTrackCrosssectionalAreaM2;
        });
        this.unadjustedTrackCrossSectionalArea.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("um²", 1e-12, NumberPreference.DEFAULT),
                new NumberUnitMultiplier("mils²", UNIT_CONVERSION_M2_PER_MIL2),
                new NumberUnitMultiplier("mm²", 1e-6),
        });
        this.unadjustedTrackCrossSectionalArea.setNumDigitsToRound(4);
        this.unadjustedTrackCrossSectionalArea.setHelpText("The unadjusted cross-sectional area. This gets multiplied by the many modifiers to give an adjusted cross-sectional area.");
        this.unadjustedTrackCrossSectionalArea.setIsEngineeringNotationEnabled(true);

        //====================== VALIDATORS ===================//
        this.unadjustedTrackCrossSectionalArea.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.unadjustedTrackCrossSectionalArea.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.unadjustedTrackCrossSectionalArea);


        //===============================================================================================//
        //================================== TRACK THICKNESS (input) ====================================//
        //===============================================================================================//

		/*this.trackThickness = new CalcVarNumericalInput(
			"trackThickness",
			trackThicknessValue,
			trackThicknessUnits,
			new NumberUnitMultiplier[]{
				new NumberUnitMultiplier("um", 1e-6, NumberPreference.DEFAULT),
				new NumberUnitMultiplier("mm", 1e-3),
				new NumberUnitMultiplier("oz", UnitConversionConstants.COPPER_THICKNESS_M_PER_OZ),
				new NumberUnitMultiplier("mils", UnitConversionConstants.METERS_PER_MILS),
			},
			4,
			null,
			"The thickness (height) of the track. This is equal to the thickness of the copper layer the track is on. This is also called the copper weight. Common values are 16um (0.5oz) or 32um (1oz)." // Help text
			);*/

        this.trackThickness.setName("trackThickness");
        this.trackThickness.setValueTextField(this.trackThicknessValue);
        this.trackThickness.setUnitsComboBox(this.trackThicknessUnits);
        this.trackThickness.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("um", 1e-6, NumberPreference.DEFAULT),
                new NumberUnitMultiplier("mm", 1e-3),
                new NumberUnitMultiplier("oz", UnitConversionConstants.COPPER_THICKNESS_M_PER_OZ),
                new NumberUnitMultiplier("mils", UnitConversionConstants.METERS_PER_MILS),
        });
        this.trackThickness.setNumDigitsToRound(4);
        this.trackThickness.setHelpText("The thickness (height) of the track. This is equal to the thickness of the copper layer the track is on. This is also called the copper weight. Common values are 16um (0.5oz) or 32um (1oz).");
        this.trackThickness.setIsEngineeringNotationEnabled(true);

        //====================== VALIDATORS ===================//
        this.trackThickness.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.trackThickness.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
        this.trackThickness.addValidator(
                new Validator(() -> {
                    return ((this.trackThickness.getRawVal() < 17.5e-6) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Track thickness is below the minimum value (17.5um) extracted from the track thickness modififer graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));
        this.trackThickness.addValidator(
                new Validator(() -> {
                    return ((this.trackThickness.getRawVal() > 105.0036e-6) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Track thickness is above the maximum value (105um) extracted from the track thickness modififer graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));

        this.calcVars.add(this.trackThickness);

        //===============================================================================================//
        //=================================== TRACK THICKNESS MODIFIER (output) =========================//
        //===============================================================================================//

		/*this.trackThicknessModifier = new CalcVarNumericalOutput(
			"trackThicknessModifier",
			trackThicknessModifierValue,
			trackThicknessModifierUnits,
			() -> {

				// Read in variables
				Double trackCurrentA = this.trackCurrent.getRawVal();
				Double trackThicknessM = this.trackThickness.getRawVal();

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
			new NumberUnitMultiplier[]{
				new NumberUnitMultiplier("no unit", 1.0, NumberPreference.DEFAULT),
			},
			4,
			"The modifier to adjust the cross-sectional area with based on the track thickness." // Help text
			);*/

        this.trackThicknessModifier.setName("trackThicknessModifier");
        this.trackThicknessModifier.setValueTextField(this.trackThicknessModifierValue);
        this.trackThicknessModifier.setUnitsComboBox(this.trackThicknessModifierUnits);
        this.trackThicknessModifier.setEquationFunction(() -> {
            // Read in variables
            Double trackCurrentA = this.trackCurrent.getRawVal();
            Double trackThicknessM = this.trackThickness.getRawVal();

            // Convert to "oz" units, as this is what is used in IPC-2152 graphs
            Double trackThicknessOz = trackThicknessM * (1 / UnitConversionConstants.COPPER_THICKNESS_M_PER_OZ);
            //console.log("trackThicknessOz = " + trackThicknessOz);

            // Lets calculate the two co-efficients for the fixed-temp trend line
            double[] trackThicknessTrendLineCoefA = new double[TRACK_THICKNESS_TREND_LINE_COEF_COEF_A.length];

            //console.log("test = " + TRACK_THICKNESS_TREND_LINE_COEF_COEF_A[0].length);


            // Outer loop calculates all co-efficients
            for (Integer i = 0; i < TRACK_THICKNESS_TREND_LINE_COEF_COEF_A.length; i++) {
                // Initialise array element with 0
                trackThicknessTrendLineCoefA[i] = 0;

                //console.log("i = " + i);
                //console.log("test = " + TRACK_THICKNESS_TREND_LINE_COEF_COEF_A[i].length);

                // Inner loop calculates a single co-efficient
                for (Integer j = 0; j < TRACK_THICKNESS_TREND_LINE_COEF_COEF_A[0].length; j++) {
                    //TRACK_THICKNESS_TREND_LINE_COEF_COEF_A[0,0] = 2;
                    //console.log("sum = " + TRACK_THICKNESS_TREND_LINE_COEF_COEF_A[0,0]);
                    trackThicknessTrendLineCoefA[i] += TRACK_THICKNESS_TREND_LINE_COEF_COEF_A[i][j] * Math.pow(trackThicknessOz, j);
                }

                //console.log("trackThicknessTrendLineCoefA[" + i + "] = '" + trackThicknessTrendLineCoefA[i] + "'.");
            }

            // Now we have calculate the 5th degree polynomial co-efficients, we can finally calc the thickness modifier
            double trackThicknessModifierMulti = 0;

            for (Integer i = 0; i < trackThicknessTrendLineCoefA.length; i++) {
                trackThicknessModifierMulti += trackThicknessTrendLineCoefA[i] * Math.pow(trackCurrentA, i);
            }

            return trackThicknessModifierMulti;
        });
        this.trackThicknessModifier.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("no unit", 1.0, NumberPreference.DEFAULT),
        });
        this.trackThicknessModifier.setNumDigitsToRound(4);
        this.trackThicknessModifier.setHelpText("The modifier to adjust the cross-sectional area with based on the track thickness.");
        this.trackThicknessModifier.setIsEngineeringNotationEnabled(true);

        //====================== VALIDATORS ===================//
        this.trackThicknessModifier.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.trackThicknessModifier.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.trackThicknessModifier);

        //===============================================================================================//
        //================================== BOARD THICKNESS (input) ====================================//
        //===============================================================================================//

		/*this.boardThickness = new CalcVarNumericalInput(
			"boardThickness",
			boardThicknessValue,
			boardThicknessUnits,
			new NumberUnitMultiplier[]{
				new NumberUnitMultiplier("um", 1e-6),
				new NumberUnitMultiplier("mm", 1e-3, NumberPreference.DEFAULT),
				new NumberUnitMultiplier("mils", UnitConversionConstants.METERS_PER_MILS),
			},
			4,
			null,
			"The total thickness of the PCB that the track is on. A standard PCB thickness is 1.6mm." // Help text
			);*/

        this.boardThickness.setName("boardThickness");
        this.boardThickness.setValueTextField(this.boardThicknessValue);
        this.boardThickness.setUnitsComboBox(this.boardThicknessUnits);
        this.boardThickness.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("um", 1e-6),
                new NumberUnitMultiplier("mm", 1e-3, NumberPreference.DEFAULT),
                new NumberUnitMultiplier("mils", UnitConversionConstants.METERS_PER_MILS),
        });
        this.boardThickness.setNumDigitsToRound(4);
        this.boardThickness.setHelpText("The total thickness of the PCB that the track is on. A standard PCB thickness is 1.6mm.");
        this.boardThickness.setIsEngineeringNotationEnabled(true);

        //========== VALIDATORS ==========//
        this.boardThickness.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.boardThickness.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
        this.boardThickness.addValidator(
                new Validator(() -> {
                    return ((this.boardThickness.getRawVal() < 0.72e-3) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Board thickness is below the minimum value (0.72mm) extracted from the board thickness modifier graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));
        this.boardThickness.addValidator(
                new Validator(() -> {
                    return ((this.boardThickness.getRawVal() > 2.36e-3) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Board thickness is above the maximum value (2.36mm) extracted from the board thickness modifier graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));

        this.calcVars.add(this.boardThickness);

        //===============================================================================================//
        //=================================== BOARD THICKNESS MODIFIER (output) =========================//
        //===============================================================================================//

		/*this.boardThicknessModifier = new CalcVarNumericalOutput(
			"boardThicknessModifier",
			boardThicknessModifierValue,
			boardThicknessModifierUnits,
			() -> {

				// Read in variables
				Double boardThicknessM = this.boardThickness.getRawVal();

				// Convert to "mils" units, as this is what is used in IPC-2152 graphs
				double boardThicknessMils = boardThicknessM * (1 / UNIT_CONVERSION_M_PER_MIL);

				double boardThicknessModifierMulti = BOARD_THICKNESS_TREND_LINE_COEF_A *
					Math.pow(boardThicknessMils, BOARD_THICKNESS_TREND_LINE_COEF_B);

				return boardThicknessModifierMulti;

			},
			new NumberUnitMultiplier[]{
				new NumberUnitMultiplier("no unit", 1.0, NumberPreference.DEFAULT),
			},
			4,
			"The modifier to adjust the cross-sectional area with based on the board thickness." // Help text
			);*/

        this.boardThicknessModifier.setName("boardThicknessModifier");
        this.boardThicknessModifier.setValueTextField(this.boardThicknessModifierValue);
        this.boardThicknessModifier.setUnitsComboBox(this.boardThicknessModifierUnits);
        this.boardThicknessModifier.setEquationFunction(() -> {
            // Read in variables
            Double boardThicknessM = this.boardThickness.getRawVal();

            // Convert to "mils" units, as this is what is used in IPC-2152 graphs
            double boardThicknessMils = boardThicknessM * (1 / UNIT_CONVERSION_M_PER_MIL);

            double boardThicknessModifierMulti = BOARD_THICKNESS_TREND_LINE_COEF_A *
                    Math.pow(boardThicknessMils, BOARD_THICKNESS_TREND_LINE_COEF_B);

            return boardThicknessModifierMulti;
        });
        this.boardThicknessModifier.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("no unit", 1.0, NumberPreference.DEFAULT),
        });
        this.boardThicknessModifier.setNumDigitsToRound(4);
        this.boardThicknessModifier.setHelpText("The modifier to adjust the cross-sectional area with based on the board thickness.");
        this.boardThicknessModifier.setIsEngineeringNotationEnabled(true);

        //========== VALIDATORS ==========//
        this.boardThicknessModifier.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.boardThicknessModifier.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.boardThicknessModifier);


        //===============================================================================================//
        //====================================== IS PLANE PRESENT (combobox) ============================//
        //===============================================================================================//

        this.isPlanePresent = new CalcVarComboBox(
                "isPlanePresent",
                isPlanePresentComboBox,
                new String[]{
                        "True",
                        "False",
                },
                () -> CalcVarDirections.Input,
                "Set this to \"True\" if there is a copper plane either above or below the current-carrying track, and then enter the distance to it in the \"Plane Proximity\" field. If there is no plane, set this to \"False\", and the \"Plane Proximity\" variable will also disappear.");

        this.calcVars.add(this.isPlanePresent);

        //===============================================================================================//
        //================================== PLANE PROXIMITY (input) ====================================//
        //===============================================================================================//

		/*this.planeProximity = new CalcVarNumericalInput(
			"planeProximity",
			planeProximityValue,
			planeProximityUnits,
			new NumberUnitMultiplier[]{
				new NumberUnitMultiplier("um", 1e-6),
				new NumberUnitMultiplier("mm", 1e-3, NumberPreference.DEFAULT),
				new NumberUnitMultiplier("mils", UnitConversionConstants.METERS_PER_MILS),
			},
			4,
			null,
			"The distance from the current-carrying track to the closest copper plane. If it is a 2-layer 1.6mm PCB, with the current-carrying track on one side and ground on the other side, then the plane proximity would be 1.6mm. For 4 or more layer boards, this value is likely to be much less." // Help text
			);*/

        this.planeProximity.setName("planeProximity");
        this.planeProximity.setValueTextField(this.planeProximityValue);
        this.planeProximity.setUnitsComboBox(this.planeProximityUnits);
        this.planeProximity.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("um", 1e-6),
                new NumberUnitMultiplier("mm", 1e-3, NumberPreference.DEFAULT),
                new NumberUnitMultiplier("mils", UnitConversionConstants.METERS_PER_MILS),
        });
        this.planeProximity.setNumDigitsToRound(4);
        this.planeProximity.setHelpText("The distance from the current-carrying track to the closest copper plane. If it is a 2-layer 1.6mm PCB, with the current-carrying track on one side and ground on the other side, then the plane proximity would be 1.6mm. For 4 or more layer boards, this value is likely to be much less.");
        this.planeProximity.setIsEngineeringNotationEnabled(true);

        //========== VALIDATORS ==========//
        this.planeProximity.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.planeProximity.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
        this.planeProximity.addValidator(
                new Validator(() -> {
                    return ((this.planeProximity.getRawVal() < 144e-6) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Plane proximity is below the minimum value (144um) extracted from the plane proximity modifier graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));
        this.planeProximity.addValidator(
                new Validator(() -> {
                    return ((this.planeProximity.getRawVal() > 2.40e-3) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Plane proximity is above the maximum value (2.40mm) extracted from the plane proximity modifier graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));
        // This next validator is dependent on other calculator variables
        this.planeProximity.addValidator(
                new Validator(
                        new ArrayList<>(Arrays.asList(this.planeProximity, this.boardThickness)), // Dependency list
                        () -> {
                            return ((this.planeProximity.getRawVal() > this.boardThickness.getRawVal()) ? CalcValidationLevels.Error : CalcValidationLevels.Ok);
                        },
                        "Plane proximity cannot be larger than total board thickness (this just does not make sense!)."));

        this.calcVars.add(this.planeProximity);

        //===============================================================================================//
        //=================================== PLANE PROXIMITY MODIFIER (output) =========================//
        //===============================================================================================//

		/*this.planeProximityModifier = new CalcVarNumericalOutput(
			"planeProximityModifier",
			planeProximityModifierValue,
			planeProximityModifierUnits,
			() -> {

				// Read in variables
				String isPlanePresent = this.isPlanePresent.getRawVal();
				double planeProximityM = this.planeProximity.getRawVal();

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
			new NumberUnitMultiplier[]{
				new NumberUnitMultiplier("no unit", 1.0, NumberPreference.DEFAULT),
			},
			4,
			"The modifier to adjust the cross-sectional area with based on the proximity of a plane to the current-carrying track." // Help text
			);*/

        this.planeProximityModifier.setName("planeProximityModifier");
        this.planeProximityModifier.setValueTextField(this.planeProximityModifierValue);
        this.planeProximityModifier.setUnitsComboBox(this.planeProximityModifierUnits);
        this.planeProximityModifier.setEquationFunction(() -> {
            // Read in variables
            String isPlanePresent = this.isPlanePresent.getRawVal();
            double planeProximityM = this.planeProximity.getRawVal();

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
        });
        this.planeProximityModifier.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("no unit", 1.0, NumberPreference.DEFAULT),
        });
        this.planeProximityModifier.setNumDigitsToRound(4);
        this.planeProximityModifier.setHelpText("The modifier to adjust the cross-sectional area with based on the proximity of a plane to the current-carrying track.");
        this.planeProximityModifier.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.planeProximityModifier.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.planeProximityModifier.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.planeProximityModifier);

        //===============================================================================================//
        //================================= THERMAL CONDUCTIVITY (input) ================================//
        //===============================================================================================//

		/*this.thermalConductivity = new CalcVarNumericalInput(
			"boardThickness",
			thermalConductivityValue,
			thermalConductivityUnits,
			new NumberUnitMultiplier[]{
				new NumberUnitMultiplier("W/(m*K)", 1),
				new NumberUnitMultiplier("BTU/(hour*ft*F)", UNIT_CONVERSION_THERMAL_CONDUCTIVITY_WATT_nMETER_nKELVIN_PER_BTU_nHOUR_nFT_nDEGF)
			},
			4,
			0.20,
			"The thermal conductivity of the PCB. This is normally hard to determine, but for most FR4 PCBs this is around 0.20Wm-1K-1." // Help text
			);*/

        this.thermalConductivity.setName("thermalConductivity");
        this.thermalConductivity.setValueTextField(this.thermalConductivityValue);
        this.thermalConductivity.setUnitsComboBox(this.thermalConductivityUnits);
        this.thermalConductivity.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("W/(m*K)", 1),
                new NumberUnitMultiplier("BTU/(hour*ft*F)", UNIT_CONVERSION_THERMAL_CONDUCTIVITY_WATT_nMETER_nKELVIN_PER_BTU_nHOUR_nFT_nDEGF)
        });
        this.thermalConductivity.setNumDigitsToRound(4);
        this.thermalConductivity.setDefaultRawValue(0.20);
        this.thermalConductivity.setHelpText("The thermal conductivity of the PCB. This is normally hard to determine, but for most FR4 PCBs this is around 0.20Wm-1K-1.");
        this.thermalConductivity.setIsEngineeringNotationEnabled(true);

        //========== VALIDATORS ==========//
        this.thermalConductivity.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.thermalConductivity.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
        this.thermalConductivity.addValidator(
                new Validator(() -> {
                    return ((this.thermalConductivity.getRawVal() < 180e-3) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Thermal conductivity is below the minimum value (180mW/m*c) extracted from the thermal conductivity modififer graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));
        this.thermalConductivity.addValidator(
                new Validator(() -> {
                    return ((this.thermalConductivity.getRawVal() > 340e-3) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Thermal conductivity is above the maximum value (340mW/m*c) extracted from the thermal conductivity modififer graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));

        this.calcVars.add(this.thermalConductivity);

        //===============================================================================================//
        //================================ THERMAL CONDUCTIVITY MODIFIER (output) =======================//
        //===============================================================================================//

		/*this.thermalConductivityModifier = new CalcVarNumericalOutput(
			"thermalConductivityModifier",
			thermalConductivityModifierValue,
			thermalConductivityModifierUnits,
			() -> {

				// Read in variables
				double thermalConductivityWattnMeternDegC = this.thermalConductivity.getRawVal();

				// Convert to BTU/(ft*hour*F), as this is what the IPC-2152 graph used
				double thermalConductivityBtunFtnHournDegF = thermalConductivityWattnMeternDegC *
					(1 / UNIT_CONVERSION_THERMAL_CONDUCTIVITY_WATT_nMETER_nKELVIN_PER_BTU_nHOUR_nFT_nDEGF);

				double thermalConductivityModifierMulti = THERMAL_CONDUCTIVITY_TREND_LINE_COEF_M *
					thermalConductivityBtunFtnHournDegF + THERMAL_CONDUCTIVITY_TREND_LINE_COEF_C;

				return thermalConductivityModifierMulti;

			},
			new NumberUnitMultiplier[]{
				new NumberUnitMultiplier("no unit", 1.0, NumberPreference.DEFAULT),
			},
			4,
			"The modifier to adjust the cross-sectional area with based on the thermal conductivity of the PCB." // Help text
			);*/

        this.thermalConductivityModifier.setName("thermalConductivityModifier");
        this.thermalConductivityModifier.setValueTextField(this.thermalConductivityModifierValue);
        this.thermalConductivityModifier.setUnitsComboBox(this.thermalConductivityModifierUnits);
        this.thermalConductivityModifier.setEquationFunction(() -> {
            // Read in variables
            double thermalConductivityWattnMeternDegC = this.thermalConductivity.getRawVal();

            // Convert to BTU/(ft*hour*F), as this is what the IPC-2152 graph used
            double thermalConductivityBtunFtnHournDegF = thermalConductivityWattnMeternDegC *
                    (1 / UNIT_CONVERSION_THERMAL_CONDUCTIVITY_WATT_nMETER_nKELVIN_PER_BTU_nHOUR_nFT_nDEGF);

            double thermalConductivityModifierMulti = THERMAL_CONDUCTIVITY_TREND_LINE_COEF_M *
                    thermalConductivityBtunFtnHournDegF + THERMAL_CONDUCTIVITY_TREND_LINE_COEF_C;

            return thermalConductivityModifierMulti;
        });
        this.thermalConductivityModifier.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("no unit", 1.0, NumberPreference.DEFAULT),
        });
        this.thermalConductivityModifier.setNumDigitsToRound(4);
        this.thermalConductivityModifier.setHelpText("The modifier to adjust the cross-sectional area with based on the thermal conductivity of the PCB.");
        this.thermalConductivityModifier.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.thermalConductivityModifier.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.thermalConductivityModifier.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.thermalConductivityModifier);

        //===============================================================================================//
        //================================= ADJUSTED CROSS-SECTIONAL AREA (output) ======================//
        //===============================================================================================//

		/*this.adjustedTrackCrossSectionalArea = new CalcVarNumericalOutput(
			"adjustedTrackCrossSectionalArea",
			adjustedTrackCrossSectionalAreaValue,
			adjustedTrackCrossSectionalAreaUnits,
			() -> {

				double unadjustedTrackCrossSectionalArea = this.unadjustedTrackCrossSectionalArea.getRawVal();
				double trackThicknessModifier = this.trackThicknessModifier.getRawVal();
				double boardThicknessModifier = this.boardThicknessModifier.getRawVal();
				double planeProximityModifier = this.planeProximityModifier.getRawVal();
				double thermalConductivityModifier = this.thermalConductivityModifier.getRawVal();

				double adjustedTrackCrosssectionalAreaM2 =
					unadjustedTrackCrossSectionalArea *
					trackThicknessModifier *
					boardThicknessModifier *
					planeProximityModifier *
					thermalConductivityModifier;

				return adjustedTrackCrosssectionalAreaM2;

			},
			new NumberUnitMultiplier[]{
				new NumberUnitMultiplier("um²", 1e-12, NumberPreference.DEFAULT),
				new NumberUnitMultiplier("mils²", UNIT_CONVERSION_M2_PER_MIL2),
				new NumberUnitMultiplier("mm²", 1e-6),
			},
			4,
			"The adjusted cross-sectional area, which is equal to the unadjusted cross-section area multiplied by all of the modifiers." // Help text
			);*/

        this.adjustedTrackCrossSectionalArea.setName("adjustedTrackCrossSectionalArea");
        this.adjustedTrackCrossSectionalArea.setValueTextField(this.adjustedTrackCrossSectionalAreaValue);
        this.adjustedTrackCrossSectionalArea.setUnitsComboBox(this.adjustedTrackCrossSectionalAreaUnits);
        this.adjustedTrackCrossSectionalArea.setEquationFunction(() -> {
            // Read in variables
            double unadjustedTrackCrossSectionalArea = this.unadjustedTrackCrossSectionalArea.getRawVal();
            double trackThicknessModifier = this.trackThicknessModifier.getRawVal();
            double boardThicknessModifier = this.boardThicknessModifier.getRawVal();
            double planeProximityModifier = this.planeProximityModifier.getRawVal();
            double thermalConductivityModifier = this.thermalConductivityModifier.getRawVal();

            double adjustedTrackCrosssectionalAreaM2 =
                    unadjustedTrackCrossSectionalArea *
                            trackThicknessModifier *
                            boardThicknessModifier *
                            planeProximityModifier *
                            thermalConductivityModifier;

            return adjustedTrackCrosssectionalAreaM2;
        });
        this.adjustedTrackCrossSectionalArea.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("um²", 1e-12, NumberPreference.DEFAULT),
                new NumberUnitMultiplier("mils²", UNIT_CONVERSION_M2_PER_MIL2),
                new NumberUnitMultiplier("mm²", 1e-6),
        });
        this.adjustedTrackCrossSectionalArea.setNumDigitsToRound(4);
        this.adjustedTrackCrossSectionalArea.setHelpText("The adjusted cross-sectional area, which is equal to the unadjusted cross-section area multiplied by all of the modifiers.");
        this.adjustedTrackCrossSectionalArea.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.adjustedTrackCrossSectionalArea.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.adjustedTrackCrossSectionalArea.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.adjustedTrackCrossSectionalArea);


        //===============================================================================================//
        //==================================== MIN. TRACK WIDTH (output) ================================//
        //===============================================================================================//

		/*this.currentLimit = new CalcVarNumericalOutput(
			"currentLimit",
			minTrackWidthValue,
			minTrackWidthUnits,
			() -> {
				double minimumTrackWidthM = this.adjustedTrackCrossSectionalArea.getRawVal() / this.trackThickness.getRawVal();

				return minimumTrackWidthM;
			},
			new NumberUnitMultiplier[]{
				new NumberUnitMultiplier("um", 1e-6),
				new NumberUnitMultiplier("mm", 1e-3, NumberPreference.DEFAULT),
				new NumberUnitMultiplier("mils", UnitConversionConstants.METERS_PER_MILS),
			},
			4,
			"The minimum track width needed to carry the specified current without exceeding the given temperature rise." // Help text
			);*/

        this.minTrackWidth.setName("currentLimit");
        this.minTrackWidth.setValueTextField(this.minTrackWidthValue);
        this.minTrackWidth.setUnitsComboBox(this.minTrackWidthUnits);
        this.minTrackWidth.setEquationFunction(() -> {
            // Read in variables
            double minimumTrackWidthM = this.adjustedTrackCrossSectionalArea.getRawVal() / this.trackThickness.getRawVal();

            return minimumTrackWidthM;
        });
        this.minTrackWidth.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("um", 1e-6),
                new NumberUnitMultiplier("mm", 1e-3, NumberPreference.DEFAULT),
                new NumberUnitMultiplier("mils", UnitConversionConstants.METERS_PER_MILS),
        });
        this.minTrackWidth.setNumDigitsToRound(4);
        this.minTrackWidth.setHelpText("The minimum track width needed to carry the specified current without exceeding the given temperature rise.");
        this.minTrackWidth.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.minTrackWidth.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.minTrackWidth.addValidator(
                new Validator(() -> {
                    return ((this.minTrackWidth.getRawVal() <= 0) ? CalcValidationLevels.Error : CalcValidationLevels.Ok);
                },
                        "Oh oh, one of the input variables is too far away from the data obtained from the IPC-2152 graphs, and the equations have produced a negative track width. Try and make sure input variables are green (or if orange, not too far away from being green)."));


        this.calcVars.add(this.minTrackWidth);

        //===============================================================================================//
        //=========================================== VIEW CONFIG =======================================//
        //===============================================================================================//

        this.isPlanePresent.addRawValueChangedListener((calcVarBase) -> {
            System.out.println("isPlanePresent calculator variable changed.");

            if (this.isPlanePresent.getRawVal() == "True") {
                this.planeProximityLabel.setVisible(true);
                this.planeProximityValue.setVisible(true);
                this.planeProximityUnits.setVisible(true);
                this.planeProximityDimension.setVisible(true);

                this.boardThicknessDimension.setLength(120.0);
                this.boardThicknessDimension.setLayoutX(140);
                this.boardThicknessDimension.setLayoutY(245);

                this.bottomPlane.setVisible(true);

            } else if (isPlanePresent.getRawVal() == "False") {
                this.planeProximityLabel.setVisible(false);
                this.planeProximityValue.setVisible(false);
                this.planeProximityUnits.setVisible(false);
                this.planeProximityDimension.setVisible(false);

                this.boardThicknessDimension.setLength(90.0);
                this.boardThicknessDimension.setLayoutX(152);
                this.boardThicknessDimension.setLayoutY(235);

                this.bottomPlane.setVisible(false);
            }
        });

        //===============================================================================================//
        //============================================== FINAL ==========================================//
        //===============================================================================================//

        this.findDependenciesAndDependants();
        this.refreshDirectionsAndUpdateUI();
        this.recalculateAllOutputs();
        this.validateAllVariables();

    } // public TrackCurrentIpc2152Calculator()
}
