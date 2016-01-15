var Node = function(){
	node = {};
	node.branches = {};
	// data should always be of array type filled with objects
	node.data = [];
	node.branchOut = function(letter){
		if (!letter)
			throw "You Must Enter a Letter to Branch Out";
		this.branches[letter] = Node();
	};
	return node;
}
var Tree = function(){
	tree = {};
	tree.root = Node()
	tree.insert = function(song,index,word){
		var obj = {};
		obj.song = song;
		obj.index = index;
		obj.word = word;
		var traveler = this.root;
		for (var i = 0; i < word.length; ++i){
			var letter = word[i];
			if (!traveler.branches[letter])
				traveler.branchOut(letter);
			traveler = traveler.branches[letter];
		}
		traveler.data.push(obj);
	};
	tree.find = function(word){
		var traveler = this.root;
		for (var i = 0; i < word.length; ++i){
			var letter = word[i];
			if (!traveler.branches[letter])
				return false;
			traveler = traveler.branches[letter];
		}
		return traveler.data;
	}
	return tree;
}
module.exports = Tree;