package MainWindow;

import Core.Calculator;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Tab;
import javafx.scene.control.TabPane;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.*;

import Core.View.CalculatorGridElement.CalculatorGridElementController;

import java.util.ArrayList;

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

    private ArrayList<Calculator> calculatorTemplates;

    //===============================================================================================//
    //======================================== CONSTRUCTORS =========================================//
    //===============================================================================================//

    public MainWindowController() {
        this.calculatorTemplates = new ArrayList<Calculator>();

        //assert this.tabPaneCalculatorInstances != null;
        //assert this.tabPaneCalculatorInstances.getSelectionModel() != null;
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

    public void addCalculatorTemplate(Calculator calculator) {
        //System.out.println("addCalculatorTemplate() called.");

        // Save to internal list
        this.calculatorTemplates.add(calculator);

        CalculatorGridElementController gridElement =
                new CalculatorGridElementController(calculator.iconImagePath, calculator.name, calculator.description, this::openCalculatorButtonPressed);

        // Add new tile to tile pane in main window
        calculatorGridTilePane.getChildren().add(gridElement);

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
        for(Calculator calculator : this.calculatorTemplates) {
            if(calculator.name == calculatorName) {
                foundCalculator = calculator;
            }
        }

        assert foundCalculator != null;

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
