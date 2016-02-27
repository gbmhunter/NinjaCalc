
package Calculators.Electronics.Basic.StandardResistanceFinder;

// SYSTEM INCLUDES

import Core.*;
import Utility.StandardResistanceFinder;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.*;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;

import java.io.IOException;
import java.net.URL;

// USER INCLUDES

/**
 * Calculator for finding a E-series resistance (standard resistance) which is closest to the user's
 * desired resistance.
 *
 * @author gbmhunter
 * @since 2013-09-17
 * @last-modified 2016-02-14
 */
public class StandardResistanceFinderModel extends Calculator {

    //===============================================================================================//
    //========================================= FXML Bindings =======================================//
    //===============================================================================================//

    @FXML private WebView infoWebView;

    @FXML private TextField desiredResistanceValue;
    @FXML private ComboBox desiredResistanceUnits;

    @FXML private ComboBox eSeriesComboBox;

    @FXML private TextField actualResistanceValue;
    @FXML private ComboBox actualResistanceUnits;

    @FXML private TextField percentageDiffValue;
    @FXML private ComboBox percentageDiffUnits;

    //===============================================================================================//
    //====================================== CALCULATOR VARIABLES ===================================//
    //===============================================================================================//

    public CalcVarNumericalInput desiredResistance;
    public CalcVarComboBox eSeries;
    public CalcVarNumericalOutput actualResistance;
    public CalcVarNumericalOutput percentageDiff;

    //===============================================================================================//
    //=========================================== CONSTRUCTOR =======================================//
    //===============================================================================================//

    public StandardResistanceFinderModel() {

        super( "Standard Resistance Finder",
                "Find the closest E-series (e.g. E12, E96) resistor to your desired resistance.",
                new String[]{ "Electronics", "Basic" },
                new String[]{"ohm, resistor, resistance, e, series"});

        super.setIconImagePath(getClass().getResource("grid-icon.png"));

        //===============================================================================================//
        //======================================== LOAD .FXML FILE ======================================//
        //===============================================================================================//

        FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("StandardResistanceFinderView.fxml"));
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
        //================================== DESIRED RESISTANCE (input) =================================//
        //===============================================================================================//

        this.desiredResistance = new CalcVarNumericalInput(
                "desiredResistance",             // Debug name
                this.desiredResistanceValue,     // Textbox for value (UI object)
                this.desiredResistanceUnits,     // Combobox for units (UI object)
                new NumberUnit[]{
                        new NumberUnit("mΩ", 1e-3),
                        new NumberUnit("Ω", 1e0, NumberPreference.DEFAULT),
                        new NumberUnit("kΩ", 1e3),
                        new NumberUnit("MΩ", 1e6),
                        new NumberUnit("GΩ", 1e9),
                },
                4,                          // Num. digits to round to
                null,                       // Default value
                "The current you want the PCB track to be able to handle." // Help info
        );

        //========== VALIDATORS ===========//
        this.desiredResistance.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.desiredResistance.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.desiredResistance);

        //===============================================================================================//
        //========================================= IS PLANE PRESENT ====================================//
        //===============================================================================================//

        this.eSeries = new CalcVarComboBox(
                "eSeries",                          // Debug name
                eSeriesComboBox,                    // Combobox to attach to (UI element)
                new String[] {                      // Options for Combobox
                        "E12",
                        "E24",
                        "E48",
                        "E96",
                        "E192",
                },
                () -> CalcVarDirections.Input,      // Always an input
                "The E-series you wish to select a resistance from.");  // Tooltip text

        this.calcVars.add(this.eSeries);

        //===============================================================================================//
        //===================================== ACTUAL RESISTANCE (output) ==============================//
        //===============================================================================================//

        this.actualResistance = new CalcVarNumericalOutput(
                "actualResistance",
                this.actualResistanceValue,
                this.actualResistanceUnits,
                () -> {

                    // Read in variables
                    Double desiredResistance = this.desiredResistance.getRawVal();
                    String selectedESeries = this.eSeries.getRawVal();

                    if(Double.isNaN(desiredResistance)) {
                        return 0;
                    }


                    StandardResistanceFinder.eSeriesOptions eSeries;

                    switch(selectedESeries) {
                        case "E12":
                            eSeries = StandardResistanceFinder.eSeriesOptions.E12;
                            break;
                        case "E24":
                            eSeries = StandardResistanceFinder.eSeriesOptions.E24;
                            break;
                        case "E48":
                            eSeries = StandardResistanceFinder.eSeriesOptions.E48;
                            break;
                        case "E96":
                            eSeries = StandardResistanceFinder.eSeriesOptions.E96;
                            break;
                        case "E192":
                            eSeries = StandardResistanceFinder.eSeriesOptions.E192;
                            break;
                        default:
                            throw new IllegalArgumentException("Unrecognised eSeries combobox option.");
                    }

                    double actualResistance = StandardResistanceFinder.Find(desiredResistance, eSeries);

                    return actualResistance;

                },
                new NumberUnit[]{
                        new NumberUnit("mΩ", 1e-3),
                        new NumberUnit("Ω", 1e0, NumberPreference.DEFAULT),
                        new NumberUnit("kΩ", 1e3),
                        new NumberUnit("MΩ", 1e6),
                        new NumberUnit("GΩ", 1e9),
                },
                4,
                "The closest resistance to your desired resistance that belongs to an E-series (which normally means you can by a resistor with this exact resistance).");

        // Add validators
        this.actualResistance.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.actualResistance.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.actualResistance);

        //===============================================================================================//
        //==================================== PERCENTAGE DIFFERENCE (output) ===========================//
        //===============================================================================================//

        this.percentageDiff = new CalcVarNumericalOutput(
                "actualResistance",
                this.percentageDiffValue,
                this.percentageDiffUnits,
                () -> {

                    // Read in variables
                    Double desiredResistance = this.desiredResistance.getRawVal();
                    Double closestStandardResistance = this.actualResistance.getRawVal();

                    // Calculate percentage difference
                    double percentageDiff = (Math.abs(closestStandardResistance - desiredResistance)/desiredResistance)*100.0;

                    return percentageDiff;

                },
                new NumberUnit[]{
                        new NumberUnit("%", 1e0, NumberPreference.DEFAULT),
                },
                4,
                "The percentage difference between the closest standard resistance and your desired resistance.");

        // Add validators. The percentage difference is allowed to be 0.
        this.percentageDiff.addValidator(Validator.IsNumber(CalcValidationLevels.Error));

        this.calcVars.add(this.percentageDiff);

        //===============================================================================================//
        //============================================== FINAL ==========================================//
        //===============================================================================================//

        this.findDependenciesAndDependants();
        this.refreshDirectionsAndUpdateUI();
        this.recalculateAllOutputs();
        this.validateAllVariables();

    }

}

