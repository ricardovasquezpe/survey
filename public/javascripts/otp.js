function getCodeBoxElement(index) {
    return document.getElementById('codeBox' + index);
  }
  
function onKeyUpEvent(index, event) {
    const eventCode = event.which || event.keyCode;
    if (getCodeBoxElement(index).value.length === 1) {
      if (index !== 4) {
        getCodeBoxElement(index+ 1).focus();
      } else {
        getCodeBoxElement(index).blur();
        // Submit code
        console.log('submit code ');
      }
    }
    if (eventCode === 8 && index !== 1) {
      getCodeBoxElement(index - 1).focus();
    }
  }
  function onFocusEvent(index) {
    for (item = 1; item < index; item++) {
      const currentElement = getCodeBoxElement(item);
      if (!currentElement.value) {
          currentElement.focus();
          break;
      }
    }
  }


function validateOtp(){
  var otp = $("#codeBox1").val() + $("#codeBox2").val() + $("#codeBox3").val() + $("#codeBox4").val();
  $.ajax({
      type: "GET",
      url: '/searchOtp?otp=' + otp,
      dataType: 'json',
      success: function(data) {
          if(!data.status){
            // abrir modal
          } else { 
            localStorage.setItem('status', true);
          }
      },
      error: function() {
          alert('Error occured');
      }
  });
}