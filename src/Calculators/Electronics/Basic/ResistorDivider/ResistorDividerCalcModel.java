package Calculators.Electronics.Basic.ResistorDivider;

import Core.*;
import javafx.beans.value.ObservableValue;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.*;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;

import java.io.IOException;
import java.net.URL;

/**
 * A calculator based around the resistor divider circuit.
 * @author gbmhunter
 * @since 2015-11-02
 * @last-modified 2016-02-14
 */
public class ResistorDividerCalcModel extends Calculator {

    //===============================================================================================//
    //========================================= FXML BINDINGS =======================================//
    //===============================================================================================//

    @FXML
    private TextField vInValue;
    @FXML
    private RadioButton vInIO;

    @FXML
    private TextField rTopValue;
    @FXML
    private RadioButton rTopIO;

    @FXML
    private TextField rBotValue;
    @FXML
    private RadioButton rBotIO;

    @FXML
    private TextField vOutValue;
    @FXML
    private RadioButton vOutIO;

    @FXML
    private TextField iQValue;

    @FXML
    private WebView infoWebView;

    //===============================================================================================//
    //============================================ VARIABLES ========================================//
    //===============================================================================================//

    CalcVarNumerical vIn;

    CalcVarNumerical rTop;

    CalcVarNumerical rBot;

    CalcVarNumerical vOut;

    CalcVarNumericalOutput iQ;

    //===============================================================================================//
    //========================================== CONSTRUCTORS =======================================//
    //===============================================================================================//

    public ResistorDividerCalcModel() {

        super("Resistor Divider",
                "Resistor dividers are a simple, widely-used circuit primitive for reducing a voltage based on a fixed ratio.",
                //"/Calculators/Electronics/Basic/ResistorDivider/grid-icon.png",
                new String[]{"Electronics", "Basic"},
                new String[]{"resistor, resistance, voltage, divider, reduce"});

        super.setIconImagePath(getClass().getResource("grid-icon.png"));

        //===============================================================================================//
        //======================================== LOAD .FXML FILE ======================================//
        //===============================================================================================//

        FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("ResistorDividerCalcView.fxml"));
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
        //================================ INPUT/OUTPUT TOGGLE GROUP ====================================//
        //===============================================================================================//

        ToggleGroup toggleGroup = new ToggleGroup();

        // Add all calculator variables to toggle group
        vInIO.setToggleGroup(toggleGroup);
        rTopIO.setToggleGroup(toggleGroup);
        rBotIO.setToggleGroup(toggleGroup);
        vOutIO.setToggleGroup(toggleGroup);
        toggleGroup.selectToggle(vOutIO);

        // Following code provides lambda function which listens to radiobuttons changes and modifies direction accordingly
        //System.out.println("Adding listener for radiobutton toggle change.");
        toggleGroup.selectedToggleProperty().addListener((ObservableValue<? extends Toggle> ov, Toggle old_toggle, Toggle new_toggle) -> {
                    this.refreshDirectionsAndUpdateUI();
                    this.recalculateAllOutputs();
                }
        );

        //===============================================================================================//
        //================================================= vIn =========================================//
        //===============================================================================================//

        this.vIn = new CalcVarNumerical(
                "vIn",
                vInValue,
                null,
                () -> {
                    Double vOut = this.vOut.getRawVal();
                    Double rTop = this.rTop.getRawVal();
                    Double rBot = this.rBot.getRawVal();

                    return ((vOut * (rTop + rBot)) / rBot);
                },
                new NumberUnit[]{
                        //new NumberUnit("mV", 1e-3),
                        new NumberUnit("V", 1e0, NumberPreference.DEFAULT),
                        //new NumberUnit("kV", 1e3),
                },
                4,
                () -> {
                    if (vInIO.isSelected()) return CalcVarDirections.Output;
                    else return CalcVarDirections.Input;
                },
                null,
                "The input voltage to the top of the resistor divider (also equal to the voltage across the entire resistor divider)." // Help text
        );

        this.vIn.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.vIn.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.vIn.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.vIn);

        //===============================================================================================//
        //=============================================== rTop ==========================================//
        //===============================================================================================//

        this.rTop = new CalcVarNumerical(
                "rTop",
                rTopValue,
                null,
                () -> {
                    Double vIn = this.vIn.getRawVal();
                    Double rBot = this.rBot.getRawVal();
                    Double vOut = this.vOut.getRawVal();

                    return ((rBot * (vIn - vOut)) / vOut);
                },
                new NumberUnit[]{
                        //new NumberUnit("mΩ", 1e-3),
                        new NumberUnit("Ω", 1e0),
                        //new NumberUnit("kΩ", 1e3, NumberPreference.DEFAULT),
                        //new NumberUnit("MΩ", 1e6),
                        //new NumberUnit("GΩ", 1e9),
                },
                4,
                () -> {
                    if (rTopIO.isSelected()) return CalcVarDirections.Output;
                    else return CalcVarDirections.Input;
                },
                null,
                "The resistance of the top resistor in the resistor divider." // Help text
        );

        this.rTop.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.rTop.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.rTop.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.rTop);

        //===============================================================================================//
        //=============================================== rBot ==========================================//
        //===============================================================================================//

        this.rBot = new CalcVarNumerical(
                "rBot",
                rBotValue,
                null,
                () -> {
                    Double vIn = this.vIn.getRawVal();
                    Double rTop = this.rTop.getRawVal();
                    Double vOut = this.vOut.getRawVal();

                    return ((rTop * vOut) / (vIn - vOut));
                },
                new NumberUnit[]{
                        //new NumberUnit("mΩ", 1e-3),
                        new NumberUnit("Ω", 1e0),
                        //new NumberUnit("kΩ", 1e3, NumberPreference.DEFAULT),
                        //new NumberUnit("MΩ", 1e6),
                        //new NumberUnit("GΩ", 1e9),
                },
                4,
                () -> {
                    if (rBotIO.isSelected()) return CalcVarDirections.Output;
                    else return CalcVarDirections.Input;
                },
                null,
                "The resistance of the bottom resistor in the resistor divider." // Help text
        );

        this.rBot.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.rBot.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.rBot.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.rBot);

        //===============================================================================================//
        //================================================= vOut =========================================//
        //===============================================================================================//

        this.vOut = new CalcVarNumerical(
                "vOut",
                vOutValue,
                null,
                () -> {
                    Double vIn = this.vIn.getRawVal();
                    Double rTop = this.rTop.getRawVal();
                    Double rBot = this.rBot.getRawVal();

                    return ((vIn * rBot) / (rTop + rBot));
                },
                new NumberUnit[]{
                        //new NumberUnit("mV", 1e-3),
                        new NumberUnit("V", 1e0, NumberPreference.DEFAULT),
                        //new NumberUnit("kV", 1e3),
                },
                4,
                () -> {
                    if (vOutIO.isSelected()) return CalcVarDirections.Output;
                    else return CalcVarDirections.Input;
                },
                null,
                "The resistor divider output voltage. The is also equal to the voltage across the bottom resistor. Note that this is only accurate as long as the circuit connected to the output voltage has a much higher resistance than the bottom resistor.");

        this.vOut.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.vOut.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.vOut.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.vOut);

        //===============================================================================================//
        //====================================== iQ (Quiescent Current) =================================//
        //===============================================================================================//

        this.iQ = new CalcVarNumericalOutput(
                "iQ",
                iQValue,
                null,
                () -> {
                    Double vIn = this.vIn.getRawVal();
                    Double rTop = this.rTop.getRawVal();
                    Double rBot = this.rBot.getRawVal();

                    return (vIn / (rTop + rBot));
                },
                new NumberUnit[]{
                        //new NumberUnit("pA", 1e-12),
                        //new NumberUnit("nA", 1e-9),
                        //new NumberUnit("uA", 1e-6),
                        //new NumberUnit("mA", 1e-3, NumberPreference.DEFAULT),
                        new NumberUnit("A", 1e0),
                },
                4,
                "The quiescent current drawn through the resistor divider. This can be an issue in low-power designs, or can cause excessive heating in the resistors when the input voltage is high and both resistors have low resistances.");

        this.iQ.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.iQ.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.iQ.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.iQ);

        //===============================================================================================//
        //============================================== FINAL ==========================================//
        //===============================================================================================//

        this.findDependenciesAndDependants();
        this.refreshDirectionsAndUpdateUI();
        this.recalculateAllOutputs();
        this.validateAllVariables();

    }
}
