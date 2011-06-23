/*
Returns and object of the form {err_code, msg}
Where err_code is 0 only if the auth was valid
msg contains the authentificator if it was valid
and an error message if it wasn't
*/
function is_valid_auth(xml)
{
    errcode = xml.getElementsByTagName("error_num");
    if(errcode.length == 0)
    {
        //No errors, return 0 and authenificator
        return {err_code:0, msg:xml.getElementsByTagName("authenticator")[0].childNodes[0].nodeValue}
    }
    else
    {
        //Error occurred, return error code and error message
        return {err_code:xml.getElementsByTagName("error_num")[0].childNodes[0].nodeValue, 
                msg:xml.getElementsByTagName("error_msg")[0].childNodes[0].nodeValue}
    }
}
