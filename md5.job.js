{
    "alphabet": "abcdefghijklmnopqrstuvwxyz",
    "nhashes": 1024,
    "hashes": [],
    "init": function() {
        this.n = 0;
    },

    "step": function() {
        var string = ""
        for (var i = 0; i < 10; i++) {
            var randomnumber = Math.floor(Math.random()*27)
            if (randomnumber < 26) string += this.alphabet[randomnumber]
        }
        
        
        this.compute_hash(string);
        this.n += 1
    },

    "compute_hash": function(source) {
        var hash = hex_md5(source);
        this.hashes.push(source + "," + hash)
    },

    "is_done": function() {
        return this.n >= this.nhashes
    },

    "finish": function() {
        var result = ""
        for (var hash in this.hashes) {
            if (this.hashes.hasOwnProperty(hash)) {
                result += this.hashes[hash] + "\n"
            }
        }

        return result
    },

    "save": function () {
        return {}
    },

    "resume": function(dict) {

    },

}
