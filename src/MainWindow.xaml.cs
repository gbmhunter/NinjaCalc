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

namespace NinjaCalc {
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window {

        /// <summary>
        /// Retains a list of all available calculators (and their data) which have been added to
        /// the application (i.e. the available list to choose from when "New Calculator" is clicked).
        /// </summary>
        private List<Calculator> calculatorTemplates;

        /// <summary>
        /// Retains a list of all the open calculator instances (i.e. the calculators which are shown on the tabs).
        /// </summary>
        private List<Calculator> calculatorInstances;

        /// <summary>
        /// Constructor. Create and opens a new main window for the application.
        /// </summary>
        public MainWindow() {
            InitializeComponent();
            //Name2 = new String('a', 5);
            //myGrid.DataContext = this;

            // Hide the overlay
            overlay.Visibility = System.Windows.Visibility.Collapsed;

            // Add event handler for menu button click
            ButtonMenu.Click += ButtonMenu_Click;

            // Add event handler for "new calculator" button click on Start tab
            buttonNewCalc.Click += buttonNewCalc_Click;

            calculatorTemplates = new List<Calculator>();
            calculatorInstances = new List<Calculator>();

            // Register calculators
            this.RegisterCalculator(new OhmsLawCalculator());
            this.RegisterCalculator(new NinjaCalc.Calculators.Pcb.TrackCurrentIpc2221A.TrackCurrentIpc2221ACalculator());
        }

        private void buttonNewCalc_Click(object sender, RoutedEventArgs e) {
            // Show the overlay
            overlay.Visibility = System.Windows.Visibility.Visible;
        }

        private void ButtonMenu_Click(object sender, RoutedEventArgs e) {
            // Show the overlay
            overlay.Visibility = System.Windows.Visibility.Visible;
        }


        private void Border_MouseLeftButtonDown(object sender, MouseButtonEventArgs e) {
            // Hide the overlay
            overlay.Visibility = System.Windows.Visibility.Collapsed;

        }

        /// <summary>
        /// Use this to register a calculator with the program. This will add the calculator
        /// to the "choose calculator" grid and allow the user to open a calculator of this type.
        /// </summary>
        /// <param name="calculator">The calculator you wish to register.</param>
        public void RegisterCalculator(Calculator calculator) {
            // Save the calculator into a list
            this.calculatorTemplates.Add(calculator);

            // Create a calculator grid element
            CalculatorGridElement calculatorGridElement = new CalculatorGridElement();
            calculatorGridElement.Title.Content = calculator.Name;
            calculatorGridElement.Description.Content = calculator.Description;

            // Setup the calculator's icon
            BitmapImage logo = new BitmapImage();
            logo.BeginInit();
            logo.UriSource = calculator.IconImagePath;
            logo.EndInit();
            calculatorGridElement.IconImage.Source = logo;

            calculatorGridElement.OpenButtonClicked += HandleOpenCalcButtonClicked;

            // Add grid element
            calculatorGrid.Children.Add(calculatorGridElement);

        }

        /// <summary>
        /// This will be subscribed to the CalculatorGridElement.OpenButtonClicked event. Adds a new tab
        /// for the corresponding calculator the user wishes to open.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void HandleOpenCalcButtonClicked(object sender, EventArgs e) {
            Console.WriteLine("HandleOpenCalcButtonClicked() called with sender = " + sender.ToString() + " and e = " + e.ToString() + ".");

            // Work out what calculator was clicked on
            CalculatorGridElement calculatorGridElement = (CalculatorGridElement)sender;
            Console.WriteLine("Open was clicked on the \"" + calculatorGridElement.Title + "\" calculator grid element.");

            // Find calculator associated with the grid element
            Calculator foundCalc = this.calculatorTemplates.Find(x => x.Name == (string)calculatorGridElement.Title.Content);
            Console.WriteLine("Found calculator \"" + foundCalc.Name + "\" using the calculator grid element.");

            // We need to make a new calculator object here. Just adding foundCalc would result in all instances of the same calculator
            // being updated at the same time!!!
            Type type = foundCalc.GetType();
            // This next line creates a new object of the specific calculator type.
            // It relies of there being a public parameterless constructor
            // (which there should be for any specific calculator, which derives from the base calculator class)
            object o = Activator.CreateInstance(type);
            // Add this new calculator instance to the list of instances
            calculatorInstances.Add((Calculator)o);

            // Create a new tab
            var tabItem = new TabItem();
            tabItem.Header = calculatorGridElement.Title.Content;

            // Fill in the tab with the content from the found calculator. The View() method should return a base UI element
            // to fill in the tab (it will have many children)
            //tabItem.Content = foundCalc.GetView();
            tabItem.Content = calculatorInstances[calculatorInstances.Count - 1].GetView();

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

