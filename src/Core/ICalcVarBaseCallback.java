package Core;

/**
 * An interface describing any callback which takes a CalcVarBase object as it's only
 * parameter and returns nothing.
 * @author gbmhunter
 * @since 2015-11-02
 */
public interface ICalcVarBaseCallback {
    void execute(CalcVarBase calcVarBase);
}
