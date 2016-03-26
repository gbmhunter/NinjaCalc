
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

    @FXML private TextField e6ResistanceValue;
    @FXML private TextField e6ErrorValue;
    @FXML private TextField e12ResistanceValue;
    @FXML private TextField e12ErrorValue;


    //===============================================================================================//
    //====================================== CALCULATOR VARIABLES ===================================//
    //===============================================================================================//

    public CalcVarNumericalInput desiredResistance;
    public CalcVarNumericalOutput e6Resistance;
    public CalcVarNumericalOutput e6Error;
    public CalcVarNumericalOutput e12Resistance;
    public CalcVarNumericalOutput e12Error;

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
                "desiredResistance",                // Debug name
                this.desiredResistanceValue,        // Textbox for value (UI object)
                null,                               // No units for this variable
                new NumberUnit[]{
                        new NumberUnit("Ω", 1e0, NumberPreference.DEFAULT),
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
        //======================================= E6 RESISTANCE (output) ================================//
        //===============================================================================================//

        this.e6Resistance = new CalcVarNumericalOutput(
                "e6Resistance",
                this.e6ResistanceValue,     // Textbox
                null,                       // No units for this variable
                () -> {

                    // Read in variables
                    Double desiredResistance = this.desiredResistance.getRawVal();

                    if(Double.isNaN(desiredResistance)) {
                        return Double.NaN;
                    }

                    double actualResistance = StandardResistanceFinder.Find(desiredResistance, StandardResistanceFinder.eSeriesOptions.E6);

                    return actualResistance;

                },
                new NumberUnit[]{
                        new NumberUnit("Ω", 1e0, NumberPreference.DEFAULT),
                },
                4,
                "The closest resistance to your desired resistance that belongs to an E-series (which normally means you can by a resistor with this exact resistance)."
        );

        this.e6Resistance.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.e6Resistance.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.e6Resistance.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.e6Resistance);

        //===============================================================================================//
        //================================= E6 PERCENTAGE DIFFERENCE (output) ===========================//
        //===============================================================================================//

        this.e6Error = new CalcVarNumericalOutput(
                "e6Resistance",         // Debug name
                this.e6ErrorValue,      // Textbox for variable value
                null,                   // No units combobox for this variable
                () -> {

                    // Read in variables
                    Double desiredResistance = this.desiredResistance.getRawVal();
                    Double closestStandardResistance = this.e6Resistance.getRawVal();

                    if(Double.isNaN(desiredResistance)) {
                        return Double.NaN;
                    }

                    // Calculate percentage difference
                    double percentageDiff = (Math.abs(closestStandardResistance - desiredResistance)/desiredResistance)*100.0;

                    return percentageDiff;

                },
                new NumberUnit[]{
                        new NumberUnit("%", 1e0, NumberPreference.DEFAULT),
                },
                4,
                "The percentage difference between the closest standard resistance and your desired resistance."
        );

        this.e6Error.setRounding(CalcVarNumerical.RoundingTypes.DECIMAL_PLACES, 2);

        // Add validators. The percentage difference is allowed to be 0.
        this.e6Error.addValidator(Validator.IsNumber(CalcValidationLevels.Error));

        this.calcVars.add(this.e6Error);

        //===============================================================================================//
        //======================================= E12 RESISTANCE (output) ================================//
        //===============================================================================================//

        this.e12Resistance = new CalcVarNumericalOutput(
                "e12Resistance",
                this.e12ResistanceValue,     // Textbox
                null,                       // No units for this variable
                () -> {

                    // Read in variables
                    Double desiredResistance = this.desiredResistance.getRawVal();

                    if(Double.isNaN(desiredResistance)) {
                        return Double.NaN;
                    }

                    double actualResistance = StandardResistanceFinder.Find(desiredResistance, StandardResistanceFinder.eSeriesOptions.E12);

                    return actualResistance;

                },
                new NumberUnit[]{
                        new NumberUnit("Ω", 1e0, NumberPreference.DEFAULT),
                },
                4,
                "The closest resistance to your desired resistance that belongs to an E-series (which normally means you can by a resistor with this exact resistance)."
        );

        this.e12Resistance.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.e12Resistance.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.e12Resistance.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.e12Resistance);

        //===============================================================================================//
        //================================= E6 PERCENTAGE DIFFERENCE (output) ===========================//
        //===============================================================================================//

        this.e12Error = new CalcVarNumericalOutput(
                "e12Error",         // Debug name
                this.e12ErrorValue,      // Textbox for variable value
                null,                   // No units combobox for this variable
                () -> {

                    // Read in variables
                    Double desiredResistance = this.desiredResistance.getRawVal();
                    Double closestStandardResistance = this.e12Resistance.getRawVal();

                    if(Double.isNaN(desiredResistance)) {
                        return Double.NaN;
                    }

                    // Calculate percentage difference
                    double percentageDiff = (Math.abs(closestStandardResistance - desiredResistance)/desiredResistance)*100.0;

                    return percentageDiff;

                },
                new NumberUnit[]{
                        new NumberUnit("%", 1e0, NumberPreference.DEFAULT),
                },
                4,
                "The percentage difference between the closest standard resistance and your desired resistance."
        );

        this.e12Error.setRounding(CalcVarNumerical.RoundingTypes.DECIMAL_PLACES, 2);

        // Add validators. The percentage difference is allowed to be 0.
        this.e12Error.addValidator(Validator.IsNumber(CalcValidationLevels.Error));

        this.calcVars.add(this.e12Error);

        //===============================================================================================//
        //============================================== FINAL ==========================================//
        //===============================================================================================//

        this.findDependenciesAndDependants();
        this.refreshDirectionsAndUpdateUI();
        this.recalculateAllOutputs();
        this.validateAllVariables();

    }

}

