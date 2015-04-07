/**
 * https://gist.github.com/myaumyau/4975024#file-numreftostring-js-L6-L10
 * [js]数値文字参照(16進数, 10進数)を文字列に変換
 * */
exports.decNumRefToString = function(decNumRef) {
	return decNumRef.replace(/&#(\d+);/ig, function(match, $1, idx, all) {
		return String.fromCharCode($1);
	});
}

/**
 * http://www.hoge256.net/2007/08/64.html
 * 日付の妥当性チェック
 * */
exports.checkDate = function(year, month, day) {
    var dt = new Date(year, month - 1, day);
    if(dt == null || dt.getFullYear() != year || dt.getMonth() + 1 != month || dt.getDate() != day) {
        return false;
    }
    return true;
}
