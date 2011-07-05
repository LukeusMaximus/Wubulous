

//gets the hex encoded md5 of the password and username concatenated
//this is used to autenticate against the boinc server
function hash_username_password(user, pass)
{
    return hex_md5(pass+user.toLowerCase())
}
