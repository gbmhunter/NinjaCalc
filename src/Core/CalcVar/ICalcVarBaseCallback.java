package Core.CalcVar;

/**
 * An interface describing any callback which takes a CalcVarBase object as it's only
 * parameter and returns nothing.
 *
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2015-11-02
 * @last-modified   2016-04-23
 */
public interface ICalcVarBaseCallback {
    void execute(CalcVarBase calcVarBase);
}
