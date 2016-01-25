using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NinjaCalc.Core {

    public enum NumberPreference {
        NOT_DEFAULT,
        DEFAULT
    }

    /// <summary>
    /// Encapsulates a single unit that can be added to a numerical calculator variable as part of its units array.
    /// </summary>
    public class NumberUnit {

        /// <summary>
        /// The displayed name for this particular unit. Will be displayed in combobox.
        /// </summary>
        public string Name {
            get;
            set;
        }
        
        public double Multiplier {
            get;
            set;
        }

        private Func<double, double> modifierFunc;
        
        public NumberPreference Preference {
            get;
            set;
        }

        /// <summary>
        /// Simplist constructor for setting this unit as the default unit. Useful for units which are a direct multiple of the raw value (e.g. mm, cm, km).
        /// </summary>
        /// <param name="name">The display name for the unit. This will be displayed in the combobox.</param>
        /// <param name="multiplier">The is the value, which multiplied by the number in this particular unit, will give the number in SI units (e.g. the multiplier for mm is 1e-3).</param>
        public NumberUnit(string name, double multiplier, NumberPreference preference) {
            this.Name = name;
            this.Multiplier = multiplier;
            this.Preference = preference;
        }

        /// <summary>
        /// Simplist constructor for not setting this unit as the default unit. Useful for units which are a direct multiple of the raw value (e.g. mm, cm, km).
        /// </summary>
        /// <param name="name">The display name for the unit. This will be displayed in the combobox.</param>
        /// <param name="multiplier">The is the value, which multiplied by the number in this particular unit, will give the number in SI units (e.g. the multiplier for mm is 1e-3).</param>
        public NumberUnit(string name, double multiplier) {
            this.Name = name;
            this.Multiplier = multiplier;
            this.Preference = NumberPreference.NOT_DEFAULT;
        }

        /// <summary>
        /// Provides a string representation of a NumberUnit object.
        /// </summary>
        /// <returns>A string representation of a NumberUnit object.</returns>
        public override string ToString() {
            return this.Name;
        }

    }
}
