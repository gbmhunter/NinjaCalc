
package Calculators.Electronics.Basic.StandardResistanceFinder;

// SYSTEM INCLUDES

import Core.*;
import Utility.StandardResistanceFinder;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.concurrent.Worker;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.*;
import javafx.scene.control.TextField;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.concurrent.Worker.State;

import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.events.Event;
import org.w3c.dom.events.EventListener;
import org.w3c.dom.events.EventTarget;
import org.w3c.dom.html.HTMLAnchorElement;

import java.awt.*;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;

// USER INCLUDES

/**
 * Calculator for finding a E-series resistance (standard resistance, preferred value) which is closest to the user's
 * desired resistance.
 *
 * Lists closest resistance and percentage error in each EIA E series from E6 to E192.
 *
 * @author gbmhunter
 * @since 2013-09-17
 * @last-modified 2016-04-10
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
    @FXML private TextField e24ResistanceValue;
    @FXML private TextField e24ErrorValue;
    @FXML private TextField e48ResistanceValue;
    @FXML private TextField e48ErrorValue;
    @FXML private TextField e96ResistanceValue;
    @FXML private TextField e96ErrorValue;
    @FXML private TextField e192ResistanceValue;
    @FXML private TextField e192ErrorValue;

    //===============================================================================================//
    //====================================== CALCULATOR VARIABLES ===================================//
    //===============================================================================================//

    public CalcVarNumericalInput desiredResistance;
    public CalcVarNumericalOutput e6Resistance;
    public CalcVarNumericalOutput e6Error;
    public CalcVarNumericalOutput e12Resistance;
    public CalcVarNumericalOutput e12Error;
    public CalcVarNumericalOutput e24Resistance;
    public CalcVarNumericalOutput e24Error;
    public CalcVarNumericalOutput e48Resistance;
    public CalcVarNumericalOutput e48Error;
    public CalcVarNumericalOutput e96Resistance;
    public CalcVarNumericalOutput e96Error;
    public CalcVarNumericalOutput e192Resistance;
    public CalcVarNumericalOutput e192Error;

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

        engine.getLoadWorker().stateProperty().addListener(
                new ChangeListener<State>() {
                    public void changed(ObservableValue ov, State oldState, State newState) {
                        if (newState == State.SUCCEEDED) {
                            //stage.setTitle(engine.getLocation());

                            NodeList nodeList = engine.getDocument().getElementsByTagName("a");
                            for (int i = 0; i < nodeList.getLength(); i++)
                            {
                                Node node= nodeList.item(i);
                                EventTarget eventTarget = (EventTarget) node;
                                eventTarget.addEventListener("click", new EventListener()
                                {
                                    @Override
                                    public void handleEvent(Event evt)
                                    {
                                        EventTarget target = evt.getCurrentTarget();
                                        HTMLAnchorElement anchorElement = (HTMLAnchorElement) target;
                                        String href = anchorElement.getHref();
                                        //handle opening URL outside JavaFX WebView
                                        Desktop d = Desktop.getDesktop();

                                        try {
                                            URI uriToBrowseTo = new URI(href);
                                            d.browse(uriToBrowseTo);
                                        } catch (URISyntaxException e) {
                                            System.err.println("URI had incorrect syntax.");
                                        } catch (IOException e) {
                                            System.err.println("An IOException occurred while trying to open link in system browser..");
                                        }

                                        System.out.println(href);
                                        evt.preventDefault();
                                    }
                                }, false);
                            }


                        }
                    }
                });

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

        this.desiredResistance.setIsEngineeringNotationEnabled(true);

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

        this.e6Resistance.setRounding(CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES, 2);
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

        this.e12Resistance.setRounding(CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES, 2);
        this.e12Resistance.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.e12Resistance.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.e12Resistance.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.e12Resistance);

        //===============================================================================================//
        //================================= E12 PERCENTAGE DIFFERENCE (output) ==========================//
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
        //======================================= E24 RESISTANCE (output) ================================//
        //===============================================================================================//

        this.e24Resistance = new CalcVarNumericalOutput(
                "e24Resistance",
                this.e24ResistanceValue,     // Textbox
                null,                       // No units for this variable
                () -> {

                    // Read in variables
                    Double desiredResistance = this.desiredResistance.getRawVal();

                    if(Double.isNaN(desiredResistance)) {
                        return Double.NaN;
                    }

                    double actualResistance = StandardResistanceFinder.Find(desiredResistance, StandardResistanceFinder.eSeriesOptions.E24);

                    return actualResistance;

                },
                new NumberUnit[]{
                        new NumberUnit("Ω", 1e0, NumberPreference.DEFAULT),
                },
                4,
                "The closest resistance to your desired resistance that belongs to an E-series (which normally means you can by a resistor with this exact resistance)."
        );

        this.e24Resistance.setRounding(CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES, 2);
        this.e24Resistance.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.e24Resistance.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.e24Resistance.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.e24Resistance);

        //===============================================================================================//
        //================================= E24 PERCENTAGE DIFFERENCE (output) ==========================//
        //===============================================================================================//

        this.e24Error = new CalcVarNumericalOutput(
                "e24Error",         // Debug name
                this.e24ErrorValue,      // Textbox for variable value
                null,                   // No units combobox for this variable
                () -> {

                    // Read in variables
                    Double desiredResistance = this.desiredResistance.getRawVal();
                    Double closestStandardResistance = this.e24Resistance.getRawVal();

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

        this.e24Error.setRounding(CalcVarNumerical.RoundingTypes.DECIMAL_PLACES, 2);

        // Add validators. The percentage difference is allowed to be 0.
        this.e24Error.addValidator(Validator.IsNumber(CalcValidationLevels.Error));

        this.calcVars.add(this.e24Error);

        //===============================================================================================//
        //======================================= E48 RESISTANCE (output) ================================//
        //===============================================================================================//

        this.e48Resistance = new CalcVarNumericalOutput(
                "e48Resistance",
                this.e48ResistanceValue,     // Textbox
                null,                       // No units for this variable
                () -> {

                    // Read in variables
                    Double desiredResistance = this.desiredResistance.getRawVal();

                    if(Double.isNaN(desiredResistance)) {
                        return Double.NaN;
                    }

                    double actualResistance = StandardResistanceFinder.Find(desiredResistance, StandardResistanceFinder.eSeriesOptions.E48);

                    return actualResistance;

                },
                new NumberUnit[]{
                        new NumberUnit("Ω", 1e0, NumberPreference.DEFAULT),
                },
                4,
                "The closest resistance to your desired resistance that belongs to an E-series (which normally means you can by a resistor with this exact resistance)."
        );

        this.e48Resistance.setRounding(CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES, 3);
        this.e48Resistance.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.e48Resistance.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.e48Resistance.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.e48Resistance);

        //===============================================================================================//
        //================================= E48 PERCENTAGE DIFFERENCE (output) ==========================//
        //===============================================================================================//

        this.e48Error = new CalcVarNumericalOutput(
                "e48Error",         // Debug name
                this.e48ErrorValue,      // Textbox for variable value
                null,                   // No units combobox for this variable
                () -> {

                    // Read in variables
                    Double desiredResistance = this.desiredResistance.getRawVal();
                    Double closestStandardResistance = this.e48Resistance.getRawVal();

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

        this.e48Error.setRounding(CalcVarNumerical.RoundingTypes.DECIMAL_PLACES, 2);

        // Add validators. The percentage difference is allowed to be 0.
        this.e48Error.addValidator(Validator.IsNumber(CalcValidationLevels.Error));

        this.calcVars.add(this.e48Error);

        //===============================================================================================//
        //======================================= E96 RESISTANCE (output) ===============================//
        //===============================================================================================//

        this.e96Resistance = new CalcVarNumericalOutput(
                "e96Resistance",
                this.e96ResistanceValue,     // Textbox
                null,                       // No units for this variable
                () -> {

                    // Read in variables
                    Double desiredResistance = this.desiredResistance.getRawVal();

                    if(Double.isNaN(desiredResistance)) {
                        return Double.NaN;
                    }

                    double actualResistance = StandardResistanceFinder.Find(desiredResistance, StandardResistanceFinder.eSeriesOptions.E96);

                    return actualResistance;

                },
                new NumberUnit[]{
                        new NumberUnit("Ω", 1e0, NumberPreference.DEFAULT),
                },
                4,
                "The closest resistance to your desired resistance that belongs to an E-series (which normally means you can by a resistor with this exact resistance)."
        );

        this.e96Resistance.setRounding(CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES, 3);
        this.e96Resistance.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.e96Resistance.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.e96Resistance.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.e96Resistance);

        //===============================================================================================//
        //================================= E96 PERCENTAGE DIFFERENCE (output) ==========================//
        //===============================================================================================//

        this.e96Error = new CalcVarNumericalOutput(
                "e96Error",         // Debug name
                this.e96ErrorValue,      // Textbox for variable value
                null,                   // No units combobox for this variable
                () -> {

                    // Read in variables
                    Double desiredResistance = this.desiredResistance.getRawVal();
                    Double closestStandardResistance = this.e96Resistance.getRawVal();

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

        this.e96Error.setRounding(CalcVarNumerical.RoundingTypes.DECIMAL_PLACES, 2);

        // Add validators. The percentage difference is allowed to be 0.
        this.e96Error.addValidator(Validator.IsNumber(CalcValidationLevels.Error));

        this.calcVars.add(this.e96Error);

        //===============================================================================================//
        //===================================== E192 RESISTANCE (output) ================================//
        //===============================================================================================//

        this.e192Resistance = new CalcVarNumericalOutput(
                "e192Resistance",
                this.e192ResistanceValue,     // Textbox
                null,                       // No units for this variable
                () -> {

                    // Read in variables
                    Double desiredResistance = this.desiredResistance.getRawVal();

                    if(Double.isNaN(desiredResistance)) {
                        return Double.NaN;
                    }

                    double actualResistance = StandardResistanceFinder.Find(desiredResistance, StandardResistanceFinder.eSeriesOptions.E192);

                    return actualResistance;

                },
                new NumberUnit[]{
                        new NumberUnit("Ω", 1e0, NumberPreference.DEFAULT),
                },
                4,
                "The closest resistance to your desired resistance that belongs to an E-series (which normally means you can by a resistor with this exact resistance)."
        );

        this.e192Resistance.setRounding(CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES, 3);
        this.e192Resistance.setIsEngineeringNotationEnabled(true);

        // Add validators
        this.e192Resistance.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.e192Resistance.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        this.calcVars.add(this.e192Resistance);

        //===============================================================================================//
        //================================= E192 PERCENTAGE DIFFERENCE (output) ==========================//
        //===============================================================================================//

        this.e192Error = new CalcVarNumericalOutput(
                "e192Error",         // Debug name
                this.e192ErrorValue,      // Textbox for variable value
                null,                   // No units combobox for this variable
                () -> {

                    // Read in variables
                    Double desiredResistance = this.desiredResistance.getRawVal();
                    Double closestStandardResistance = this.e192Resistance.getRawVal();

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

        this.e192Error.setRounding(CalcVarNumerical.RoundingTypes.DECIMAL_PLACES, 2);

        // Add validators. The percentage difference is allowed to be 0.
        this.e192Error.addValidator(Validator.IsNumber(CalcValidationLevels.Error));

        this.calcVars.add(this.e192Error);

        //===============================================================================================//
        //============================================== FINAL ==========================================//
        //===============================================================================================//

        this.findDependenciesAndDependants();
        this.refreshDirectionsAndUpdateUI();
        this.recalculateAllOutputs();
        this.validateAllVariables();

    }

}

