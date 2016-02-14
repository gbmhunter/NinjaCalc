package Core;


import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.scene.control.*;
import javafx.util.StringConverter;

/**
 * A combobox-style calculator variable. Currently this only supports being an input.
 *
 * @author gbmhunter
 * @since 2015-11-02
 * @last-modified 2016-02-14
 */
public class CalcVarComboBox extends CalcVarBase {

    protected String rawVal;
    /// <summary>
    /// Holds the "raw" (unscaled, unrounded) value for this variable.
    /// </summary>
    public String getRawVal() {

        this.OnRawValueRead();
        return this.rawVal;
    }

    public void setRawVal(String value) {

        // Only change if different
        if (this.rawVal != value) {
            this.rawVal = value;
            this.onRawValueChanged();
        }
    }


    ComboBox calculatorComboBox;

    public ObservableList<String> comboBoxOptions;

    String HelpText;

    //===============================================================================================//
    //========================================== CONSTRUCTORS =======================================//
    //===============================================================================================//

    public CalcVarComboBox(
        String name,
        ComboBox comboBox,
        String[] comboBoxOptions,
        IDirectionFunction directionFunction,
        String helpText) {

        super(
                name,
                // equationFunction function is not used, should
                // we be passing null here instead???
                () -> 0.0,
                directionFunction
        );

        this.calculatorComboBox = comboBox;
        //this.comboBoxOptions = comboBoxOptions;

        //===============================================================================================//
        //====================================== UNITS AND COMBOBOX =====================================//
        //===============================================================================================//


        // Attach event handler to the selection change for the units combo box
        //this.unitsComboBox.SelectionChanged += this.unitsComboBoxSelectionChanged;
        //this.unitsComboBox.setOnAction(this::unitsComboBoxSelectionChanged);

        // Initialise empty combobox options
        this.comboBoxOptions = FXCollections.observableArrayList();

        for(String myString : comboBoxOptions) {
            this.comboBoxOptions.add(myString);
        }

        // Bind the combo-box to the observable collection
        this.calculatorComboBox.setItems(this.comboBoxOptions);

        //============ LET THE COMBOBOX KNOW HOW TO RENDER NUMBER UNITS ============//

        this.calculatorComboBox.setCellFactory((combobox) -> {

            // Define rendering of the list of values in ComboBox drop down.
            return new ListCell<String>() {
                @Override
                protected void updateItem(String item, boolean empty) {
                    super.updateItem(item, empty);

                    if (item == null || empty) {
                        setText(null);
                    } else {
                        setText(item);
                    }
                }
            };
        });

        // Define rendering of selected value shown in ComboBox.
        this.calculatorComboBox.setConverter(new StringConverter<String>() {
            @Override
            public String toString(String numberUnit) {
                if (numberUnit == null) {
                    return null;
                } else {
                    return numberUnit;
                }
            }

            @Override
            public String fromString(String numberUnitString) {
                return null; // No conversion fromString needed.
            }
        });

        // Connect up event handler for when combobox units change
        this.calculatorComboBox.getSelectionModel().selectedItemProperty().addListener((observable, oldValue, newValue) -> {
            this.comboBoxSelectionChanged();
        });


        // Set current combobox selection to default unit
        this.calculatorComboBox.getSelectionModel().select(0);


        // Save the help text
        this.HelpText = helpText;

        // We need to use a TextBlock so we can do advanced formatting
        //var toolTip = new System.Windows.Controls.TextBlock();

        // Tooltip content is help info plus validation results
        //toolTip.Inlines.Add(this.helpText);

        // Setting a max width prevents the tooltip from getting rediculuosly large when there is a long help info string.
        // Keeping this quite small also makes the tooltip easier to read.
        //toolTip.MaxWidth = 300;
        // Important to allow wrapping as we are restricting the max. width!
        //toolTip.TextWrapping = System.Windows.TextWrapping.Wrap;

        //this.calculatorComboBox.ToolTip = toolTip;

    }

    private void comboBoxSelectionChanged() {
        //System.out.println("comboBoxSelectionChanged() called for calculator variable \"" + this.name + "\".");

        // Need to update the selected unit, bypassing the property (otherwise
        // we will create an infinite loop)
        //ComboBox units = (ComboBox)sender;
        this.setRawVal((String) this.calculatorComboBox.getSelectionModel().getSelectedItem());

        //System.out.println("Selected unit is now \"" + this.getRawVal() + "\".");

        this.forceDependantOutputsToRecalculate();
    }


    public void updateUIFromDirection() {
        // Do nothing
    }

}
