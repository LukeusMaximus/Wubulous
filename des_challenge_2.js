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
        this.start = String.fromCharCode(0x00,0x11,0x22,0x33,0x44,0x55,0x00,0x00);
        this.result = "0," + this.convertToHex(this.start);
        this.keys_to_test = 0xffff;
        this.key = "";
    },
    
    "step":function() {
        for (var i = 0; i < 0x400; i++) {
            var current_key = this.next_key();
            this.key = current_key;
            var result=des(current_key,this.ciphertext,0,1,this.iv,1);
            //remove 16 bytes of "chaff"
            result = result.substring(0, result.length - 16);
            //fast fail on non-printable characters
            if(this.is_printable(result)) {
                this.result = "1," + this.convertToHex(this.start) + ',' + this.convertToHex(current_key) +  ',' + result;
            }
            this.count++;
        }
        safe_log("iteration = " + this.count + ", key = " + this.convertToHex(this.key));
    },

    "next_key":function() {
        var count_munge = this.count
        key = "";
        for(var i = 7; i >= 0; i--) {
            hex_pair = (this.start.charCodeAt(i) + count_munge) % 256;
            count_munge = count_munge >> 8;
            key = String.fromCharCode(hex_pair) + key;
        }
        return key;
    },

    "is_printable":function(result) {
        for (var i = 0; i < result.length; i++) {
            var char_code = result.charCodeAt(i);
            if(char_code < 32 || char_code >= 127) {
                return false;
            }
        }
        return true;
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

    "is_done":function() {
        if (this.count >= this.keys_to_test || this.result.charAt(0) == '1') {
            safe_log(this.convertToHex(this.key));
            return true;
        }
        return false;
    },
    
    "finish":function() {
        return this.result;
    },
    
    "save":function() {
        return {count:this.count, result:this.result};
    },
    
    "resume":function(dict) {
        this.count = dict.count;
        this.result = dict.result;
    }
}
