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
using System.Globalization;

namespace NinjaCalc.Core.View {
    /// <summary>
    /// Interaction logic for CalcInfo.xaml
    /// </summary>
    public partial class CalcInfo : UserControl {
        public CalcInfo() {
            InitializeComponent();
        }
    }

    public class MultiplyConverter : IMultiValueConverter {
        public object Convert(object[] values, Type targetType, object parameter, CultureInfo culture) {
            double result = 1.0;
            for (int i = 0; i < values.Length; i++) {
                if (values[i] is double)
                    result *= (double)values[i];
            }

            return result;
        }

        public object[] ConvertBack(object value, Type[] targetTypes, object parameter, CultureInfo culture) {
            throw new Exception("Not implemented");
        }
    }
}
