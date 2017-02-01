var casper = require("casper").create();
var fs = require('fs');
var url = "https://syllabus.doshisha.ac.jp/html/2016/21/121002000.html";

/**
 *		divide
 * 		配列をnで指定した数に分割する
 *
 * 		@param { array } ary
 * 		@param { int } n
 * 		@return { array } results
 */
function divide(ary,n){
	var idx = 0;
 	var results = [];
 	var length = ary.length;

  	while (idx + n < length){
  		var result = ary.slice(idx, idx + n);
  		results.push(result);
  		idx = idx + n;
  	}

  	var rest = ary.slice(idx, length+1);
  	results.push(rest);
  	return results;
}

/**
 *		getTableData
 * 		評価基準が入ったテーブルデータを取得する
 *
 * 		@return { array } res
 */
function getTableData(){
	var
		res = null,
		p = document.querySelectorAll("p");

	for(var i = 0; i < p.length; i++){
	  if(p[i].innerHTML.match(/成績評価基準/)){
	  	res = p[i].nextElementSibling;
	  }
	}

	return res;
}

/**
 *		converter
 * 		不要な文字列を削除し、改行ごとに配列に格納する
 *
 * 		@param { array } table
 * 		@return { array } table
 */
function converter(table){
	table = table.textContent.trim();
	table = table.replace(/\n+/g,"\n");
	table = table.replace(/%/g,"");
	table = table.split("\n");

	for(var i = 0; i < table.length; i++){
		table[i] = table[i].trim();
	}

	return table;
}

/**
 *		fileExport
 * 		ファイルにデータを書き込む
 *
 * 		@param { string } path
 * 		@param { array } data
 */
function fileExport(path, data){
	try {
		fs.write(path, data, "w");
	} catch(err) {
	    throw new Error(err);
	}
}

casper.start(url,function(){
	var table = this.evaluate(getTableData);
	var data = divide(converter(table),3);
	fileExport('./data.csv', data.join('\n'));
});

casper.run();
