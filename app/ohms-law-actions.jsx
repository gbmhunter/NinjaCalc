 //!
//! @file               ohms-law-actions.js
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-02
//! @last-modified      2015-11-02
//! @brief              Contains the stats related "redux" actions for the NinjaTerm app.
//! @details
//!     See README.rst in repo root dir for more info.


//======================================================================//
//========================== setStartupTime() ==========================//
//======================================================================//

export var SET_CALC_WHAT = 'SET_CALC_WHAT';

//! @brief    Stores the current time as the start-up time in the app's state (used for stats).
export function setCalcWhat(variableName) {

  return (dispatch, getState) => {
    console.log('setCalcWhat() thunk called.');

    dispatch({
      type: SET_CALC_WHAT,
      variableName: variableName,
    });
  }
}