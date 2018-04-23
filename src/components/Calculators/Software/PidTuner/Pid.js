/* eslint-disable */

"use strict";

export const IntegralLimitModes = {
    NONE: 'None',
    CONSTANT_LIMITED: 'Constant Limited',
    OUTPUT_LIMITED: 'Output Limited'
};

export class Pid {
    constructor(pConstant, iConstant, dConstant) {
        this.pConstant = pConstant
        this.iConstant = iConstant
        this.dConstant = dConstant        

        this.setPoint = 0.0
        this.iValue = 0.0
        this.previousError = 0.0

        // Integral limiting (default to OFF)
        this.integralLimitSettings = {}
        this.integralLimitSettings.mode = IntegralLimitModes.NONE

        // Output limiting (default to OFF)
        this.enableOutputLimiting = false
        this.outputLimMin = 0.0
        this.outputLimMax = 0.0        
    }

    setSetPoint(value) {
        // console.log('setSetPoint() called. value = ' + value)
        this.setPoint = value
    }

    setConstants(pConstant, iConstant, dConstant) {
        console.log('setConstants() called. pConstant = ' + pConstant + ', iConstant = ' + iConstant + ', dConstant = ' + dConstant)
        this.pConstant = pConstant
        this.iConstant = iConstant
        // We also need to reset the integated value
        // (latent integral could remain if iConstant is changed from non-zero to zero)
        this.iValue = 0.0
        this.dConstant = dConstant
    }

    setOutputLimits(enabled, min, max) {
        this.enableOutputLimiting = enabled
        this.outputLimMin = min
        this.outputLimMax = max        
    }

    setIntegralLimit(options) {
        console.log('setIntegralLimit() called with settings = ')
        console.log(options)
        if(options.mode === IntegralLimitModes.CONSTANT_LIMITED) {
            if(!options.hasOwnProperty('min') || !options.hasOwnProperty('max'))
                throw new Error('Provided options must have min and max property when mode === CONSTANT_LIMITED.')

            if(typeof options.min !== 'number' || typeof options.max !== 'number')
                throw new Error('Provided options.min and options.max must both be numbers.')
        } else if(options.mode === IntegralLimitModes.OUTPUT_LIMITED) {
            // Output limiting has to be enabled for this mode to work
            if(!this.enableOutputLimiting)
                throw new Error('Integral limiting set to OUTPUT_LIMITED but output limiting is not enabled.')
        } 

        this.integralLimitSettings = options
    }

    run(currentValue, deltaTime_s) {  
        
        console.log('Pid.run() called. currentValue = ' + currentValue + ', deltaTime_s = ' + deltaTime_s)

        // Error positive if we need to "go forward"
        const error = this.setPoint - currentValue
        console.log('error = ' + error)

        // Porportional control
        const pValue = error * this.pConstant
        // console.log('pValue = ' + pValue)

        // Integral control
        this.iValue += error*deltaTime_s*this.iConstant
        // console.log('iValue (before limiting) = ' + this.iValue)

        // Limit integral control
        // console.log('this.integralLimitSettings =')
        // console.log(this.integralLimitSettings)
        if(this.integralLimitSettings.mode === IntegralLimitModes.CONSTANT_LIMITED) {
            // console.log('Limiting integral term with constant.')
            if(this.iValue > this.integralLimitSettings.max)
                this.iValue = this.integralLimitSettings.max
            else if(this.iValue < this.integralLimitSettings.min)
                this.iValue = this.integralLimitSettings.min
        }

        // console.log('iValue (after limiting) = ' + this.iValue)

        // Derivative control
        const deltaError = error - this.previousError
        console.log('deltaError = ' + deltaError)

        const errorDerivative = deltaError/deltaTime_s
        console.log('errorDerivative = ' + errorDerivative)

        const dValue = errorDerivative*this.dConstant
        console.log('dValue = ' + dValue)

        let output = pValue + this.iValue + dValue 
        // console.log('output = ' + output)

        this.previousError = error

        // Limit output if output limiting is enabled
        if(this.enableOutputLimiting) {
            if(output > this.outputLimMax) {
                // console.log('Desired output is above max. limit.')
                if(this.integralLimitSettings.mode === IntegralLimitModes.OUTPUT_LIMITED) {
                    this.limitIntegralTerm(output)                                        
                }
                output = this.outputLimMax
            } else if(output < this.outputLimMin) {
                // console.log('Desired output (' + output + ') is below min. limit (' + this.outputLimMin + '.')
                if(this.integralLimitSettings.mode === IntegralLimitModes.OUTPUT_LIMITED) {
                    this.limitIntegralTerm(output)                                        
                }
                output = this.outputLimMin
            }
        }

        // Save the calculated P, I, D and output values, as the user may want to 
        // inspect these by calling getLastTerms()
        this.lastTerms = {
            p: pValue,
            i: this.iValue,
            d: dValue,
            output: output
        }

        // console.log('output =')
        // console.log(output)
        return output

    }

    getLastTerms () {
        return this.lastTerms
    }

    limitIntegralTerm(output) {
        // console.log('limitIntegralTerm() called. output = ' + output)
        // console.log('iValue (before limiting) = ' + this.iValue)
        if(output > this.outputLimMax) {                       
            let difference = output - this.outputLimMax
            // console.log('output - outputLimMax = ' + difference)
            if(this.iValue > 0.0)
                // Reduce I value, but make sure it doesn't go negative!
                this.iValue = Math.max(this.iValue - difference, 0)                    
        } else if(output < this.outputLimMin) {
            let difference = output - this.outputLimMin
            // console.log('output - outputLimMin = ' + difference)
            if(this.iValue < 0.0)
                // Increase I value, but make sure it doesn't go positive!
                this.iValue = Math.min(this.iValue - difference, 0)  
        }     
        // console.log('iValue (after limiting) = ' + this.iValue)   
    }

    reset () {
        this.pConstant = 0.0    
        this.iConstant = 0.0                
        this.iValue = 0.0
        this.dConstant = 0.0

        this.lastTerms = {}
        this.previousError = 0.0

        this.enableOutputLimiting = false
    }
}
/* eslint-enable */
