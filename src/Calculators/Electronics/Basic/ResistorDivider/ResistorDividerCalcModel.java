package Calculators.Electronics.Basic.ResistorDivider;

import Core.*;
import Core.CalcVar.CalcVarBase;
import Core.CalcVar.CalcVarDirections;
import Core.CalcVar.Numerical.CalcVarNumerical;
import Core.CalcVar.Numerical.CalcVarNumericalOutput;
import javafx.beans.value.ObservableValue;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.*;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;

/**
 * A calculator based around the basic resistor divider circuit.
 *
 * @author gbmhunter (www.mbedded.ninja) <gbmhunter@gmail.com>
 * @last-modified 2016-04-22
 * @since 2015-11-02
 */
public class ResistorDividerCalcModel extends Calculator {

    //===============================================================================================//
    //========================================= FXML BINDINGS =======================================//
    //===============================================================================================//

    @FXML
    private WebView infoWebView;

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

    //===============================================================================================//
    //======================================= CALCULATOR VARIABLES ==================================//
    //===============================================================================================//

    CalcVarNumerical vIn = new CalcVarNumerical();
    CalcVarNumerical rTop = new CalcVarNumerical();
    CalcVarNumerical rBot = new CalcVarNumerical();
    CalcVarNumerical vOut = new CalcVarNumerical();
    CalcVarNumericalOutput iQ = new CalcVarNumericalOutput();

    //===============================================================================================//
    //========================================== CONSTRUCTORS =======================================//
    //===============================================================================================//

    public ResistorDividerCalcModel() {

        super("Resistor Divider",
                "Resistor dividers are a simple, widely-used circuit primitive for reducing a voltage based on a fixed ratio.",
                new String[]{"Electronics", "Basic"},
                new String[]{"resistor", "resistance", "voltage", "divider", "reduce", "adc", "translate", "level", "shift"});

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

        /*this.vIn = new CalcVarNumerical(
                "vIn",
                vInValue,
                null,
                () -> {
                    // Read dependency variables
                    Double vOut = this.vOut.getRawVal();
                    Double rTop = this.rTop.getRawVal();
                    Double rBot = this.rBot.getRawVal();

                    return ((vOut * (rTop + rBot)) / rBot);
                },
                new NumberUnitMultiplier[]{
                        //new NumberUnitMultiplier("mV", 1e-3),
                        new NumberUnitMultiplier("V", 1e0, NumberPreference.DEFAULT),
                        //new NumberUnitMultiplier("kV", 1e3),
                },
                4,
                () -> {
                    if (vInIO.isSelected()) return CalcVarDirections.Output;
                    else return CalcVarDirections.Input;
                },
                null,
                "The input voltage to the top of the resistor divider (also equal to the voltage across the entire resistor divider)." // Help text
        );*/

        this.vIn.setName("vIn");
        this.vIn.setValueTextField(vInValue);
        //this.vIn.setUnitsComboBox(null);
        this.vIn.setEquationFunction(() -> {
            // Read dependency variables
            Double vOut = this.vOut.getRawVal();
            Double rTop = this.rTop.getRawVal();
            Double rBot = this.rBot.getRawVal();

            return ((vOut * (rTop + rBot)) / rBot);
        });
        this.vIn.setUnits(new NumberUnitMultiplier[]{
                //new NumberUnitMultiplier("mV", 1e-3),
                new NumberUnitMultiplier("V", 1e0, NumberPreference.DEFAULT),
                //new NumberUnitMultiplier("kV", 1e3),
        });
        this.vIn.setNumDigitsToRound(4);
        this.vIn.setDirectionFunction(() -> {
            if (vInIO.isSelected()) return CalcVarDirections.Output;
            else return CalcVarDirections.Input;
        });
        this.vIn.setDefaultRawValue(null);
        this.vIn.setHelpText("The input voltage to the top of the resistor divider (also equal to the voltage across the entire resistor divider).");
        this.vIn.setIsEngineeringNotationEnabled(true);

        //====================== VALIDATORS ===================//
        this.vIn.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.vIn.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
        this.vIn.addValidator(
                new Validator(
                        new ArrayList<>(Arrays.asList(this.vOut, this.vIn)),            // Dependency list
                        () -> {                                                         // Validation equation
                            return ((this.vIn.getRawVal() <= this.vOut.getRawVal()) ? CalcValidationLevels.Error : CalcValidationLevels.Ok);
                        },
                        "Vin must be greater than Vout. It is impossible for Vin to be less than Vout because a resistor divider can only reduce the input voltage."));

        addCalcVar(this.vIn);

        //===============================================================================================//
        //=============================================== rTop ==========================================//
        //===============================================================================================//

        /*this.rTop = new CalcVarNumerical(
                "rTop",
                rTopValue,
                null,
                () -> {
                    // Read dependency variables
                    Double vIn = this.vIn.getRawVal();
                    Double rBot = this.rBot.getRawVal();
                    Double vOut = this.vOut.getRawVal();

                    return ((rBot * (vIn - vOut)) / vOut);
                },
                new NumberUnitMultiplier[]{
                        //new NumberUnitMultiplier("mΩ", 1e-3),
                        new NumberUnitMultiplier("Ω", 1e0),
                        //new NumberUnitMultiplier("kΩ", 1e3, NumberPreference.DEFAULT),
                        //new NumberUnitMultiplier("MΩ", 1e6),
                        //new NumberUnitMultiplier("GΩ", 1e9),
                },
                4,
                () -> {
                    if (rTopIO.isSelected()) return CalcVarDirections.Output;
                    else return CalcVarDirections.Input;
                },
                null,
                "The resistance of the top resistor in the resistor divider." // Help text
        );*/

        this.rTop.setName("rTop");
        this.rTop.setValueTextField(rTopValue);
        //this.rTop.setUnitsComboBox(null);
        this.rTop.setEquationFunction(() -> {
            // Read dependency variables
            Double vIn = this.vIn.getRawVal();
            Double rBot = this.rBot.getRawVal();
            Double vOut = this.vOut.getRawVal();

            return ((rBot * (vIn - vOut)) / vOut);
        });
        this.rTop.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("Ω", 1e0),
        });
        this.rTop.setNumDigitsToRound(4);
        this.rTop.setDirectionFunction(() -> {
            if (rTopIO.isSelected()) return CalcVarDirections.Output;
            else return CalcVarDirections.Input;
        });
        this.rTop.setDefaultRawValue(null);
        this.rTop.setHelpText("The resistance of the top resistor in the resistor divider.");
        this.rTop.setIsEngineeringNotationEnabled(true);

        //====================== VALIDATORS ===================//
        this.rTop.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.rTop.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        addCalcVar(this.rTop);

        //===============================================================================================//
        //=============================================== rBot ==========================================//
        //===============================================================================================//

        /*this.rBot = new CalcVarNumerical(
                "rBot",
                rBotValue,
                null,
                () -> {
                    // Read dependency variables
                    Double vIn = this.vIn.getRawVal();
                    Double rTop = this.rTop.getRawVal();
                    Double vOut = this.vOut.getRawVal();

                    return ((rTop * vOut) / (vIn - vOut));
                },
                new NumberUnitMultiplier[]{
                        //new NumberUnitMultiplier("mΩ", 1e-3),
                        new NumberUnitMultiplier("Ω", 1e0),
                        //new NumberUnitMultiplier("kΩ", 1e3, NumberPreference.DEFAULT),
                        //new NumberUnitMultiplier("MΩ", 1e6),
                        //new NumberUnitMultiplier("GΩ", 1e9),
                },
                4,
                () -> {
                    if (rBotIO.isSelected()) return CalcVarDirections.Output;
                    else return CalcVarDirections.Input;
                },
                null,
                "The resistance of the bottom resistor in the resistor divider." // Help text
        );
        this.rBot.setIsEngineeringNotationEnabled(true);*/

        this.rBot.setName("rBot");
        this.rBot.setValueTextField(rBotValue);
        //this.rBot.setUnitsComboBox(null);
        this.rBot.setEquationFunction(() -> {
            // Read dependency variables
            Double vIn = this.vIn.getRawVal();
            Double rTop = this.rTop.getRawVal();
            Double vOut = this.vOut.getRawVal();

            return ((rTop * vOut) / (vIn - vOut));
        });
        this.rBot.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("Ω", 1e0),
        });
        this.rBot.setNumDigitsToRound(4);
        this.rBot.setDirectionFunction(() -> {
            if (rBotIO.isSelected()) return CalcVarDirections.Output;
            else return CalcVarDirections.Input;
        });
        this.rBot.setDefaultRawValue(null);
        this.rBot.setHelpText("The resistance of the bottom resistor in the resistor divider.");
        this.rBot.setIsEngineeringNotationEnabled(true);

        //====================== VALIDATORS ===================//
        this.rBot.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.rBot.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        addCalcVar(this.rBot);

        //===============================================================================================//
        //================================================= vOut =========================================//
        //===============================================================================================//

        /*this.vOut = new CalcVarNumerical(
                "vOut",
                vOutValue,
                null,
                () -> {
                    // Read dependency variables
                    Double vIn = this.vIn.getRawVal();
                    Double rTop = this.rTop.getRawVal();
                    Double rBot = this.rBot.getRawVal();

                    return ((vIn * rBot) / (rTop + rBot));
                },
                new NumberUnitMultiplier[]{
                        //new NumberUnitMultiplier("mV", 1e-3),
                        new NumberUnitMultiplier("V", 1e0, NumberPreference.DEFAULT),
                        //new NumberUnitMultiplier("kV", 1e3),
                },
                4,
                () -> {
                    if (vOutIO.isSelected()) return CalcVarDirections.Output;
                    else return CalcVarDirections.Input;
                },
                null,
                "The resistor divider output voltage. The is also equal to the voltage across the bottom resistor. Note that this is only accurate as long as the circuit connected to the output voltage has a much higher resistance than the bottom resistor.");
        this.vOut.setIsEngineeringNotationEnabled(true);*/

        this.vOut.setName("vOut");
        this.vOut.setValueTextField(vOutValue);
        //this.vOut.setUnitsComboBox(null);
        this.vOut.setEquationFunction(() -> {
            // Read dependency variables
            Double vIn = this.vIn.getRawVal();
            Double rTop = this.rTop.getRawVal();
            Double rBot = this.rBot.getRawVal();

            return ((vIn * rBot) / (rTop + rBot));
        });
        this.vOut.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("V", 1e0, NumberPreference.DEFAULT),
        });
        this.vOut.setNumDigitsToRound(4);
        this.vOut.setDirectionFunction(() -> {
            if (vOutIO.isSelected()) return CalcVarDirections.Output;
            else return CalcVarDirections.Input;
        });
        this.vOut.setDefaultRawValue(null);
        this.vOut.setHelpText("The resistor divider output voltage. The is also equal to the voltage across the bottom resistor. Note that this is only accurate as long as the circuit connected to the output voltage has a much higher resistance than the bottom resistor.");
        this.vOut.setIsEngineeringNotationEnabled(true);

        //====================== VALIDATORS ===================//
        this.vOut.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.vOut.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
        this.vOut.addValidator(
                new Validator(
                        new ArrayList<CalcVarBase>(Arrays.asList(this.vOut, this.vIn)), // Dependency list
                        () -> {                                                         // Validation equation
                            return ((this.vOut.getRawVal() >= this.vIn.getRawVal()) ? CalcValidationLevels.Error : CalcValidationLevels.Ok);
                        },
                        "Vout must be less than Vin. It is impossible for Vout to be greater than Vin because a resistor divider can only reduce the input voltage."));

        addCalcVar(this.vOut);

        //===============================================================================================//
        //====================================== iQ (Quiescent Current) =================================//
        //===============================================================================================//

        /*this.iQ = new CalcVarNumericalOutput(
                "iQ",
                iQValue,
                null,
                () -> {
                    Double vIn = this.vIn.getRawVal();
                    Double rTop = this.rTop.getRawVal();
                    Double rBot = this.rBot.getRawVal();

                    return (vIn / (rTop + rBot));
                },
                new NumberUnitMultiplier[]{
                        //new NumberUnitMultiplier("pA", 1e-12),
                        //new NumberUnitMultiplier("nA", 1e-9),
                        //new NumberUnitMultiplier("uA", 1e-6),
                        //new NumberUnitMultiplier("mA", 1e-3, NumberPreference.DEFAULT),
                        new NumberUnitMultiplier("A", 1e0),
                },
                4,
                "The quiescent current drawn through the resistor divider. This can be an issue in low-power designs, or can cause excessive heating in the resistors when the input voltage is high and both resistors have low resistances.");
        this.iQ.setIsEngineeringNotationEnabled(true);*/

        this.iQ.setName("iQ");
        this.iQ.setValueTextField(iQValue);
        //this.iQ.setUnitsComboBox(null);
        this.iQ.setEquationFunction(() -> {
            // Read dependency variables
            Double vIn = this.vIn.getRawVal();
            Double rTop = this.rTop.getRawVal();
            Double rBot = this.rBot.getRawVal();

            return (vIn / (rTop + rBot));
        });
        this.iQ.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("A", 1e0),
        });
        this.iQ.setNumDigitsToRound(4);
        this.iQ.setHelpText("The quiescent current drawn through the resistor divider. This can be an issue in low-power designs, or can cause excessive heating in the resistors when the input voltage is high and both resistors have low resistances.");
        this.iQ.setIsEngineeringNotationEnabled(true);

        //====================== VALIDATORS ===================//
        this.iQ.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.iQ.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        addCalcVar(this.iQ);

        //===============================================================================================//
        //============================================== FINAL ==========================================//
        //===============================================================================================//

        this.findDependenciesAndDependants();
        this.refreshDirectionsAndUpdateUI();
        this.recalculateAllOutputs();
        this.validateAllVariables();

    }
}
