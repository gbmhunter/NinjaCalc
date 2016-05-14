
package Calculators.Electronics.Basic.StandardResistanceFinder;

// SYSTEM INCLUDES

import Core.CalcVar.CalcVarNumerical;
import Core.CalcVar.CalcVarNumericalInput;
import Core.CalcVar.CalcVarNumericalOutput;
import Utility.StandardResistanceFinder;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.GridPane;
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
import java.util.ArrayList;

// USER INCLUDES

import Core.*;

/**
 * Calculator for finding a E-series resistance (standard resistance, preferred value) which is closest to the user's
 * desired resistance.
 *
 * Lists closest resistance and percentage error in each EIA E series from E6 to E192.
 *
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @last-modified   2016-05-01
 * @since           2013-09-17
 */
public class StandardResistanceFinderModel extends Calculator {

    //===============================================================================================//
    //========================================= FXML Bindings =======================================//
    //===============================================================================================//

    @FXML
    private WebView infoWebView;

    @FXML
    private TextField desiredResistanceValue;

    @FXML
    private TextField e6ResistanceValue;
    @FXML
    private TextField e6ErrorValue;
    @FXML
    private TextField e12ResistanceValue;
    @FXML
    private TextField e12ErrorValue;
    @FXML
    private TextField e24ResistanceValue;
    @FXML
    private TextField e24ErrorValue;
    @FXML
    private TextField e48ResistanceValue;
    @FXML
    private TextField e48ErrorValue;
    @FXML
    private TextField e96ResistanceValue;
    @FXML
    private TextField e96ErrorValue;
    @FXML
    private TextField e192ResistanceValue;
    @FXML
    private TextField e192ErrorValue;

    @FXML
    private GridPane variableGridPane;

    //===============================================================================================//
    //====================================== CALCULATOR VARIABLES ===================================//
    //===============================================================================================//

    public CalcVarNumericalInput desiredResistance = new CalcVarNumericalInput();
    public CalcVarNumericalOutput e6Resistance = new CalcVarNumericalOutput();
    public CalcVarNumericalOutput e6Error = new CalcVarNumericalOutput();
    public CalcVarNumericalOutput e12Resistance = new CalcVarNumericalOutput();
    public CalcVarNumericalOutput e12Error = new CalcVarNumericalOutput();
    public CalcVarNumericalOutput e24Resistance = new CalcVarNumericalOutput();
    public CalcVarNumericalOutput e24Error = new CalcVarNumericalOutput();
    public CalcVarNumericalOutput e48Resistance = new CalcVarNumericalOutput();
    public CalcVarNumericalOutput e48Error = new CalcVarNumericalOutput();
    public CalcVarNumericalOutput e96Resistance = new CalcVarNumericalOutput();
    public CalcVarNumericalOutput e96Error = new CalcVarNumericalOutput();
    public CalcVarNumericalOutput e192Resistance = new CalcVarNumericalOutput();
    public CalcVarNumericalOutput e192Error = new CalcVarNumericalOutput();

    private class GridPaneRow {
        String resistanceSeries;
        CalcVarNumericalOutput closestResistance;
        CalcVarNumericalOutput closesResistanceError;
        CalcVarNumericalOutput closestHigherResistance;
        CalcVarNumericalOutput closestHigherResistanceError;
        CalcVarNumericalOutput closestLowerResistance;
        CalcVarNumericalOutput closestLowerResistanceError;
    }

    public ArrayList<GridPaneRow> gridPaneRows = new ArrayList<>();

    //===============================================================================================//
    //=========================================== CONSTRUCTOR =======================================//
    //===============================================================================================//

    public StandardResistanceFinderModel() {

        super("Standard Resistance Finder",
                "Find the closest E-series (e.g. E12, E96) resistor (preferred value) to your desired resistance.",
                new String[]{"Electronics", "Basic"},
                new String[]{"ohm", "resistor", "resistance", "e", "series", "standard", "preferred", "values", "e6", "e12", "e24", "e48", "e96", "e128"});

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
        final String htmlFile = "info.html";
        URL url = getClass().getResource(htmlFile);

        engine.getLoadWorker().stateProperty().addListener(
                new ChangeListener<State>() {
                    public void changed(ObservableValue ov, State oldState, State newState) {
                        if (newState == State.SUCCEEDED) {
                            //stage.setTitle(engine.getLocation());

                            NodeList nodeList = engine.getDocument().getElementsByTagName("a");
                            for (int i = 0; i < nodeList.getLength(); i++) {
                                Node node = nodeList.item(i);
                                EventTarget eventTarget = (EventTarget) node;
                                eventTarget.addEventListener("click", new EventListener() {
                                    @Override
                                    public void handleEvent(Event evt) {
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

        this.desiredResistance.setName("desiredResistance");
        this.desiredResistance.setValueTextField(this.desiredResistanceValue);
        this.desiredResistance.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("Ω", 1e0, NumberPreference.DEFAULT),
        });
        this.desiredResistance.setNumDigitsToRound(4);
        this.desiredResistance.setHelpText("The resistance you actually want. The closest value to this resistance will be found in each resistor series.");
        this.desiredResistance.setIsEngineeringNotationEnabled(true);

        //========== VALIDATORS ===========//
        this.desiredResistance.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        this.desiredResistance.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
        this.desiredResistance.addValidator(
                new Validator(() -> {
                    return ((this.desiredResistance.getRawVal() < 1.0 || this.desiredResistance.getRawVal() > 10.0e6) ? CalcValidationLevels.Warning : CalcValidationLevels.Ok);
                },
                        "The desired resistance is outside the \"normal\" purchasable resistance range of 1Ω to 10MΩ. Some or all of the standard E-series may not have a resistor available with the desired resistance."));

        this.calcVars.add(this.desiredResistance);


        //===============================================================================================//
        //======================================= E6 RESISTANCE (output) ================================//
        //===============================================================================================//

//        this.e6Resistance.setName("e6Resistance");
//        this.e6Resistance.setValueTextField(this.e6ResistanceValue);
//        this.e6Resistance.setEquationFunction(() -> {
//            // Read in variables
//            Double desiredResistance = this.desiredResistance.getRawVal();
//
//            if (Double.isNaN(desiredResistance)) {
//                return Double.NaN;
//            }
//
//            double actualResistance = StandardResistanceFinder.Find(desiredResistance, StandardResistanceFinder.eSeriesOptions.E6);
//
//            return actualResistance;
//        });
//        this.e6Resistance.setUnits(new NumberUnitMultiplier[]{
//                new NumberUnitMultiplier("Ω", 1e0, NumberPreference.DEFAULT),
//        });
//        this.e6Resistance.setRounding(CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES, 2);
//        this.e6Resistance.setHelpText("The closest resistance in the E6 series to your desired resistance.");
//        this.e6Resistance.setIsEngineeringNotationEnabled(true);
//
//        //========== VALIDATORS ===========//
//        this.e6Resistance.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
//        this.e6Resistance.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
//
//        this.calcVars.add(this.e6Resistance);

        //===============================================================================================//
        //================================= E6 PERCENTAGE DIFFERENCE (output) ===========================//
        //===============================================================================================//

//        this.e6Error.setName("e6Error");
//        this.e6Error.setValueTextField(this.e6ErrorValue);
//        this.e6Error.setEquationFunction(() -> {
//            // Read in variables
//            Double desiredResistance = this.desiredResistance.getRawVal();
//            Double closestStandardResistance = this.e6Resistance.getRawVal();
//
//            if (Double.isNaN(desiredResistance)) {
//                return Double.NaN;
//            }
//
//            // Calculate percentage difference
//            double percentageDiff = (Math.abs(closestStandardResistance - desiredResistance) / desiredResistance) * 100.0;
//
//            return percentageDiff;
//        });
//        this.e6Error.setUnits(new NumberUnitMultiplier[]{
//                new NumberUnitMultiplier("%", 1e0, NumberPreference.DEFAULT),
//        });
//        this.e6Error.setRounding(CalcVarNumerical.RoundingTypes.DECIMAL_PLACES, 2);
//        this.e6Error.setHelpText("The percentage difference between the closest E6 series resistance and your desired resistance.");
//        this.e6Error.setIsEngineeringNotationEnabled(true);
//
//        //========== VALIDATORS ===========//
//        this.e6Error.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
//
//        this.calcVars.add(this.e6Error);

//        //===============================================================================================//
//        //======================================= E12 RESISTANCE (output) ================================//
//        //===============================================================================================//
//
//        this.e12Resistance.setName("e12Resistance");
//        this.e12Resistance.setValueTextField(this.e12ResistanceValue);
//        this.e12Resistance.setEquationFunction(() -> {
//            // Read in variables
//            Double desiredResistance = this.desiredResistance.getRawVal();
//
//            if (Double.isNaN(desiredResistance)) {
//                return Double.NaN;
//            }
//
//            double actualResistance = StandardResistanceFinder.Find(desiredResistance, StandardResistanceFinder.eSeriesOptions.E12);
//
//            return actualResistance;
//        });
//        this.e12Resistance.setUnits(new NumberUnitMultiplier[]{
//                new NumberUnitMultiplier("Ω", 1e0, NumberPreference.DEFAULT),
//        });
//        this.e12Resistance.setRounding(CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES, 2);
//        this.e12Resistance.setHelpText("The closest resistance in the E12 series to your desired resistance.");
//        this.e12Resistance.setIsEngineeringNotationEnabled(true);
//
//        //========== VALIDATORS ===========//
//        this.e12Resistance.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
//        this.e12Resistance.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
//
//        this.calcVars.add(this.e12Resistance);
//
//        //===============================================================================================//
//        //====================================== E12 ERROR (output) =====================================//
//        //===============================================================================================//
//
//        this.e12Error.setName("e12Error");
//        this.e12Error.setValueTextField(this.e12ErrorValue);
//        this.e12Error.setEquationFunction(() -> {
//            // Read in variables
//            Double desiredResistance = this.desiredResistance.getRawVal();
//            Double closestStandardResistance = this.e12Resistance.getRawVal();
//
//            if (Double.isNaN(desiredResistance)) {
//                return Double.NaN;
//            }
//
//            // Calculate percentage difference
//            double percentageDiff = (Math.abs(closestStandardResistance - desiredResistance) / desiredResistance) * 100.0;
//
//            return percentageDiff;
//        });
//        this.e12Error.setUnits(new NumberUnitMultiplier[]{
//                new NumberUnitMultiplier("%", 1e0, NumberPreference.DEFAULT),
//        });
//        this.e12Error.setRounding(CalcVarNumerical.RoundingTypes.DECIMAL_PLACES, 2);
//        this.e12Error.setHelpText("The percentage difference between the closest E12 series resistance and your desired resistance.");
//        this.e12Error.setIsEngineeringNotationEnabled(true);
//
//        //========== VALIDATORS ===========//
//        this.e12Error.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
//
//        this.calcVars.add(this.e12Error);
//
//        //===============================================================================================//
//        //======================================= E24 RESISTANCE (output) ================================//
//        //===============================================================================================//
//
//        this.e24Resistance.setName("e24Resistance");
//        this.e24Resistance.setValueTextField(this.e24ResistanceValue);
//        this.e24Resistance.setEquationFunction(() -> {
//            // Read in variables
//            Double desiredResistance = this.desiredResistance.getRawVal();
//
//            if (Double.isNaN(desiredResistance)) {
//                return Double.NaN;
//            }
//
//            double actualResistance = StandardResistanceFinder.Find(desiredResistance, StandardResistanceFinder.eSeriesOptions.E24);
//
//            return actualResistance;
//        });
//        this.e24Resistance.setUnits(new NumberUnitMultiplier[]{
//                new NumberUnitMultiplier("Ω", 1e0, NumberPreference.DEFAULT),
//        });
//        this.e24Resistance.setRounding(CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES, 2);
//        this.e24Resistance.setHelpText("The closest resistance in the E24 series to your desired resistance.");
//        this.e24Resistance.setIsEngineeringNotationEnabled(true);
//
//        //========== VALIDATORS ===========//
//        this.e24Resistance.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
//        this.e24Resistance.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
//
//        this.calcVars.add(this.e24Resistance);
//
//        //===============================================================================================//
//        //================================= E24 PERCENTAGE DIFFERENCE (output) ==========================//
//        //===============================================================================================//
//
//        this.e24Error.setName("e24Error");
//        this.e24Error.setValueTextField(this.e24ErrorValue);
//        this.e24Error.setEquationFunction(() -> {
//            // Read in variables
//            Double desiredResistance = this.desiredResistance.getRawVal();
//            Double closestStandardResistance = this.e24Resistance.getRawVal();
//
//            if (Double.isNaN(desiredResistance)) {
//                return Double.NaN;
//            }
//
//            // Calculate percentage difference
//            double percentageDiff = (Math.abs(closestStandardResistance - desiredResistance) / desiredResistance) * 100.0;
//
//            return percentageDiff;
//        });
//        this.e24Error.setUnits(new NumberUnitMultiplier[]{
//                new NumberUnitMultiplier("%", 1e0, NumberPreference.DEFAULT),
//        });
//        this.e24Error.setRounding(CalcVarNumerical.RoundingTypes.DECIMAL_PLACES, 2);
//        this.e24Error.setHelpText("The percentage difference between the closest E24 series resistance and your desired resistance.");
//        this.e24Error.setIsEngineeringNotationEnabled(true);
//
//        //========== VALIDATORS ===========//
//        this.e24Error.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
//
//        this.calcVars.add(this.e24Error);
//
//        //===============================================================================================//
//        //======================================= E48 RESISTANCE (output) ================================//
//        //===============================================================================================//
//
//        this.e48Resistance.setName("e48Resistance");
//        this.e48Resistance.setValueTextField(this.e48ResistanceValue);
//        this.e48Resistance.setEquationFunction(() -> {
//            // Read in variables
//            Double desiredResistance = this.desiredResistance.getRawVal();
//
//            if (Double.isNaN(desiredResistance)) {
//                return Double.NaN;
//            }
//
//            double actualResistance = StandardResistanceFinder.Find(desiredResistance, StandardResistanceFinder.eSeriesOptions.E48);
//
//            return actualResistance;
//        });
//        this.e48Resistance.setUnits(new NumberUnitMultiplier[]{
//                new NumberUnitMultiplier("Ω", 1e0, NumberPreference.DEFAULT),
//        });
//        this.e48Resistance.setRounding(CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES, 3);
//        this.e48Resistance.setHelpText("The closest resistance in the E48 series to your desired resistance.");
//        this.e48Resistance.setIsEngineeringNotationEnabled(true);
//
//        //========== VALIDATORS ===========//
//        this.e48Resistance.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
//        this.e48Resistance.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
//
//        this.calcVars.add(this.e48Resistance);
//
//        //===============================================================================================//
//        //======================================= E48 ERROR (output) ===================================//
//        //===============================================================================================//
//
//        this.e48Error.setName("e48Error");
//        this.e48Error.setValueTextField(this.e48ErrorValue);
//        this.e48Error.setEquationFunction(() -> {
//            // Read in variables
//            Double desiredResistance = this.desiredResistance.getRawVal();
//            Double closestStandardResistance = this.e48Resistance.getRawVal();
//
//            if (Double.isNaN(desiredResistance)) {
//                return Double.NaN;
//            }
//
//            // Calculate percentage difference
//            double percentageDiff = (Math.abs(closestStandardResistance - desiredResistance) / desiredResistance) * 100.0;
//
//            return percentageDiff;
//        });
//        this.e48Error.setUnits(new NumberUnitMultiplier[]{
//                new NumberUnitMultiplier("%", 1e0, NumberPreference.DEFAULT),
//        });
//        this.e48Error.setRounding(CalcVarNumerical.RoundingTypes.DECIMAL_PLACES, 2);
//        this.e48Error.setHelpText("The percentage difference between the closest E48 series resistance and your desired resistance.");
//        this.e48Error.setIsEngineeringNotationEnabled(true);
//
//        //========== VALIDATORS ===========//
//        this.e48Error.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
//
//        this.calcVars.add(this.e48Error);
//
//        //===============================================================================================//
//        //======================================= E96 RESISTANCE (output) ===============================//
//        //===============================================================================================//
//
//        this.e96Resistance.setName("e96Resistance");
//        this.e96Resistance.setValueTextField(this.e96ResistanceValue);
//        this.e96Resistance.setEquationFunction(() -> {
//            // Read in variables
//            Double desiredResistance = this.desiredResistance.getRawVal();
//
//            if (Double.isNaN(desiredResistance)) {
//                return Double.NaN;
//            }
//
//            double actualResistance = StandardResistanceFinder.Find(desiredResistance, StandardResistanceFinder.eSeriesOptions.E96);
//
//            return actualResistance;
//        });
//        this.e96Resistance.setUnits(new NumberUnitMultiplier[]{
//                new NumberUnitMultiplier("Ω", 1e0, NumberPreference.DEFAULT),
//        });
//        this.e96Resistance.setRounding(CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES, 3);
//        this.e96Resistance.setHelpText("The closest resistance in the E96 series to your desired resistance.");
//        this.e96Resistance.setIsEngineeringNotationEnabled(true);
//
//        //========== VALIDATORS ===========//
//        this.e96Resistance.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
//        this.e96Resistance.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
//
//        this.calcVars.add(this.e96Resistance);
//
//        //===============================================================================================//
//        //================================= E96 PERCENTAGE DIFFERENCE (output) ==========================//
//        //===============================================================================================//
//
//        this.e96Error.setName("e96Error");
//        this.e96Error.setValueTextField(this.e96ErrorValue);
//        this.e96Error.setEquationFunction(() -> {
//            // Read in variables
//            Double desiredResistance = this.desiredResistance.getRawVal();
//            Double closestStandardResistance = this.e96Resistance.getRawVal();
//
//            if (Double.isNaN(desiredResistance)) {
//                return Double.NaN;
//            }
//
//            // Calculate percentage difference
//            double percentageDiff = (Math.abs(closestStandardResistance - desiredResistance) / desiredResistance) * 100.0;
//
//            return percentageDiff;
//        });
//        this.e96Error.setUnits(new NumberUnitMultiplier[]{
//                new NumberUnitMultiplier("%", 1e0, NumberPreference.DEFAULT),
//        });
//        this.e96Error.setRounding(CalcVarNumerical.RoundingTypes.DECIMAL_PLACES, 2);
//        this.e96Error.setHelpText("The percentage difference between the closest E96 series resistance and your desired resistance.");
//        this.e96Error.setIsEngineeringNotationEnabled(true);
//
//        //========== VALIDATORS ===========//
//        this.e96Error.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
//
//        this.calcVars.add(this.e96Error);
//
//        //===============================================================================================//
//        //===================================== E192 RESISTANCE (output) ================================//
//        //===============================================================================================//
//
//        this.e192Resistance.setName("e192Resistance");
//        this.e192Resistance.setValueTextField(this.e192ResistanceValue);
//        this.e192Resistance.setEquationFunction(() -> {
//            // Read in variables
//            Double desiredResistance = this.desiredResistance.getRawVal();
//
//            if (Double.isNaN(desiredResistance)) {
//                return Double.NaN;
//            }
//
//            double actualResistance = StandardResistanceFinder.Find(desiredResistance, StandardResistanceFinder.eSeriesOptions.E192);
//
//            return actualResistance;
//        });
//        this.e192Resistance.setUnits(new NumberUnitMultiplier[]{
//                new NumberUnitMultiplier("Ω", 1e0, NumberPreference.DEFAULT),
//        });
//        this.e192Resistance.setRounding(CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES, 3);
//        this.e192Resistance.setHelpText("The closest resistance in the E192 series to your desired resistance.");
//        this.e192Resistance.setIsEngineeringNotationEnabled(true);
//
//        //========== VALIDATORS ===========//
//        this.e192Resistance.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
//        this.e192Resistance.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));
//
//        this.calcVars.add(this.e192Resistance);
//
//        //===============================================================================================//
//        //================================= E192 PERCENTAGE DIFFERENCE (output) ==========================//
//        //===============================================================================================//
//
//        this.e192Error.setName("e192Error");
//        this.e192Error.setValueTextField(this.e192ErrorValue);
//        this.e192Error.setEquationFunction(() -> {
//            // Read in variables
//            Double desiredResistance = this.desiredResistance.getRawVal();
//            Double closestStandardResistance = this.e192Resistance.getRawVal();
//
//            if (Double.isNaN(desiredResistance)) {
//                return Double.NaN;
//            }
//
//            // Calculate percentage difference
//            double percentageDiff = (Math.abs(closestStandardResistance - desiredResistance) / desiredResistance) * 100.0;
//
//            return percentageDiff;
//        });
//        this.e192Error.setUnits(new NumberUnitMultiplier[]{
//                new NumberUnitMultiplier("%", 1e0, NumberPreference.DEFAULT),
//        });
//        this.e192Error.setRounding(CalcVarNumerical.RoundingTypes.DECIMAL_PLACES, 2);
//        this.e192Error.setHelpText("The percentage difference between the closest E192 series resistance and your desired resistance.");
//        this.e192Error.setIsEngineeringNotationEnabled(true);
//
//        //========== VALIDATORS ===========//
//        this.e192Error.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
//
//        this.calcVars.add(this.e192Error);

        //===============================================================================================//
        //========================================== ARRAY METHOD =======================================//
        //===============================================================================================//

        // This variable keeps track of what row we are up to when inserting E-series resistances
        Integer gridRowCount = 0;
        // First row is a header
        gridRowCount++;

        ESeriesResistanceRow e6ResistanceRow = new ESeriesResistanceRow(
                "E6",
                StandardResistanceFinder.eSeriesOptions.E6,
                desiredResistance,
                variableGridPane,
                gridRowCount++,
                calcVars,
                CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES,
                2);

        ESeriesResistanceRow e12ResistanceRow = new ESeriesResistanceRow(
                "E12",
                StandardResistanceFinder.eSeriesOptions.E12,
                desiredResistance,
                variableGridPane,
                gridRowCount++,
                calcVars,
                CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES,
                2);

        ESeriesResistanceRow e24ResistanceRow = new ESeriesResistanceRow(
                "E24",
                StandardResistanceFinder.eSeriesOptions.E24,
                desiredResistance,
                variableGridPane,
                gridRowCount++,
                calcVars,
                CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES,
                2);

        ESeriesResistanceRow e48ResistanceRow = new ESeriesResistanceRow(
                "E48",
                StandardResistanceFinder.eSeriesOptions.E48,
                desiredResistance,
                variableGridPane,
                gridRowCount++,
                calcVars,
                CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES,
                3);

        ESeriesResistanceRow e96ResistanceRow = new ESeriesResistanceRow(
                "E96",
                StandardResistanceFinder.eSeriesOptions.E96,
                desiredResistance,
                variableGridPane,
                gridRowCount++,
                calcVars,
                CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES,
                3);

        ESeriesResistanceRow e192ResistanceRow = new ESeriesResistanceRow(
                "E192",
                StandardResistanceFinder.eSeriesOptions.E192,
                desiredResistance,
                variableGridPane,
                gridRowCount++,
                calcVars,
                CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES,
                3);

        //===============================================================================================//
        //============================================== FINAL ==========================================//
        //===============================================================================================//

        this.findDependenciesAndDependants();
        this.refreshDirectionsAndUpdateUI();
        this.recalculateAllOutputs();
        this.validateAllVariables();

    }

/*
    private void buildCalculator(ArrayList<GridPaneRow> gridPaneRowList) {
        for(int x = 0; x < gridPaneRowList.size(); x++) {
            // Create label
            Label resistanceSeriesLabel = new Label(gridPaneRowList.get(x).resistanceSeries);
            this.variableGridPane.add(resistanceSeriesLabel, 0, x + 1);

            //=============== CLOSEST RESISTANCE ============//

            // "Closest Resistance" TextField
            TextField closestResistanceTextField = new TextField();
            this.variableGridPane.add(closestResistanceTextField, 1, x + 1);

            // Calculator variable
            CalcVarNumericalOutput closestResistanceCalcVar = new CalcVarNumericalOutput();
            closestResistanceCalcVar.setName("closestResistance");
            closestResistanceCalcVar.setValueTextField(closestResistanceTextField);
            closestResistanceCalcVar.setEquationFunction(() -> {
                // Read in variables
                Double desiredResistance = this.desiredResistance.getRawVal();

                if (Double.isNaN(desiredResistance)) {
                    return Double.NaN;
                }

                double actualResistance = StandardResistanceFinder.Find(desiredResistance, StandardResistanceFinder.eSeriesOptions.E6);

                return actualResistance;
            });
            closestResistanceCalcVar.setUnits(new NumberUnitMultiplier[]{
                    new NumberUnitMultiplier("Ω", 1e0, NumberPreference.DEFAULT),
            });
            closestResistanceCalcVar.setRounding(CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES, 2);
            closestResistanceCalcVar.setHelpText("The closest resistance in the E6 series to your desired resistance.");
            closestResistanceCalcVar.setIsEngineeringNotationEnabled(true);

            //========== VALIDATORS ===========//
            closestResistanceCalcVar.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
            closestResistanceCalcVar.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

            this.calcVars.add(closestResistanceCalcVar);

            // Ohm symbol
            Label ohmSymbol = new Label("Ω");
            this.variableGridPane.add(ohmSymbol, 2, x + 1);

            //=============== CLOSEST RESISTANCE ERROR ============//

            // "Closest Resistance" TextField
            TextField closestResistanceErrorTextField = new TextField();
            this.variableGridPane.add(closestResistanceErrorTextField, 3, x + 1);

            // Ohm symbol
            Label percentSymbol = new Label("%");
            this.variableGridPane.add(percentSymbol, 4, x + 1);

        }
    }*/

}

