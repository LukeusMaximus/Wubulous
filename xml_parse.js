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

/*
Returns true if the server has given the client work,
returns false otherwise
*/
function has_work(xml)
{
    return (xml.getElementsByTagName("file_info").length > 0)
}

/**
 * Returns the host id if it exists
 * returns null otherwise
 */
function get_host_id_from_scheduler_request(xml)
{
    if(xml.getElementsByTagName("hostid").length == 0)
    {
        return null;
    }
    else
    {
        var e = xml.getElementsByTagName("hostid")[0];
        return e.childNodes[0].nodeValue;
    }
    return 
}
