var radixtree = require('./radixtree'), fs = require('fs');
var artist = 'kanye';
var tree = radixtree(), listOfSongs;
function getFilePath(artist,songtitle){
	var result = [];
	result.push('./');
	result.push(artist);
	result.push('/lyrics/');
	result.push(songtitle);
	return result.join('');
};
// check folder
if (!fs.statSync('./kanye/lyrics').isDirectory())
	throw "./kanye/lyrics doesn't exist..."
// get list of files
listOfSongs = fs.readdirSync('./kanye/lyrics');
// insert words of each file with ext json into tree
listOfSongs.forEach(function(ele){
	if (/json$/.test(ele)) {
		var json = require(getFilePath(artist,ele));
		for (var index in json){
			if (String(index) === 'title' || String(index) === 'artist' || String(index) === 'album' || String(index) === 'feature')
				continue;
			var listOfWords = json[index].split(' ');
			for (var i = 0; i < listOfWords.length; ++i){
				var word = listOfWords[i].replace(/\W/,'').toLowerCase();
				if (/\w/.test(word))
					tree.insert(json.title,index,word);
			}
		}
	}
});
console.log(tree.find(process.argv[2]));
