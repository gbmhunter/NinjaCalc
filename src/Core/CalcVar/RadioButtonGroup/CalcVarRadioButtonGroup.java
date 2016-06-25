package Core.CalcVar.RadioButtonGroup;

import Core.CalcVar.CalcVarBase;
import Core.CalcVar.CalcVarDirections;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.scene.control.RadioButton;
import javafx.scene.control.Toggle;
import javafx.scene.control.ToggleGroup;

import java.util.ArrayList;
import java.util.List;

/**
 * A CalcVarRadioButtonGroup can only be used as an input
 */
public class CalcVarRadioButtonGroup extends CalcVarBase {



    //===============================================================================================//
    //========================================== CONSTRUCTORS =======================================//
    //===============================================================================================//

    public CalcVarRadioButtonGroup() {
        super();

        // Permenently set this calculator variable as in input
        setDirectionFunction(() -> {
            return CalcVarDirections.Input;
        });

        radioButtons = new ArrayList<>();

        toggleGroup = new ToggleGroup();

        toggleGroup.selectedToggleProperty().addListener((ObservableValue<? extends Toggle> ov,
                                                          Toggle toggle, Toggle new_toggle) -> {
                  toggleChanged(new_toggle);
                }
        );
    }


    private void toggleChanged(Toggle newToggle) {

        System.out.println("CalcVarRadioButtonGroup.toggleChanged() called.");

        if (newToggle == null)
            throw new RuntimeException("newToggle was null.");

        // Update the value of this calculator variable
        value = newToggle;
        // Now we need to update any other calculator variables who are dependent
        // on this calculator variable's value
        forceDependantOutputsToRecalculate();

    }

    //===============================================================================================//
    //============================= VARIABLES AND GETTERS/SETTERS ===================================//
    //===============================================================================================//

    private Toggle value;
    public Toggle getValue() {
        // Notify any listeners that the value of this calculator variable is being read.
        onValueRead();
        return value;
    };
    public void setValue(Toggle value) {
        this.value = value;
        // Also update the UI
        toggleGroup.selectToggle(value);
    }

    /**
     * A private JavaFX variable to monitor when the selection changes
     * within this group of radiobuttons.
     */
    private ToggleGroup toggleGroup;


    //===============================================================================================//
    //======================================== GENERAL METHODS ======================================//
    //===============================================================================================//

    public void calculate() {

    }

    public void validate() {

    }

    public void updateUIFromDirection() {

    }

    private List<RadioButton> radioButtons;
    public void addRadioButton(RadioButton radioButton) {
        radioButtons.add(radioButton);

        radioButton.setToggleGroup(toggleGroup);
    }


}
