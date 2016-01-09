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

namespace NinjaCalc.Core.View {

    /// <summary>
    /// Used to set the margins for a child elements of a WPF panel object, in XAML.
    /// XAML Syntax: 
    ///     <StackPanel local:Core.MarginSetter.Margin="10"/>
    /// for any panel element.
    /// </summary>
    public class MarginSetter {
        public static Thickness GetMargin(DependencyObject obj) {
            return (Thickness)obj.GetValue(MarginProperty);
        }

        public static void SetMargin(DependencyObject obj, Thickness value) {
            obj.SetValue(MarginProperty, value);
        }

        // Using a DependencyProperty as the backing store for Margin.  This enables animation, styling, binding, etc...
        public static readonly DependencyProperty MarginProperty =
            DependencyProperty.RegisterAttached("Margin", typeof(Thickness), typeof(MarginSetter), new UIPropertyMetadata(new Thickness(), MarginChangedCallback));

        public static void MarginChangedCallback(object sender, DependencyPropertyChangedEventArgs e) {
            // Make sure this is put on a panel
            var panel = sender as Panel;

            if (panel == null) return;

            panel.Loaded += new RoutedEventHandler(panel_Loaded);

        }

        static void panel_Loaded(object sender, RoutedEventArgs e) {
            var panel = sender as Panel;

            // Go over the children and set margin for them:
            foreach (var child in panel.Children) {
                var fe = child as FrameworkElement;

                if (fe == null) continue;

                fe.Margin = MarginSetter.GetMargin(panel);
            }
        }

    }
}
