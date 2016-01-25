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

namespace NinjaCalc
{
    /// <summary>
    /// Interaction logic for CalculatorGridElement.xaml
    /// </summary>
    public partial class CalculatorGridElement : UserControl
    {

        /// <summary>
        /// Fired when the "Open" button is clicked on the calculator grid element.
        /// </summary>
        public event EventHandler OpenButtonClicked;

        public CalculatorGridElement()
        {
            InitializeComponent();

            // Add handler to "Open" button click
            ButtonOpen.Click += ButtonOpen_Click;
        }

        private void ButtonOpen_Click(object sender, RoutedEventArgs e)
        {
            Console.WriteLine("ButtonOpen_Click() called.");

            // Create a new tab, and display the calculator to the user
            OnRaiseOpenButtonClicked(new EventArgs());
        }

        // Wrap event invocations inside a protected virtual method
        // to allow derived classes to override the event invocation behavior
        protected virtual void OnRaiseOpenButtonClicked(EventArgs e)
        {
            // Make a temporary copy of the event to avoid possibility of
            // a race condition if the last subscriber unsubscribes
            // immediately after the null check and before the event is raised.
            EventHandler handler = OpenButtonClicked;

            // Event will be null if there are no subscribers
            if (handler != null)
            {
                // Format the string to send inside the CustomEventArgs parameter
                //e.Message += String.Format(" at {0}", DateTime.Now.ToString());

                // Use the () operator to raise the event.
                handler(this, e);
            }
        }
    }
}
