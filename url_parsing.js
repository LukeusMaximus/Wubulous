/**
 * returns everything after the last slash minus the file suffix
 */
function get_job_id_from_url(url) {
    return url.substr(url.lastIndexOf('/') + 1,
                      url.lastIndexOf('.') - url.lastIndexOf('/') - 1
                     );
}
