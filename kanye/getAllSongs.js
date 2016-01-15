var request = require('request'), cheerio = require('cheerio'), getURL = require('./getUrl.js');
var MAX_PAGE = 52,i,time = 100;
var link = 'http://genius.com/artists/songs?for_artist_page=72&id=Kanye-west&page='
module.exports = function(){
	for (i = 1; i <= MAX_PAGE; ++i){
		// console.log(i + 'interation');
		request(link + String(i) + '&pagination=true',function(err,resp,html){
			if (err)
				return false;
			if (html == null)
				return false;
			var $ = cheerio.load(html);
			var songList = $('ul.song_list li').contents()
			// console.log(songList);
			for (var z = 0; z < songList.length; ++z){
				if (songList[z].type !== 'tag' && songList[z].name !== 'a')
					continue;
				if (songList[z].attribs && typeof songList[z].attribs.href === 'string' && songList[z].attribs.href)
					(function(link){
						setTimeout(function(){
							getURL(link);
						}, time);
						time += 50; // so its intervaled properly (not requesting too fast)
					})(songList[z].attribs.href);
			}
		});
	}
}
