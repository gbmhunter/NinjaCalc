package Calculators.Electronics.Pcb.TrackCurrentIpc2221A;


import Core.CalcVar.ComboBox.CalcVarComboBox;
import Core.CalcVar.CalcVarDirections;
import Core.CalcVar.Numerical.CalcVarNumericalInput;
import Core.CalcVar.Numerical.CalcVarNumericalOutput;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.*;

import Core.*;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;

import java.io.IOException;
import java.net.URL;

/**
 * A track current calculator based of the IPC-2221A standard.
 *
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @last-modified   2016-04-23
 * @since           2015-11-02
 */
public class TrackCurrentIpc2221ACalcModel extends Calculator {

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
    private TextField trackThicknessValue;
    @FXML
    private ComboBox trackThicknessUnits;

    @FXML
    private ComboBox trackLayerComboBox;

    @FXML
    private TextField minTrackWidthValue;
    @FXML
    private ComboBox minTrackWidthUnits;

    //===============================================================================================//
    //====================================== CALCULATOR VARIABLES ===================================//
    //===============================================================================================//

    public CalcVarNumericalInput trackCurrent = new CalcVarNumericalInput();

    public CalcVarNumericalInput tempRise = new CalcVarNumericalInput();

    public CalcVarNumericalInput trackThickness = new CalcVarNumericalInput();

    public CalcVarComboBox trackLayer;

    public CalcVarNumericalOutput minTrackWidth = new CalcVarNumericalOutput();

    //===============================================================================================//
    //========================================== CONSTRUCTORS =======================================//
    //===============================================================================================//

    public TrackCurrentIpc2221ACalcModel() {

        super(
                "Track Current (IPC-2221A)",
                "PCB track current carrying capability calculator, using the IPC-2221A standard.",
                new String[]{"Electronics", "PCB"},
                new String[]{"pcb", "track", "current", "trace", "width", "carry", "heat", "hot", "temperature", "ipc", "ipc2221a", "ipc-2221a"});

        super.setIconImagePath(getClass().getResource("grid-icon.png"));

        //===============================================================================================//
        //======================================== LOAD .FXML FILE ======================================//
        //===============================================================================================//

        FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("TrackCurrentIpc2221ACalcView.fxml"));
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
        //========================================= TRACK CURRENT =======================================//
        //===============================================================================================//

        /*this.trackCurrent = new CalcVarNumericalInput(
             "traceCurrent",
             trackCurrentValue,
             trackCurrentUnits,
             new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("mA", 1e-3),
                new NumberUnitMultiplier("A", 1e0, NumberPreference.DEFAULT),
            },
             4,
             null,
             "The current you want the PCB track to be able to handle." // Help info
             );*/

        this.trackCurrent.setName("trackCurrent");
        this.trackCurrent.setValueTextField(this.trackCurrentValue);
        this.trackCurrent.setUnitsComboBox(this.trackCurrentUnits);
        this.trackCurrent.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("A", 1e0, NumberPreference.DEFAULT),
        });
        this.trackCurrent.setNumDigitsToRound(4);
        this.trackCurrent.setHelpText("The current you want the PCB track to be able to handle.");
        this.trackCurrent.setIsEngineeringNotationEnabled(true);

        //===== VALIDATORS =====//
        this.trackCurrent.addValidator(Validator.IsNumber(trackCurrent, CalcValidationLevels.Error));
        this.trackCurrent.addValidator(Validator.IsGreaterThanZero(trackCurrent, CalcValidationLevels.Error));
        this.trackCurrent.addValidator(
                new Validator(() -> {
                    return ((this.trackCurrent.getRawVal() > 35.0) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Current is above recommended maximum (35A). Equation will not be as accurate (extrapolation will occur)."));

        addCalcVar(this.trackCurrent);

        //===============================================================================================//
        //====================================== TEMP RISE (input) ======================================//
        //===============================================================================================//

        this.tempRise.setName("tempRise");
        this.tempRise.setValueTextField(this.tempRiseValue);
        this.tempRise.setUnitsComboBox(this.tempRiseUnits);
        this.tempRise.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("°C", 1e0, NumberPreference.DEFAULT),
        });
        this.tempRise.setNumDigitsToRound(4);
        this.tempRise.setHelpText("The maximum desired temperature rise due to the current flowing through the track. 20-40°c is a common value for this.");
        this.tempRise.setIsEngineeringNotationEnabled(true);

        //===== VALIDATORS =====//
        this.tempRise.addValidator(Validator.IsNumber(tempRise, CalcValidationLevels.Error));
        this.tempRise.addValidator(Validator.IsGreaterThanZero(tempRise, CalcValidationLevels.Error));
        this.tempRise.addValidator(
                new Validator(() -> {
                    return ((this.tempRise.getRawVal() < 10.0) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Temperature rise is below the recommended minimum (10°c). Equation will not be as accurate (extrapolation will occur)."));
        this.tempRise.addValidator(
                new Validator(() -> {
                    return ((this.tempRise.getRawVal() > 100.0) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Temperature rise is above the recommended maximum (100°c). Equation will not be as accurate (extrapolation will occur)."));

        addCalcVar(this.tempRise);

        //===============================================================================================//
        //====================================== TRACK THICKNESS (input) ================================//
        //===============================================================================================//

        this.trackThickness.setName("trackThickness");
        this.trackThickness.setValueTextField(this.trackThicknessValue);
        this.trackThickness.setUnitsComboBox(this.trackThicknessUnits);
        this.trackThickness.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("m", 1e0),
                new NumberUnitMultiplier("oz", UnitConversionConstants.COPPER_THICKNESS_M_PER_OZ),
                new NumberUnitMultiplier("mils", UnitConversionConstants.METERS_PER_MILS),
        });
        this.trackThickness.setNumDigitsToRound(4);
        this.trackThickness.setHelpText("The thickness (height) of the track. This is equal to the thickness of the copper layer the track is on. This is also called the copper weight. Common values are 16um (0.5oz) or 32um (1oz).");
        this.trackThickness.setIsEngineeringNotationEnabled(true);

        //===== VALIDATORS =====//
        this.trackThickness.addValidator(Validator.IsNumber(trackThickness, CalcValidationLevels.Error));
        this.trackThickness.addValidator(Validator.IsGreaterThanZero(trackThickness, CalcValidationLevels.Error));
        this.trackThickness.addValidator(
                new Validator(() -> {
                    return ((this.trackThickness.getRawVal() < 17.5e-6) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Track thickness is below the recommended minimum (17.5um or 0.5oz). Equation will not be as accurate (extrapolation will occur)."));
        this.trackThickness.addValidator(
                new Validator(() -> {
                    return ((this.trackThickness.getRawVal() > 105.0036e-6) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "Track thickness is above the recommended maximum (105um or 3oz). Equation will not be as accurate (extrapolation will occur)."));

        addCalcVar(this.trackThickness);

        //===============================================================================================//
        //======================================== TRACK LAYER (input) ==================================//
        //===============================================================================================//

        this.trackLayer = new CalcVarComboBox(
                "trackLayerComboBox",
                this.trackLayerComboBox,
                new String[]{
                        "Internal",
                        "External",
                },
                () -> CalcVarDirections.Input,
                "The type of layer that the current-carrying track is on. If the track is on the top or bottom copper layer of the PCB, set this to \"External\". If the track is on a buried layer, set this to \"Internal\".");

        addCalcVar(this.trackLayer);

        //===============================================================================================//
        //=================================== MIN. TRACK WIDTH (output) =================================//
        //===============================================================================================//

        this.minTrackWidth.setName("currentLimit");
        this.minTrackWidth.setValueTextField(this.minTrackWidthValue);
        this.minTrackWidth.setUnitsComboBox(this.minTrackWidthUnits);
        this.minTrackWidth.setEquationFunction(() -> {
            // Read in variables
            Double traceCurrent = this.trackCurrent.getRawVal();
            Double tempRise = this.tempRise.getRawVal();
            Double trackThickness = this.trackThickness.getRawVal();
            String trackLayer = this.trackLayer.getRawVal();

            if (trackLayer == "External") {
                //System.out.println("External trace selected.");
                double crossSectionalArea = (Math.pow((traceCurrent / (0.048 * Math.pow(tempRise, 0.44))), 1 / 0.725));
                //System.out.println("Cross-sectional area = " + String.valueOf(crossSectionalArea));
                double width = (crossSectionalArea / (trackThickness * 1000000.0 / 25.4)) * (25.4 / 1000000.0);
                return width;
            } else if (trackLayer == "Internal") {
                //System.out.println("Internal trace selected.");
                double crossSectionalArea = (Math.pow((traceCurrent / (0.024 * Math.pow(tempRise, 0.44))), 1 / 0.725));
                //System.out.println("Cross-sectional area = " + String.valueOf(crossSectionalArea));
                double width = (crossSectionalArea / (trackThickness * 1000000.0 / 25.4)) * (25.4 / 1000000.0);
                return width;
            } else {
                assert false; //, "Track layer was invalid (should be either External or Internal).");
                return Double.NaN;
            }
        });
        this.minTrackWidth.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("m", 1e0, NumberPreference.DEFAULT),
                new NumberUnitMultiplier("mils", UnitConversionConstants.METERS_PER_MILS),
        });
        this.minTrackWidth.setNumDigitsToRound(4);
        this.minTrackWidth.setHelpText("The minimum track width needed to carry the specified current without exceeding the given temperature rise.");
        this.minTrackWidth.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.minTrackWidth.addValidator(Validator.IsNumber(minTrackWidth, CalcValidationLevels.Error));
        this.minTrackWidth.addValidator(Validator.IsGreaterThanZero(minTrackWidth, CalcValidationLevels.Error));

        addCalcVar(this.minTrackWidth);

        //===============================================================================================//
        //============================================== FINAL ==========================================//
        //===============================================================================================//

        this.findDependenciesAndDependants();
        this.refreshDirectionsAndUpdateUI();
        this.recalculateAllOutputs();
        this.validateAllVariables();

    }
}
