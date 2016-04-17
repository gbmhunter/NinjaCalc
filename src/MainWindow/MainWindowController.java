package MainWindow;

import Core.Calculator;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Tab;
import javafx.scene.control.TabPane;
import javafx.scene.control.TextField;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.*;

import Core.View.CalculatorGridElement.CalculatorGridElementController;

import java.util.ArrayList;
import java.util.regex.Pattern;

class CalculatorAndGridElementPair {
    Calculator calculator;
    CalculatorGridElementController gridElement;

    public CalculatorAndGridElementPair(Calculator calculator, CalculatorGridElementController gridElement) {
        this.calculator = calculator;
        this.gridElement = gridElement;
    }
}

/**
 * The controller for the main window.
 *
 * @author gbmhunter
 * @since 2015-11-02
 * @last-modified 2016-02-14
 */
public class MainWindowController implements Initializable {

    @FXML
    private AnchorPane anchorPane;

    @FXML
    private GridPane calcGridOverlay;

    @FXML
    private TilePane calculatorGridTilePane;

    @FXML
    private GridPane gridPaneCalculatorTabsContainer;

    @FXML
    private TabPane tabPaneCalculatorInstances;

    @FXML
    private VBox noCalculatorIsOpenPane;

    @FXML
    private TextField searchTextField;

    private ArrayList<CalculatorAndGridElementPair> calculatorTemplates;

    //===============================================================================================//
    //======================================== CONSTRUCTORS =========================================//
    //===============================================================================================//

    public MainWindowController() {
        this.calculatorTemplates = new ArrayList<CalculatorAndGridElementPair>();
    }

    /**
     * Used to add listeners to the main window where needed (UI objects have been injected at this point).
     * @param location
     * @param resources
     */
    public void initialize(java.net.URL location, java.util.ResourceBundle resources) {
        this.tabPaneCalculatorInstances.getSelectionModel().selectedItemProperty().addListener((ov, oldTab, newTab) -> {
            //System.out.println("changed");
            //System.out.println("Selected tab index = \"" + String.valueOf(this.tabPaneCalculatorInstances.getSelectionModel().getSelectedIndex()) + "\".");

            // Check to see if there are any tabs left open
            if(this.tabPaneCalculatorInstances.getSelectionModel().getSelectedIndex() == -1) {
                // Last tab has been closed, hide the tab pane and
                // show the "Do you wish to open a calculator" pane
                this.noCalculatorIsOpenPane.setVisible(true);
                this.gridPaneCalculatorTabsContainer.setVisible(false);
            } else {
                // First tab has been opened, hide the "Do you wish to open a calculator" pane
                // and show the tab pane
                this.noCalculatorIsOpenPane.setVisible(false);
                this.gridPaneCalculatorTabsContainer.setVisible(true);
            }

        });

        this.searchTextField.textProperty().addListener((observable, oldValue, newValue) -> {
            System.out.println("searchTextField.textProperty listener called with newValue = " + newValue + ".");

            this.filterCalculatorSelectionGrid(newValue);
        });


    }

    /***
     * Filters the calculator templates visible in the selection grid by the provided search text
     * (which comes the the search TextField).
     * @param searchText
     */
    public void filterCalculatorSelectionGrid(String searchText) {

        // Iterate over all the registered calculator templates
        for(CalculatorAndGridElementPair calculatorAndGridElementPair : this.calculatorTemplates) {



            if(this.doesCalculatorMatchSearchText(calculatorAndGridElementPair.calculator, searchText)) {
                System.out.println("Calculator \"" + calculatorAndGridElementPair.calculator.name + "\" included by search text.");

                if(!calculatorGridTilePane.getChildren().contains(calculatorAndGridElementPair.gridElement))
                    calculatorGridTilePane.getChildren().add(calculatorAndGridElementPair.gridElement);

            } else {
                System.out.println("Calculator \"" + calculatorAndGridElementPair.calculator.name + "\" excluded by search text.");
                if(calculatorGridTilePane.getChildren().contains(calculatorAndGridElementPair.gridElement))
                    calculatorGridTilePane.getChildren().remove(calculatorAndGridElementPair.gridElement);
            }
        }
    }

    /**
     * Searches through the relevant String fields of the provided calculator to see if the calculator is a suitable
     * match for the provided search text.
     * @param calculator    The calculator that will be searched through.
     * @param searchText    The search text to use on the calculator.
     * @return              True if the calculator is a suitable match for the search text, otherwise false.
     */
    public boolean doesCalculatorMatchSearchText(Calculator calculator, String searchText) {

        /*if(calculator.name.contains(searchText))
            return true;*/

        // Search name
        if(Pattern.compile(Pattern.quote(searchText), Pattern.CASE_INSENSITIVE).matcher(calculator.name).find())
            return true;

        // Search description
        if(Pattern.compile(Pattern.quote(searchText), Pattern.CASE_INSENSITIVE).matcher(calculator.description).find())
            return true;

        // Search through tags
        for(String tag : calculator.tags) {
            if(Pattern.compile(Pattern.quote(searchText), Pattern.CASE_INSENSITIVE).matcher(tag).find())
                return true;
        }

        // If we get here, no match has been found in any of the relevant string fields of the
        // calculator, so the calculator is NOT a suitable match.
        return false;
    }


    public void handleButtonOnAction(ActionEvent actionEvent) {
        //Alert alert = new Alert(Alert.AlertType.CONFIRMATION, "blah");
        //alert.showAndWait();

        // Show the calculator grid overlay
        calcGridOverlay.setVisible(true);

    }

    public void handleCalcSelectionBorderMouseClicked(MouseEvent event) {
        //System.out.println("handleCalcSelectionBorderMouseClicked() called.");
        calcGridOverlay.setVisible(false);
        event.consume();
    }

    public void handleCalcSelectionMouseClicked(MouseEvent event) {
        // This is to stop the mouse click event for the border from capturing this event
        // and hiding the selection grid
        event.consume();
    }

    /***
     * Adds a calculator to the list of calculator templates the user can select from in the calculator selection grid.
     * This must be called once for each calculator that is to be shown to the user when the app starts up.
     * @param calculator    The calculator you wish to add to the apps list of calculator templates.
     */
    public void addCalculatorTemplate(Calculator calculator) {
        //System.out.println("addCalculatorTemplate() called.");

        CalculatorGridElementController gridElement =
                new CalculatorGridElementController(calculator.iconImagePath, calculator.name, calculator.description, this::openCalculatorButtonPressed);

        // Add new tile to tile pane in main window
        calculatorGridTilePane.getChildren().add(gridElement);

        CalculatorAndGridElementPair calculatorAndGridElementPair = new CalculatorAndGridElementPair(calculator, gridElement);

        // Save to internal list
        this.calculatorTemplates.add(calculatorAndGridElementPair);

    }

    @FXML
    private void onMenuButtonClick(MouseEvent mouseEvent) {
        calcGridOverlay.setVisible(true);
        mouseEvent.consume();
    }

    public void openCalculatorButtonPressed(String calculatorName) {
        //System.out.println("openCalculatorButtonPressed() called, with calculatorName = \"" + calculatorName +  "\" .");


        Calculator foundCalculator = null;
        // Search for calculator in list of calculator templates
        for(CalculatorAndGridElementPair calculatorAndGridElementPair : this.calculatorTemplates) {
            if(calculatorAndGridElementPair.calculator.name == calculatorName) {
                foundCalculator = calculatorAndGridElementPair.calculator;
            }
        }

        if(foundCalculator == null)
            throw new IllegalArgumentException("The provided calculator name \"" + calculatorName + "\" was not found in the list of calculator templates.");

        System.out.println("Opening new calculator instance...");

        // Make calculator tabs visible
        //this.gridPaneCalculatorTabsContainer.setVisible(true);

        // Hide the selection grid overlay
        this.calcGridOverlay.setVisible(false);

        // Hide the "No calculator is open" pane
        //this.noCalculatorIsOpenPane.setVisible(false);

        // Add new tab to tab pane
        Tab newTab = new Tab();
        newTab.setText(foundCalculator.name);


        try {
            // Create a new instance of this calculator
            Calculator newInstance = foundCalculator.getClass().newInstance();
            newTab.setContent(newInstance.view);
            this.tabPaneCalculatorInstances.getTabs().add(newTab);
            // Set this newly created tab to be the active one
            // NOTE: If this is the first tab to be created, this also causes a listener to be called which shows the tab
            // pane and hides the "Do wish to open a new calculator?" pane
            this.tabPaneCalculatorInstances.getSelectionModel().selectLast();
        }  catch (InstantiationException x) {
            x.printStackTrace();
        } catch (IllegalAccessException x) {
            x.printStackTrace();
        }

    }


}
