
package Calculators.Electronics.Basic.StandardResistanceFinder;

// SYSTEM INCLUDES

import Core.CalcVar.Numerical.CalcVarNumerical;
import Core.CalcVar.Numerical.CalcVarNumericalInput;
import Utility.StandardResistanceFinder;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
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

// USER INCLUDES

import Core.*;

/**
 * Calculator for finding a E-series resistance (standard resistance, preferred value) which is closest to the user's
 * desired resistance.
 *
 * Lists closest resistance and percentage error in each EIA E series from E6 to E192.
 *
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @last-modified   2016-06-25
 * @since           2013-09-17
 */
public class StandardResistanceFinderCalcModel extends Calculator {

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

    public ESeriesResistanceRow e6ResistanceRow;
    public ESeriesResistanceRow e12ResistanceRow;
    public ESeriesResistanceRow e24ResistanceRow;
    public ESeriesResistanceRow e48ResistanceRow;
    public ESeriesResistanceRow e96ResistanceRow;
    public ESeriesResistanceRow e192ResistanceRow;

    //===============================================================================================//
    //=========================================== CONSTRUCTOR =======================================//
    //===============================================================================================//

    public StandardResistanceFinderCalcModel() {

        super("Standard Resistance Finder",
                "Find the closest E-series (e.g. E12, E96) resistor (preferred value) to your desired resistance.",
                new String[]{"Electronics", "Basic"},
                new String[]{"ohm", "resistor", "resistance", "e", "series", "standard", "preferred", "values", "e6", "e12", "e24", "e48", "e96", "e128"});

        super.setIconImagePath(getClass().getResource("grid-icon.png"));

        //===============================================================================================//
        //======================================== LOAD .FXML FILE ======================================//
        //===============================================================================================//

        FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("StandardResistanceFinderCalcView.fxml"));
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

        addCalcVar(this.desiredResistance);


        //===============================================================================================//
        //======================================= E-SERIES RESISTANCES ==================================//
        //===============================================================================================//

        // This variable keeps track of what row we are up to when inserting E-series resistances
        Integer gridRowCount = 0;
        // First row is a header
        gridRowCount++;

        e6ResistanceRow = new ESeriesResistanceRow(
                "E6",
                StandardResistanceFinder.eSeriesOptions.E6,
                desiredResistance,
                variableGridPane,
                gridRowCount++,
                this,
                CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES,
                2);

        e12ResistanceRow = new ESeriesResistanceRow(
                "E12",
                StandardResistanceFinder.eSeriesOptions.E12,
                desiredResistance,
                variableGridPane,
                gridRowCount++,
                this,
                CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES,
                2);

        e24ResistanceRow = new ESeriesResistanceRow(
                "E24",
                StandardResistanceFinder.eSeriesOptions.E24,
                desiredResistance,
                variableGridPane,
                gridRowCount++,
                this,
                CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES,
                2);

        e48ResistanceRow = new ESeriesResistanceRow(
                "E48",
                StandardResistanceFinder.eSeriesOptions.E48,
                desiredResistance,
                variableGridPane,
                gridRowCount++,
                this,
                CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES,
                3);

        e96ResistanceRow = new ESeriesResistanceRow(
                "E96",
                StandardResistanceFinder.eSeriesOptions.E96,
                desiredResistance,
                variableGridPane,
                gridRowCount++,
                this,
                CalcVarNumerical.RoundingTypes.SIGNIFICANT_FIGURES,
                3);

        e192ResistanceRow = new ESeriesResistanceRow(
                "E192",
                StandardResistanceFinder.eSeriesOptions.E192,
                desiredResistance,
                variableGridPane,
                gridRowCount++,
                this,
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

}

