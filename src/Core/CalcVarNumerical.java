
package Core;

import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.beans.value.ChangeListener;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.Event;
import javafx.scene.control.*;
import javafx.util.Duration;
import javafx.util.StringConverter;
import java.lang.reflect.Field;
import java.util.ArrayList;

/**
 * Encapsulates a single numerical variable in a NinjaCalc calculator (inherits from CalcVarBase).
 * Stores the variable name, it's equation, it's state (input or output).
 * Is further inherited by specialised input and output variable classes.
 *
 * @author gbmhunter
 * @since 2015-11-02
 * @last-modified 2016-02-14
 */
public class CalcVarNumerical extends CalcVarBase {

    //===============================================================================================//
    //==================================== VARIABLES AND PROPERTIES =================================//
    //===============================================================================================//

    //============================================= RAW VAL =========================================//

    protected double rawVal;



    //============================================ DISP VAL =========================================//

    public double dispVal;

    private TextField valueTextField;
    private ChangeListener<String> textListener;

    public CalcVarDirections getDirection() {
        return this.direction;
    }

    private ArrayList<Validator> validators;

    public ArrayList<CalcValidationResult> validationResults;

    /// <summary>
    /// Gets or sets the validation result for this calculator variable.
    /// Will also change the border colour of the associated text box.
    /// </summary>
    public CalcValidationLevel worstValidationLevel;

    private ComboBox unitsComboBox;

    /**
     * Uses an observable list so that it can be bound to the combo box.
     * See http://code.makery.ch/blog/javafx-8-event-handling-examples/
     */
    public ObservableList<NumberUnit> units;

    /// <summary>
    /// Do NOT access this from anything put the SelectionChanged event handler for
    /// the ComboBox.
    /// </summary>
    private NumberUnit selUnit;

    /// <summary>
    /// Gets and sets the selected unit for this calculator variable. If set, it will also update
    /// the associated ComboBox on the UI.
    /// </summary>
    public NumberUnit getSelUnit()
    {
        return this.selUnit;
    }


    public int numDigitsToRound;

    public String helpText;

    //private ToggleGroup radioButtonToggleGroup;

    //===============================================================================================//
    //========================================== CONSTRUCTORS =======================================//
    //===============================================================================================//

    /**
     * Base constructor. Requires all possible arguments.
     * @param name
     * @param valueTextField        The text field that displays this calculator variables value (UI element).
     * @param unitsComboBox
     * @param equation              An expression tree of a function which calculates this variables value from the other variables.
     * @param units                 An array of units for this calculator variable, to display in the units combobox.
     * @param numDigitsToRound      The number of significant figures you want the calculator variable rounded to, when it is an output.
     * @param directionFunction
     * @param defaultRawValue       Default number for raw value to be set to. Can also be set to null, in which case the displayed text will be empty.
     * @param helpText
     */
    public CalcVarNumerical(
        String name,
        TextField valueTextField,
        ComboBox unitsComboBox,
        IEquationFunction equation,
        NumberUnit[] units,
        int numDigitsToRound,
        IDirectionFunction directionFunction,
        Double defaultRawValue,
        String helpText)
    {

        super(name, equation, directionFunction);

        //System.out.println("CalcVarNumerical constructor called.");

        // Create text field listener
        this.textListener = (observable, oldValue, newValue) -> {
            //System.out.println("CalcVarNumerical.TextBoxChanged() called. Text changed from \"" + oldValue + "\" to \"" + newValue + "\".");

            // Make sure this event only fires when this variable is an input!
            if(this.getDirection() == CalcVarDirections.Input) {

                // Save this to the raw value
                // (bypass setting the property as we don't want to update the TextBox)
                // This could throw a System.FormatException if the value can't be converted into a double,
                // for example, if it had letters (a2) or was just a negative sign (-).
                try {
                    this.dispVal = Double.valueOf(newValue);
                    this.rawVal = this.dispVal * this.selUnit.multiplier;
                }
                catch (NumberFormatException exception) {
                    this.dispVal = Double.NaN;
                    this.rawVal = Double.NaN;
                }

                this.validate();

                // We need to re-calculate any this calculator variables dependants, if they are outputs
                this.forceDependantOutputsToRecalculate();
            }
        };

        // Make sure the provided text field is not null
        assert valueTextField != null;

        this.valueTextField = valueTextField;

        // Attach this new listener to the text field
        this.valueTextField.textProperty().addListener(textListener);

        //===============================================================================================//
        //========================================== VALIDATORS =========================================//
        //===============================================================================================//


        // Initialise empty validators list
        this.validators = new ArrayList<Validator>();

        // Initialise empty validation results list
        this.validationResults = new ArrayList<CalcValidationResult>();

        //===============================================================================================//
        //====================================== UNITS AND UNITS COMBOBOX =====================================//
        //===============================================================================================//

        // Save reference to the units combobox
        this.unitsComboBox = unitsComboBox;

        // Initialise empty units list
        this.units = FXCollections.observableArrayList();

        // Internally save the units, and find the default unit at the same time
        // Note we can't implictly convert from an array of NumberUnit to a List<NumberUnit>
        NumberUnit defaultUnit = null;
        for(NumberUnit unit : units) {
            this.units.add(unit);
            if (unit.preference == NumberPreference.DEFAULT) {
                defaultUnit = unit;
            }
        }

        // The combobox is allowed to be null, so only interact with it
        // if combobox was provided
        if(this.unitsComboBox != null) {

            // Bind the combo-box to the observable collection
            this.unitsComboBox.setItems(this.units);

            //============ LET THE COMBOBOX KNOW HOW TO RENDER NUMBER UNITS ============//

            this.unitsComboBox.setCellFactory((combobox) -> {

                // Define rendering of the list of values in ComboBox drop down.
                return new ListCell<NumberUnit>() {
                    @Override
                    protected void updateItem(NumberUnit item, boolean empty) {
                        super.updateItem(item, empty);

                        if (item == null || empty) {
                            setText(null);
                        } else {
                            setText(item.name);
                        }
                    }
                };
            });

            // Define rendering of selected value shown in ComboBox.
            this.unitsComboBox.setConverter(new StringConverter<NumberUnit>() {
                @Override
                public String toString(NumberUnit numberUnit) {
                    if (numberUnit == null) {
                        return null;
                    } else {
                        return numberUnit.name;
                    }
                }

                @Override
                public NumberUnit fromString(String numberUnitString) {
                    return null; // No conversion fromString needed.
                }
            });

            // Connect up event handler for when combobox units change
            this.unitsComboBox.setOnAction(this::unitsComboBoxSelectionChanged);
        } // if(this.unitsComboBox != null) {


        // Set current combobox selection to default unit
        if (defaultUnit != null) {
            this.setSelUnit(defaultUnit);
        }
        else {
            this.setSelUnit(this.units.get(0));
        }

        //===============================================================================================//
        //============================================ ROUNDING =========================================//
        //===============================================================================================//

        this.numDigitsToRound = numDigitsToRound;

        // Assign the default raw value
        if (defaultRawValue != null) {
            this.rawVal = defaultRawValue;
            this.dispVal = this.rawVal * this.selUnit.multiplier;
            this.valueTextField.setText(String.valueOf(this.dispVal));
        }
        else {
            // Provided default value was null, so lets make
            // the textbox empty
            this.rawVal = Double.NaN;
            this.dispVal = Double.NaN;
            this.valueTextField.setText("");
        }

        // Install event handlers
        /*this.RawValueChanged += (sender, EventArgs) => {
            // Update displayed value
            this.dispVal = this.rawVal * this.selUnit.multiplier;
            // Update textbox
            this.valueTextField.Text = this.dispVal.ToString();
        };*/
        this.addRawValueChangedListener(calcVarBase -> {
            // Update displayed value
            this.dispVal = this.rawVal * this.selUnit.multiplier;
            // Update textbox
            this.valueTextField.setText(String.valueOf(this.dispVal));
        });

        // Save the help text (displayed in the tooltip)
        this.helpText = helpText;

    }

    //===============================================================================================//
    //======================================== GETTERS/SETTERS ======================================//
    //===============================================================================================//

    /**
     * Gets or sets the the "raw" (unscaled, unrounded) value for this variable. Setting will cause the displayed value, textbox, and all
     * dependant variables to update.
     * @return      The raw value of the calculator variable.
     */
    public double getRawVal() {
        this.OnRawValueRead();

        return this.rawVal;
    }

    public void setRawVal(double value) {
        // Only set if new value is different from current
        if (this.rawVal != value) {
            this.rawVal = value;
            // Fire the RawValueChanged event handler
            this.onRawValueChanged();
        }
    }

    /**
     * Set the selected unit for this calculator variable by passing in a unit name. If the unit can't be found in
     * the units array, a System.ArgumentException exception will be thrown.
     * @param unitName      The name (i.e. whats displayed in the combobox) of the unit you wish to be selected.
     */
    /*public void setUnits(String unitName) {

        Core.NumberUnit foundUnit = null;

        for(NumberUnit unit : this.units) {
            if (unit.name == unitName) {
                foundUnit = unit;
                break;
            }
        }

        if (foundUnit == null) {
            throw new IllegalArgumentException("Unit name was not found in unit array.");
        }

        // Valid unit in unit array found, so lets set it to the currently
        // selected unit
        this.selUnit = foundUnit;

    }*/

    /**
     * Sets the selected unit in the unit combobox.
     * @param value     The unit you wish to change the combobox selection to.
     */
    public void setSelUnit(NumberUnit value) {
        this.selUnit = value;
        // Anytime this is set, also update selected value in combobox,
        // if one has been provided
        if(this.unitsComboBox != null) {
            this.unitsComboBox.getSelectionModel().select(this.selUnit);
        }
    }

    /**
     * Calculates the raw value from the provided equation, calculates the displayed value from the raw value,
     * then updates the UI and forces all dependent outputs to recalculate also.
     * @warning     This should only be called for output variables.
     */
    public void calculate() {
        // Make sure this event only fires when this calculator variable is an output!
        assert this.getDirection() == CalcVarDirections.Output;

        //System.out.println("CalcVar.calculate() called for \"" + this.name + "\".");

        // Invoke the provided equation function,
        // which should return the raw value for this calculator variable
        this.rawVal = this.equationFunction.execute();
        //this.dispVal = this.rawVal / this.selUnit.multiplier;
        //this.valueTextField.Text = this.dispVal.ToString();
        this.updateDispValFromRawVal();

        // Validation is done in the TextBoxChanged event handler
        this.validate();

        this.forceDependantOutputsToRecalculate();
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
        this.validationResults.clear();

        CalcValidationLevel worstValidationLevel = CalcValidationLevels.Ok;

        // validate this value (if validators are provided)
        for(Validator validator : this.validators) {
            // Run the validation function
            CalcValidationLevel validationLevel = validator.ValidationFunction.execute(this.rawVal);

            // Save this validation result
            this.validationResults.add(new CalcValidationResult(validationLevel, validator.Message));

            // Logic for keeping track of the worst validation resut
            // (error worse than warning worse than ok)
            if (validationLevel == CalcValidationLevels.Warning && worstValidationLevel == CalcValidationLevels.Ok) {
                worstValidationLevel = CalcValidationLevels.Warning;
            }
            else if (validationLevel == CalcValidationLevels.Error) {
                worstValidationLevel = CalcValidationLevels.Error;
            }
        }

        //System.out.println("Worst validation level was \"" + worstValidationLevel.name + "\".");

        // Save this to the internal variable
        this.worstValidationLevel = worstValidationLevel;

        // Finally, force an update of the UI based on these validation results
        this.updateUIBasedOnValidationResults();
    }

    /**
     * Event handler for when the units in the unit combobox are changed. Event handler is installed in this
     * calculator variables constructor.
     * @param event
     */
    private void unitsComboBoxSelectionChanged(Event event) {
        //System.out.println("unitsComboBoxSelectionChanged() called for calculator variable \"" + this.name + "\".");

        // Need to update the selected unit, bypassing the property (otherwise
        // we will create an infinite loop)
        //ComboBox units = (ComboBox)sender;
        this.selUnit = (NumberUnit)this.unitsComboBox.getSelectionModel().getSelectedItem();

        //System.out.println("Selected unit is now \"" + this.selUnit + "\".");

        // If the variable is an input, we need to adjust the raw value, if the
        // variable is an output, we need to adjust the displayed value
        if (this.getDirection() == CalcVarDirections.Input) {
            this.rawVal = this.dispVal * this.selUnit.multiplier;
            //System.out.println("rawVal re-scaled to \"" + String.valueOf(this.rawVal) + "\".");

            // Since the raw value has changed, we also need to re-validate this variable
            this.validate();

            // We also need to force a recalculation of any dependants (which are also outputs)
            // of this variable
            this.forceDependantOutputsToRecalculate();

        }
        else if(this.getDirection() == CalcVarDirections.Output) {
            this.updateDispValFromRawVal();
        }
    }

    private void updateDispValFromRawVal() {

        //System.out.println("updateDispValFromRawVal() called for variable \"" + this.name + "\".");

        // Recalculate dispVal and update textbox
        // We don't need to validate again if the units are changed for an output,
        // as the actual value (raw value) does not change.
        double unroundedDispVal = this.rawVal / this.selUnit.multiplier;
        this.dispVal = Rounding.RoundToSignificantDigits(unroundedDispVal, this.numDigitsToRound);
        this.valueTextField.setText(String.valueOf(this.dispVal));
    }

    /**
     * Updates the tooltip text (adds help info plus validation results).
     */
    public void updateUIBasedOnValidationResults() {
        // Change the textbox's border colour
        //this.valueTextField.borderColor = this.validationResult.borderColor;
        //this.valueTextField.Background = this.validationResult.backgroundColor;

        //================= UPDATE COLOURS ON TEXT FIELD ================//

        //final PseudoClass errorClass = PseudoClass.getPseudoClass("error");


        //this.valueTextField.pseudoClassStateChanged(this.worstValidationLevel.pseudoClass, true); // or false to unset it
        this.valueTextField.getStyleClass().remove("ok");
        this.valueTextField.getStyleClass().remove("warning");
        this.valueTextField.getStyleClass().remove("error");
        this.valueTextField.getStyleClass().add(this.worstValidationLevel.name);
        /*this.valueTextField.setStyle(
                "-fx-background-color: " + this.worstValidationLevel.backgroundColor + ";" +
                "-fx-border-color: " + this.worstValidationLevel.borderColor + ";");*/

        //================== CREATE TOOLTIP ==================//

        // Build up string from all of the validators which are at the same validation
        // level as the worse one
        String validationMsg = "";
        if (this.worstValidationLevel != CalcValidationLevels.Ok) {
            for(CalcValidationResult validationResult : this.validationResults) {
                // Check to see if this validation result was just as bad as the worse one
                // (i.e. the same level of validation)
                if (validationResult.CalcValidationLevel == this.worstValidationLevel) {
                    validationMsg += validationResult.Message + " ";
                }
            }
        }
        else {
            // Validation must of been o.k., so in this case we display a stock-standard message
            validationMsg = "Value is o.k.";
        }

        // We need to use a TextBlock so we can do advanced formatting
        Tooltip toolTip = new Tooltip();

        // Tooltip content is help info plus validation results
        toolTip.setText(this.helpText + "\r\n\r\n" + validationMsg);
        toolTip.setWrapText(true);
        //toolTip.Inlines.Add(new Italic(new Run(validationMsg)));

        // Setting a max width prevents the tooltip from getting rediculuosly large when there is a long help info string.
        // Keeping this quite small also makes the tooltip easier to read.
        toolTip.setMaxWidth(300);
        hackTooltipStartTiming(toolTip);
        // Important to allow wrapping as we are restricting the max. width!
        //toolTip.TextWrapping = System.Windows.TextWrapping.Wrap;

        this.valueTextField.setTooltip(toolTip);
        //this.valueTextField.ToolTip = toolTip;
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
            objTimer.getKeyFrames().add(new KeyFrame(new Duration(100)));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }



    /**
     * This method makes the text fields of output variables slightly transparent to indicate
     * to the user that they are readonly.
     */
    public void updateUIFromDirection() {

        // We don't disable the text field as this disables the tooltip also.

        switch(this.direction) {
            case Input:
                //this.valueTextField.setDisable(false);
                this.valueTextField.setEditable(true);
                break;
            case Output:
                //this.valueTextField.setDisable(true);
                this.valueTextField.setEditable(false);
                break;
        }
    }

}
