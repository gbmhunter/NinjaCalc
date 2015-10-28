//!
//! @file 			ohms-law.js
//! @author 		Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @edited 		n/a
//! @date 			2013-11-23
//! @last-modified	2015-06-14
//! @brief 			Ohms law calculator.
//! @details
//!		See the README in the repo's root dir for more info.

function ohmsLaw()
{
	this.calcWhat = ko.observable('resistance');
	
	this.voltage = new cc.variable({
		app: this,
		eqFn: function()
		{
			Log('Calculating voltage...');
			return this.current.val()*this.resistance.val();
		},
		units: [
			new cc.unit('mV', 0.001),
			new cc.unit('V', 1.0),
			new cc.unit('kV', 1000.0)
		],
		selUnitNum: 1,
		roundTo: 2,
		// state function to set as input/output
		stateFn: function(){
			Log('voltage state function called.');
			if(this.calcWhat() == 'voltage')
			{
				Log('voltage is output.');
				return cc.stateEnum.output;
			}
			else
			{
				Log('voltage is input.');
				return cc.stateEnum.input;
			}
		}
	});
	
	this.current = new cc.variable({
		app: this,
		eqFn: function(){
			Log('Calculating current...');
			return this.voltage.val()/this.resistance.val();
		},
		units: [
			new cc.unit('mA', 0.001),
			new cc.unit('A', 1.0),
			new cc.unit('kA', 1000.0)
		],
		selUnitNum: 1,
		roundTo: 2,
		// state function to set as input/output
		stateFn: function()
		{
			if(this.calcWhat() == 'current')
				return cc.stateEnum.output;
			else
				return cc.stateEnum.input;
		}
	});
	
	this.resistance = new cc.variable({
		app: this,
		eqFn: function(){
			Log('Calculating resistance...');
			Log('voltage.val() = ' + this.voltage.val());
			Log('current.val() = ' + this.current.val());
			return this.voltage.val()/this.current.val();
		},
		units: [
			new cc.unit('m\u2126', 0.001),
			new cc.unit('\u2126', 1.0),
			new cc.unit('k\u2126', 1000.0)
		],
		selUnitNum: 1,
		roundTo: 2,
		// state function to set as input/output
		stateFn: function(){
			if(this.calcWhat() == 'resistance')
				return cc.stateEnum.output;
			else
				return cc.stateEnum.input;
		}
	});	
}

// Register the calculator
cc.registerCalc(ohmsLaw, 'ohmsLaw');

