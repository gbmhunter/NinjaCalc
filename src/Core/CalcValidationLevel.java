package Core;

/**
 * Created by gbmhunter on 2016-01-25.
 */

/// <summary>
/// Encapsulates a validation result.
/// </summary>
public class CalcValidationLevel {
    public String Name;


    public String BorderBrush;

    public String BackgroundBrush;

    public CalcValidationLevel(String name, String borderBrush, String backgroundBrush) {
        this.Name = name;
        this.BorderBrush = borderBrush;
        this.BackgroundBrush = backgroundBrush;
    }
}
