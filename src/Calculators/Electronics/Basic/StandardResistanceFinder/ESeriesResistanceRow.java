package Calculators.Electronics.Basic.StandardResistanceFinder;

import Core.*;
import Core.CalcVar.CalcVarBase;
import Core.CalcVar.Numerical.CalcVarNumerical;
import Core.CalcVar.Numerical.CalcVarNumericalInput;
import Core.CalcVar.Numerical.CalcVarNumericalOutput;
import Utility.StandardResistanceFinder;
import javafx.geometry.Pos;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.GridPane;

import java.util.ArrayList;

/**
 * Dedicated class to represent a row in the standard resistance finder table.
 * Used by the StandardResistanceFinderCalcModel class.
 *
 * @author              gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @last-modified       2016-07-02
 * @since               2016-05-14
 */
public class ESeriesResistanceRow {

    String name;
    StandardResistanceFinder.eSeriesOptions eSeries;

    CalcVarNumericalOutput closestResistanceCalcVar;
    CalcVarNumericalOutput closestResistanceErrorCalcVar;

    CalcVarNumericalOutput closestEqualOrLowerResistanceCalcVar;
    CalcVarNumericalOutput closestEqualOrLowerResistanceErrorCalcVar;

    CalcVarNumericalOutput closestEqualOrHigherResistanceCalcVar;
    CalcVarNumericalOutput closestEqualOrHigherResistanceErrorCalcVar;

    ESeriesResistanceRow(
            String name,
            StandardResistanceFinder.eSeriesOptions eSeries,
            CalcVarNumericalInput desiredResistance,
            GridPane variableGridPane,
            Integer rowToAddTo,
            Calculator calculator,
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
        closestResistanceCalcVar = new CalcVarNumericalOutput();
        closestResistanceCalcVar.setName("closestResistanceCalcVar");
        closestResistanceCalcVar.setValueTextField(closestResistanceTextField);
        closestResistanceCalcVar.setEquationFunction(() -> {
            // Read in variables
            Double desiredResistanceValue = desiredResistance.getRawVal();

            if (Double.isNaN(desiredResistanceValue)) {
                return Double.NaN;
            }

            double actualResistance = StandardResistanceFinder.Find(desiredResistanceValue, eSeries);

            return actualResistance;
        });
        closestResistanceCalcVar.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("Ω", 1e0, NumberPreference.DEFAULT),
        });
        closestResistanceCalcVar.setRounding(roundingType, numberToRoundTo);
        closestResistanceCalcVar.setHelpText("The closest resistance in the " + name + " series to your desired resistance.");
        closestResistanceCalcVar.setIsEngineeringNotationEnabled(true);

        //========== VALIDATORS ===========//
        closestResistanceCalcVar.addValidator(Validator.IsNumber(closestResistanceCalcVar, CalcValidationLevels.Error));
        closestResistanceCalcVar.addValidator(Validator.IsGreaterThanZero(closestResistanceCalcVar, CalcValidationLevels.Error));

        calculator.addCalcVar(closestResistanceCalcVar);

        // Ohm symbol
        variableGridPane.add(new Label("Ω"), currColumnCount++, rowToAddTo);

        //=============== CLOSEST RESISTANCE ERROR ============//

        // "Closest Resistance Error" TextField
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
            Double closestStandardResistanceValue = closestResistanceCalcVar.getRawVal();

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
        closestResistanceErrorCalcVar.addValidator(Validator.IsNumber(closestResistanceErrorCalcVar, CalcValidationLevels.Error));
        closestResistanceErrorCalcVar.addValidator(Validator.IsGreaterOrEqualToZero(closestResistanceErrorCalcVar, CalcValidationLevels.Error));

        calculator.addCalcVar(closestResistanceErrorCalcVar);

        // Percentage symbol
        variableGridPane.add(new Label("%"), currColumnCount++, rowToAddTo);

        //============================== CLOSEST EQUAL OR LOWER RESISTANCE ==============================//

        // "Closest Resistance" TextField
        TextField closestEqualOrLowerResistanceTextField = new TextField();
        closestEqualOrLowerResistanceTextField.setAlignment(Pos.CENTER_RIGHT);
        variableGridPane.add(closestEqualOrLowerResistanceTextField, currColumnCount++, rowToAddTo);

        // Calculator variable
        closestEqualOrLowerResistanceCalcVar = new CalcVarNumericalOutput();
        closestEqualOrLowerResistanceCalcVar.setName("closestHigherResistance");
        closestEqualOrLowerResistanceCalcVar.setValueTextField(closestEqualOrLowerResistanceTextField);
        closestEqualOrLowerResistanceCalcVar.setEquationFunction(() -> {
            // Read in variables
            Double desiredResistanceValue = desiredResistance.getRawVal();

            if (Double.isNaN(desiredResistanceValue)) {
                return Double.NaN;
            }

            double actualResistance = StandardResistanceFinder.Find(desiredResistanceValue, eSeries, StandardResistanceFinder.searchMethods.CLOSEST_EQUAL_OR_LOWER);

            return actualResistance;
        });
        closestEqualOrLowerResistanceCalcVar.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("Ω", 1e0, NumberPreference.DEFAULT),
        });
        closestEqualOrLowerResistanceCalcVar.setRounding(roundingType, numberToRoundTo);
        closestEqualOrLowerResistanceCalcVar.setHelpText("The closest equal or higher resistance in the " + name + " series to your desired resistance.");
        closestEqualOrLowerResistanceCalcVar.setIsEngineeringNotationEnabled(true);

        //========== VALIDATORS ===========//
        closestEqualOrLowerResistanceCalcVar.addValidator(Validator.IsNumber(closestEqualOrLowerResistanceCalcVar, CalcValidationLevels.Error));
        closestEqualOrLowerResistanceCalcVar.addValidator(Validator.IsGreaterThanZero(closestEqualOrLowerResistanceCalcVar, CalcValidationLevels.Error));

        calculator.addCalcVar(closestEqualOrLowerResistanceCalcVar);

        // Ohm symbol
        variableGridPane.add(new Label("Ω"), currColumnCount++, rowToAddTo);

        //============================== CLOSEST EQUAL OR LOWER RESISTANCE ERROR ==============================//

        // "Closest Equal Or Lower Resistance Error" TextField
        TextField closestEqualOrLowerResistanceErrorTextField = new TextField();
        closestEqualOrLowerResistanceErrorTextField.setAlignment(Pos.CENTER_RIGHT);
        variableGridPane.add(closestEqualOrLowerResistanceErrorTextField, currColumnCount++, rowToAddTo);

        // Calculator variable
        closestEqualOrLowerResistanceErrorCalcVar = new CalcVarNumericalOutput();
        closestEqualOrLowerResistanceErrorCalcVar.setName("equalOrLowerResistanceError");
        closestEqualOrLowerResistanceErrorCalcVar.setValueTextField(closestEqualOrLowerResistanceErrorTextField);
        closestEqualOrLowerResistanceErrorCalcVar.setEquationFunction(() -> {
            // Read in variables
            Double desiredResistanceValue = desiredResistance.getRawVal();
            Double closestEqualOrLowerResistanceValue = closestEqualOrLowerResistanceCalcVar.getRawVal();

            if (Double.isNaN(desiredResistanceValue)) {
                return Double.NaN;
            }

            // Calculate percentage difference
            double percentageDiff = (Math.abs(closestEqualOrLowerResistanceValue - desiredResistanceValue) / desiredResistanceValue) * 100.0;

            return percentageDiff;
        });
        closestEqualOrLowerResistanceErrorCalcVar.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("%", 1e0, NumberPreference.DEFAULT),
        });
        closestEqualOrLowerResistanceErrorCalcVar.setRounding(CalcVarNumerical.RoundingTypes.DECIMAL_PLACES, 2);
        closestEqualOrLowerResistanceErrorCalcVar.setHelpText("The percentage difference between the closest equal or lower " + name + " series resistance and your desired resistance.");
        closestEqualOrLowerResistanceErrorCalcVar.setIsEngineeringNotationEnabled(true);

        //========== VALIDATORS ===========//
        closestEqualOrLowerResistanceErrorCalcVar.addValidator(Validator.IsNumber(closestEqualOrLowerResistanceErrorCalcVar, CalcValidationLevels.Error));
        closestEqualOrLowerResistanceErrorCalcVar.addValidator(Validator.IsGreaterOrEqualToZero(closestEqualOrLowerResistanceErrorCalcVar, CalcValidationLevels.Error));

        calculator.addCalcVar(closestEqualOrLowerResistanceErrorCalcVar);

        // Percentage symbol
        variableGridPane.add(new Label("%"), currColumnCount++, rowToAddTo);

        //============================== CLOSEST EQUAL OR HIGHER RESISTANCE ==============================//

        // "Closest Resistance" TextField
        TextField closestEqualOrHigherResistanceTextField = new TextField();
        closestEqualOrHigherResistanceTextField.setAlignment(Pos.CENTER_RIGHT);
        variableGridPane.add(closestEqualOrHigherResistanceTextField, currColumnCount++, rowToAddTo);

        // Calculator variable
        closestEqualOrHigherResistanceCalcVar = new CalcVarNumericalOutput();
        closestEqualOrHigherResistanceCalcVar.setName("closestHigherResistance");
        closestEqualOrHigherResistanceCalcVar.setValueTextField(closestEqualOrHigherResistanceTextField);
        closestEqualOrHigherResistanceCalcVar.setEquationFunction(() -> {
            // Read in variables
            Double desiredResistanceValue = desiredResistance.getRawVal();

            if (Double.isNaN(desiredResistanceValue)) {
                return Double.NaN;
            }

            double actualResistance = StandardResistanceFinder.Find(desiredResistanceValue, eSeries, StandardResistanceFinder.searchMethods.CLOSEST_EQUAL_OR_HIGHER);

            return actualResistance;
        });
        closestEqualOrHigherResistanceCalcVar.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("Ω", 1e0, NumberPreference.DEFAULT),
        });
        closestEqualOrHigherResistanceCalcVar.setRounding(roundingType, numberToRoundTo);
        closestEqualOrHigherResistanceCalcVar.setHelpText("The closest equal or higher resistance in the " + name + " series to your desired resistance.");
        closestEqualOrHigherResistanceCalcVar.setIsEngineeringNotationEnabled(true);

        //========== VALIDATORS ===========//
        closestEqualOrHigherResistanceCalcVar.addValidator(Validator.IsNumber(closestEqualOrHigherResistanceCalcVar, CalcValidationLevels.Error));
        closestEqualOrHigherResistanceCalcVar.addValidator(Validator.IsGreaterThanZero(closestEqualOrHigherResistanceCalcVar, CalcValidationLevels.Error));

        calculator.addCalcVar(closestEqualOrHigherResistanceCalcVar);

        // Ohm symbol
        variableGridPane.add(new Label("Ω"), currColumnCount++, rowToAddTo);

        //============================== CLOSEST EQUAL OR HIGHER RESISTANCE ERROR ==============================//

        // "Closest Equal Or Lower Resistance Error" TextField
        TextField closestEqualOrHigherResistanceErrorTextField = new TextField();
        closestEqualOrHigherResistanceErrorTextField.setAlignment(Pos.CENTER_RIGHT);
        variableGridPane.add(closestEqualOrHigherResistanceErrorTextField, currColumnCount++, rowToAddTo);

        // Calculator variable
        closestEqualOrHigherResistanceErrorCalcVar = new CalcVarNumericalOutput();
        closestEqualOrHigherResistanceErrorCalcVar.setName("equalOrHigherResistanceError");
        closestEqualOrHigherResistanceErrorCalcVar.setValueTextField(closestEqualOrHigherResistanceErrorTextField);
        closestEqualOrHigherResistanceErrorCalcVar.setEquationFunction(() -> {
            // Read in variables
            Double desiredResistanceValue = desiredResistance.getRawVal();
            Double closestEqualOrHigherResistanceValue = closestEqualOrHigherResistanceCalcVar.getRawVal();

            if (Double.isNaN(desiredResistanceValue)) {
                return Double.NaN;
            }

            // Calculate percentage difference
            double percentageDiff = (Math.abs(closestEqualOrHigherResistanceValue - desiredResistanceValue) / desiredResistanceValue) * 100.0;

            return percentageDiff;
        });
        closestEqualOrHigherResistanceErrorCalcVar.setUnits(new NumberUnitMultiplier[]{
                new NumberUnitMultiplier("%", 1e0, NumberPreference.DEFAULT),
        });
        closestEqualOrHigherResistanceErrorCalcVar.setRounding(CalcVarNumerical.RoundingTypes.DECIMAL_PLACES, 2);
        closestEqualOrHigherResistanceErrorCalcVar.setHelpText("The percentage difference between the closest equal or higher " + name + " series resistance and your desired resistance.");
        closestEqualOrHigherResistanceErrorCalcVar.setIsEngineeringNotationEnabled(true);

        //========== VALIDATORS ===========//
        closestEqualOrHigherResistanceErrorCalcVar.addValidator(Validator.IsNumber(closestEqualOrHigherResistanceErrorCalcVar, CalcValidationLevels.Error));
        closestEqualOrHigherResistanceErrorCalcVar.addValidator(Validator.IsGreaterOrEqualToZero(closestEqualOrHigherResistanceErrorCalcVar, CalcValidationLevels.Error));

        calculator.addCalcVar(closestEqualOrHigherResistanceErrorCalcVar);

        // Percentage symbol
        variableGridPane.add(new Label("%"), currColumnCount++, rowToAddTo);

    }

}
