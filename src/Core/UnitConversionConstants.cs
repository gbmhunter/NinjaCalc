using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NinjaCalc.Core {
    public static class UnitConversionConstants {

        public const double METERS_PER_INCH = 25.4 / 1000;
        public const double METERS_PER_MILS = METERS_PER_INCH / 1000.0;

        // Electronics -> PCB
        public const double COPPER_THICKNESS_M_PER_OZ = 0.0000350012;

    }
}
