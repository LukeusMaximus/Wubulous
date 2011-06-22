
function hash_username_password(user, pass)
{
    return hex_md5(pass+user.toLowerCase())
}
