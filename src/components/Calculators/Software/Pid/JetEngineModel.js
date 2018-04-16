/* eslint-disable */
export class JetEngineModel {

    constructor(fuelConstant, dragConstant, maxAccel_radPss) {        
        this.fuelConstant = fuelConstant
        this.dragConstant = dragConstant
        this.maxAccel_radPss = maxAccel_radPss
        this.rotVel_radPs = 0.0

        this.lastUpdateTime_s = 0.0
    }

    update(fuelFlow_lPmin, timeStep_s) {
        console.log('JetEngineModel.update() called with fuelFlow_lPmin = ' + fuelFlow_lPmin + ', timeStep_s = ' + timeStep_s + '.')        

        // Ffuel - Fdrag = ma
        let rotAccel_radPss = this.fuelConstant*fuelFlow_lPmin + this.dragConstant*Math.pow(this.rotVel_radPs, 1)
        console.log('rotAccel_radPss = ' + rotAccel_radPss)

        if(rotAccel_radPss > this.maxAccel_radPss)
            rotAccel_radPss = this.maxAccel_radPss
        else if(rotAccel_radPss < -this.maxAccel_radPss)
            rotAccel_radPss = -this.maxAccel_radPss
        
        let changeInRotVel_radPs = rotAccel_radPss * timeStep_s
        // console.log('changeInRotVel = ' + changeInRotVel)

        this.rotVel_radPs = this.rotVel_radPs + changeInRotVel_radPs        
    }

    getRotVel_radPs() {
        return this.rotVel_radPs
    }

}
/* eslint-enable */
