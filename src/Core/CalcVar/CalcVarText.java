
package Core.CalcVar;

import Core.*;
import Utility.MetricPrefixes.MetricPrefixes;
import Utility.MetricPrefixes.RoundingMethods;
import Utility.Rounding;
import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.beans.value.ChangeListener;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.Event;
import javafx.scene.control.ComboBox;
import javafx.scene.control.ListCell;
import javafx.scene.control.TextField;
import javafx.scene.control.Tooltip;
import javafx.util.Duration;
import javafx.util.StringConverter;

import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;

/**
 * Encapsulates a single text-based variable in a NinjaCalc calculator (inherits from CalcVarBase).
 *
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2016-06-22
 * @last-modified   2016-06-22
 */
public class CalcVarText extends CalcVarBase {

    //===============================================================================================//
    //========================================= ENUMS ===============================================//
    //===============================================================================================//



    //===============================================================================================//
    //==================================== VARIABLES AND PROPERTIES =================================//
    //===============================================================================================//

    /**
     * The time from when the mouse is hovered over the variables value textbox to when
     * the tooltip is displayed.
     */
    private static final double TOOLTIP_OPEN_TIME_MS = 100.0;





    //===============================================================================================//
    //========================================== CONSTRUCTORS =======================================//
    //===============================================================================================//

    public CalcVarText() {
        super();

        //========================= VALIDATORS ===============================//

        // Initialise empty validators list
        this.validators = new ArrayList<>();

        // Initialise empty validation results list
        this.validationResults = new ArrayList<>();

    }

    //===============================================================================================//
    //======================================== GETTERS/SETTERS ======================================//
    //===============================================================================================//

    /**
     * The "value" for this calculator variable. This is essentially the text string that this calculator variable
     * is currently equal to.
     */
    private String value;
    public String getValue() { return value; };
    public void setValue(String value) { this.value = value; };


    private TextField textField;
    public TextField getTextField() { return this.textField; }
    public void setTextField(TextField textField) {

        // Make sure the provided text field is not null
        if(textField == null)
            throw new IllegalArgumentException("Provided TextField for calculator variable \"" + this.getName() + "\" value was null. Is the @FXML binding name the same as the fx:id?");

        // Save reference to text field
        this.textField = textField;

        // Attach listener to the text field
        this.textField.textProperty().addListener((observable, oldValue, newValue) -> {
            this.textFieldChanged(newValue);
        });

    }

    private String helpText;
    public String getHelpText() { return helpText; }
    public void setHelpText(String helpText) { this.helpText = helpText; }

    //===============================================================================================//
    //======================================== GENERAL METHODS ======================================//
    //===============================================================================================//

    /**
     * Calculates the raw value from the provided equation, calculates the displayed value from the raw value,
     * then updates the UI and forces all dependent outputs to recalculate also.
     * @warning     This should only be called for output variables.
     */
    public void calculate() {
        // Make sure this event only fires when this calculator variable is an output!
        if(this.getDirection() != CalcVarDirections.Output){
            throw new RuntimeException("calculate() was called for calculator variable " + this.getName() + " which is NOT an output.");
        }

        //System.out.println("CalcVar.calculate() called for \"" + this.name + "\".");

        // Invoke the provided equation function,
        // which should return the raw value for this calculator variable
        //this.rawVal = this.equationFunction.execute();

        // Update the displayed value based on this newly calculated raw value
        //this.updateDispValFromRawVal();

        // Validate this new value
        this.validate();

        // Force all calculator variables which are dependent on this one to recalculate.
        this.forceDependantOutputsToRecalculate();
        this.forceVariablesWithDependantValidatorsToRevalidate();
    }

    /**
     * Listener that will get called when the text field changes.
     * @param newValue
     */
    protected void textFieldChanged(String newValue) {
        System.out.println("CalcVarText.textFieldChanged() called.");

        // Need to update the calculator variables "value"
        setValue(newValue);
    }


    /**
     * Use this to add a specific validator to this calculator variable.
     * @param validator     The validator to add.
     */
    public void addValidator(Validator validator) {
        // Add provided validator to the internal list
        this.validators.add(validator);
    }

    /**
     * Call this to perform validation on this calculator variable. Will run all validators
     * that have been added through calling addValidator(), and populate validationResults with the
     * results. Also updates UI based on these results.
     */
    public void validate() {
        //System.out.println("validate() called for calculator variable \"" + this.name + "\" with this.RawVal = \"" + String.valueOf(this.rawVal) + "\".");

        // Clear the old validation results
//        this.validationResults.clear();
//
//        CalcValidationLevel worstValidationLevel = CalcValidationLevels.Ok;
//
//        // validate this value (if validators are provided)
//        for(Validator validator : this.validators) {
//            // Run the validation function
//            CalcValidationLevel validationLevel = validator.ValidationFunction.execute(this.rawVal);
//
//            // Save this validation result
//            this.validationResults.add(new CalcValidationResult(validationLevel, validator.Message));
//
//            // Logic for keeping track of the worst validation resut
//            // (error worse than warning worse than ok)
//            if (validationLevel == CalcValidationLevels.Warning && worstValidationLevel == CalcValidationLevels.Ok) {
//                worstValidationLevel = CalcValidationLevels.Warning;
//            }
//            else if (validationLevel == CalcValidationLevels.Error) {
//                worstValidationLevel = CalcValidationLevels.Error;
//            }
//        }
//
//        //System.out.println("Worst validation level was \"" + worstValidationLevel.name + "\".");
//
//        // Save this to the internal variable
//        this.worstValidationLevel = worstValidationLevel;
//
//        // Finally, force an update of the UI based on these validation results
//        this.updateUIBasedOnValidationResults();
    }

    public static void hackTooltipStartTiming(Tooltip tooltip) {
        try {
            Field fieldBehavior = tooltip.getClass().getDeclaredField("BEHAVIOR");
            fieldBehavior.setAccessible(true);
            Object objBehavior = fieldBehavior.get(tooltip);

            Field fieldTimer = objBehavior.getClass().getDeclaredField("activationTimer");
            fieldTimer.setAccessible(true);
            Timeline objTimer = (Timeline) fieldTimer.get(objBehavior);

            objTimer.getKeyFrames().clear();

            // This is where the new "time to open" gets assigned
            objTimer.getKeyFrames().add(new KeyFrame(new Duration(TOOLTIP_OPEN_TIME_MS)));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void updateUIFromDirection() {

    }


}