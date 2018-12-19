
  function list_factories(){
    if (typeof(dTable) == "undefined"){
      window.dTable =  $('#factory_table').dataTable( {
      "sDom": "<'row mb'<'#t_top.span6'l><'span4 pull-right 'f>r>t<'row'<'span4'i><'span6 pull-right'p>>",
      "sPaginationType": "bootstrap",
      "bServerSide": false,
      "bProcessing": true,
      "bAutoWidth": false,
      "sAjaxSource": window.location.toString(),
      "bFilter": true,
      "bLengthChange": false,
      "iDisplayLength": 25,
      "aaSorting": [[ 0, "desc" ]],
      "bStateSave": false,
      "aoColumns": [

        {  "asSorting": [ "asc", "desc" ], bSearchable: true },
        {  bSearchable: false },
        {  "bVisible":    false, bSearchable: true, "asSorting": [ "asc", "desc" ] },
        {  "bVisible":    false, bSearchable: true, "asSorting": [ "asc", "desc" ] },
        {  "bVisible":    false, bSearchable: false, "asSorting": [ "asc", "desc" ] }
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
$(document).ready(function() {
  window.i = 0;
  window.j = 0;
  window.k = 0;

  function arrow_up(row){
    $('.menu_arrow'+row).css({'-webkit-transform': 'rotate(180deg)', 'position': 'absolute', 'right': '57px'});
  }
  function arrow_down(row){
    $('.menu_arrow'+row).css({'-webkit-transform': 'rotate(0deg)', 'position': 'absolute', 'top': '0', 'bottom': '0', 'right':'0'});
  }

  $('#sort_factory li div.menu_arrow1').show();
  $('#sort_factory li a').on('click', function () {
    var sort_params = $(this).attr("id");
    if(sort_params == "created_date"){
      $('#sort_factory li div.menu_arrow1').show();
      $('#sort_factory li div.menu_arrow2').hide();
      $('#sort_factory li div.menu_arrow3').hide();
      i=i+1
      if(i%2 != 0){
        arrow_up(1);
        dTable.fnSort( [ [4,'asc'] ] );
      }
      else{
        arrow_down(1);
        dTable.fnSort( [ [4,'desc'] ] );
        }
    }
    else if(sort_params == "title"){
      $('#sort_factory li div.menu_arrow2').show();
      $('#sort_factory li div.menu_arrow1').hide();
      $('#sort_factory li div.menu_arrow3').hide();
      j=j+1
      if(j%2 != 0){
        arrow_up(2);
        dTable.fnSort( [ [2,'asc'] ] );
      }
      else{
        arrow_down(2);
        dTable.fnSort( [ [2,'desc'] ] );
        }
    }
    else if(sort_params == "client"){
      $('#sort_factory li div.menu_arrow3').show();
      $('#sort_factory li div.menu_arrow1').hide();
      $('#sort_factory li div.menu_arrow2').hide();
      k=k+1
      if(k%2 != 0){
        arrow_up(3);
        dTable.fnSort( [ [3,'asc'] ] );
      }
      else{
        arrow_down(3);
        dTable.fnSort( [ [3,'desc'] ] );
        }
    }
  });

});
