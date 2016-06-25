package Calculators.Electronics.Pcb.ViaCurrentIpc2221A;


import Core.*;
import Core.CalcVar.Numerical.CalcVarNumerical;
import Core.CalcVar.Numerical.CalcVarNumericalInput;
import Core.CalcVar.Numerical.CalcVarNumericalOutput;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.ComboBox;
import javafx.scene.control.TextField;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;

import java.io.IOException;
import java.net.URL;

/**
 * A via current calculator based of the IPC-2221A standard.
 *
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2016-04-24
 * @last-modified   2016-04-24
 */
public class ViaCurrentIpc2221ACalcModel extends Calculator {

    //===============================================================================================//
    //=========================================== CONSTANTS ========================================//
    //===============================================================================================//

    public static final Double ipc2221ACoefficientK = 0.048;
    public static final Double ipc2221ACoefficientb = 0.44;
    public static final Double ipc2221ACoefficientc = 0.725;

    //===============================================================================================//
    //========================================= FXML BINDINGS =======================================//
    //===============================================================================================//

    @FXML
    private WebView infoWebView;

    @FXML
    private TextField finishedHoleDiameterValue;
    @FXML
    private ComboBox finishedHoleDiameterUnits;

    @FXML
    private TextField platingThicknessValue;
    @FXML
    private ComboBox platingThicknessUnits;

    @FXML
    private TextField viaLengthValue;
    @FXML
    private ComboBox viaLengthUnits;

    // VARIABLES IN GRIDPANE

    @FXML
    private TextField temperatureRiseValue;
    @FXML
    private ComboBox temperatureRiseUnits;

    @FXML
    private TextField platedCopperResistivityValue;
    @FXML
    private ComboBox platedCopperResistivityUnits;

    @FXML
    private TextField specificThermalConductivityValue;
    @FXML
    private ComboBox specificThermalConductivityUnits;

    @FXML
    private TextField viaCrossSectionalAreaValue;
    @FXML
    private ComboBox viaCrossSectionalAreaUnits;

    @FXML
    private TextField viaResistanceValue;
    @FXML
    private ComboBox viaResistanceUnits;

    @FXML
    private TextField thermalResistanceValue;
    @FXML
    private ComboBox thermalResistanceUnits;

    @FXML
    private TextField currentLimitValue;
    @FXML
    private ComboBox currentLimitUnits;

    //===============================================================================================//
    //====================================== CALCULATOR VARIABLES ===================================//
    //===============================================================================================//

    // CALCULATOR VARIABLES IN DIAGRAM
    public final CalcVarNumericalInput finishedHoleDiameter_M = new CalcVarNumericalInput();
    public final CalcVarNumericalInput platingThickness_M = new CalcVarNumericalInput();
    public final CalcVarNumericalInput viaLength_M = new CalcVarNumericalInput();

    // CALCULATOR VARIABLES IN GRIDPANE
    public final CalcVarNumericalInput temperatureRise_DegC = new CalcVarNumericalInput();
    public final CalcVarNumericalInput platedCopperResistivity_OhmMeter = new CalcVarNumericalInput();
    public final CalcVarNumericalInput specificThermalConductivity_WpKm = new CalcVarNumericalInput();
    public final CalcVarNumericalOutput viaCrossSectionalArea_M2 = new CalcVarNumericalOutput();
    public final CalcVarNumericalOutput viaResistance_Ohms = new CalcVarNumericalOutput();
    public final CalcVarNumericalOutput thermalResistance_DegCpWatt = new CalcVarNumericalOutput();
    public final CalcVarNumericalOutput currentLimit = new CalcVarNumericalOutput();

    //===============================================================================================//
    //========================================== CONSTRUCTORS =======================================//
    //===============================================================================================//

    public ViaCurrentIpc2221ACalcModel() {

        super(
                "Via Current (IPC-2221A)",
                "PCB via current carrying capability calculator, using the IPC-2221A standard.",
                new String[]{"Electronics", "PCB"},
                new String[]{"pcb", "via", "current", "width", "carry", "heat", "hot", "temperature", "ipc", "ipc2221a", "ipc-2221a", "resistivity", "ampacity"});

        super.setIconImagePath(getClass().getResource("img/grid-icon.png"));

        //===============================================================================================//
        //======================================== LOAD .FXML FILE ======================================//
        //===============================================================================================//

        FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("ViaCurrentIpc2221ACalcView.fxml"));
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
        //================================ FINISHED HOLE DIAMETER (input) ===============================//
        //===============================================================================================//

        this.finishedHoleDiameter_M.setName("finishedHoleDiameter_M");
        this.finishedHoleDiameter_M.setValueTextField(this.finishedHoleDiameterValue);
        this.finishedHoleDiameter_M.setUnitsComboBox(this.finishedHoleDiameterUnits);
        this.finishedHoleDiameter_M.setUnits(new NumberUnit[]{
                new NumberUnitMultiplier("um", 1e-6),
                new NumberUnitMultiplier("mm", 1e-3, NumberPreference.DEFAULT),
        });
        this.finishedHoleDiameter_M.setHelpText("The finished hole diameter of the via. This is not the same as the drilled hole diameter, as the via is then plated.");
        this.finishedHoleDiameter_M.setIsEngineeringNotationEnabled(false);

        //===== VALIDATORS =====//
        this.finishedHoleDiameter_M.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.finishedHoleDiameter_M.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.finishedHoleDiameter_M);

        //===============================================================================================//
        //================================== PLATING THICKNESS (input) ==================================//
        //===============================================================================================//

        this.platingThickness_M.setName("platingThickness_M");
        this.platingThickness_M.setValueTextField(this.platingThicknessValue);
        this.platingThickness_M.setUnitsComboBox(this.platingThicknessUnits);
        this.platingThickness_M.setUnits(new NumberUnit[]{
                new NumberUnitMultiplier("um", 1e-6, NumberPreference.DEFAULT),
                new NumberUnitMultiplier("oz", UnitConversionConstants.COPPER_THICKNESS_M_PER_OZ),
                new NumberUnitMultiplier("mils", UnitConversionConstants.METERS_PER_MILS),
        });
        this.platingThickness_M.setHelpText("The plating thickness of the via walls. This is usually the same as the thickness of the start and end copper layers that the via connects to.");
        this.platingThickness_M.setIsEngineeringNotationEnabled(false);

        //===== VALIDATORS =====//
        this.platingThickness_M.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.platingThickness_M.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.platingThickness_M);

        //===============================================================================================//
        //======================================== VIA LENGTH (input) ===================================//
        //===============================================================================================//

        this.viaLength_M.setName("viaLength_M");
        this.viaLength_M.setValueTextField(this.viaLengthValue);
        this.viaLength_M.setUnitsComboBox(this.viaLengthUnits);
        this.viaLength_M.setUnits(new NumberUnit[]{
                new NumberUnitMultiplier("um", 1e-6),
                new NumberUnitMultiplier("mm", 1e-3, NumberPreference.DEFAULT),
                new NumberUnitMultiplier("mils", UnitConversionConstants.METERS_PER_MILS),
        });
        this.viaLength_M.setHelpText("The length of the via. This is equal to the distance between the copper planes the via starts and ends on. For a simple 2-layer 1.6mm thick PCB, the via height is also 1.6mm. This could also be called the height of the via.");
        this.viaLength_M.setIsEngineeringNotationEnabled(false);

        //===== VALIDATORS =====//
        this.viaLength_M.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.viaLength_M.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.viaLength_M);


        //===============================================================================================//
        //==================================== TEMPERATURE RISE (input) =================================//
        //===============================================================================================//

        this.temperatureRise_DegC.setName("temperatureRise_DegC");
        this.temperatureRise_DegC.setValueTextField(this.temperatureRiseValue);
        this.temperatureRise_DegC.setUnitsComboBox(this.temperatureRiseUnits);
        this.temperatureRise_DegC.setUnits(new NumberUnit[]{
                new NumberUnitMultiplier("°C", 1e0),
        });
        this.temperatureRise_DegC.setHelpText("The maximum temperature rise above ambient you are allowing for the via. A rule-of-thumb for this value is between 10-40°C.");
        this.temperatureRise_DegC.setIsEngineeringNotationEnabled(false);

        // Plated copper has a resistivity of about 19e-9 Ohm.m (1.9e-6 Ohm.cm)
        this.temperatureRise_DegC.setDefaultRawValue(20.0);

        //===== VALIDATORS =====//
        this.temperatureRise_DegC.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.temperatureRise_DegC.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.temperatureRise_DegC);


        //===============================================================================================//
        //================================ PLATED COPPER RESISTIVITY (input) ============================//
        //===============================================================================================//

        this.platedCopperResistivity_OhmMeter.setName("platedCopperResistivity_OhmMeter");
        this.platedCopperResistivity_OhmMeter.setValueTextField(this.platedCopperResistivityValue);
        this.platedCopperResistivity_OhmMeter.setUnitsComboBox(this.platedCopperResistivityUnits);
        this.platedCopperResistivity_OhmMeter.setUnits(new NumberUnit[]{
                new NumberUnitMultiplier("Ω⋅m", 1e0),
        });
        this.platedCopperResistivity_OhmMeter.setHelpText("The resistivity of the plated copper which the via is made from.");
        this.platedCopperResistivity_OhmMeter.setIsEngineeringNotationEnabled(false);

        // Plated copper has a resistivity of about 19e-9 Ohm.m (1.9e-6 Ohm.cm)
        this.platedCopperResistivity_OhmMeter.setDefaultRawValue(19e-9);

        //===== VALIDATORS =====//
        this.platedCopperResistivity_OhmMeter.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.platedCopperResistivity_OhmMeter.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.platedCopperResistivity_OhmMeter);

        
        //===============================================================================================//
        //============================== SPECIFIC THERMAL CONDUCTIVITY (input) ==========================//
        //===============================================================================================//

        this.specificThermalConductivity_WpKm.setName("specificThermalConductivity_WpKm");
        this.specificThermalConductivity_WpKm.setValueTextField(this.specificThermalConductivityValue);
        this.specificThermalConductivity_WpKm.setUnitsComboBox(this.specificThermalConductivityUnits);
        this.specificThermalConductivity_WpKm.setUnits(new NumberUnit[]{
                new NumberUnitMultiplier("W/K⋅m", 1e0),
        });
        this.specificThermalConductivity_WpKm.setHelpText("The specific thermal conductivity, k, of the plated copper which the via is made from.");
        this.specificThermalConductivity_WpKm.setIsEngineeringNotationEnabled(false);

        // Plated copper has a specific thermal conductivity of about 401.8W/K.m
        // (a specific thermal resistivity of 2.489e-3Km/W)
        this.specificThermalConductivity_WpKm.setDefaultRawValue(401.8);

        //===== VALIDATORS =====//
        this.specificThermalConductivity_WpKm.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.specificThermalConductivity_WpKm.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.specificThermalConductivity_WpKm);


        //===============================================================================================//
        //================================ VIA CROSS-SECTIONAL AREA (output) ============================//
        //===============================================================================================//

        this.viaCrossSectionalArea_M2.setName("viaCrossSectionalArea_M2");
        this.viaCrossSectionalArea_M2.setValueTextField(this.viaCrossSectionalAreaValue);
        this.viaCrossSectionalArea_M2.setUnitsComboBox(this.viaCrossSectionalAreaUnits);
        this.viaCrossSectionalArea_M2.setEquationFunction(() -> {
            // Read dependencies
            Double finishedHoleDiameter_M = this.finishedHoleDiameter_M.getRawVal();
            Double platingThickness_M = this.platingThickness_M.getRawVal();

            return Math.PI * (finishedHoleDiameter_M + platingThickness_M) * platingThickness_M;

        });
        this.viaCrossSectionalArea_M2.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("m2", 1e0, NumberPreference.DEFAULT),
        });
        this.viaCrossSectionalArea_M2.setRounding(CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES, 4);
        this.viaCrossSectionalArea_M2.setHelpText("The cross-sectional area of the via (the area of the via as viewed from the top down).");
        this.viaCrossSectionalArea_M2.setIsEngineeringNotationEnabled(false);

        // Add validators
        this.viaCrossSectionalArea_M2.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.viaCrossSectionalArea_M2.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.viaCrossSectionalArea_M2);

        //===============================================================================================//
        //====================================== VIA RESISTANCE (output) ================================//
        //===============================================================================================//

        this.viaResistance_Ohms.setName("viaResistance_Ohms");
        this.viaResistance_Ohms.setValueTextField(this.viaResistanceValue);
        this.viaResistance_Ohms.setUnitsComboBox(this.viaResistanceUnits);
        this.viaResistance_Ohms.setEquationFunction(() -> {
            // Read dependencies
            Double platedCopperResistivity_OhmMeter = this.platedCopperResistivity_OhmMeter.getRawVal();
            Double viaLength_M = this.viaLength_M.getRawVal();
            Double viaCrossSectionalArea_M2 = this.viaCrossSectionalArea_M2.getRawVal();

            return (platedCopperResistivity_OhmMeter*viaLength_M)/viaCrossSectionalArea_M2;

        });
        this.viaResistance_Ohms.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("mΩ", 1e-3),
        });
        this.viaResistance_Ohms.setNumDigitsToRound(4);
        this.viaResistance_Ohms.setHelpText("The resistance of the via. This is the resistance as measured from the top to the bottom of the via.");
        this.viaResistance_Ohms.setIsEngineeringNotationEnabled(false);

        // Add validators
        this.viaResistance_Ohms.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.viaResistance_Ohms.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.viaResistance_Ohms);

        //===============================================================================================//
        //================================== THERMAL RESISTANCE (output) ================================//
        //===============================================================================================//

        this.thermalResistance_DegCpWatt.setName("thermalResistance_DegCpWatt");
        this.thermalResistance_DegCpWatt.setValueTextField(this.thermalResistanceValue);
        this.thermalResistance_DegCpWatt.setUnitsComboBox(this.thermalResistanceUnits);
        this.thermalResistance_DegCpWatt.setEquationFunction(() -> {
            // Read dependencies
            Double viaLength_M = this.viaLength_M.getRawVal();
            Double specificThermalConductivity_WpKm = this.specificThermalConductivity_WpKm.getRawVal();
            Double viaCrossSectionalArea_M2 = this.viaCrossSectionalArea_M2.getRawVal();

            return viaLength_M/(specificThermalConductivity_WpKm * viaCrossSectionalArea_M2);

        });
        this.thermalResistance_DegCpWatt.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("°C/W", 1e0),
        });
        this.thermalResistance_DegCpWatt.setNumDigitsToRound(4);
        this.thermalResistance_DegCpWatt.setHelpText("The thermal resistance of the via.");
        this.thermalResistance_DegCpWatt.setIsEngineeringNotationEnabled(false);

        // Add validators
        this.thermalResistance_DegCpWatt.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.thermalResistance_DegCpWatt.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.thermalResistance_DegCpWatt);

        //===============================================================================================//
        //====================================== CURRENT LIMIT (output) =================================//
        //===============================================================================================//

        // Note that this does not take into account the via length or the via resistivity.

        this.currentLimit.setName("currentLimit");
        this.currentLimit.setValueTextField(this.currentLimitValue);
        this.currentLimit.setUnitsComboBox(this.currentLimitUnits);
        this.currentLimit.setEquationFunction(() -> {
            // Read dependencies
            Double temperatureRise_DegC = this.temperatureRise_DegC.getRawVal();
            Double viaCrossSectionalArea_M2 = this.viaCrossSectionalArea_M2.getRawVal();

            // Perform unit conversions for IPC-2221A equation
            Double viaCrossSectionalArea_Mills2 = viaCrossSectionalArea_M2 * Math.pow((1000.0/25.4)*1000.0, 2);

            // Use the IPC-2221A equation
            return ipc2221ACoefficientK*Math.pow(temperatureRise_DegC, ipc2221ACoefficientb)*Math.pow(viaCrossSectionalArea_Mills2, ipc2221ACoefficientc);
        });
        this.currentLimit.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("A", 1e0, NumberPreference.DEFAULT),
        });
        this.currentLimit.setNumDigitsToRound(4);
        this.currentLimit.setHelpText("The maximum current the via can take before it rises to the specified temperature above ambient.");
        this.currentLimit.setIsEngineeringNotationEnabled(false);

        // Add validators
        this.currentLimit.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.currentLimit.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.currentLimit);

        //===============================================================================================//
        //=========================================== VIEW CONFIG =======================================//
        //===============================================================================================//

        // Setup the top PCB layer to dissappear if "External" is selected for the track layer,
        // and visible if "Internal" is selected.
        /*this.trackLayer.RawValueChanged += (sender, e) => {
            if (this.trackLayer.RawVal == "Internal") {
                view.TopPcb.Visibility = System.Windows.Visibility.Visible;
            }
            else if (this.trackLayer.RawVal == "External") {
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
