package Calculators.Electronics.Basic.StandardResistanceFinder;

import Core.*;
import Core.CalcVar.CalcVarBase;
import Core.CalcVar.CalcVarNumerical;
import Core.CalcVar.CalcVarNumericalInput;
import Core.CalcVar.CalcVarNumericalOutput;
import Utility.StandardResistanceFinder;
import javafx.geometry.Pos;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.GridPane;

import java.util.ArrayList;

/**
 * Represents a row in the standard resistance finder table.
 *
 * @author              gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @last-modified       2016-05-14
 * @since               2016-05-14
 */
public class ESeriesResistanceRow {

    String name;
    StandardResistanceFinder.eSeriesOptions eSeries;

    CalcVarNumericalOutput closestResistance;
    CalcVarNumericalOutput closestResistanceErrorCalcVar;

    CalcVarNumericalOutput closestHigherResistance;
    CalcVarNumericalOutput closestLowerResistance;

    ESeriesResistanceRow(
            String name,
            StandardResistanceFinder.eSeriesOptions eSeries,
            CalcVarNumericalInput desiredResistance,
            GridPane variableGridPane,
            Integer rowToAddTo,
            ArrayList<CalcVarBase> calcVars,
            CalcVarNumerical.RoundingTypes roundingType,
            Integer numberToRoundTo) {

        // Keeps track of what column of the grid pane we are currently inserting at
        Integer currColumnCount = 0;

        this.name = name;
        this.eSeries = eSeries;

        // Create label
        Label resistanceSeriesLabel = new Label(eSeries.name());
        variableGridPane.add(resistanceSeriesLabel, currColumnCount++, rowToAddTo);

        //=============== CLOSEST RESISTANCE ============//

        // "Closest Resistance" TextField
        TextField closestResistanceTextField = new TextField();
        closestResistanceTextField.setAlignment(Pos.CENTER_RIGHT);
        variableGridPane.add(closestResistanceTextField, currColumnCount++, rowToAddTo);

        // Calculator variable
        closestResistance = new CalcVarNumericalOutput();
        closestResistance.setName("closestResistance");
        closestResistance.setValueTextField(closestResistanceTextField);
        closestResistance.setEquationFunction(() -> {
            // Read in variables
            Double desiredResistanceValue = desiredResistance.getRawVal();

            if (Double.isNaN(desiredResistanceValue)) {
                return Double.NaN;
            }

            double actualResistance = StandardResistanceFinder.Find(desiredResistanceValue, eSeries);

            return actualResistance;
        });
        closestResistance.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("Ω", 1e0, NumberPreference.DEFAULT),
        });
        closestResistance.setRounding(roundingType, numberToRoundTo);
        closestResistance.setHelpText("The closest resistance in the " + name + " series to your desired resistance.");
        closestResistance.setIsEngineeringNotationEnabled(true);

        //========== VALIDATORS ===========//
        closestResistance.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        closestResistance.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        calcVars.add(closestResistance);

        // Ohm symbol
        variableGridPane.add(new Label("Ω"), currColumnCount++, rowToAddTo);

        //=============== CLOSEST RESISTANCE ERROR ============//

        // "Closest Resistance" TextField
        TextField closestResistanceErrorTextField = new TextField();
        closestResistanceErrorTextField.setAlignment(Pos.CENTER_RIGHT);
        variableGridPane.add(closestResistanceErrorTextField, currColumnCount++, rowToAddTo);

        // Calculator variable
        closestResistanceErrorCalcVar = new CalcVarNumericalOutput();
        closestResistanceErrorCalcVar.setName("seriesError");
        closestResistanceErrorCalcVar.setValueTextField(closestResistanceErrorTextField);
        closestResistanceErrorCalcVar.setEquationFunction(() -> {
            // Read in variables
            Double desiredResistanceValue = desiredResistance.getRawVal();
            Double closestStandardResistanceValue = closestResistance.getRawVal();

            if (Double.isNaN(desiredResistanceValue)) {
                return Double.NaN;
            }

            // Calculate percentage difference
            double percentageDiff = (Math.abs(closestStandardResistanceValue - desiredResistanceValue) / desiredResistanceValue) * 100.0;

            return percentageDiff;
        });
        closestResistanceErrorCalcVar.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("%", 1e0, NumberPreference.DEFAULT),
        });
        closestResistanceErrorCalcVar.setRounding(CalcVarNumerical.RoundingTypes.DECIMAL_PLACES, 2);
        closestResistanceErrorCalcVar.setHelpText("The percentage difference between the closest " + name + " series resistance and your desired resistance.");
        closestResistanceErrorCalcVar.setIsEngineeringNotationEnabled(true);

        //========== VALIDATORS ===========//
        closestResistance.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        closestResistance.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        calcVars.add(closestResistanceErrorCalcVar);

        // Percentage symbol
        variableGridPane.add(new Label("%"), currColumnCount++, rowToAddTo);

        //============================== CLOSEST HIGHER RESISTANCE ==============================//

        // "Closest Resistance" TextField
        TextField closestHigherResistanceTextField = new TextField();
        closestHigherResistanceTextField.setAlignment(Pos.CENTER_RIGHT);
        variableGridPane.add(closestHigherResistanceTextField, currColumnCount++, rowToAddTo);

        // Calculator variable
        closestResistance = new CalcVarNumericalOutput();
        closestResistance.setName("closestHigherResistance");
        closestResistance.setValueTextField(closestHigherResistanceTextField);
        closestResistance.setEquationFunction(() -> {
            // Read in variables
            Double desiredResistanceValue = desiredResistance.getRawVal();

            if (Double.isNaN(desiredResistanceValue)) {
                return Double.NaN;
            }

            double actualResistance = StandardResistanceFinder.Find(desiredResistanceValue, eSeries);

            return actualResistance;
        });
        closestResistance.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("Ω", 1e0, NumberPreference.DEFAULT),
        });
        closestResistance.setRounding(roundingType, numberToRoundTo);
        closestResistance.setHelpText("The closest resistance in the " + name + " series to your desired resistance.");
        closestResistance.setIsEngineeringNotationEnabled(true);

        //========== VALIDATORS ===========//
        closestResistance.addValidator(Validator.IsNumber(CalcValidationLevels.Error));
        closestResistance.addValidator(Validator.IsGreaterThanZero(CalcValidationLevels.Error));

        calcVars.add(closestResistance);

        // Ohm symbol
        variableGridPane.add(new Label("Ω"), currColumnCount++, rowToAddTo);


    }


}
