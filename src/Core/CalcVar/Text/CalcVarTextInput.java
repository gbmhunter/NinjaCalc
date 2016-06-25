package Core.CalcVar.Text;

import Core.CalcVar.CalcVarDirections;
import Core.CalcVar.Text.CalcVarText;

/**
 * Created by gbmhu on 2016-06-25.
 */
public class CalcVarTextInput extends CalcVarText {

    public CalcVarTextInput() {
        super();
        this.setDirectionFunction(() -> CalcVarDirections.Input);
    }

}
