$(document).ready(function() {

  window.oTable = $('#data_table').dataTable( {
    "sDom": "<'row'<'span6'l><'span4'f>r>t<'row'<'span4'i><'span6 force-right'p>>",
    "sPaginationType": "bootstrap",
    "bServerSide": true,
    "bProcessing": true,
    "sAjaxSource": window.location.toString(),
    "bFilter": false,
    "bLengthChange": false,
    "iDisplayLength": 50,
    "aaSorting": [[ 1, "desc" ]],
    "bStateSave": true,
    "aoColumns": [
      { "bSortable": false },
      null,
      { "asSorting": [ "desc", "asc" ] },
      { "asSorting": [ "desc", "asc" ] },
      { "asSorting": [ "desc", "asc" ] },
      { "asSorting": [ "desc", "asc" ] },
      { "asSorting": [ "desc", "asc" ] },
      { "asSorting": [ "desc", "asc" ] },
      { "asSorting": [ "desc", "asc" ] }
      ],
    "fnInitComplete": function(oSettings, json) {
      new FixedHeader(oTable);
    },
    "fnDrawCallback":function(){
      $('#gs_delete').css('visibility','hidden');
      gs_ids = [];
    },
    "fnDrawCallback":function(){
      $('#gs_enable').css('visibility','hidden');
      gs_ids = [];
    }
  });

  $(oTable).bind( 'draw', function(){
   $('.dataTable #gs_check_all').removeAttr('checked').removeClass('active');
  });

  //new FixedHeader(oTable);

  $('#gold_date_filter').daterangepicker({
    ranges: {
         'Today': ['today', 'today'],
         'Yesterday': ['yesterday', 'yesterday'],
         'This Week': new Date().getUTCDay() == 1 ? ['today', 'today'] : [Date.today().moveToDayOfWeek(1, -1), 'today'],
         'Last 7 Days': [Date.today().add({ days: -6 }), 'today'],
         'Last 30 Days': [Date.today().add({ days: -29 }), 'today'],
         'This Month': [Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()],
      },
    opens: 'right',
    format: 'MM/dd/yyyy',
    maxDate: Date.today(),
    locale: {
      firstDay: 1
    },
    buttonClasses: ['btn-danger']
  },
  function(start, end) {
    if( start == null && end == null)
     {
      $('#gold_date_filter').val("");
      var data = $('#gold_params_filter').serialize();
      oTable.fnSettings().sAjaxSource = window.location.pathname+'?'+data;
      oTable.fnDraw();
     }else
     {
      $('#gold_date_filter').val(start.toString('MMM d, yyyy') + ' - ' + end.toString('MMM d, yyyy'));
     }
   }
  );

  $('#gold_params_filter').submit(function(e){
    e.preventDefault();
    if ( $(this).find('.well').hasClass('active') || $(this).find('#gold_date_filter')[0].value != "" ){
      var data = $(this).serialize();
      oTable.fnSettings().sAjaxSource = window.location.toString()+'?'+data;
      oTable.fnDraw();
      $(this).find('#gold_date_filter').addClass('applied');
      $(this).find('.well.active').addClass('applied');
      $('#gs_delete').css('visibility','hidden');
      $('#gs_enable').css('visibility','hidden');
    }else{
      return false;
    }

  });

  $('#gold_params_filter').bind('reset',function(e){
    e.preventDefault();
    $(this).find('input[type="hidden"]').val("");
    $(".slider-range").parent('div').removeClass('active').end().each(function(){
      var $slider = $(this);
      $slider.slider("values", 0, 0);
      $slider.slider("values", 1, $(this).data("max"));
      $slider.siblings('b').html("");
    });
    var _wells = $(".filter-block .well");
    $(this).find('#gold_date_filter')[0].value = "";
    if(_wells.hasClass('applied') || $(this).find('#gold_date_filter').hasClass('applied')){
      var data = $(this).serialize();
      oTable.fnSettings().sAjaxSource = window.location.toString()+'&?'+data;
      oTable.fnDraw();
      _wells.removeClass('applied');
      $(this).find('#gold_date_filter').removeClass('applied');
      $('#gs_delete').css('visibility','hidden');
      $('#gs_enable').css('visibility','hidden');
    }
    return true;
  });

  $('#gold_params_filter button').bind('click', function(e){
    e.preventDefault();
    var _slid = $(this).siblings('input[type="hidden"]').val("").end().siblings(".slider-range");
    _slid.slider("values", 0, 0);
    _slid.slider("values", 1, _slid.data('max'));
    _slid.siblings('b').hide();
    var data = $('#gold_params_filter').serialize();
    if(_slid.parent().hasClass('applied'))
      {
        oTable.fnSettings().sAjaxSource = window.location.pathname+'?'+data;
        oTable.fnDraw();
      }
    _slid.parent('div.well').removeClass('active').removeClass('applied');
  });

  window.data_table = $("#data_table");
  $('#gs_check_all').on('click', function(){
  if ($(this).is(':checked')){
    data_table.find('input').attr('checked','checked');
  }else{
    data_table.find('input').removeAttr('checked');
  }
  });

 $('body').tooltip({
    selector: '[rel=tooltip]',
    placement: 'bottom'
  });

  $('.view_task').live('click', function(e) {
    e.preventDefault();
    var me = $(this);
        $.fancybox({
          ajax : {
            type  : "GET",
          },
          onComplete: function(){
            $('#fancybox-wrap').draggable({handle: '#gs_tabs'});
            $('#gs_tabs').css('cursor', 'move');
          },
          href: me.attr('href')
        });
    });


// for gold_standard_disable process

  window.gs_ids = [];
  window.gs_delete_button = $('#gs_delete');
  window.gs_enable_button = $('#gs_enable');

  function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
  }

  function show_enable_gs(){
    return getURLParameter("gs_type") == 'disabled' ? true : false;
  }

  $(document).on('change','.gs_checkbox',function(){

    $(this).toggleClass('active');

    if($(this).is(':checked')){
      $(this).parents('tr').addClass('highlight');
      gs_ids.push($(this).data('id'));
    }else{
      $(this).parents('tr').removeClass('highlight');
      var index = gs_ids.indexOf($(this).data('id'));
      gs_ids.splice(index, 1);
    }
    if($('.gs_checkbox').hasClass('active')){
      gs_delete_button.css('visibility','visible');
      if(show_enable_gs())
        gs_enable_button.css('visibility','visible');
    }else{
      gs_delete_button.css('visibility','hidden');
      gs_enable_button.css('visibility','hidden');
    }
    if( $('input.gs_checkbox').length === $('input.gs_checkbox.active').length )
      $('.dataTable #gs_check_all').attr('checked','checked').addClass('active');
    else
      $('.dataTable #gs_check_all').removeAttr('checked').removeClass('active');
  });

  $(document).on('change','#gs_check_all',function(){
    $(this).toggleClass('active');

    if($(this).hasClass('active')){
      $('.gs_checkbox').addClass('active').parents('tr').addClass('highlight');
      gs_ids = $('.gs_checkbox.active').map(function(){ return $(this).data('id'); }).get();
      if (gs_ids.length > 0)
        gs_delete_button.css('visibility','visible') ;
        if(show_enable_gs() && gs_ids.length > 0)
          gs_enable_button.css('visibility','visible') ;
    }else{
      $('.gs_checkbox').removeClass('active').parents('tr').removeClass('highlight');
      gs_delete_button.css('visibility','hidden');
      gs_enable_button.css('visibility','hidden');
      gs_ids = [];
    }

  });

  window.process_gs = function (process_url){
    $('#data_table_processing').fadeIn();
    var url = process_url  ;
    console.log(url);
    $.ajaxSetup({
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    }});
    $.ajax({
      type: 'POST',
      url: url,
      dataType : 'json',
      data: {'gs_ids' : gs_ids},
       success: function(response){
          oTable.fnDraw();
          $('#gs_delete').css('visibility','hidden');
          $('#gs_enable').css('visibility','hidden');
       }
   });
  }

  $('#delete_gold_standard').click(function(e){
    e.preventDefault();
    if( confirm('Are you sure you want to delete this gold standard? All unresolved appeals will be automatically approved.') ){
      this.innerHTML='Deleting';
      var _gs_ids = $(this).data('id');
      var url = this.href;
      $.ajax({
        type: 'POST',
        url: url,
        dataType : 'json',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
        },
        data: {'gs_ids' : _gs_ids},
         success: function(response){
            window.location = url.replace('delete','');
         }
      });
    }else{
      return false;
    }

  });

  //gold standards show portion

  $(".select_worker_checkbox").click(function(e){
    e.stopPropagation() }
  );

  $('#appealed_table tbody tr').click(function(e){

    if($(e.target).hasClass('first'))
    {
      $(e.target).find('input').click();
      return false;
    }
    var _data = $(this).closest('tr').data('options');
    var worker_id = _data.id;
    var appealed_on = _data.appealed_on;
    var comment = _data.comment;
    var content =['<h2>Appeal Details</h2><br/><div class="details"><span class="appeal_label"> Worker Id : </span><span class="worker_id">'+worker_id+'</span></div><div class="details"><span class="appeal_label"> Appealed On : </span><span class="appealed_date">'+appealed_on+'</span></div><div class="details"><span class="appeal_label"> Comment : </span><span class="comment">'+ comment+'</span><br /><br /><a class="pull-right view_shot" href="http://appeal-images.s3.amazonaws.com/'+Rails.env+'/appeal_'+this.id+'.png" target="_blank">View screenshot</a></div>' ]
    $.fancybox(content,{width: 600,autoDimensions: false, height: 220});
  });

  window.appealed_table = $("#appealed_table");
  $('#select_all_review_task').on('click', function(){
  if ($(this).is(':checked')){
    appealed_table.find('input').attr('checked','checked');
  }else{
    appealed_table.find('input').removeAttr('checked');
  }
  var len = $('.select_worker_checkbox.active').length;
  $('#total_selected_appeal').html(len+' Appeals Selected.');
  });

  window.appeal_ids = [];
  window.gs_action = $('#gs_action');

  $(document).on('change','.select_worker_checkbox',function(){
    $(this).toggleClass('active');

    if($(this).is(':checked')){
      $(this).parents('tr').addClass('highlight');
      var str  = $(this).parent().parent('tr').text();
      $('#appealed_table tbody tr:contains("'+str+'")').addClass('highlight').find('input').attr('checked',true).addClass('active');
      appeal_ids = $('.select_worker_checkbox.active').map(function(){ return $(this).data('id'); }).get();
    }
    else{
      $(this).removeClass('active').parents('tr').removeClass('highlight');
      var index = appeal_ids.indexOf($(this).data('id'));
      appeal_ids.splice(index, 1);
    }
    if($('.select_worker_checkbox').hasClass('active')){
      gs_action.css('visibility','visible');
    }
    else{
      gs_action.css('visibility','hidden');
    }
    var len = $('.select_worker_checkbox.active').length;
    if( len == $('.select_worker_checkbox').length){
      $('input#select_all_review_task').addClass('active').attr('checked',true);
    }
    else{
      $('input#select_all_review_task').removeClass('active').attr('checked',false);
    }
    $('#total_selected_appeal').html(len+' Appeals Selected.');
  });

  $(document).on('change','#select_all_review_task',function(){
    $(this).toggleClass('active');

    if($(this).hasClass('active')){
      $('.select_worker_checkbox').addClass('active').attr('checked',true).parents('tr').addClass('highlight');
      appeal_ids = $('.select_worker_checkbox.active').map(function(){ return $(this).data('id'); }).get();
    }else{
      $('.select_worker_checkbox').removeClass('active').removeAttr('checked').parents('tr').removeClass('highlight');
      gs_action.css('visibility','hidden');
      appeal_ids = [];
    }
    if($('.select_worker_checkbox').hasClass('active')){
      gs_action.css('visibility','visible');
    }

  });

  $("#preview").fancybox({
    ajax : {
        type  : "GET",
    },
    onComplete: function(){
      $('#fancybox-wrap').draggable({handle: '#gs_tabs'});
      $('#gs_tabs').css('cursor', 'move');
    },
  });

  $(document).on('click', 'a[data-gid-link-id]', function(e){
    e.preventDefault();
    var reg = /\/$/, id = $(this).data('gid-link-id'), path;
    if(reg.test(location.pathname)){
      path = location.pathname+id;
    }else{
      path = location.pathname+'/'+id;
    }
    window.location = path;
  });

  function success_msg(action_word){
    var msg_action = (action_word == "approve") ? "Approved" : "Rejected" ;
    var txt = "Appeals Successfully "+ msg_action+".";
    $.gritter.add({
    text: txt,
    class_name: 'gritter-notice'
    });
  }

  window.approve_appeal = function (approve_url, action){
    var _comment = $('#action_comment')[0].value;
    var url = approve_url;
    var _appeal_str = appeal_ids.join(', #');
    $('#'+_appeal_str).fadeOut(300, function(){ $(this).remove(); });
    $.ajax({
      type: 'POST',
      url: url,
      dataType : 'json',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
      },
      data: {'appeal_ids' : appeal_ids, 'appeal_action': action, 'comment': _comment},
       success: function(response){
        success_msg(action);
        $('.gs_mass_action').removeAttr('disabled');
        $('#action_comment').val('');
        gs_action.css('visibility','hidden');
        $('#total_selected_appeal').html("");
        var ids_len = appeal_ids.length;
        appeals = [];
        var rem = appeals_count - ids_len;
        appeals_count = appeals_count - ids_len;
        $('#appeal_pagi').html("Showing "+rem+" Appeals");
       }
   });
  };

  $('.dataTables_filter input').unbind();
  $('.dataTables_filter input').bind('keyup', function(e) {
    if(e.keyCode == 13) {
      dTable.fnFilter(this.value);
    }
  });

  window.alsortFlag = true;
  $(window).scroll(function(){
    if((window.scrollY > $(".al_sort").offset().top) && window.alsortFlag){
      window.alsortFlag = false;
      window.topPosition = window.scrollY;
      $(".al_sort").css("position","fixed").css("z-index",'1').css('top','60px');
      $(".dataTables_filter label").css("position","fixed").css("z-index",'1').css('top','90px');
      $(".al_sort").css('padding-bottom',0);
      $(".dataTables_filter label").css('padding-bottom',0);
    } else if((window.scrollY < window.topPosition) && !window.alsortFlag){
      window.alsortFlag = true;
      $(".al_sort").css("position","relative").css("z-index",'1').css('top','10px');
      $(".dataTables_filter label").css("position","relative").css("z-index",'1').css('top','10px');
      $(".al_sort").css('padding-bottom',10);
      $(".dataTables_filter label").css('padding-bottom',10);
    }
  });

});