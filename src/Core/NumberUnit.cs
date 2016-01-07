using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NinjaCalc.Core {
    class NumberUnit {

        private string name;
        private double multiplier;
        private Func<double, double> modifierFunc;

        /// <summary>
        /// Simplist constructor. Useful for units which are a direct multiple of the raw value (e.g. mm, cm, km).
        /// </summary>
        /// <param name="name"></param>
        /// <param name="multiplier"></param>
        public NumberUnit(string name, double multiplier) {
            this.name = name;
            this.multiplier = multiplier;
        }

    }
}
