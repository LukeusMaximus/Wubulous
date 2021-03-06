{
    "init":function() {
        this.ciphertext = String.fromCharCode(0xbd,0x0d,0xde,0x91,0x99,0x60,0xb8,0x8a,0x47,0x9c,0xb1,0x5c,0x23,0x7b,0x81,
       0x18,0x99,0x05,0x45,0xbc,0xde,0x82,0x01,0xab,0x53,0x4d,0x6f,0x1c,0xb4,0x30,
       0x63,0x3c,0xee,0xcd,0x96,0x2e,0x07,0xc6,0xe6,0x95,0x99,0x9c,0x96,0x46,0x5a,
       0x95,0x70,0x02,0x02,0x70,0x98,0xbd,0x41,0xc2,0x88,0xa9,0xf0,0x2f,0x8b,0xe5,
       0x48,0x20,0xd2,0xa8,0xa0,0x6b,0xbf,0x93,0xde,0x89,0xf6,0xe2,0x52,0xfd,0x8a,
       0x25,0xeb,0xd0,0x7d,0x96,0x83,0xee,0xa4,0x2d,0xc8,0x8d,0x1b,0x71);
        this.iv = String.fromCharCode(0xda,0x4b,0xbe,0xf1,0x6b,0x6e,0x98,0x3d);
        this.count = 0;
        this.results = [];
    },

    "step":function() {
        var current_key = this.generateRandKey();
        var this_result=des(current_key,this.ciphertext,0,1,this.iv,1);
        this_result = this_result.substring(0, this_result.length - 16);
        this.results.push(this.convertToHex(current_key) + ',' + this.convertToHex(this_result));
        this.count++;
    },

    "convertToHex":function(text) {
        var hext = "";
        for(var i = 0; i < text.length; i++) {
            charHex = text.charCodeAt(i).toString(16);
            while(charHex.length < 2) {
                charHex = '0' + charHex;
            }
            hext += charHex;
        }
        return hext;
    },

    "generateRandKey":function() {
        var key = "";
        for(var i = 0; i < 8; i++) {
            key += String.fromCharCode(Math.floor(Math.random() * 256));
        }
        return key;
    },

    "is_done":function() {
        if (this.count >= 256) {
            return true;
        }
        return false;
    },
    
    "finish":function() {
        return this.results.join('\n');
    },
    
    "save":function() {
        return {count:this.count, results:this.results};
    },
    
    "resume":function(dict) {
        this.count = dict.count;
        this.results = dict.results;
    }
}
