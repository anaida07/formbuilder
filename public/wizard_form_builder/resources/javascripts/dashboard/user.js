function list_users(){
    if (typeof(dTable) == "undefined"){
      window.dTable =  $('#user_table').dataTable( {
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

        {  "asSorting": [ "asc", "desc" ] },
        {  bSearchable: false },
        { "bVisible":    false,  bSearchable: true }
        ],
        oLanguage: {"oPaginate": {
                "sNext": "",
                "sPrevious": "",
                oPaginateClass: "pagination pagination-small"
           }}
      });
    }
  };

  $(document).ready(function() {
  window.i = 0;

  function arrow_up(row){
    $('.menu_arrow'+row).css({'-webkit-transform': 'rotate(180deg)', 'position': 'absolute', 'right': '57px'});
  }
  function arrow_down(row){
    $('.menu_arrow'+row).css({'-webkit-transform': 'rotate(0deg)', 'position': 'absolute', 'top': '0', 'bottom': '0', 'right':'0'});
  }

  $('.sort_data li div.menu_arrow1').show();
  $('.sort_data li a').on('click', function () {
    var sort_params = $(this).attr("id");
    if(sort_params == "user_id"){
      $('.sort_data li div.menu_arrow1').show();
      $('.sort_data li div.menu_arrow2').hide();
      i=i+1
      if(i%2 != 0){
        arrow_up(1);
        dTable.fnSort( [ [0,'asc'] ] );
      }
      else{
        arrow_down(1);
        dTable.fnSort( [ [0,'desc'] ] );
        }
    }
  });

  $('body').tooltip({
    selector: '.more_roles',
    placement: "top",
  });

});


