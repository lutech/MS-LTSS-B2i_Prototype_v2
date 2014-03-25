var DataStore = function (opts) {
	// Internal Properties
	var count = 0;
	this.data = {};
	var opts = opts ? opts : {};
	var colMeta = {};
	var colArr = {};
	var colArrIdx = [];
	var colArrKeys = [];
	var colKeyObj = {};
	var keyName = "";
	var keyMode;

	function getIdForObj(obj) {
		for (prop in obj) {
			if (obj.hasOwnProperty(prop) && prop.match(/id$/i)) {
				keyName = prop;
				return prop;
			}
		}
		return null;
	}

	this.contains = function (key) {
		if (this.data[key] == undefined) {
			if (keyMode == "count") {
				var i;
				for (i = 0; i < colArrKeys.length; i++) {
					if (this.data[colArrKeys[i]] == key) {
						return true;
					}
				}
			}
			return false;
		}

		return true;
	};

	this.add = function (item) {
	    var itemId;

	    if (!opts.autoKey) {
	      
	        if (item.id != undefined) {
	            itemId = item.id;
	        }
	        else {
	            var itemIdProp = getIdForObj(item);
	            itemId = itemIdProp != null ? item[itemIdProp] : null;
	        }
	    }

		if (itemId == null) {
			itemId = count + 1;
			keyMode = 'count';
		}

		this.addByKey(itemId, item);
	};

	this.addByKey = function (key, item) {
	    item.dsKey = key;
	    if (this.data[key] != undefined) {
			this.data[key] = item;
		}
		else {
			this.data[key] = item;
			colKeyObj[key] = key;
			colArr[count] = key;
			colArrIdx.push(count);
			colArrKeys.push(key);
			colMeta[key] = {
				arrIdx: count
			};


			++count;
		}

		return this.data[key];
	};

	this.getByValueKey = function (key) {
		if (colKeyObj[key] == undefined) {
			return undefined;
		}

		return this.get(colKeyObj[key]);
	};

	this.remove = function (key) {
		if (this.data[key] == undefined) {
			return undefined;
		}
		var deletedObj = this.data[key];
		var delArrIdx = colMeta[key].arrIdx;

		delete this.data[key];
		delete colMeta[key];
		delete colArr[delArrIdx];
		delete colKeyObj[deletedObj.id == undefined ? key : deletedObj.id];
		colArrKeys.splice(delArrIdx + 1, 1);
		colArrIdx.splice(delArrIdx + 1, 1);
		--count;
		return deletedObj;
	};

	this.removeAll = function () {
		for (key in this.data) {
			if (this.data.hasOwnProperty(key)) {
				var delArrIdx = colMeta[key].arrIdx;
				delete colArr[delArrIdx];
				delete colMeta[key];
				delete this.data[key];
			}
		}
		colArrIdx = [];
		count = 0;
	};

	this.removeAt = function (idx) {
		if (!colArrIdx[idx]) {
			return undefined;
		}

		var deletedObj = this.data[colArr[colArrIdx[idx]]];
		delete this.data[colArr[colArrIdx[idx]]];
		delete colMeta[colArr[colArrIdx[idx]]];
		delete colArr[colArrIdx[idx]];
		colArrIdx.splice(idx + 1, 1);
		count--;
		return deletedObj
	};

	this.getDataStore = function () {
		return {
			data: this.data,
			count: count,
			colMeta: colMeta,
			colArr: colArr,
			colArrIdx: colArrIdx
		};
	};

	this.get = function (key) {
		return this.data[key];
	};

	this.getKeys = function () {
		return colArrKeys;
	};

	this.getAll = function (conds) {
		if (count == 0) {
			return [];
		}

		var results = [];
		for (key in this.data) {
		    if (this.data.hasOwnProperty(key)) {
		        if (conds) {
		            var i;
		            var meetsConds = true;
		            for (i = 0; i < conds.length; i++) {
		                if (this.data[key][conds[i].field] != conds[i].value) {
		                    meetsConds = false;
		                    break;
		                }
		            }

		            if (meetsConds) {
		                results.push(this.data[key]);
		            }
		        }
		        else {
		            results.push(this.data[key]);
		        }
			}
		}

		return results;
	};

	this.getCount = function () {
		return count;
	};

	this.each = function (fn) {
		for (key in this.data) {
			if (this.data.hasOwnProperty(key)) {
				fn(this.data[key]);
			}
		}
	};

	this.eachSorted = function (fn, field, dir) {
		var sortedArr = this.getSorted(field, dir);
		var i;
		for (i = 0; i < sortedArr.length; i++) {
			fn(this.data[sortedArr[i][keyName]]);
		}
	};

	this.getAt = function (idx) {
		return this.data[colArr[colArrIdx[idx]]];
	};

	this.findByValue = function (item, value) {
		var results = [];
		for (key in this.data) {
		    if (this.data.hasOwnProperty(key)){
		        if (this.data[key][item] != undefined) {
		            if (this.data[key][item] == value) {
		                results.push(this.data[key]);
		            }
		        }
			}
		}
		return results.length > 0 ? results : [];
	};

	this.findByFn = function (fn) {
	    var results = [];
	    for (key in this.data) {
	        if (this.data.hasOwnProperty(key)) {
	            if (fn(this.data[key])) {
	                results.push(this.data[key]);
	            }
	        }
	    }

	    return results.length > 0 ? results : [];
	};

	function stringComparer(a, b, dir) {
		var leftStr;
		var rightStr;

		if (dir == undefined || dir == "ASC") {
			leftStr = a.toLowerCase();
			rightStr = b.toLowerCase();
		}
		else {
			leftStr = b.toLowerCase();
			rightStr = a.toLowerCase();
		}

		if (leftStr == rightStr) {
			return 0;
		}
		if (leftStr < rightStr) {
			return -1
		}
		if (leftStr > rightStr) {
			return 1
		}
		return 0;
	}

	function numComparer(a, b, dir) {
		if (dir == undefined || dir == "ASC") {
			return a - b;
		}
		else {
			return b - a;
		}
	}

	function dateComparer(a, b, dir) {
		var isDate = a instanceof Date
		if (dir == undefined || dir == "ASC") {
			if (isDate) {
				return a.getTime() - b.getTime();
			}
			else {
				return new Date(a).getTime() - new Date(b).getTime();
			}
		}
		else {
			if (isDate) {
				return b.getTime() - a.getTime();
			}
			else {
				return new Date(b).getTime() - new Date(a).getTime();
			}
		}
	}

	this.getSorted = function (field, dir, type, thenBy, thenByDir) {
		if (field == undefined || (dir != undefined && (dir != "ASC" && dir != "DESC"))) {
			return undefined;
		}

		function compare(a, b) {
			var compareFn;

			var sortType = type == undefined ? typeof a[field] : type
			switch (typeof sortType) {
				case "string":
					compareFn = stringComparer;
					break;
				case "date":
					compareFn = dateComparer;
					break;
				default:
					compareFn = numComparer;
			}

			return compareFn(a[field], b[field], dir);
		}

		function compareThenBy(a, b) {
			var compareFn;

			var sortType = type == undefined ? typeof a[field] : type
			switch (typeof sortType) {
				case "string":
					compareFn = stringComparer;
					break;
				case "date":
					compareFn = dateComparer;
					break;
				default:
					compareFn = numComparer;
			}
			return compareFn(a[thenBy], b[thenBy], thenByDir);
		}

		var arrData = this.getAll();

		if (arrData != undefined) {
			if (thenBy) {
				arrData.sort(function (a, b) {
					return compare(a, b) || compareThenBy(a, b);
				});
			}
			else {
				arrData.sort(compare);
			}
		}

		return arrData;
	};

	this.load = function (data, initFn) {
		var i;
		for (i = 0; i < data.length; i++) {
		    if (initFn) {
		        initFn(data[i]);
		    }
			this.add(data[i]);
		}
	}

	if (opts.data != undefined) {
		this.load(opts.data);
	}
}

function getFieldArrayFromObjArray( arr, field )
{
	var fieldArr = [];
	var i = 0;
	for( i = 0; i < arr.length; i++ ) {
		fieldArr.push(arr[i][field]);		
	}

	return fieldArr;
}