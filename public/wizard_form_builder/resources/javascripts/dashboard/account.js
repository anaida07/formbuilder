function list_accounts(){
  if (typeof(dTable) == "undefined"){
    window.dTable =  $('#account_table').dataTable( {
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
      {  "asSorting": [ "asc", "desc" ] },
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
  window.j = 0;

  function arrow_up(row){
    $('.menu_arrow'+row).css({'-webkit-transform': 'rotate(180deg)', 'position': 'absolute', 'right': '57px'});
  }
  function arrow_down(row){
    $('.menu_arrow'+row).css({'-webkit-transform': 'rotate(0deg)', 'position': 'absolute', 'top': '0', 'bottom': '0', 'right':'0'});
  }

  $('.sort_data li div.menu_arrow1').show();
  $('.sort_data li a').on('click', function (e) {
    var sort_params = $(this).attr("id");
    if(sort_params == "acc_id"){
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
   else if(sort_params == "title"){
    $('.sort_data li div.menu_arrow2').show();
    $('.sort_data li div.menu_arrow1').hide();
    $('.sort_data li div.menu_arrow3').hide();
    j=j+1
    if(j%2 != 0){
      arrow_up(2);
      dTable.fnSort( [ [1,'asc'] ] );
    }
    else{
      arrow_down(2);
      dTable.fnSort( [ [1,'desc'] ] );
      }
  }
  });

});

function list_acc_associated_lines(lines_data){
  var lines_data = lines_data ;
  window.dTable = $('#acc_associated_lines').dataTable( {
    "aaData": lines_data,
    "sDom": "<'row mb'<'#t_top.span6'l><'span4 pull-right 'f>r>t<'row'<'span4'i><'span6 pull-right'p>>",
    "sPaginationType": "bootstrap",
    "bServerSide": false,
    "bProcessing": true,
    "bAutoWidth": false,
    "bInfo": false,
    "bFilter": true,
    "bLengthChange": false,
    "iDisplayLength": 5,
    "aaSorting": [[ 0, "desc" ]],
    "bStateSave": false,
    "aoColumns": [
      { "sTitle": "id" },
      { "sTitle": "title",bSearchable: false },
      {"sTitle": "title", "bVisible": false, bSearchable: true}
      ]
    });
};
function list_acc_associated_users(users_data){
  var users_data = users_data ;
  window.oTable = $('#acc_associated_users').dataTable( {
    "aaData": users_data,
    "sDom": "<'row mb'<'#t_top.span6'l><'span4 pull-right 'f>r>t<'row'<'span4'i><'span6 pull-right'p>>",
    "sPaginationType": "bootstrap",
    "bServerSide": false,
    "bProcessing": true,
    "bAutoWidth": false,
    "bInfo": false,
    "bFilter": true,
    "bLengthChange": false,
    "iDisplayLength": 5,
    "aaSorting": [[ 0, "desc" ]],
    "bStateSave": false,
    "aoColumns": [
      { "sTitle": "id" },
      { "sTitle": "title" }
      ]
    });
};

$(document).ready(function(){
  $('#acc_associated_users_filter input').attr("placeholder", "enter user");
  $('#acc_associated_lines_filter input').attr("placeholder", "enter line");
  $('#acc_associated_users_filter input').unbind();
    $('#acc_associated_users_filter input').bind('keyup', function(e) {
      if(e.keyCode == 13) {
        oTable.fnFilter(this.value);
      }
    });

    $('#acc_associated_lines_filter input').unbind();
    $('#acc_associated_lines_filter input').bind('keyup', function(e) {
      if(e.keyCode == 13) {
        dTable.fnFilter(this.value);
      }
    });

   $('body').tooltip({
    selector: '.more_roles',
    placement: "top",
  });
  $('.selectpicker').selectpicker();
});


function add_line(url){
  $("#add_line").on("click", function(e){
    e.preventDefault();
    var selected_lines = $("#line_data ul.selectpicker li.selected a").map(function () { return $(this).attr("class"); }).get();
    $.ajax({
      url: url,
      data: {lines: selected_lines},
      dataType: 'json',
      type: 'post',
      beforeSend: function(xhr) {
      xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
      },
      success: function(data){
        location.reload();
      }
    });
  });
}

function add_user(url){
  $("#add_user").on("click", function(e){
    e.preventDefault();
    var self = $(this);
    var selected_users = $("#user_data ul.selectpicker li.selected a").map(function () { return $(this).attr("class"); }).get();
    $.ajax({
      url: url,
      data: {users: selected_users},
      dataType: 'json',
      type: 'post',
      beforeSend: function(xhr) {
      xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
      },
      success: function(data){
        location.reload();
      }
    });
  });
}


