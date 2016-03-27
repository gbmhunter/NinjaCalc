package Calculators.Electronics.Pcb.TrackCurrentIpc2221A;


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
 * @author gbmhunter
 * @since 2015-11-02
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
    private ComboBox trackLayer;

    @FXML
    private TextField minTrackWidthValue;
    @FXML
    private ComboBox minTrackWidthUnits;

    //===============================================================================================//
    //============================================ VARIABLES ========================================//
    //===============================================================================================//

    public CalcVarNumericalInput TrackCurrent;

    public CalcVarNumericalInput TempRise;

    public CalcVarNumericalInput TrackThickness;

    public CalcVarComboBox TrackLayer;

    public CalcVarNumericalOutput MinTrackWidth;

    //===============================================================================================//
    //========================================== CONSTRUCTORS =======================================//
    //===============================================================================================//

    public TrackCurrentIpc2221ACalcModel() {

        super(
            "Track Current (IPC-2221A)",
            "PCB track current carrying capability calculator, using the IPC-2221A standard.",
            //"/Calculators/Electronics/Pcb/TrackCurrentIpc2221A/grid-icon.png",
            new String[] { "Electronics", "PCB" },
            new String[] { "pcb, track, current, trace, width, carry, heat, temperature, ipc, ipc2221a, ipc-2221a" });

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
        final String htmlFile= "info.html";
        URL url = getClass().getResource(htmlFile);
        engine.load(url.toExternalForm());

        //===============================================================================================//
        //========================================= TRACK CURRENT =======================================//
        //===============================================================================================//

        this.TrackCurrent = new CalcVarNumericalInput(
             "traceCurrent",
             trackCurrentValue,
             trackCurrentUnits,
             new NumberUnit[]{
                new NumberUnit("mA", 1e-3),
                new NumberUnit("A", 1e0, NumberPreference.DEFAULT),
            },
             4,
             null,
             "The current you want the PCB track to be able to handle." // Help info
             );

        //===== VALIDATORS =====//
        this.TrackCurrent.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.TrackCurrent.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
        this.TrackCurrent.addValidator(
            new Validator(() -> {
                return ((this.TrackCurrent.getRawVal() > 35.0) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
            },
            "Current is above recommended maximum (35A). Equation will not be as accurate (extrapolation will occur)."));

        this.calcVars.add(this.TrackCurrent);

        //===============================================================================================//
        //====================================== TEMP RISE (input) ======================================//
        //===============================================================================================//

        this.TempRise = new CalcVarNumericalInput(
            "tempRise",
            tempRiseValue,
            tempRiseUnits,
            new NumberUnit[]{
                new NumberUnit("°c", 1e0, NumberPreference.DEFAULT),
            },
            4,
            null,
            "The maximum desired temperature rise due to the current flowing through the track. 20-40°c is a common value for this." // Help info
            );

        //===== VALIDATORS =====//
        this.TempRise.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.TempRise.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
        this.TempRise.addValidator(
            new Validator(() -> {
                return ((this.TempRise.getRawVal() < 10.0) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
            },
            "Temperature rise is below the recommended minimum (10°c). Equation will not be as accurate (extrapolation will occur)."));
        this.TempRise.addValidator(
            new Validator(() -> {
                return ((this.TempRise.getRawVal() > 100.0) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
            },
            "Temperature rise is above the recommended maximum (100°c). Equation will not be as accurate (extrapolation will occur)."));

        this.calcVars.add(this.TempRise);

        //===============================================================================================//
        //====================================== TRACK THICKNESS (input) ================================//
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

        //===== VALIDATORS =====//
        this.TrackThickness.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.TrackThickness.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
        this.TrackThickness.addValidator(
           new Validator(() -> {
               return ((this.TrackThickness.getRawVal() < 17.5e-6) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
           },
           "Track thickness is below the recommended minimum (17.5um or 0.5oz). Equation will not be as accurate (extrapolation will occur)."));
        this.TrackThickness.addValidator(
            new Validator(() -> {
                return ((this.TrackThickness.getRawVal() > 105.0036e-6) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
            },
            "Track thickness is above the recommended maximum (105um or 3oz). Equation will not be as accurate (extrapolation will occur)."));

        this.calcVars.add(this.TrackThickness);

        //===============================================================================================//
        //======================================== TRACK LAYER (input) ==================================//
        //===============================================================================================//

        this.TrackLayer = new CalcVarComboBox(
            "trackLayer",
            this.trackLayer,
            new String[] {
                "Internal",
                "External",
            },
            () -> CalcVarDirections.Input,
            "The type of layer that the current-carrying track is on. If the track is on the top or bottom copper layer of the PCB, set this to \"External\". If the track is on a buried layer, set this to \"Internal\".");

        this.calcVars.add(this.TrackLayer);

        //===============================================================================================//
        //=================================== MIN. TRACK WIDTH (output) =================================//
        //===============================================================================================//

        this.MinTrackWidth = new CalcVarNumericalOutput(
            "minTrackWidth",
            this.minTrackWidthValue,
            this.minTrackWidthUnits,
            () -> {
                Double traceCurrent = this.TrackCurrent.getRawVal();
                Double tempRise = this.TempRise.getRawVal();
                Double trackThickness = this.TrackThickness.getRawVal();
                String trackLayer = this.TrackLayer.getRawVal();

                if(trackLayer == "External")
                {
                    //System.out.println("External trace selected.");
                    double crossSectionalArea = (Math.pow((traceCurrent/(0.048*Math.pow(tempRise, 0.44))), 1/0.725));
                    //System.out.println("Cross-sectional area = " + String.valueOf(crossSectionalArea));
                    double width = (crossSectionalArea/(trackThickness*1000000.0/25.4))*(25.4/1000000.0);
                    return width;
                }
                else if(trackLayer == "Internal")
                {
                    //System.out.println("Internal trace selected.");
                    double crossSectionalArea = (Math.pow((traceCurrent/(0.024*Math.pow(tempRise, 0.44))), 1/0.725));
                    //System.out.println("Cross-sectional area = " + String.valueOf(crossSectionalArea));
                    double width = (crossSectionalArea/(trackThickness*1000000.0/25.4))*(25.4/1000000.0);
                    return width;
                }
                else {
                    assert false; //, "Track layer was invalid (should be either External or Internal).");
                    return Double.NaN;
                }
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
        this.MinTrackWidth.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.MinTrackWidth.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.MinTrackWidth);

        //===============================================================================================//
        //=========================================== VIEW CONFIG =======================================//
        //===============================================================================================//

        // Setup the top PCB layer to dissappear if "External" is selected for the track layer,
        // and visible if "Internal" is selected.
        /*this.TrackLayer.RawValueChanged += (sender, e) => {
            if (this.TrackLayer.RawVal == "Internal") {
                view.TopPcb.Visibility = System.Windows.Visibility.Visible;
            }
            else if (this.TrackLayer.RawVal == "External") {
                view.TopPcb.Visibility = System.Windows.Visibility.Collapsed;
            }
        };*/

        //===============================================================================================//
        //============================================== FINAL ==========================================//
        //===============================================================================================//

        this.findDependenciesAndDependants();
        this.refreshDirectionsAndUpdateUI();
        this.recalculateAllOutputs();
        this.validateAllVariables();

    }
}
