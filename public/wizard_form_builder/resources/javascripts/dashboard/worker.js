window.skillLineWidget = function(data, skill_id) {
  var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'line_widget',
            type: 'spline'
        },
        title : {
                text : data["name"]
            },
        series: [{
            name: data["name"],
            data: data["data"],
            pointStart: 1,
          }],
              plotOptions:{
      series: {
        cursor: 'pointer',
        point: {
          events: {
            click: function() {
              window.location.href = this.url
            }
          }
        }
      }
    },
    credits:{ enabled: false, },
    legend:{ enabled: false, },
    yAxis:{
      title: {text: null},
    },
    xAxis: {min:1},
    tooltip: {
      formatter: function() {
         return this.series.name + ': <b>' + this.y + '</b><br>' +
         'Assignment ID: <b>' + this.point.assignment_id + '</b><br>' +
         'GoldStandard?: <b>' + this.point.gt + '</b><br>';
        }
      }
    });
  $('.skill_filter').attr('data-skill_id',skill_id);

};



function list_skills() {
     window.oTable = $('#skill_table'). dataTable({
        "bJQueryUI": false,
        "bInfo": true,
        "iDisplayLength": 6,
        "bLengthChange": false,
        "bSort": false,
        "sDom": "<'row'<'span10'<'search_field' f>><'span2'<'skillBtn'>>r>t<'span12'i><'span12'p>>",
        oLanguage: {"oPaginate": {
                "sNext": "",
                "sPrevious": "",
                oPaginateClass: "pagination pagination-small"
           }},
         "aoColumnDefs": [
            /* name */
            { "sName": "", "aTargets": [ 0 ] },
            { "bSearchable": true, "aTargets": [ 0 ] }, /* do NOT search this field/column */
            /* value */
            { "sName": "", "aTargets": [ 1 ] },
            { "bSearchable": false, "aTargets": [ 1 ] }, /* do NOT search this field/column */
            /* actions */
            { "sName": "", "aTargets": [ 2 ] },
            { "bSearchable": false, "aTargets": [ 2 ] }, /* do NOT search this field/column */
            ]
      });
    $('#skill_table_filter label span').remove();
    $('#skill_table_filter label').append('<div class="search_btn"></div>');
    $('#skill_table_filter input.span2').attr('placeholder','Enter skill title');

    $( "#tabs" ).tabs();

  $('body').tooltip({
    selector: '.value_info, .tooltips',
    zindex: 9999,
    placement: 'bottom'
  });

  $( "#skill_table").on( "click",  ".enable_disable_button",  function( e ) {
    var confirm_state = false;
    var el = $(this);
    if(el.find('a').data('worker-state') == 'enabled')
    {
      confirm_state = confirm('Are you sure you want to disable this skill?');
    }else{
      confirm_state = confirm('Are you sure you want to enable this skill?');
    }
    if(confirm_state)
      $(this).parent('div').siblings('.sk_btn').css("display","inline-block");
    else{
      e.preventDefault();
      return false;
    }
  });

  $(document).ajaxStart(function(){
    $('.sk_btn').html('<img src="/images/ajax_loader.gif" />');
  });

  $(document).ajaxStop(function(){
    $('.sk_btn').html('');
    $('.sk_btn').css("display","none");
  });

  $('.update-skill-form').live('submit', function(){
    $(this).parent('tr').find('.sk_btn').css("display","inline-block");
  });

  $(document).on('focusin', "input.value", function(){
    $('input.value').not(this).each(function(){
      $(this).val($(this).data('skill-value'));
    });
  });

  $(document).on('click', function(e){
    if ($(e.target).parent().hasClass('update-skill-btn') || $(e.target).hasClass('update-skill-btn') || $(e.target).hasClass('value') ){
      return;
    }else{
      $('input.value').each(function(){
        $(this).val($(this).data('skill-value'));
      });
    }
  });

  $('.skill_button').bind("contextmenu",function(e){
    return false;
  });

}

function list_worker(){
  if (typeof(dTable) == "undefined"){
    window.dTable =  $('#worker_table').dataTable( {
    "sDom": "<'row mb'<'#t_top.span6'l><'span4 pull-right 'f>r>t<'row'<'span4'i><'span6 pull-right'p>>",
    "sPaginationType": "bootstrap",
    "bServerSide": true,
    "bProcessing": true,
    "bAutoWidth": false,
    "sAjaxSource": window.location.toString(),
    "bFilter": true,
    "bLengthChange": false,
    "iDisplayLength": 50,
    "aaSorting": [[ 2, "asc" ]],
    "bStateSave": false,
    "aoColumns": [
      {  "bSortable": false },
      {  "bSortable": false },
      {  "asSorting": [ "asc", "desc" ] },
      { "bSortable": false },
      { "bSortable": false }
      ],
      "aoColumnDefs": [
            /* mturk_id_f */
            { "sName": "", "aTargets": [ 1 ] },
            { "bSearchable": true, "aTargets": [ 1 ] }, /* do search this field/column only i.e mturk_id_f */
            ],
      oLanguage: {"oPaginate": {
              "sNext": "",
              "sPrevious": "",
              oPaginateClass: "pagination pagination-small"
         }},
    "fnInitComplete": function(oSettings, json) {
      setTimeout(function(){
        new FixedHeader(dTable),{ "offsetTop": 52 };
      }, 400);

      }
    });
  }
};


function worker_hisory_init(){
  if (typeof(dTable) == "undefined"){
    window.dTable =  $('#history_table').dataTable( {
    "sPaginationType": "bootstrap",
    "bServerSide": true,
    "bProcessing": true,
    "bAutoWidth": false,
    "sAjaxSource": window.location.pathname,
    "bFilter": false,
    "bLengthChange": true,
    "iDisplayLength": 50,
    "aaSorting": [[ 0, "desc" ]],
    "bStateSave": false,
    "aoColumns": [
      { "asSorting": [ "desc", "asc" ] },
      { "asSorting": [ "desc", "asc" ] },
      { "bSortable": false },
      { "asSorting": [ "desc", "asc" ] },
      { "asSorting": [ "desc", "asc" ] },
      { "bSortable": false },
      ],
      oLanguage: {"oPaginate": {
              "sNext": "",
              "sPrevious": "",
              oPaginateClass: "pagination pagination-small"
         }},
    "fnInitComplete": function(oSettings, json) {
      new FixedHeader(dTable),{ "offsetTop": 52 };
      }
    });
  }
};

$(document).ready(function(){
  $('.dataTables_filter input').unbind();
  $('.dataTables_filter input').bind('keyup', function(e) {
    if(e.keyCode == 13) {
      oTable.fnFilter(this.value);
    }
  });

  $('.selectpicker').selectpicker();

});


function add_skill(url){
  $("#add_skill").on("click", function(e){
    e.preventDefault();
    $collection = $("#skill_data ul.selectpicker li.selected a");
    if ($collection.length>0){
        var selected_skills = $collection.map(function () { return $(this).data("skillid"); }).get();
        $.ajax({
          url: url,
          data: {skills: selected_skills},
          dataType: "json",
          type: "post",
          beforeSend: function(xhr) {
          xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
          },
          success: function(data){
            location.reload();
          }
        });
      }
  });
}


