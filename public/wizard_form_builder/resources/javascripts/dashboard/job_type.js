
  function list_job_types(){
    if (typeof(dTable) == "undefined"){
      window.dTable =  $('#jt_table').dataTable( {
      "sDom": "<'row mb'<'#t_top.span6'l><'span4 pull-right 'f>r>t<'row'<'span4'i><'span6 pull-right'p>>",
      "sPaginationType": "bootstrap",
      "bServerSide": true,
      "bProcessing": true,
      "bAutoWidth": false,
      "sAjaxSource": window.location.toString(),
      "bFilter": true,
      "bLengthChange": false,
      "iDisplayLength": 50,
      "aaSorting": [[ 0, "asc" ]],
      "bStateSave": false,
      "aoColumns": [
        {  "asSorting": [ "asc", "desc" ] },
        {  "asSorting": [ "asc", "desc" ] },
        { "bSortable": false },
        { "bSortable": false },
        { "bSortable": false },
        { "bSortable": false },
        { "bSortable": false },
        { "bSortable": false }
        ],
        "aoColumnDefs": [
              /* id */
              { "sName": "", "aTargets": [ 1 ] },
              { "bSearchable": true, "aTargets": [ 1 ] }, /* do search this field/column i.e id */
              /* title */
              { "sName": "", "aTargets": [ 1 ] },
              { "bSearchable": true, "aTargets": [ 1 ] }, /* do search this field/column i.e title */
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