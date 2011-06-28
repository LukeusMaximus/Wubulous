var interval_to_cancel;

function set_interval_cancel(handle) {
    interval_to_cancel = handle;
}

var global_host_id;

function work_callback(data) {
    var host_id = get_host_id_from_scheduler_request(data);
    if (host_id != null) {
        standard_request = update_request_xml(standard_request, host_id);
        global_host_id = host_id;
    }
    standard_request = increment_rpcno(standard_request);
    if (has_work(data)) {
        console.log("got work, canceling interval");
        clearInterval(interval_to_cancel);
        do_work(data);
    } else {
        console.log("got no work");
    }
}

var work_unit_url;
var job_id;

function do_work(data) {
    console.log(data);
    var work_config_url = get_work_config_url_from_scheduler_result(data);
    console.log(work_config_url);
    job_id = get_job_id_from_url(work_config_url) + "_0";
    work_unit_url = get_work_unit_url_from_scheduler_result(data);
    console.log(work_unit_url);
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

function execute_work(data) {
    work_unit = eval("(" + data + ")");
    if (!resume_work()) {
        work_unit.init();
    }
    execute();
}

function execute() {
    if(!work_unit.isDone()) {
        work_unit.step();
        work_timer = setTimeout("execute()", 100);
    } else {
        work_unit.finish();
        report_work_back();
    }
}

function save_work() {
    var state = workunit.save();
    var work_unit_state = JSON.stringify(state);
    document.cookie="boinc_work_unit=" + escape(work_unit_state);
}

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

function report_work_back() {
    var local_completion = replace_job_id(completed_work_request, job_id);
    local_completion = update_request_xml(local_completion, global_host_id);
    local_completion = increment_rpcno(local_completion);
    $.post(CGI_ROOT + "/cgi", local_completion, report_callback);
}

function report_callback(data) {
    console.log(data);
}

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
                        '    <work_req_seconds>60480.000000</work_req_seconds>', 
                        '    <cpu_req_secs>60480.000000</cpu_req_secs>', 
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
                              '    <hostid>277</hostid>', 
                              '    <rpc_seqno>8</rpc_seqno>', 
                              '    <core_client_major_version>6</core_client_major_version>',
                              '    <core_client_minor_version>10</core_client_minor_version>',
                              '    <core_client_release>59</core_client_release>',
                              '    <resource_share_fraction>1.000000</resource_share_fraction>',
                              '    <rrs_fraction>1.000000</rrs_fraction>',
                              '    <prrs_fraction>1.000000</prrs_fraction>',
                              '    <duration_correction_factor>0.960632</duration_correction_factor>',
                              '    <sandbox>0</sandbox>', 
                              '    <work_req_seconds>60480.000000</work_req_seconds>', 
                              '    <cpu_req_secs>60480.000000</cpu_req_secs>', 
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


function schedule_request() {
    $.post(CGI_ROOT + "/cgi", standard_request, work_callback);
}


