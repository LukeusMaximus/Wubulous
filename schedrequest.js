var interval_to_cancel;

function set_interval_cancel(handle) {
    interval_to_cancel = handle;
}

function work_callback(data) {
    var host_id = get_host_id_from_scheduler_request(data);
    if (host_id != null) update_request_xml(standard_request, host_id); 
    if (has_work(data)) {
        console.log("got work, canceling interval");
        clearInterval(interval_to_cancel);
        do_work(data);
    } else {
        console.log("got no work");
    }
}

var work_unit_url;

function do_work(data) {
    console.log(data);
    var work_config_url = get_work_config_url_from_scheduler_result(data);
    console.log(work_config_url);
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

function execute_work(data) {
    var x = eval("(" + data + ")");
    console.log(x.main());
}

var standard_request = ['<scheduler_request>', 
                        '    <authenticator>cd83b81e4874b95c24a26b44ef1a73e8</authenticator>', 
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
                        '    <cpu_req_instances>2.000000</cpu_req_instances>', 
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
function schedule_request(authtoken) {
    $.post(CGI_ROOT + "/cgi", standard_request, work_callback);
}
