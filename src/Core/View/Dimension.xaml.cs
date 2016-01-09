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

namespace NinjaCalc.Core.View {
    /// <summary>
    /// Interaction logic for Dimension.xaml
    /// </summary>
    public partial class Dimension : UserControl {

        public double Length {
            get { return (double)GetValue(LengthProperty); }
            set { SetValue(LengthProperty, value); }
        }

        // Using a DependencyProperty as the backing store for Property1.  This enables animation, styling, binding, etc...
        public static readonly DependencyProperty LengthProperty =
        DependencyProperty.Register("Length", typeof(double), typeof(Dimension), new UIPropertyMetadata(200.0));

        public Dimension() {
            InitializeComponent();            
        }
    }
}
