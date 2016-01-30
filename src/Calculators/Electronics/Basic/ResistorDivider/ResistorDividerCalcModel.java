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
 */
public class ResistorDividerCalcModel extends Calculator {

    //===============================================================================================//
    //========================================= FXML BINDINGS =======================================//
    //===============================================================================================//

    @FXML
    private TextField vInValue;
    @FXML
    private ComboBox vInUnits;
    @FXML
    private RadioButton vInIO;

    @FXML
    private TextField rTopValue;
    @FXML
    private ComboBox rTopUnits;
    @FXML
    private RadioButton rTopIO;

    @FXML
    private TextField rBotValue;
    @FXML
    private ComboBox rBotUnits;
    @FXML
    private RadioButton rBotIO;

    @FXML
    private TextField vOutValue;
    @FXML
    private ComboBox vOutUnits;
    @FXML
    private RadioButton vOutIO;

    @FXML
    private TextField iQValue;
    @FXML
    private ComboBox iQUnits;

    @FXML
    private WebView infoWebView;

    //===============================================================================================//
    //============================================ VARIABLES ========================================//
    //===============================================================================================//

    CalcVarNumerical Vin;

    CalcVarNumerical Rtop;

    CalcVarNumerical Rbot;

    CalcVarNumerical Vout;

    CalcVarNumericalOutput Iq;

    //===============================================================================================//
    //========================================== CONSTRUCTORS =======================================//
    //===============================================================================================//

    public ResistorDividerCalcModel() {

        super("Resistor Divider",
                "Resistor dividers are a simple, widely-used circuit primitive for reducing a voltage based on a fixed ratio.",
                "/Calculators/Electronics/Basic/ResistorDivider/grid-icon.png",
                new String[]{"Electronics", "Basic"},
                new String[]{"resistor, resistance, voltage, divider, reduce"});

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
        System.out.println("Adding listener for radiobutton toggle change.");
        toggleGroup.selectedToggleProperty().addListener((ObservableValue<? extends Toggle> ov, Toggle old_toggle, Toggle new_toggle) -> {
                    this.refreshDirectionsAndUpdateUI();
                    this.recalculateAllOutputs();
                }
        );

        //===============================================================================================//
        //================================================= Vin =========================================//
        //===============================================================================================//

        this.Vin = new CalcVarNumerical(
                "vIn",
                vInValue,
                vInUnits,
                () -> {
                    Double vOut = this.Vout.getRawVal();
                    Double rTop = this.Rtop.getRawVal();
                    Double rBot = this.Rbot.getRawVal();

                    return ((vOut * (rTop + rBot)) / rBot);
                },
                new NumberUnit[]{
                        new NumberUnit("mV", 1e-3),
                        new NumberUnit("V", 1e0, NumberPreference.DEFAULT),
                        new NumberUnit("kV", 1e3),
                },
                4,
                () -> {
                    if (vInIO.isSelected()) return CalcVarDirections.Output;
                    else return CalcVarDirections.Input;
                },
                null,
                "The input voltage to the top of the resistor divider (also equal to the voltage across the entire resistor divider)." // Help text
        );

        // Add validators
        this.Vin.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.Vin.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.Vin);

        //===============================================================================================//
        //=============================================== Rtop ==========================================//
        //===============================================================================================//

        this.Rtop = new CalcVarNumerical(
                "rTop",
                rTopValue,
                rTopUnits,
                () -> {
                    Double vIn = this.Vin.getRawVal();
                    Double rBot = this.Rbot.getRawVal();
                    Double vOut = this.Vout.getRawVal();

                    return ((rBot * (vIn - vOut)) / vOut);
                },
                new NumberUnit[]{
                        new NumberUnit("mΩ", 1e-3),
                        new NumberUnit("Ω", 1e0),
                        new NumberUnit("kΩ", 1e3, NumberPreference.DEFAULT),
                        new NumberUnit("MΩ", 1e6),
                        new NumberUnit("GΩ", 1e9),
                },
                4,
                () -> {
                    if (rTopIO.isSelected()) return CalcVarDirections.Output;
                    else return CalcVarDirections.Input;
                },
                null,
                "The resistance of the top resistor in the resistor divider." // Help text
        );

        // Add validators
        this.Rtop.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.Rtop.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.Rtop);

        //===============================================================================================//
        //=============================================== Rbot ==========================================//
        //===============================================================================================//

        this.Rbot = new CalcVarNumerical(
                "rBot",
                rBotValue,
                rBotUnits,
                () -> {
                    Double vIn = this.Vin.getRawVal();
                    Double rTop = this.Rtop.getRawVal();
                    Double vOut = this.Vout.getRawVal();

                    return ((rTop * vOut) / (vIn - vOut));
                },
                new NumberUnit[]{
                        new NumberUnit("mΩ", 1e-3),
                        new NumberUnit("Ω", 1e0),
                        new NumberUnit("kΩ", 1e3, NumberPreference.DEFAULT),
                        new NumberUnit("MΩ", 1e6),
                        new NumberUnit("GΩ", 1e9),
                },
                4,
                () -> {
                    if (rBotIO.isSelected()) return CalcVarDirections.Output;
                    else return CalcVarDirections.Input;
                },
                null,
                "The resistance of the bottom resistor in the resistor divider." // Help text
        );

        // Add validators
        this.Rbot.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.Rbot.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.Rbot);

        //===============================================================================================//
        //================================================= Vout =========================================//
        //===============================================================================================//

        this.Vout = new CalcVarNumerical(
                "vOut",
                vOutValue,
                vOutUnits,
                () -> {
                    Double vIn = this.Vin.getRawVal();
                    Double rTop = this.Rtop.getRawVal();
                    Double rBot = this.Rbot.getRawVal();

                    return ((vIn * rBot) / (rTop + rBot));
                },
                new NumberUnit[]{
                        new NumberUnit("mV", 1e-3),
                        new NumberUnit("V", 1e0, NumberPreference.DEFAULT),
                        new NumberUnit("kV", 1e3),
                },
                4,
                () -> {
                    if (vOutIO.isSelected()) return CalcVarDirections.Output;
                    else return CalcVarDirections.Input;
                },
                null,
                "The resistor divider output voltage. The is also equal to the voltage across the bottom resistor. Note that this is only accurate as long as the circuit connected to the output voltage has a much higher resistance than the bottom resistor.");

        // Add validators
        this.Vout.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.Vout.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.Vout);

        //===============================================================================================//
        //======================================= Iq (Quescent Current) =================================//
        //===============================================================================================//

        this.Iq = new CalcVarNumericalOutput(
                "iQ",
                iQValue,
                iQUnits,
                () -> {
                    Double vIn = this.Vin.getRawVal();
                    Double rTop = this.Rtop.getRawVal();
                    Double rBot = this.Rbot.getRawVal();

                    return (vIn / (rTop + rBot));
                },
                new NumberUnit[]{
                        new NumberUnit("pA", 1e-12),
                        new NumberUnit("nA", 1e-9),
                        new NumberUnit("uA", 1e-6),
                        new NumberUnit("mA", 1e-3, NumberPreference.DEFAULT),
                        new NumberUnit("A", 1e0),
                },
                4,
                "The quiscent current drawn through the resistor divider. This can be an issue in low-power designs, or can cause excessive heating in the resistors when the input voltage is high and both resistors have low resistances.");

        // Add validators
        this.Iq.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.Iq.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.Iq);

        //===============================================================================================//
        //============================================== FINAL ==========================================//
        //===============================================================================================//

        this.findDependenciesAndDependants();
        this.refreshDirectionsAndUpdateUI();
        this.recalculateAllOutputs();
        this.validateAllVariables();

    }
}
