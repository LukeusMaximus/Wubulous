{
    "init":function() {
        this.ciphertext = String.fromCharCode(0x1d,0x49,0x50,0x87,0xa7,0x68,0xf5,0xac
        ,0xa6,0x63,0x4b,0x90,0xb0,0xfa,0x02,0xe9
        ,0x2f,0x12,0xc4,0x0f,0x5f,0x3f,0x07,0xc7
        ,0x04,0x72,0x76,0x64,0x0d,0x37,0xfa,0x20
        ,0x3e,0xae,0x18,0x39,0xc7,0x83,0x1d,0x11
        ,0xd4,0x87,0xa9,0x18,0x5e,0x72,0x3f,0x98
        ,0xa7,0x59,0x26,0xd6,0x21,0x45,0x10,0x7d
        ,0xeb,0xb3,0x46,0x2f,0x54,0x43,0x09,0xbf
        ,0x03,0x68,0x63,0xe3,0xd7,0x2c,0xf6,0x9d
        ,0x40,0xe2,0x65,0x76,0x3b,0xd6,0x6c,0x38);
        this.iv = String.fromCharCode(0x09,0xf0,0x04,0x15,0xc7,0xc3,0x6d,0x8e);
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
            hext += (text.charCodeAt(i).toString(16));
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