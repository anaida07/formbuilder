var initial_url = document.location.pathname;

function showAlert(message, type) {
  if( typeof type == 'undefined') {
    type = ''
  }

  $('#admin-body').prepend(
    $('<div/>').addClass('alert').addClass(type)
               .append( $('<a/>').addClass('close').attr('data-dismiss', 'alert').html('&times;') )
               .append(message)
  );
}

var initialize_transaction = function (){
  $('#transaction_date_filter').daterangepicker({
      ranges: {
           'Today': ['today', 'today'],
           'Yesterday': ['yesterday', 'yesterday'],
           'Last 7 Days': [Date.today().add({ days: -6 }), 'today'],
           'Last 30 Days': [Date.today().add({ days: -29 }), 'today'],
           'This Month': [Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()],
           'Last Month': [Date.today().moveToFirstDayOfMonth().add({ months: -1 }), Date.today().moveToFirstDayOfMonth().add({ days: -1 })]
      },
      opens: 'left',
      format: 'MM/dd/yyyy',
      separator: ' to ',
      maxDate: Date.today(),
      locale: {
          applyLabel: 'Submit',
          firstDay: 1
      },
      showWeekNumbers: true,
      buttonClasses: ['btn-danger']
       },
      function(start, end) {
        if( start == null && end == null)
         {
          $('#transaction_date_filter').val("");
          select_transaction();
         }else
         {
          $('#transaction_date_filter').val(start.toString('MMM d, yyyy') + ' - ' + end.toString('MMM d, yyyy'));
          select_transaction();
         }
       }
  );
}
