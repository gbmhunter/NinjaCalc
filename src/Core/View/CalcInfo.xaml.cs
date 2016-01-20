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
// Markup is so ContentProperty works correctly
using System.Windows.Markup;
using System.Windows.Interactivity;

namespace NinjaCalc.Core.View {

    // Used on sub-controls of an expander to bubble the mouse wheel scroll event up 
    public sealed class BubbleScrollEvent : Behavior<UIElement> {
        protected override void OnAttached() {
            base.OnAttached();
            AssociatedObject.PreviewMouseWheel += AssociatedObject_PreviewMouseWheel;
        }

        protected override void OnDetaching() {
            AssociatedObject.PreviewMouseWheel -= AssociatedObject_PreviewMouseWheel;
            base.OnDetaching();
        }

        void AssociatedObject_PreviewMouseWheel(object sender, MouseWheelEventArgs e) {
            e.Handled = true;
            var e2 = new MouseWheelEventArgs(e.MouseDevice, e.Timestamp, e.Delta);
            e2.RoutedEvent = UIElement.MouseWheelEvent;
            AssociatedObject.RaiseEvent(e2);
        }
    }


    /// <summary>
    /// Interaction logic for CalcInfo.xaml
    /// </summary>
    [ContentProperty("Children")]
    public partial class CalcInfo : UserControl {

        //===============================================================================================//
        //====================================== FIELDS/PROPERTIES ======================================//
        //===============================================================================================//

        //========== SUPPORT FOR CHILDREN ==========//

        public static readonly DependencyPropertyKey ChildrenProperty = DependencyProperty.RegisterReadOnly(
            "Children",
            typeof(UIElementCollection),
            typeof(CalcInfo),
            new PropertyMetadata());

        public UIElementCollection Children {
            get { return (UIElementCollection)GetValue(ChildrenProperty.DependencyProperty); }
            private set { SetValue(ChildrenProperty, value); }
        }

        //===============================================================================================//
        //======================================== CONSTRUCTORS =========================================//
        //===============================================================================================//

        public CalcInfo() {
            InitializeComponent();

            // Add children to the correct element in the UI.
            Children = ChildrenHost.Children;
        }

       

    }

    /// <summary>
    /// Code behind for "slide out" animation support for the Expander UI element (so the info can
    /// be expanded/collapsed with smooth animation)
    /// </summary>
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
