package Calculators.Electronics.Basic.StandardResistanceFinder;

import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by gbmhunter on 2016-03-07.
 */
public class StandardResistanceFinderModelTest {
    @Test
    public void firstTest() {
        assertTrue(true);

        StandardResistanceFinderModel standardResistanceFinderModel = new StandardResistanceFinderModel();

        standardResistanceFinderModel.desiredResistance.setRawVal(10);
        standardResistanceFinderModel.eSeries.setRawVal("E96");
        assert 10.0 == standardResistanceFinderModel.actualResistance.getRawVal();

    }

}