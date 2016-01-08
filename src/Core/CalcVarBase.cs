using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NinjaCalc.Core {
    public class CalcVarBase {

        public String Name {
            get;
            set;
        }

        /// <summary>
        /// Use this to listen and act on the raw value being read from this calculator variable.
        /// </summary>
        public event EventHandler RawValueRead;

        protected virtual void OnRawValueRead(EventArgs e) {
            EventHandler handler = RawValueRead;
            if (handler != null) {
                handler(this, e);
            }
        }

        /// <summary>
        /// Designed to be assigned to when Calculator.CalculateDependencies() is run. This is not calculated in this class's constructor,
        /// but rather once all calculator variables and their equations have been added to the calculator.
        /// </summary>
        public List<CalcVarBase> Dependencies {
            get;
            set;
        }

        /// <summary>
        /// Designed to be assigned to when Calculator.CalculateDependencies() is run. This is not calculated in this class's constructor,
        /// but rather once all calculator variables and their equations have been added to the calculator.
        /// </summary>
        public List<CalcVarBase> Dependants {
            get;
            set;
        }

        /// <summary>
        /// Set to true to disable the updating of the text box when this CalcVar's Calculate() method
        /// is called.
        /// </summary>
        public bool DisableUpdate {
            get;
            set;
        }

        /// <summary>
        /// Gets and sets the equation function which is used to calculate the value
        /// of this calculator variable when it is an output.
        /// </summary>
        public Func<double> Equation {
            get;
            set;
        }

        public virtual Direction_t Direction {
            get;
            set;
        }

        public virtual void Calculate() {
            // Default implementation is to just return
            // (and do nothing)
            Console.WriteLine("WARNING: BaseCalcVar.Calculate() called, this is an empty function.");
            return;
        }



        public CalcVarBase(string name, Func<double> equation) {
            this.Name = name;

            this.Dependencies = new List<CalcVarBase>();
            this.Dependants = new List<CalcVarBase>();

            this.Equation = equation;
        }
        

        public void ForceDependantOutputsToRecalculate() {
            Console.WriteLine("ForceDependantOutputsToRecalculate() called.");
            // We need to re-calculate any this calculator variables dependants, if they are outputs
            for (int i = 0; i < this.Dependants.Count; i++) {
                if (this.Dependants[i].Direction == Direction_t.Output) {
                    this.Dependants[i].Calculate();
                }
            }
        }

    }
}
