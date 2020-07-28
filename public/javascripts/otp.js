function getCodeBoxElement(index) {
    return document.getElementById('codeBox' + index);
}
  
function onKeyUpEvent(index, event) {
    const eventCode = event.which || event.keyCode;
    if (getCodeBoxElement(index).value.length === 1) {
      if (index !== 4) {
        getCodeBoxElement(index+ 1).focus();
        $('#sendOtp').prop('disabled', true);
      } else {
        getCodeBoxElement(index).blur();
        $('#sendOtp').prop('disabled', false);
      }
    }
    if (eventCode === 8 && index !== 1) {
      $('#sendOtp').prop('disabled', true);
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
  if(otp.length != 4){
    alert("Ingrese un OTP correcto");
    return;
  }

  $.ajax({
      type: "GET",
      url: '/searchOtp?otp=' + otp,
      dataType: 'json',
      success: function(data) {
          if(!data.status){
            alert("El otp ya esta siendo utilizado o no existe");
          } else { 
            //localStorage.setItem('status', true);
            //abrir modal
          }
      },
      error: function() {
          alert('Error occured');
      }
  });
}