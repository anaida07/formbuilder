function list_skills(){
  if (typeof(dTable) == "undefined"){
    window.dTable =  $('#skill_data_table').dataTable( {
    "sDom": "<'row mb'<'#t_top.span6'l><'span4 pull-right 'f>r>t<'row'<'span4'i><'span6 pull-right'p>>",
    "sPaginationType": "bootstrap",
    "bServerSide": true,
    "bProcessing": true,
    "bAutoWidth": false,
    "sAjaxSource": window.location.toString(),
    "bFilter": true,
    "bLengthChange": false,
    "iDisplayLength": 50,
    "aaSorting": [[ 0, "desc" ]],
    "bStateSave": false,
    "aoColumns": [
      { "asSorting": [ "desc", "asc" ] },
      { "asSorting": [ "desc", "asc" ] },
      { "asSorting": [ "desc", "asc" ] },
      { "asSorting": [ "desc", "asc" ] },
      { "asSorting": [ "desc", "asc" ] },
      { "asSorting": [ "desc", "asc" ] },
      { "bSortable": false }
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
