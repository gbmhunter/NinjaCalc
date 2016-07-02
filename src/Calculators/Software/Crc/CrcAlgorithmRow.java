package Calculators.Software.Crc;

import Core.CalcVar.CalcVarDirections;
import Core.CalcVar.Generic.CalcVarGeneric;
import Core.CalcVar.Text.CalcVarText;
import Core.Calculator;
import Utility.Crc.CrcAlgorithmParameters;
import Utility.Crc.CrcGeneric;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.GridPane;

import java.util.List;

/**
 * Created by gbmhu on 2016-07-02.
 */
public class CrcAlgorithmRow {

    CrcAlgorithmParameters crcAlgorithmParameters;

    public CalcVarText crcValueCalcVar = new CalcVarText();

    public CrcAlgorithmRow(
            GridPane gridPane,
            int rowIndexToAddTo,
            CrcAlgorithmParameters crcAlgorithmParameters,
            CalcVarGeneric<List<Integer>> convertedCrcDataCalcVar,
            Calculator calculator) {

        this.crcAlgorithmParameters = crcAlgorithmParameters;

        int currColumnIndex = 0;

        //==============================================//
        //============ CRC ALGORITHM NAME ==============//
        //==============================================//

        Label crcName = new Label(crcAlgorithmParameters.name);
        gridPane.add(crcName, currColumnIndex++, rowIndexToAddTo);

        //==============================================//
        //============ CRC ALGORITHM VALUE =============//
        //==============================================//

        TextField crcValueTextField = new TextField();
        crcValueTextField.setPrefWidth(110);

        gridPane.add(crcValueTextField, currColumnIndex++, rowIndexToAddTo);

        crcValueCalcVar.setName("crcValueCalcVar");
        crcValueCalcVar.setTextField(crcValueTextField);
        crcValueCalcVar.setDirectionFunction(() -> {
            return CalcVarDirections.Output;
        });
        crcValueCalcVar.setEquationFunction(() -> {

            List<Integer> convertedCrcData = convertedCrcDataCalcVar.getValue();

            if (convertedCrcData == null) {
                return "";
            }

            // Create a CRC engine
            CrcGeneric crcGeneric = new CrcGeneric(crcAlgorithmParameters);

            for(Integer data : convertedCrcData) {
                crcGeneric.update(data);
            }

            //Integer crcResult = Crc16XModem.CalcFast(convertedCrcData);
            long crcResult = crcGeneric.getValue();

            // Convert to hex for display
            String crcResultAsHex = String.format("0x%0" + crcAlgorithmParameters.crcWidthBits / 4 + "X", crcResult);

            return crcResultAsHex;

        });
        crcValueCalcVar.setHelpText("The CRC result using the " + crcAlgorithmParameters.name + " algorithm.");
        calculator.addCalcVar(crcValueCalcVar);

    }

}
