var request = require('request'), cheerio = require('cheerio'), fs = require('fs');
module.exports = function(songurl){
	request(songurl, function(err,resp,html){
		var newline = /^\s*\n+\s*$/, kanyeVerse = /\[Verse\s?\d?.* Kanye West\]|\[Verse\s?\d?\]|\[Kanye West\]|\[Produced by Kanye West\]/, verse = /\[.*\]/;
		var json = {}, count = 0;
		var validVerse = false;
		var $ = cheerio.load(html);
		var title = $('.song_header-primary_info h1').first().text();
		var artist = $('.song_header-primary_info h2').first().text();
		var album = $('song-primary-album .song_header-primary_info-additional_data a').first().text();
		var feature = $('additional-artists .song_header-primary_info-additional_data a').contents(); // will be false if kanye west not featured
		if (!feature.length)
			feature = false;
		else {
			for (var i = 0; i < feature.length; ++i){
				if (feature[i].data === 'Kanye West')
					feature = 'Kanye West';
					break;
			}
			if (feature !== 'Kanye West')
				feature = false;
		}
		json.title = title;
		json.artist = artist;
		json.album = album;
		json.feature = feature;

		if (artist !== 'Kanye West' && feature !== 'Kanye West')
			return false; // kanye has to have a part 

		var obj = $('.lyrics p').contents();

		for (var index = 0; index < obj.length; ++index){
			var that = obj[index];
			if (that.type === 'text' && !newline.test(that.data)){
				if (kanyeVerse.test(that.data))
					validVerse = true;
				else if (verse.test(that.data))
					validVerse = false;
				else
					if (validVerse)
						// console.log(that.data);
						json[count++] = that.data.replace(/\n/g,'');
			}
			if (that.type === 'tag' && that.name === 'a'){
				that.children.forEach(function(element){
					if (element.type === 'text'){
						if (kanyeVerse.test(element.data))
							validVerse = true;
						else if (verse.test(element.data))
							validVerse = false;
						else
							if (validVerse)
								// console.log(element.data);
								json[count++] = element.data.replace(/\n/g,'');
					}
				});
			}
		}
		
		if (!count)
			return false; // kanye didn't say anything (relevent), so no file.
		
		fs.writeFile('./lyrics/' + title + '.json', JSON.stringify(json),function(e){
			console.log(title + " has been done SUCCESSly");
		});
	});
}


