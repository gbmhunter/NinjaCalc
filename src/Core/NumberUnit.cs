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

    class NumberUnit {

        private string name;
        private double multiplier;
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
            this.name = name;
            this.multiplier = multiplier;
            this.preference = preference;
        }

        /// <summary>
        /// Simplist constructor for not setting this unit as the default unit. Useful for units which are a direct multiple of the raw value (e.g. mm, cm, km).
        /// </summary>
        /// <param name="name"></param>
        /// <param name="multiplier"></param>
        public NumberUnit(string name, double multiplier) {
            this.name = name;
            this.multiplier = multiplier;
            this.preference = NumberPreference.NOT_DEFAULT;
        }

        /// <summary>
        /// Provides a string representation of a NumberUnit object.
        /// </summary>
        /// <returns>A string representation of a NumberUnit object.</returns>
        public override string ToString() {
            return this.name;
        }

    }
}
