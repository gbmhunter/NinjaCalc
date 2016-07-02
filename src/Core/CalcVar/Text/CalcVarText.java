
package Core.CalcVar.Text;

import Core.CalcValidationLevels;
import Core.CalcValidationResult;
import Core.CalcVar.CalcVarBase;
import Core.CalcVar.CalcVarDirections;
import Core.Validator;
import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.scene.control.TextField;
import javafx.scene.control.Tooltip;
import javafx.util.Duration;

import java.lang.reflect.Field;
import java.util.ArrayList;

/**
 * Encapsulates a single text-based variable in a NinjaCalc calculator (inherits from CalcVarBase).
 *
 * @author gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @last-modified 2016-07-02
 * @since 2016-06-22
 */
public class CalcVarText extends CalcVarBase {

    //===============================================================================================//
    //========================================= ENUMS ===============================================//
    //===============================================================================================//

    public enum PrebuiltValidators {
        MUST_BE_HEX,
    }

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

    /**
     * Basic constructor.
     */
    public CalcVarText() {
        super();

        // Initialise this calculator variables value to
        // ""
        value = "";

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

    public String getValue() {
        // Notify any listeners that the value of this calculator variable is being read.
        onValueRead();
        return value;
    }

    ;

    public void setValue(String value) {
        this.value = value;
        textField.setText(value);
        // Notify any listeners
        onValueChanged();
    }

    ;


    private TextField textField;

    public TextField getTextField() {
        return this.textField;
    }

    public void setTextField(TextField textField) {

        // Make sure the provided text field is not null
        if (textField == null)
            throw new IllegalArgumentException("Provided TextField for calculator variable \"" + this.getName() + "\" value was null. Is the @FXML binding name the same as the fx:id?");

        // Save reference to text field
        this.textField = textField;

        // Attach listener to the text field
        this.textField.textProperty().addListener((observable, oldValue, newValue) -> {
            this.textFieldChanged(newValue);
        });

    }

    private String helpText;

    public String getHelpText() {
        return helpText;
    }

    public void setHelpText(String helpText) {
        this.helpText = helpText;
    }

    //===============================================================================================//
    //======================================== GENERAL METHODS ======================================//
    //===============================================================================================//

    /**
     * Calculates the raw value from the provided equation, calculates the displayed value from the raw value,
     * then updates the UI and forces all dependent outputs to recalculate also.
     *
     * @warning This should only be called for output variables.
     */
    public void calculate() {

        //System.out.println("CalcVarText.calculate() called for \"" + this.getName() + "\".");

        // Make sure this event only fires when this calculator variable is an output!
        if (this.getDirection() != CalcVarDirections.Output) {
            throw new RuntimeException("calculate() was called for calculator variable " + this.getName() + " which is NOT an output.");
        }

        // This check is for output calculator variables which don't use the equation function to define
        // what there value is
        if (this.equationFunction == null) {
            return;
        }

        // Invoke the provided equation function,
        // which should return a String for this calculator variable
        value = (String) this.equationFunction.execute();

        // Update the value in the UI
        textField.setText(value);

        // Validate this new value
        this.validate();

        // Force all calculator variables which are dependent on this one to recalculate.
        this.forceDependantOutputsToRecalculate();
        this.forceVariablesWithDependantValidatorsToRevalidate();
    }

    /**
     * Listener that will get called when the text field changes.
     *
     * @param newValue
     */
    protected void textFieldChanged(String newValue) {
        //System.out.println("CalcVarText.textFieldChanged() called.");

        // Need to update the calculator variables "value"
        value = newValue;

        validate();

        // Notify any attached listeners that the calculator variable's
        // value has changed
        onValueChanged();

        // Now we need to update any other calculator variables who are dependent
        // on this calculator variable's value
        forceDependantOutputsToRecalculate();
    }


    /**
     * Use this to add a specific validator to this calculator variable.
     *
     * @param validator The validator to add.
     */
    public void addValidator(Validator validator) {
        // Add provided validator to the internal list
        this.validators.add(validator);
    }

    public void addValidator(PrebuiltValidators prebuiltValidator) {

        switch (prebuiltValidator) {
            case MUST_BE_HEX:
                validators.add(new Validator(() -> {
                        try {
                            Long.parseLong(getValue(), 16);
                        } catch (NumberFormatException e) {
                            return CalcValidationLevels.Error;
                        }

                        return CalcValidationLevels.Ok;
                    },
                    "This must be a valid hex number (without the \"0x\" prefix). e.g. \"4\", \"A7\", \"FF\" are all valid inputs."));
                break;
            default:
                throw new RuntimeException("PrebuiltValidator not recognised.");
        }

    }

    /**
     * Updates the tooltip text (adds help info plus validation results).
     */
    public void updateUIBasedOnValidationResults() {

        //================= UPDATE COLOURS ON TEXT FIELD ================//

        this.textField.getStyleClass().remove("ok");
        this.textField.getStyleClass().remove("warning");
        this.textField.getStyleClass().remove("error");
        this.textField.getStyleClass().add(this.worstValidationLevel.name);

        //================== CREATE TOOLTIP ==================//

        // Build up string from all of the validators which are at the same validation
        // level as the worse one
        String validationMsg = "";
        if (this.worstValidationLevel != CalcValidationLevels.Ok) {
            for (CalcValidationResult validationResult : this.validationResults) {
                // Check to see if this validation result was just as bad as the worse one
                // (i.e. the same level of validation)
                if (validationResult.CalcValidationLevel == this.worstValidationLevel) {
                    validationMsg += validationResult.Message + " ";
                }
            }
        } else {
            // Validation must of been o.k., so in this case we display a stock-standard message
            validationMsg = "Value is o.k.";
        }

        // We need to use a TextBlock so we can do advanced formatting
        Tooltip toolTip = new Tooltip();

        // Tooltip content is help info plus validation results
        toolTip.setText(this.helpText + "\r\n\r\n" + validationMsg);
        toolTip.setWrapText(true);

        // Setting a max width prevents the tooltip from getting rediculuosly large when there is a long help info string.
        // Keeping this quite small also makes the tooltip easier to read.
        toolTip.setMaxWidth(300);
        hackTooltipStartTiming(toolTip);

        this.textField.setTooltip(toolTip);

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

    /**
     * This method makes the text fields of output variables slightly transparent to indicate
     * to the user that they are readonly. This is done via CSS targeting the editable property.
     */
    public void updateUIFromDirection() {

        // We don't disable the text field as this disables the tooltip also.
        switch (this.direction) {
            case Input:
                textField.setEditable(true);
                break;
            case Output:
                textField.setEditable(false);
                break;
        }
    }


}
