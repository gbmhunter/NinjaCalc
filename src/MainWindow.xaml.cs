using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.ComponentModel;

namespace NinjaCalc
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {

        /// <summary>
        /// Retains a list of all calculators (and their data) which have been added to
        /// the application.
        /// </summary>
        private List<Calculator> calculators;

        public MainWindow()
        {
            InitializeComponent();
            //Name2 = new String('a', 5);
            //myGrid.DataContext = this;

            // Hide the overlay
            overlay.Visibility = System.Windows.Visibility.Collapsed;

            // Add event handler for menu button click
            ButtonMenu.Click += ButtonMenu_Click;

            // Add event handler for "new calculator" button click on Start tab
            buttonNewCalc.Click += buttonNewCalc_Click;

            calculators = new List<Calculator>();

            // Register calculators
            this.RegisterCalculator(new OhmsLaw());
        }

        private void buttonNewCalc_Click(object sender, RoutedEventArgs e)
        {
            // Show the overlay
            overlay.Visibility = System.Windows.Visibility.Visible;
        }

        private void ButtonMenu_Click(object sender, RoutedEventArgs e)
        {
            // Show the overlay
            overlay.Visibility = System.Windows.Visibility.Visible;
        }
     

        private void Border_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            // Hide the overlay
            overlay.Visibility = System.Windows.Visibility.Collapsed;
            
        }

        /// <summary>
        /// Use this to register a calculator with the program. This will add the calculator
        /// to the "choose calculator" grid and allow the user to open a calculator of this type.
        /// </summary>
        /// <param name="calculator">The calculator you wish to register.</param>
        public void RegisterCalculator(Calculator calculator)
        {
            // Save the calculator into a list
            this.calculators.Add(calculator);

            // Create a calculator grid element
            CalculatorGridElement testUserControl = new CalculatorGridElement();
            testUserControl.Title.Content = calculator.Name;
            testUserControl.Description.Content = calculator.Description;
            testUserControl.OpenButtonClicked += HandleOpenCalcButtonClicked;

            // Add grid element
            calculatorGrid.Children.Add(testUserControl);

            //this.TabControlCalculators.Items.Add(new TabItem());
        }

        /// <summary>
        /// This will be subscribed to the CalculatorGridElement.OpenButtonClicked event. Adds a new tab
        /// for the corresponding calculator the user wishes to open.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void HandleOpenCalcButtonClicked(object sender, EventArgs e)
        {
            Console.WriteLine("HandleOpenCalcButtonClicked() called with sender = " + sender.ToString() + " and e = " + e.ToString() + ".");

            // Work out what calculator was clicked on
            CalculatorGridElement calculatorGridElement = (CalculatorGridElement)sender;
            Console.WriteLine("Open was clicked on the \"" + calculatorGridElement.Title + "\" calculator grid element.");

            // Find calculator associated with the grid element
            Calculator foundCalc = this.calculators.Find(x => x.Name == (string)calculatorGridElement.Title.Content);
            Console.WriteLine("Found calculator \"" + foundCalc.Name + "\" using the calculator grid element.");

            // Create a new tab
            var tabItem = new TabItem();
            tabItem.Header = calculatorGridElement.Title.Content;

            // Fill in the tab with the content from the found calculator. The View() method should return a base UI element
            // to fill in the tab (it will have many children)
            tabItem.Content = foundCalc.GetView();

            //tabItem.HorizontalAlignment = System.Windows.HorizontalAlignment.Center;
            //tabItem.VerticalAlignment = System.Windows.VerticalAlignment.Center;

            // Add new tab to tab control
            this.TabControlCalculators.Items.Add(tabItem);

            // Hide the "Select Calculator" overlay
            overlay.Visibility = System.Windows.Visibility.Collapsed;

            // Make the tab control visible
            this.TabControlCalculators.Visibility = System.Windows.Visibility.Visible;

            // Make this newly added tab the active tab
            this.TabControlCalculators.SelectedIndex = this.TabControlCalculators.Items.Count - 1;


        }

    } // public partial class MainWindow : Window, INotifyPropertyChanged

  

}

