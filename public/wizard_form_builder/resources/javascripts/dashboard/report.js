$(function(){
  list_reports();
  var date_range = $('#report_date_filter').val();
  if(date_range == ""){
    $('#report_date_filter').val(Date.today().add({ days: -7}).toString('MMM d, yyyy') + ' - ' + Date.today().add({ days: -1}).toString('MMM d, yyyy'));
  }
  var selected_account = "All";
  var selected_lines = "";

  var url = unescape(window.location.toString());
  if (url.indexOf("#") == -1){
    $('#weekly').removeClass('active');
    $('#daily').addClass('active');

  }else{
     $('#daily').removeClass('active');
     $('#weekly').addClass('active');
  }

  $("#line_selector").on("change", function(e){
    e.preventDefault();
    var selected_lines = $("#line_data ul.selectpicker li.selected a").map(function () { return $(this).attr("class"); }).get();
    if(selected_lines.length == 0)
    {
      $("#submit_btn").hide();
    }else{
      $("#submit_btn").css("display","inline-block");
    }
  });

  $('#daily').click(function(e){
    e.preventDefault();
    selected_account = $("#account_data ul.selectpicker li.selected a").attr("class");
    date_range = $('#report_date_filter').val();
    $('#daily').addClass('active');
    $('#weekly').removeClass('active');
    drTable.fnSettings().sAjaxSource = (window.location.origin + window.location.pathname).toString()+'?breakdown='+"daily"+'&daterange='+date_range+'&account='+selected_account+'&line='+selected_lines;
    drTable.fnDraw();
  });


  $('#weekly').click(function(e){
    e.preventDefault();
    date_range = $('#report_date_filter').val();
    selected_account = $("#account_data ul.selectpicker li.selected a").attr("class");
    $('#daily').removeClass('active');
    $('#weekly').addClass('active');
    drTable.fnSettings().sAjaxSource = (window.location.origin + window.location.pathname).toString()+'?breakdown='+"weekly"+'&daterange='+date_range+'&account='+selected_account+'&line='+selected_lines;
    drTable.fnDraw();
  });

  $('#account_selector').selectpicker();
  $('#line_selector').selectpicker();

  $('#get_report_data').click(function(e){
    e.preventDefault();
    selected_lines = $("#line_data ul.selectpicker li.selected a").map(function () { return $(this).attr("class"); }).get();
    if($('#weekly').hasClass('active')) {
      drTable.fnSettings().sAjaxSource = (window.location.origin + window.location.pathname).toString()+'?breakdown='+"weekly"+'&daterange='+date_range+'&account='+selected_account+'&line='+selected_lines;
    }else{
      drTable.fnSettings().sAjaxSource = (window.location.origin + window.location.pathname).toString()+'?breakdown='+"daily"+'&daterange='+date_range+'&account='+selected_account+'&line='+selected_lines;
    }
    drTable.fnDraw();
  });

  $('#account_selector').on("change", function(){
      date_range = $('#report_date_filter').val();
      $('#report_date_filter').val(date_range);
      var account = $("#account_data ul.selectpicker li.selected a").attr("class");
      selected_account = account;
      selected_lines = "";
      if($('#weekly').hasClass('active')) {
        drTable.fnSettings().sAjaxSource = (window.location.origin + window.location.pathname).toString()+'?breakdown='+"weekly"+'&daterange='+date_range+'&account='+selected_account+'&line='+selected_lines;
      }else{
        drTable.fnSettings().sAjaxSource = (window.location.origin + window.location.pathname).toString()+'?breakdown='+"daily"+'&daterange='+date_range+'&account='+selected_account+'&line='+selected_lines;
      }
      drTable.fnDraw();

    });

  $('#report_date_filter').daterangepicker(
    {
      ranges: {
         'Last 7 Days': [Date.today().add({ days: -7 }), Date.today().add({ days: -1 })],
         'Last 30 Days': [Date.today().add({ days: -30 }), Date.today().add({ days: -1 })],
         'This Month': [Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()],
      },
      opens: 'left',
      format: 'MM/dd/yyyy',
      separator: ' to ',
      maxDate: Date.today().add({ days: -1 }),
      locale: {
          applyLabel: 'Submit',
          fromLabel: 'From',
          toLabel: 'To',
          customRangeLabel: 'Custom Range',
          daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
          monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          firstDay: 1
      },
      showWeekNumbers: true,
      buttonClasses: ['btn-danger']
   },
   function(start, end) {
     $('#report_date_filter').val(Date.today().add({ days: -7}).toString('MMM d, yyyy') + ' - ' + Date.today().add({ days: -1}).toString('MMM d, yyyy'));
      var selected_date = start.toString('MMM d, yyyy') + ' - ' + end.toString('MMM d, yyyy');
      date_range = selected_date
      $('#report_date_filter').val(selected_date);
      if($('#weekly').hasClass('active')) {
        drTable.fnSettings().sAjaxSource = (window.location.origin + window.location.pathname).toString()+'?breakdown='+"weekly"+'&daterange='+date_range+'&account='+selected_account;
      }else{
        drTable.fnSettings().sAjaxSource = (window.location.origin + window.location.pathname).toString()+'?breakdown='+"daily"+'&daterange='+date_range+'&account='+selected_account;
      }
      drTable.fnDraw();
    }
  );

 

  var comma = ",", next_line = '\n';

  $('#data_mart_csv').click(function(){
    if($('#daily').hasClass('active')){
      breakdown = "Daily"
    }else{
      breakdown = "Weekly"
    }
    file_title = breakdown + " Production Report from " + date_range + ".csv"
    $('.download_click').attr("download", file_title)
    var csv = "";
    var col_length = $('#report_data_table thead tr th').length;
    $.each( $('#report_data_table thead tr th') , 
      function(i,v){ csv += $(this).text().replace(/\s+/g, ' '); csv += (col_length-1) == i ? next_line : comma; });
    trs = $('#report_data_table tbody tr');
    $.each(trs, function(i,v){ $.each($(this).find('td'), 
      function(i,v){  
        csv += $(this).text().replace(/,/g,''); 
        csv += (col_length-1) == i ? next_line : comma; }); 
      });
    $('.download_click').attr("href", "data:application/csv;charset=utf-8," + encodeURIComponent(csv));
  });
});


function list_reports(){
    if (typeof(drTable) == "undefined"){
      window.drTable =  $('#report_data_table').dataTable( {
      "sDom": "<'row mb'<'#t_top.span6'l><'span4 pull-right 'f>r>t<'row'<'span4'i><'span6 pull-right'p>>",
      "sPaginationType": "bootstrap",
      "bPaginate": false,
      "bFilter": false,
      "bInfo" : false,
      "bServerSide": true,
      "bProcessing": true,
      "bAutoWidth": false,
      "sAjaxSource": window.location.toString(),
      "bLengthChange": false,
      "iDisplayLength": 10,
      "aaSorting": [[ 0, "desc" ]],
      "bStateSave": false,
      "bInfo": false,
      "aoColumns": [
        {  "asSorting": [ "asc", "desc" ] },
        {  "asSorting": [ "asc", "desc" ] },
        {  "asSorting": [ "asc", "desc" ] },
        {  "asSorting": [ "asc", "desc" ] },
        {  "asSorting": [ "asc", "desc" ] },
        {  "asSorting": [ "asc", "desc" ] },
        {  "asSorting": [ "asc", "desc" ] },
        {  "asSorting": [ "asc", "desc" ] },
        {  "asSorting": [ "asc", "desc" ] }
        ],
        oLanguage: {"oPaginate": {
                "sNext": "",
                "sPrevious": "",
                oPaginateClass: "pagination pagination-small"
           }},
      "fnInitComplete": function(oSettings, json) {
        setTimeout(function(){
          new FixedHeader(drTable),{ "offsetTop": 52 };
        }, 400);
        
      },
      "fnDrawCallback":function(){
        $('.fancybox').fancybox();
      }
      });
    }
  };