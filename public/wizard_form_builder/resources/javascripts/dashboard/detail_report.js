$(function(){
  var comma = ",", next_line = '\n';
  $('#data_mart_detail_csv').click(function(){
    if($('#daily').hasClass('active')){
      breakdown = "Daily"
    }else{
      breakdown = "Weekly"
    }
    date = $("#report").data("date-range");
    file_title = breakdown + " Detail Production Report for " + date + ".csv"
    $('.download_click').attr("download", file_title)
    var csv = "";
    var col_length = $('#detail_report_data_table thead tr th').length;
    $.each( $('#detail_report_data_table').parent('div').siblings('.dataTables_scrollHead').find('table thead tr th') , 
      function(i,v){ csv += $(this).text().replace(/\s+/g, ' '); csv += (col_length-1) == i ? next_line : comma; });
    trs = $('#detail_report_data_table tbody tr');
    $.each(trs, function(i,v){ $.each($(this).find('td'), 
      function(i,v){  
        csv += $(this).text(); 
        csv += (col_length-1) == i ? next_line : comma; }); 
      });
    $('.download_click').attr("href", "data:application/csv;charset=utf-8," + encodeURIComponent(csv));
  });
});

function detail_report_data_table_init(ajax_source)
{
  var fb_dtable = $('#detail_report_data_table').dataTable( {
  "sDom": "<'row mb'<'#t_top.span6'l><'span4 pull-right 'f>r>t<'row'<'span4'i><'span6 pull-right'p>>",
  "sPaginationType": "bootstrap",
  "bPaginate": false,
  "sScrollY": 400,
  "bFilter": true,
  "bInfo" : false,
  "bServerSide": true,
  "bProcessing": true,
  "bAutoWidth": false,
  "sAjaxSource": ajax_source,
  "bLengthChange": false,
  "iDisplayLength": 10,
  "aaSorting": [[ 0, "desc" ]],
  "bStateSave": false,
  "bInfo": false,
  "bPaginate": false,
  "sScrollX": 1400,
  "aoColumns": [
  { "asSorting": [ "desc", "asc" ] },
  { "asSorting": [ "desc", "asc" ] },
  { "asSorting": [ "desc", "asc" ] },
  { "asSorting": [ "desc", "asc" ] },
  { "asSorting": [ "desc", "asc" ] },
  { "asSorting": [ "desc", "asc" ] },
  { "asSorting": [ "desc", "asc" ] },
  { "asSorting": [ "desc", "asc" ] },
  { "asSorting": [ "desc", "asc" ] },
  { "asSorting": [ "desc", "asc" ] }
  ],
  "aoColumnDefs": [
              /* station */
              { "sName": "", "aTargets": [ 0 ] },
              { "bSearchable": true, "aTargets": [ 0 ] }, /* do search this field/column i.e station */
              ],
  oLanguage: {"oPaginate": {
  "sNext": "",
  "sPrevious": "",
  oPaginateClass: "pagination pagination-small"
  }},
  "fnInitComplete": function(oSettings, json) {
  $('#fancybox-inner').height(600);
  $('#fancybox-outer').height(650);
  $('#fancybox-wrap').css("top",70);
  $('#fancybox-wrap').draggable({handle: '#report'});
  $('#report').css('cursor', 'move');
  }
  });

}