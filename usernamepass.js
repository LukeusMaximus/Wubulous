md5 = require("./md5");

function hash_username_password(user, pass)
{
    return md5.hex_md5(user.toLowerCase()+pass.toLowerCase());
}
exports.hashunp = hash_username_password
