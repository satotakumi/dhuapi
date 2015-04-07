/**
 * https://gist.github.com/myaumyau/4975024#file-numreftostring-js-L6-L10
 * [js]数値文字参照(16進数, 10進数)を文字列に変換
 * */

exports.decNumRefToString = function(decNumRef) {
	return decNumRef.replace(/&#(\d+);/ig, function(match, $1, idx, all) {
		return String.fromCharCode($1);
	});
}