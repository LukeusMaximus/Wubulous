/**
 * Returns and object of the form {err_code, msg}
 * Where err_code is 0 only if the auth was valid
 * msg contains the authentificator if it was valid
 * and an error message if it wasn't
 */
function is_valid_auth(xml) {
    errcode = xml.getElementsByTagName("error_num");
    if(errcode.length == 0) {
        //No errors, return 0 and authenificator
        return {err_code:0, msg:xml.getElementsByTagName("authenticator")[0].childNodes[0].nodeValue}
    } else {
        //Error occurred, return error code and error message
        return {err_code:xml.getElementsByTagName("error_num")[0].childNodes[0].nodeValue, 
                msg:xml.getElementsByTagName("error_msg")[0].childNodes[0].nodeValue}
    }
}

/**
 * Returns true if the server has given the client work,
 * returns false otherwise
 */
function has_work(xml) {
    return (xml.getElementsByTagName("file_info").length > 0)
}

/**
 * Returns the host id if it exists
 * returns null otherwise
 */
function get_host_id_from_scheduler_request(xml) {
    if(xml.getElementsByTagName("hostid").length == 0) {
        return null;
    } else {
        var e = xml.getElementsByTagName("hostid")[0];
        return e.childNodes[0].nodeValue;
    }
}

function get_work_config_url_from_scheduler_result(xml) {
    var file_infos = xml.getElementsByTagName("file_info");
    for (file_info_index in file_infos) {
        if (file_infos.hasOwnProperty(file_info_index)) {
            var elem = file_infos[file_info_index];
            safe_log("bees:");
            safe_log(elem);
            var url_node = elem.getElementsByTagName("url")[0]
            if (url_node.childNodes[0].nodeValue.indexOf("xml") != -1) {
                return url_node.childNodes[0].nodeValue;
            }
        }

    }

}

function get_work_unit_url_from_scheduler_result(xml) {
    var file_infos = xml.getElementsByTagName("file_info");
    for (var i = 2; i < file_infos.length; i++) {
        if (file_infos[i].getElementsByTagName("executable").length != 0) {
            var url_node = file_infos[i].getElementsByTagName("url")[0]
            return url_node.childNodes[0].nodeValue;
        }
    }

    return "";
}

/**
 * Adds a specified host id and a rpc seqno (of 0)
 * to the specified XML string (if they do not exist)
 * and returns a new XML string
 */
function update_request_xml(xml_str, host_id) {
    safe_log("updating request xml");
    var xml_parser = new DOMParser();
    var xml = xml_parser.parseFromString(xml_str, "text/xml");
    var scheduler_request_node = xml.getElementsByTagName("scheduler_request")[0];
    if (xml.getElementsByTagName("hostid").length == 0) {
        var host_ID_node = xml.createElement("hostid");
        var rpc_seqno_node = xml.createElement("rpc_seqno");
        scheduler_request_node.appendChild(host_ID_node);
        scheduler_request_node.appendChild(rpc_seqno_node);
    }
    $(xml).find("hostid").text(host_id);
    $(xml).find("rpc_seqno").text("1");
    
    var xml_text = (new XMLSerializer()).serializeToString(xml)+"\n\n";
    xml_text = xml_text.replace("</hostid>", "</hostid>\n");
    xml_text = xml_text.replace("</rpc_seqno>", "</rpc_seqno>\n");
    return xml_text
}

/**
 * Changes the authenticator to the given authenticator
 */
function update_authenticator(xml_str, authenticator) {
    var xml_parser = new DOMParser();
    var xml = xml_parser.parseFromString(xml_str, "text/xml");
    $(xml).find("authenticator").text(authenticator);
    return (new XMLSerializer()).serializeToString(xml)+"\n\n";
}

/**
 * Increments the rpc_seqno
 */

var global_rpc_seqno = 1;

function increment_rpcno(xml_str) {
    var xml_parser = new DOMParser();
    var xml = xml_parser.parseFromString(xml_str, "text/xml");
    $(xml).find("rpc_seqno").text(global_rpc_seqno.toString());
    global_rpc_seqno += 1;
    return (new XMLSerializer()).serializeToString(xml)+"\n\n";
}


function replace_job_id(xml_str, job_id) {
    var xml_parser = new DOMParser();
    var xml = xml_parser.parseFromString(xml_str, "text/xml");
    $(xml).find("name").text(job_id);
    return (new XMLSerializer()).serializeToString(xml)+"\n\n";

}

function extract_upload_file_string(xml) {
    var elements = xml.getElementsByTagName("upload_when_present")
    if (elements.length != 0) {
        var xml_node = xml.getElementsByTagName("upload_when_present")[0].parentNode;
        return (new XMLSerializer()).serializeToString(xml_node);
    } else {
        return null;
    }
}
