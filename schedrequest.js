
var global_host_id;


function parse_and_update_from_scheduler_response(data) {
    //get the host id from the request and use it for communication
    //with the server. Set it globally so it can be used later
    var host_id = get_host_id_from_scheduler_request(data);
    if (host_id != null) {
        standard_request = update_request_xml(standard_request, host_id);
        global_host_id = host_id;
    } else {
        //increment the rpc number used in this request so that the server
        //doesn't give us a new host ID and we aren't generating endless
        //host ids
        standard_request = increment_rpcno(standard_request);
    }

}

function work_callback(data) {

    parse_and_update_from_scheduler_response(data);

    if (has_work(data)) {
        safe_log("got work, canceling interval");
        do_work(data);
    } else {
        safe_log("got no work");
        setTimeout("schedule_request();", 10000);
    }
}

var work_unit_url;
var job_id;
var file_upload_string;

function do_work(data) {
    safe_log(data);
    safe_log("upload_file_string");
    safe_log(extract_upload_file_string(data));
    file_upload_string = extract_upload_file_string(data);
    safe_log("upload_file_string");
    var work_config_url = get_work_config_url_from_scheduler_result(data);
    safe_log("work_config_url");
    safe_log(work_config_url);
    job_id = get_job_id_from_url(work_config_url) + "_0";
    work_unit_url = get_work_unit_url_from_scheduler_result(data);
    safe_log("work_unit_url");
    safe_log(work_unit_url);
    get_config_and_execute(work_config_url)
}

function get_config_and_execute(work_url) {
    $.get(work_url, parse_config_and_execute_work_unit); 
}

function parse_config_and_execute_work_unit(work_unit_config) {
   $.get(work_unit_url, execute_work) ;
}

var work_timer;
var work_unit;
var step_count;

function parse_and_create_work_unit(data) {
    var wu = eval("(" + data + ")");
    wu["resume_work"] = resume_work;
    return wu;
}

//downloads and executes the work unit
function execute_work(data) {
    step_count = 0;
    work_unit = parse_and_create_work_unit(data);
    work_unit.init();
    work_unit.resume_work();
    execute();
}

//the wrapper function to execute a workunit to completion
function execute() {
    if(!work_unit.is_done()) {
        work_unit.step();
        step_count++;
        work_timer = setTimeout("execute()", 0);
    } else {
        safe_log("work completed");
        var result = work_unit.finish();
        report_work_back(result);
    }
}

//saves current state to a cookie
function save_work() {
    var state = workunit.save();
    var work_unit_state = JSON.stringify(state);
    document.cookie="boinc_work_unit=" + escape(work_unit_state);
}

//resumes current state from a cookie
function resume_work() {
    var cookies = document.cookie.split(';');
    for (cookie in cookies) {
        if (cookie.substr(0, cookie.indexOf('=')) == "boinc_work_unit") {
            var work_unit_state = cookie.substr(cookie.indexOf('=') + 1);
            var state = JSON.parse(work_unit_state);
            work_unit.resume(state);
            return true;
        }
    }
    return false;
}


var set_host_id_in_report = false;

//reports completion of a workunit to the server. Initiates uploading of work 
//results to the server
function report_work_back(result) {
    var local_completion = replace_job_id(completed_work_request, job_id);
    if (!set_host_id_in_report) local_completion = update_request_xml(local_completion, global_host_id);
    local_completion = increment_rpcno(local_completion);
    $.post(CGI_ROOT + "/cgi", local_completion, report_callback);
    upload_result(result);
}

//uploads the result of a workunit to the server, DOES NOT report
//success or failure
function upload_result(result) {
    safe_log("uploading work!");
    var string_result = result.toString();
    var report = upload_result_request;
    report += file_upload_string + "\n";
    report += "<nbytes>" + string_result.length +"</nbytes>\n";
    report += "<md5_cksum>" + hex_md5(string_result) + "</md5_cksum>\n";
    report += "<offset>0</offset>\n"
    report += "<data>\n"
    report += result
    $.post(CGI_ROOT + "/file_upload_handler", report, upload_callback);
}

//called after we've reported a completed job
function report_callback(data) {
    safe_log(data);
    if (has_work(data)) work_callback(data);
    else setTimeout("schedule_request();", 10000);
}

//called after we've uploaded work
function upload_callback(data) {
    safe_log(data);
}

function restart_job_timer() {
   scheduler_request_interval_handle = setInterval("schedule_request();", 10000); 
}


//TODO: generate these instead of just joining a giant hard coded string

var standard_request = ['<scheduler_request>', 
                        '    <authenticator>0</authenticator>', 
                        '    <core_client_major_version>6</core_client_major_version>', 
                        '    <core_client_minor_version>10</core_client_minor_version>', 
                        '    <core_client_release>59</core_client_release>', 
                        '    <resource_share_fraction>1.000000</resource_share_fraction>', 
                        '    <rrs_fraction>1.000000</rrs_fraction>', 
                        '    <prrs_fraction>1.000000</prrs_fraction>', 
                        '    <duration_correction_factor>1.000000</duration_correction_factor>', 
                        '    <sandbox>0</sandbox>', 
                        '    <work_req_seconds>1.000000</work_req_seconds>', 
                        '    <cpu_req_secs>1.000000</cpu_req_secs>', 
                        '    <cpu_req_instances>1.000000</cpu_req_instances>', 
                        '    <estimated_delay>0.000000</estimated_delay>', 
                        '    <client_cap_plan_class>1</client_cap_plan_class>', 
                        '    <platform_name>javascript</platform_name>', 
                        '    <code_sign_key>', 
                        '1024', 
                        'caf9ff3c57c08e2779720b5fc72e25f28c62add28866d3035e5e87eb5bd49a1d', 
                        '0afe7bb84ea624cce42a581a6ce232dc7dd7dad2d2ea5ed6609bec8c41785f05', 
                        '145df8814b3bd4258b12f0df53206f25ba89645a9c34c8e0e18773cbb761cbce', 
                        '70fcd4061ff066829327c357fefcc2a01275d810b282cd83cf2b9de7ab78bc47', 
                        '0000000000000000000000000000000000000000000000000000000000000000', 
                        '0000000000000000000000000000000000000000000000000000000000000000', 
                        '0000000000000000000000000000000000000000000000000000000000000000', 
                        '0000000000000000000000000000000000000000000000000000000000010001', 
                        '.', 
                        '</code_sign_key>', 
                        '<host_info>', 
                        '   <d_total>155416956928.000000</d_total>', 
                        '   <d_free>115370192896.000000</d_free>', 
                        '</host_info>', 
                        '<other_results>', 
                        '</other_results>', 
                        '<in_progress_results>', 
                        '</in_progress_results>', 
                        '</scheduler_request>', '',''].join("\n");


var completed_work_request = ['<scheduler_request>', 
                              '    <authenticator>0</authenticator>', 
                              '    <core_client_major_version>6</core_client_major_version>',
                              '    <core_client_minor_version>10</core_client_minor_version>',
                              '    <core_client_release>59</core_client_release>',
                              '    <resource_share_fraction>1.000000</resource_share_fraction>',
                              '    <rrs_fraction>1.000000</rrs_fraction>',
                              '    <prrs_fraction>1.000000</prrs_fraction>',
                              '    <duration_correction_factor>0.960632</duration_correction_factor>',
                              '    <sandbox>0</sandbox>', 
                              '    <work_req_seconds>1.000000</work_req_seconds>', 
                              '    <cpu_req_secs>1.000000</cpu_req_secs>', 
                              '    <cpu_req_instances>1.000000</cpu_req_instances>', 
                              '    <estimated_delay>0.000000</estimated_delay>', 
                              '    <client_cap_plan_class>1</client_cap_plan_class>', 
                              '    <platform_name>javascript</platform_name>', 
                              '    <code_sign_key>',
                              '1024',
                              'caf9ff3c57c08e2779720b5fc72e25f28c62add28866d3035e5e87eb5bd49a1d', 
                              '0afe7bb84ea624cce42a581a6ce232dc7dd7dad2d2ea5ed6609bec8c41785f05',
                              '145df8814b3bd4258b12f0df53206f25ba89645a9c34c8e0e18773cbb761cbce',
                              '70fcd4061ff066829327c357fefcc2a01275d810b282cd83cf2b9de7ab78bc47',
                              '0000000000000000000000000000000000000000000000000000000000000000',
                              '0000000000000000000000000000000000000000000000000000000000000000',
                              '0000000000000000000000000000000000000000000000000000000000000000',
                              '0000000000000000000000000000000000000000000000000000000000010001', 
                              '.',
                              '</code_sign_key>',
                              '<host_info>',
                              '    <d_total>155416956928.000000</d_total>',
                              '    <d_free>115209900032.000000</d_free>',
                              '</host_info>',
                              '<result>',
                              '    <name>sj_43_0</name>',
                              '    <final_cpu_time>0.000000</final_cpu_time>',
                              '    <final_elapsed_time>2.128962</final_elapsed_time>',
                              '    <exit_status>0</exit_status>',
                              '    <state>5</state>',
                              '    <platform>javascript</platform>',
                              '    <version_num>100</version_num>', 
                              '    <app_version_num>100</app_version_num>',
                              '</result>',
                              '<other_results>',
                              '</other_results>',
                              '<in_progress_results>',
                              '</in_progress_results>', 
                              '</scheduler_request>', '',''].join("\n");

var upload_result_request = ['<data_server_request>', 
                             '<core_client_major_version>1</core_client_major_version>', 
                             '<core_client_minor_version>1</core_client_minor_version>', 
                             '    <core_client_release>1</core_client_release>', 
                             '<file_upload>',''].join("\n");



function schedule_request() {
    $.post(CGI_ROOT + "/cgi", standard_request, work_callback);
}


