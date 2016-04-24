package Core;

import Core.CalcVar.CalcVarDirections;

/**
 * Used to provide a function which will calculate direction to each calculator variable.
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2015-11-02
 * @last-modified   2016-04-13
 */
public interface IDirectionFunction {
    CalcVarDirections execute();
}
