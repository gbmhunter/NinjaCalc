using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NinjaCalc.Core {
    public class BaseCalcVar {

        private String name;

        public String Name {
            get {
                return name;
            }
            set {
                name = value;
            }
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

        protected List<BaseCalcVar> dependencies;

        /// <summary>
        /// Designed to be assigned to when Calculator.CalculateDependencies() is run. This is not calculated in this class's constructor,
        /// but rather once all calculator variables and their equations have been added to the calculator.
        /// </summary>
        public List<BaseCalcVar> Dependencies {
            get {
                return this.dependencies;
            }
            set {
                this.dependencies = value;
            }
        }

        protected List<BaseCalcVar> dependants;

        /// <summary>
        /// Designed to be assigned to when Calculator.CalculateDependencies() is run. This is not calculated in this class's constructor,
        /// but rather once all calculator variables and their equations have been added to the calculator.
        /// </summary>
        public List<BaseCalcVar> Dependants {
            get {
                return this.dependants;
            }
            set {
                this.dependants = value;
            }
        }

        private bool disableUpdate;

        /// <summary>
        /// Set to true to disable the updating of the text box when this CalcVar's Calculate() method
        /// is called.
        /// </summary>
        public bool DisableUpdate {
            get {
                return this.disableUpdate;
            }
            set {
                this.disableUpdate = value;
            }
        }

        private Func<double> equation;
        /// <summary>
        /// Gets and sets the equation function which is used to calculate the value
        /// of this calculator variable when it is an output.
        /// </summary>
        public Func<double> Equation {
            get {
                return this.equation;
            }
            set {
                this.equation = value;
            }
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

        public BaseCalcVar(string name, Func<double> equation) {
            this.Name = name;

            this.Dependencies = new List<BaseCalcVar>();
            this.Dependants = new List<BaseCalcVar>();

            this.Equation = equation;
        }

    }
}
