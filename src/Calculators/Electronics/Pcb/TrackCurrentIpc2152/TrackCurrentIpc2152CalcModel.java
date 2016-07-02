package Calculators.Electronics.Pcb.TrackCurrentIpc2152;

import Core.*;
import Core.CalcVar.ComboBox.CalcVarComboBox;
import Core.CalcVar.CalcVarDirections;
import Core.CalcVar.Numerical.CalcVarNumericalInput;
import Core.CalcVar.Numerical.CalcVarNumericalOutput;
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
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @last-modified   2016-07-02
 * @since           2015-11-02
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

        trackCurrent.setName("trackCurrent");
        trackCurrent.setValueTextField(trackCurrentValue);
        trackCurrent.setUnitsComboBox(trackCurrentUnits);
        trackCurrent.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("uA", 1e-6),
                new NumberUnitMultiplier("mA", 1e-3),
                new NumberUnitMultiplier("A", 1e0, NumberPreference.DEFAULT),
        });
        trackCurrent.setNumDigitsToRound(4);
        trackCurrent.setHelpText("The current you want the PCB track to be able to handle.");
        trackCurrent.setIsEngineeringNotationEnabled(false);

        //====================== VALIDATORS ===================//
        trackCurrent.addValidator(Validator.IsNumber(trackCurrent, CalcValidationLevels.Error));
        trackCurrent.addValidator(Validator.IsGreaterThanZero(trackCurrent, CalcValidationLevels.Error));
        trackCurrent.addValidator(
                new Validator(() -> {
                    return ((trackCurrent.getRawVal() < 274e-3) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Current is below the minimum value (274mA) extracted from the universal graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));
        trackCurrent.addValidator(
                new Validator(() -> {
                    return ((trackCurrent.getRawVal() > 26.0) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Current is above the maximum value (26A) extracted from the universal graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));

        addCalcVar(trackCurrent);

        //===============================================================================================//
        //====================================== TEMP RISE (input) ======================================//
        //===============================================================================================//

        tempRise.setName("tempRise");
        tempRise.setValueTextField(tempRiseValue);
        tempRise.setUnitsComboBox(tempRiseUnits);
        tempRise.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("°C", 1e0, NumberPreference.DEFAULT),
        });
        tempRise.setNumDigitsToRound(4);
        tempRise.setHelpText("The maximum desired temperature rise due to the current flowing through the track. 20-40°c is a common value for this.");
        tempRise.setIsEngineeringNotationEnabled(false);

        //====================== VALIDATORS ===================//
        tempRise.addValidator(Validator.IsNumber(tempRise, CalcValidationLevels.Error));
        tempRise.addValidator(Validator.IsGreaterThanZero(tempRise, CalcValidationLevels.Error));
        tempRise.addValidator(
                new Validator(() -> {
                    return ((tempRise.getRawVal() < 1.0) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Temp. rise is below the minimum value (1°c) extracted from the universal graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));
        tempRise.addValidator(
                new Validator(() -> {
                    return ((tempRise.getRawVal() > 100.0) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Temp. rise is above the maximum value (100°c) extracted from the universal graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));

        addCalcVar(tempRise);

        //===============================================================================================//
        //============================ UN-ADJUSTED TRACK CROSS-SECTIONAL AREA (output) ==================//
        //===============================================================================================//

        unadjustedTrackCrossSectionalArea.setName("unadjustedTrackCrossSectionalArea");
        unadjustedTrackCrossSectionalArea.setValueTextField(unadjustedTrackCrossSectionalAreaValue);
        unadjustedTrackCrossSectionalArea.setUnitsComboBox(unadjustedTrackCrossSectionalAreaUnits);
        unadjustedTrackCrossSectionalArea.setEquationFunction(() -> {
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
        unadjustedTrackCrossSectionalArea.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("um²", 1e-12, NumberPreference.DEFAULT),
                new NumberUnitMultiplier("mils²", UNIT_CONVERSION_M2_PER_MIL2),
                new NumberUnitMultiplier("mm²", 1e-6),
        });
        unadjustedTrackCrossSectionalArea.setNumDigitsToRound(4);
        unadjustedTrackCrossSectionalArea.setHelpText("The unadjusted cross-sectional area. This gets multiplied by the many modifiers to give an adjusted cross-sectional area.");
        unadjustedTrackCrossSectionalArea.setIsEngineeringNotationEnabled(false);

        //====================== VALIDATORS ===================//
        unadjustedTrackCrossSectionalArea.addValidator(Validator.IsNumber(unadjustedTrackCrossSectionalArea, CalcValidationLevels.Error));
        unadjustedTrackCrossSectionalArea.addValidator(Validator.IsGreaterThanZero(unadjustedTrackCrossSectionalArea, CalcValidationLevels.Error));

        addCalcVar(unadjustedTrackCrossSectionalArea);


        //===============================================================================================//
        //================================== TRACK THICKNESS (input) ====================================//
        //===============================================================================================//

        trackThickness.setName("trackThickness");
        trackThickness.setValueTextField(trackThicknessValue);
        trackThickness.setUnitsComboBox(trackThicknessUnits);
        trackThickness.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("um", 1e-6, NumberPreference.DEFAULT),
                new NumberUnitMultiplier("mm", 1e-3),
                new NumberUnitMultiplier("oz", UnitConversionConstants.COPPER_THICKNESS_M_PER_OZ),
                new NumberUnitMultiplier("mils", UnitConversionConstants.METERS_PER_MILS),
        });
        trackThickness.setNumDigitsToRound(4);
        trackThickness.setHelpText("The thickness (height) of the track. This is equal to the thickness of the copper layer the track is on. This is also called the copper weight. Common values are 16um (0.5oz) or 32um (1oz).");
        trackThickness.setIsEngineeringNotationEnabled(false);

        //====================== VALIDATORS ===================//
        trackThickness.addValidator(Validator.IsNumber(trackThickness, CalcValidationLevels.Error));
        trackThickness.addValidator(Validator.IsGreaterThanZero(trackThickness, CalcValidationLevels.Error));
        trackThickness.addValidator(
                new Validator(() -> {
                    return ((trackThickness.getRawVal() < 17.5e-6) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Track thickness is below the minimum value (17.5um) extracted from the track thickness modififer graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));
        trackThickness.addValidator(
                new Validator(() -> {
                    return ((trackThickness.getRawVal() > 105.0036e-6) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Track thickness is above the maximum value (105um) extracted from the track thickness modififer graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));

        addCalcVar(trackThickness);

        //===============================================================================================//
        //=================================== TRACK THICKNESS MODIFIER (output) =========================//
        //===============================================================================================//

        trackThicknessModifier.setName("trackThicknessModifier");
        trackThicknessModifier.setValueTextField(trackThicknessModifierValue);
        trackThicknessModifier.setUnitsComboBox(trackThicknessModifierUnits);
        trackThicknessModifier.setEquationFunction(() -> {
            // Read in variables
            Double trackCurrentA = trackCurrent.getRawVal();
            Double trackThicknessM = trackThickness.getRawVal();

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
        trackThicknessModifier.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("no unit", 1.0, NumberPreference.DEFAULT),
        });
        trackThicknessModifier.setNumDigitsToRound(4);
        trackThicknessModifier.setHelpText("The modifier to adjust the cross-sectional area with based on the track thickness.");
        trackThicknessModifier.setIsEngineeringNotationEnabled(false);

        //====================== VALIDATORS ===================//
        trackThicknessModifier.addValidator(Validator.IsNumber(trackThicknessModifier, CalcValidationLevels.Error));
        trackThicknessModifier.addValidator(Validator.IsGreaterThanZero(trackThicknessModifier, CalcValidationLevels.Error));

        addCalcVar(trackThicknessModifier);

        //===============================================================================================//
        //================================== BOARD THICKNESS (input) ====================================//
        //===============================================================================================//

        boardThickness.setName("boardThickness");
        boardThickness.setValueTextField(boardThicknessValue);
        boardThickness.setUnitsComboBox(boardThicknessUnits);
        boardThickness.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("um", 1e-6),
                new NumberUnitMultiplier("mm", 1e-3, NumberPreference.DEFAULT),
                new NumberUnitMultiplier("mils", UnitConversionConstants.METERS_PER_MILS),
        });
        boardThickness.setNumDigitsToRound(4);
        boardThickness.setHelpText("The total thickness of the PCB that the track is on. A standard PCB thickness is 1.6mm.");
        boardThickness.setIsEngineeringNotationEnabled(false);

        //========== VALIDATORS ==========//
        boardThickness.addValidator(Validator.IsNumber(boardThickness, CalcValidationLevels.Error));
        boardThickness.addValidator(Validator.IsGreaterThanZero(boardThickness, CalcValidationLevels.Error));
        boardThickness.addValidator(
                new Validator(() -> {
                    return ((boardThickness.getRawVal() < 0.72e-3) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Board thickness is below the minimum value (0.72mm) extracted from the board thickness modifier graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));
        boardThickness.addValidator(
                new Validator(() -> {
                    return ((boardThickness.getRawVal() > 2.36e-3) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Board thickness is above the maximum value (2.36mm) extracted from the board thickness modifier graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));

        addCalcVar(boardThickness);

        //===============================================================================================//
        //=================================== BOARD THICKNESS MODIFIER (output) =========================//
        //===============================================================================================//

        boardThicknessModifier.setName("boardThicknessModifier");
        boardThicknessModifier.setValueTextField(boardThicknessModifierValue);
        boardThicknessModifier.setUnitsComboBox(boardThicknessModifierUnits);
        boardThicknessModifier.setEquationFunction(() -> {
            // Read in variables
            Double boardThicknessM = boardThickness.getRawVal();

            // Convert to "mils" units, as this is what is used in IPC-2152 graphs
            double boardThicknessMils = boardThicknessM * (1 / UNIT_CONVERSION_M_PER_MIL);

            double boardThicknessModifierMulti = BOARD_THICKNESS_TREND_LINE_COEF_A *
                    Math.pow(boardThicknessMils, BOARD_THICKNESS_TREND_LINE_COEF_B);

            return boardThicknessModifierMulti;
        });
        boardThicknessModifier.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("no unit", 1.0, NumberPreference.DEFAULT),
        });
        boardThicknessModifier.setNumDigitsToRound(4);
        boardThicknessModifier.setHelpText("The modifier to adjust the cross-sectional area with based on the board thickness.");
        boardThicknessModifier.setIsEngineeringNotationEnabled(false);

        //========== VALIDATORS ==========//
        boardThicknessModifier.addValidator(Validator.IsNumber(boardThicknessModifier, CalcValidationLevels.Error));
        boardThicknessModifier.addValidator(Validator.IsGreaterThanZero(boardThicknessModifier, CalcValidationLevels.Error));

        addCalcVar(boardThicknessModifier);


        //===============================================================================================//
        //====================================== IS PLANE PRESENT (combobox) ============================//
        //===============================================================================================//

        isPlanePresent = new CalcVarComboBox(
                "isPlanePresent",
                isPlanePresentComboBox,
                new String[]{
                        "True",
                        "False",
                },
                () -> CalcVarDirections.Input,
                "Set this to \"True\" if there is a copper plane either above or below the current-carrying track, and then enter the distance to it in the \"Plane Proximity\" field. If there is no plane, set this to \"False\", and the \"Plane Proximity\" variable will also disappear.");

        addCalcVar(isPlanePresent);

        //===============================================================================================//
        //================================== PLANE PROXIMITY (input) ====================================//
        //===============================================================================================//

        planeProximity.setName("planeProximity");
        planeProximity.setValueTextField(planeProximityValue);
        planeProximity.setUnitsComboBox(planeProximityUnits);
        planeProximity.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("um", 1e-6),
                new NumberUnitMultiplier("mm", 1e-3, NumberPreference.DEFAULT),
                new NumberUnitMultiplier("mils", UnitConversionConstants.METERS_PER_MILS),
        });
        planeProximity.setNumDigitsToRound(4);
        planeProximity.setHelpText("The distance from the current-carrying track to the closest copper plane. If it is a 2-layer 1.6mm PCB, with the current-carrying track on one side and ground on the other side, then the plane proximity would be 1.6mm. For 4 or more layer boards, this value is likely to be much less.");
        planeProximity.setIsEngineeringNotationEnabled(false);

        //========== VALIDATORS ==========//
        planeProximity.addValidator(Validator.IsNumber(planeProximity, CalcValidationLevels.Error));
        planeProximity.addValidator(Validator.IsGreaterThanZero(planeProximity, CalcValidationLevels.Error));
        planeProximity.addValidator(
                new Validator(() -> {
                    return ((planeProximity.getRawVal() < 144e-6) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Plane proximity is below the minimum value (144um) extracted from the plane proximity modifier graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));
        planeProximity.addValidator(
                new Validator(() -> {
                    return ((planeProximity.getRawVal() > 2.40e-3) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Plane proximity is above the maximum value (2.40mm) extracted from the plane proximity modifier graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));
        // This next validator is dependent on other calculator variables
        planeProximity.addValidator(
                new Validator(
                        new ArrayList<>(Arrays.asList(planeProximity, boardThickness)), // Dependency list
                        () -> {
                            return ((planeProximity.getRawVal() > boardThickness.getRawVal()) ? CalcValidationLevels.Error : CalcValidationLevels.Ok);
                        },
                        "Plane proximity cannot be larger than total board thickness (this just does not make sense!)."));

        addCalcVar(planeProximity);

        //===============================================================================================//
        //=================================== PLANE PROXIMITY MODIFIER (output) =========================//
        //===============================================================================================//

        planeProximityModifier.setName("planeProximityModifier");
        planeProximityModifier.setValueTextField(planeProximityModifierValue);
        planeProximityModifier.setUnitsComboBox(planeProximityModifierUnits);
        planeProximityModifier.setEquationFunction(() -> {
            // Read in variables
            String isPlanePresent = this.isPlanePresent.getRawVal();
            double planeProximityM = planeProximity.getRawVal();

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
        planeProximityModifier.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("no unit", 1.0, NumberPreference.DEFAULT),
        });
        planeProximityModifier.setNumDigitsToRound(4);
        planeProximityModifier.setHelpText("The modifier to adjust the cross-sectional area with based on the proximity of a plane to the current-carrying track.");
        planeProximityModifier.setIsEngineeringNotationEnabled(false);

        // Add validators
        planeProximityModifier.addValidator(Validator.IsNumber(planeProximityModifier, CalcValidationLevels.Error));
        planeProximityModifier.addValidator(Validator.IsGreaterThanZero(planeProximityModifier, CalcValidationLevels.Error));

        addCalcVar(planeProximityModifier);

        //===============================================================================================//
        //================================= THERMAL CONDUCTIVITY (input) ================================//
        //===============================================================================================//

        thermalConductivity.setName("thermalConductivity");
        thermalConductivity.setValueTextField(thermalConductivityValue);
        thermalConductivity.setUnitsComboBox(thermalConductivityUnits);
        thermalConductivity.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("W/(m*K)", 1),
                new NumberUnitMultiplier("BTU/(hour*ft*F)", UNIT_CONVERSION_THERMAL_CONDUCTIVITY_WATT_nMETER_nKELVIN_PER_BTU_nHOUR_nFT_nDEGF)
        });
        thermalConductivity.setNumDigitsToRound(4);
        thermalConductivity.setDefaultRawValue(0.20);
        thermalConductivity.setHelpText("The thermal conductivity of the PCB. This is normally hard to determine, but for most FR4 PCBs this is around 0.20Wm-1K-1.");
        thermalConductivity.setIsEngineeringNotationEnabled(false);

        //========== VALIDATORS ==========//
        thermalConductivity.addValidator(Validator.IsNumber(thermalConductivity, CalcValidationLevels.Error));
        thermalConductivity.addValidator(Validator.IsGreaterThanZero(thermalConductivity, CalcValidationLevels.Error));
        thermalConductivity.addValidator(
                new Validator(() -> {
                    return ((thermalConductivity.getRawVal() < 180e-3) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Thermal conductivity is below the minimum value (180mW/m*c) extracted from the thermal conductivity modififer graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));
        thermalConductivity.addValidator(
                new Validator(() -> {
                    return ((thermalConductivity.getRawVal() > 340e-3) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Thermal conductivity is above the maximum value (340mW/m*c) extracted from the thermal conductivity modififer graph in IPC-2152." +
                                " Results might not be as accurate (extrapolation will occur)."));

        addCalcVar(thermalConductivity);

        //===============================================================================================//
        //================================ THERMAL CONDUCTIVITY MODIFIER (output) =======================//
        //===============================================================================================//

        thermalConductivityModifier.setName("thermalConductivityModifier");
        thermalConductivityModifier.setValueTextField(thermalConductivityModifierValue);
        thermalConductivityModifier.setUnitsComboBox(thermalConductivityModifierUnits);
        thermalConductivityModifier.setEquationFunction(() -> {
            // Read in variables
            double thermalConductivityWattnMeternDegC = thermalConductivity.getRawVal();

            // Convert to BTU/(ft*hour*F), as this is what the IPC-2152 graph used
            double thermalConductivityBtunFtnHournDegF = thermalConductivityWattnMeternDegC *
                    (1 / UNIT_CONVERSION_THERMAL_CONDUCTIVITY_WATT_nMETER_nKELVIN_PER_BTU_nHOUR_nFT_nDEGF);

            double thermalConductivityModifierMulti = THERMAL_CONDUCTIVITY_TREND_LINE_COEF_M *
                    thermalConductivityBtunFtnHournDegF + THERMAL_CONDUCTIVITY_TREND_LINE_COEF_C;

            return thermalConductivityModifierMulti;
        });
        thermalConductivityModifier.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("no unit", 1.0, NumberPreference.DEFAULT),
        });
        thermalConductivityModifier.setNumDigitsToRound(4);
        thermalConductivityModifier.setHelpText("The modifier to adjust the cross-sectional area with based on the thermal conductivity of the PCB.");
        thermalConductivityModifier.setIsEngineeringNotationEnabled(false);

        // Add validators
        thermalConductivityModifier.addValidator(Validator.IsNumber(thermalConductivityModifier, CalcValidationLevels.Error));
        thermalConductivityModifier.addValidator(Validator.IsGreaterThanZero(thermalConductivityModifier, CalcValidationLevels.Error));

        addCalcVar(thermalConductivityModifier);

        //===============================================================================================//
        //================================= ADJUSTED CROSS-SECTIONAL AREA (output) ======================//
        //===============================================================================================//

        adjustedTrackCrossSectionalArea.setName("adjustedTrackCrossSectionalArea");
        adjustedTrackCrossSectionalArea.setValueTextField(adjustedTrackCrossSectionalAreaValue);
        adjustedTrackCrossSectionalArea.setUnitsComboBox(adjustedTrackCrossSectionalAreaUnits);
        adjustedTrackCrossSectionalArea.setEquationFunction(() -> {
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
        adjustedTrackCrossSectionalArea.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("um²", 1e-12, NumberPreference.DEFAULT),
                new NumberUnitMultiplier("mils²", UNIT_CONVERSION_M2_PER_MIL2),
                new NumberUnitMultiplier("mm²", 1e-6),
        });
        adjustedTrackCrossSectionalArea.setNumDigitsToRound(4);
        adjustedTrackCrossSectionalArea.setHelpText("The adjusted cross-sectional area, which is equal to the unadjusted cross-section area multiplied by all of the modifiers.");
        adjustedTrackCrossSectionalArea.setIsEngineeringNotationEnabled(false);

        // Add validators
        adjustedTrackCrossSectionalArea.addValidator(Validator.IsNumber(adjustedTrackCrossSectionalArea, CalcValidationLevels.Error));
        adjustedTrackCrossSectionalArea.addValidator(Validator.IsGreaterThanZero(adjustedTrackCrossSectionalArea, CalcValidationLevels.Error));

        addCalcVar(adjustedTrackCrossSectionalArea);


        //===============================================================================================//
        //==================================== MIN. TRACK WIDTH (output) ================================//
        //===============================================================================================//

        minTrackWidth.setName("currentLimit");
        minTrackWidth.setValueTextField(minTrackWidthValue);
        minTrackWidth.setUnitsComboBox(minTrackWidthUnits);
        minTrackWidth.setEquationFunction(() -> {
            // Read in variables
            double minimumTrackWidthM = adjustedTrackCrossSectionalArea.getRawVal() / trackThickness.getRawVal();

            return minimumTrackWidthM;
        });
        minTrackWidth.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("um", 1e-6),
                new NumberUnitMultiplier("mm", 1e-3, NumberPreference.DEFAULT),
                new NumberUnitMultiplier("mils", UnitConversionConstants.METERS_PER_MILS),
        });
        minTrackWidth.setNumDigitsToRound(4);
        minTrackWidth.setHelpText("The minimum track width needed to carry the specified current without exceeding the given temperature rise.");
        minTrackWidth.setIsEngineeringNotationEnabled(false);

        // Add validators
        minTrackWidth.addValidator(Validator.IsNumber(minTrackWidth, CalcValidationLevels.Error));
        minTrackWidth.addValidator(
                new Validator(() -> {
                    return ((minTrackWidth.getRawVal() <= 0) ? CalcValidationLevels.Error : CalcValidationLevels.Ok);
                },
                        "Oh oh, one of the input variables is too far away from the data obtained from the IPC-2152 graphs, and the equations have produced a negative track width. Try and make sure input variables are green (or if orange, not too far away from being green)."));


        addCalcVar(minTrackWidth);

        //===============================================================================================//
        //=========================================== VIEW CONFIG =======================================//
        //===============================================================================================//

        isPlanePresent.addValueChangedListener((calcVarBase) -> {
            System.out.println("isPlanePresent calculator variable changed.");

            if (isPlanePresent.getRawVal() == "True") {
                planeProximityLabel.setVisible(true);
                planeProximityValue.setVisible(true);
                planeProximityUnits.setVisible(true);
                planeProximityDimension.setVisible(true);

                boardThicknessDimension.setLength(120.0);
                boardThicknessDimension.setLayoutX(140);
                boardThicknessDimension.setLayoutY(245);

                bottomPlane.setVisible(true);

            } else if (isPlanePresent.getRawVal() == "False") {
                planeProximityLabel.setVisible(false);
                planeProximityValue.setVisible(false);
                planeProximityUnits.setVisible(false);
                planeProximityDimension.setVisible(false);

                boardThicknessDimension.setLength(90.0);
                boardThicknessDimension.setLayoutX(152);
                boardThicknessDimension.setLayoutY(235);

                bottomPlane.setVisible(false);
            }
        });

        //===============================================================================================//
        //============================================== FINAL ==========================================//
        //===============================================================================================//

        findDependenciesAndDependants();
        refreshDirectionsAndUpdateUI();
        recalculateAllOutputs();
        validateAllVariables();

    } // public TrackCurrentIpc2152Calculator()
}
