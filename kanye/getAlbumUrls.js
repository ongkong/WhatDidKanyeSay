var request = require('request'), cheerio = require('cheerio'), getURL = require('./getUrl.js');
function getAlbumUrl(albumurl){
	request(albumurl, function(err,resp,html){
		var $ = cheerio.load(html);
		var list = $('ul.song_list li').contents();
		for (var index in list){
			var obj = list[index];
			if (obj.type !== 'tag')
				continue;
			if (obj.name !== 'a')
				continue;
			getURL(obj.attribs.href);
		}
	});
};

module.exports = function(albums){
	albums.forEach(function(ele){
		getAlbumUrl(ele);
	});
}
