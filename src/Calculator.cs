using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

namespace NinjaCalc
{
    /// <summary>
    /// Base calculator class. Designed to be inherited by actual calculator implementations.
    /// </summary>
    public abstract class Calculator
    {
        private string name;

        /// <summary>
        /// The name of the calculator. This is shown in the "choose calculator" grid.
        /// </summary>
        public string Name
        {
            get
            {
                return name;
            }
            set
            {
                name = value;
            }
        }

        private string description;

        /// <summary>
        /// A description of the calculator. Can be many lines of text. This is shown in the "choose calculator" grid.
        /// </summary>
        public string Description
        {
            get
            {
                return description;
            }
            set
            {
                description = value;
            }
        }

        /// <summary>
        /// Constructor for calculator.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="description"></param>
        public Calculator(string name, string description)
        {            
            this.name = name;
            this.description = description;
        }

        /// <summary>
        /// This needs to return a Grid which contains the calculators view. The Grid element will be inserted on the
        /// empty tab when a new instance of the calculator is created. 
        /// </summary>
        /// <returns></returns>
        public abstract Control GetView();
    }
}
