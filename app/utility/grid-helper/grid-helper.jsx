//!
//! @file               grid-helper.jsx
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-12-05
//! @last-modified      2015-12-07
//! @brief              
//! @details
//!     See README.rst in repo root dir for more info.

'use strict';

//=========== npm MODULES ==========//


//! @brief 		Shows items in gridElements which are children of category path, and hides all others, by setting the "filtered" property.
//! @param 		gridElements    An array of the elements displayed in the grid view. This function requires each element
//! 							to have "name" and "categoryPath" parameters. The "filtered" property on each element will be
//! 							modified directly.
//! @param 		categoryPath 	categoryPath should be an array of strings in the form ['root', 'Electronics', 'Basic'].
//! @returns 	Nothing, modifies gridElements directly.
export function filter(gridElements, categoryPath) {
	console.log('gridHelper.filter() called with gridElements =');
	console.log(gridElements);
	console.log('and categoryPath =');
	console.log(categoryPath);
	// We need to set the false parameter on every gridElement which is not in the categoryPath
	for(var i = 0; i < gridElements.length; i++) {

		// We need to check whether the grid element's category path belongs to the
		// provided category path.
		var newCategoryPath = categoryPath.slice();
		//console.log('newCategoryPath = ');
		//console.log(newCategoryPath);

		// Now remove the 'root' element from path
		newCategoryPath.shift();
		//console.log('newCategoryPath.shift() =');
		//console.log(newCategoryPath);

		if(isInPath(gridElements[i].categoryPath, newCategoryPath)) {
			// This gird element belongs to the selected category path, let's make sure it's shown
			// in the grid view
			//console.log('gridElement ' + gridElements[i].name + ' is in the categoryPath, making visible.');
			gridElements[i].filtered = false;
		} else {
			// This gird element does not belong to the selected category path, let's hide it.
			//console.log('gridElement ' + gridElements[i].name + ' is NOT in the categoryPath, hiding.');
			gridElements[i].filtered = true;
		}

	}

}

//! @brief 		Checks to see if categoryPath1 is the same OR a child path of categoryPath2.
//! @details	If categoryPath2 is empty, then isInPath() will return true.
//! @param 		categoryPath1 		The category path that is under investigation.
//! @param 		categoryPath2       The category path that we want to see if categoryPath1 belongs to.
//! @returns 	True is categoryPath1 is equal or a child of categoryPath2, otherwise false.
function isInPath(categoryPath1, categoryPath2) {
	//console.log('gridHelper.isInPath() called with categoryPath1 =');
	//console.log(categoryPath1);
	//console.log('and categoryPath2 =');
	//console.log(categoryPath2);

	// We need to check to make sure that every string element in the reference category path
	// is present in the category path under investigation.
	for (var i = 0; i < categoryPath2.length; i++) {
		//console.log('Comparing \"' + categoryPath1[i] + '\" with \"' + categoryPath2[i] + '\".');
		if(categoryPath1[i] != categoryPath2[i]) {
			return false;
		}
	}

	// If we made it here, all elements in categoryPath2 are in categoryPath1,
	// and so it passed!
	return true;
}