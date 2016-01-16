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

    public class NumberUnit {

        /// <summary>
        /// The displayed name for this particular unit. Will be displayed in combobox.
        /// </summary>
        public string Name {
            get;
            set;
        }

        private double multiplier;
        public double Multiplier {
            get {
                return this.multiplier;
            }
            set {
                this.multiplier = value;
            }
        }

        private Func<double, double> modifierFunc;

        private NumberPreference preference;
        public NumberPreference Preference {
            get {
                return this.preference;
            }
            set {
                this.preference = value;
            }
        }

        /// <summary>
        /// Simplist constructor for setting this unit as the default unit. Useful for units which are a direct multiple of the raw value (e.g. mm, cm, km).
        /// </summary>
        /// <param name="name"></param>
        /// <param name="multiplier"></param>
        public NumberUnit(string name, double multiplier, NumberPreference preference) {
            this.Name = name;
            this.multiplier = multiplier;
            this.preference = preference;
        }

        /// <summary>
        /// Simplist constructor for not setting this unit as the default unit. Useful for units which are a direct multiple of the raw value (e.g. mm, cm, km).
        /// </summary>
        /// <param name="name"></param>
        /// <param name="multiplier"></param>
        public NumberUnit(string name, double multiplier) {
            this.Name = name;
            this.multiplier = multiplier;
            this.preference = NumberPreference.NOT_DEFAULT;
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
