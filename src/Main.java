

// SYSTEM IMPORTS
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.SceneAntialiasing;
import javafx.stage.Stage;

// USER IMPORTS
import MainWindow.MainWindowController;

/**
 * Entry class for NinjaCalc application.
 *
 * @author          gbmhunter <gbmhunter@gmail.com> (www.mbedded.ninja)
 * @since           2015-11-02
 * @last-modified   2016-04-19
 */
public class Main extends Application {

    @Override
    public void start(Stage primaryStage) throws Exception{

        FXMLLoader loader = new FXMLLoader(getClass().getResource("/MainWindow/MainWindowView.fxml"));
        Parent root = loader.load();

        // Load the default style sheet
        root.getStylesheets().add("/Core/StyleSheets/default.css");

        // Get a handle of the controller (backend) for the MainWindowView.fxml file
        MainWindowController controller = loader.getController();

        //===============================================================================================//
        //======================================= REGISTER CALCULATORS ==================================//
        //===============================================================================================//

        // Any of the following can be commented out to remove the calculator(s) from the app

        //======== SCIENTIFIC =========//
        controller.addCalculatorTemplate(new Calculators.Scientific.ScientificCalcModel());

        //===============================================================================================//
        //========================================== ELECTRONICS ========================================//
        //===============================================================================================//

        //========== BASIC ==========//
        controller.addCalculatorTemplate(new Calculators.Electronics.Basic.OhmsLaw.OhmsLawCalcModel());
        controller.addCalculatorTemplate(new Calculators.Electronics.Basic.ResistorDivider.ResistorDividerCalcModel());
        controller.addCalculatorTemplate(new Calculators.Electronics.Basic.StandardResistanceFinder.StandardResistanceFinderModel());

        //========== FILTERS ==========//
        controller.addCalculatorTemplate(new Calculators.Electronics.Filters.LowPassRC.LowPassRCCalcModel());

        //========== PCB ==========//
        controller.addCalculatorTemplate(new Calculators.Electronics.Pcb.TrackCurrentIpc2221A.TrackCurrentIpc2221ACalcModel());
        controller.addCalculatorTemplate(new Calculators.Electronics.Pcb.TrackCurrentIpc2152.TrackCurrentIpc2152CalcModel());

        //===============================================================================================//
        //========================================= ENVIRONMENTAL =======================================//
        //===============================================================================================//

        controller.addCalculatorTemplate(new Calculators.Environmental.DewPointMagnus.DewPointMagnusCalcModel());

        //===============================================================================================//
        //================================== SETUP AND SHOW APPLICATION =================================//
        //===============================================================================================//

        primaryStage.setTitle("NinjaCalc");

        // Setup the dimensions for the NinjaCalc window.
        // By default, it should be large enough to display and operate
        // comfortably, but not take up the entire window (e.g. not maximised), to give it a "calculator" feel.
        // EDIT: NinjaCalc is now shown full-screen to give user a better experience with the app
        primaryStage.setScene(new Scene(root, 1200, 800, false, SceneAntialiasing.BALANCED));

        primaryStage.setMaximized(true);

        // Show the NinjaCalc app
        primaryStage.show();

    }



    public static void main(String[] args) {
        launch(args);
    }


}
