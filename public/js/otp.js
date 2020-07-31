const inputQty = 4;
const OTPKEY = "OTP";
const FORM_ACCESS = "FORM_ACCESS";



getCodeBoxElement = (index) =>
    document.getElementById('codeBox' + index);

onKeyUpEvent = (index, event) => {
    const eventCode = event.which || event.keyCode;
    if (getCodeBoxElement(index).value.length === 1) {
        if (index !== 4) {
            getCodeBoxElement(index + 1).focus();
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

onFocusEvent = (index) => {
    for (item = 1; item < index; item++) {
        const currentElement = getCodeBoxElement(item);
        if (!currentElement.value) {
            currentElement.focus();
            break;
        }
    }
}

onClose = () => {
    cleanValues();
    onDisposeClose();
}

onAccept = () => {
    cleanValues();
    window.location.href = '/form';
}

cleanValues = () => {
    for (let index = 0; index < inputQty; index++)
        getCodeBoxElement(index + 1).value = "";
}

onDisposeSuccess = () =>
    $("#successModal").modal('hide');

onDisposeClose = () => $("#errorModal").modal('hide');


validateOtp = () => {
    let otp = $("#codeBox1").val() + $("#codeBox2").val() + $("#codeBox3").val() + $("#codeBox4").val();
    if (otp.length != inputQty) {
        alert("Enter correct OTP");
        return;
    }
    var otpStorage = localStorage.getItem(OTPKEY);

    if (otpStorage != null && otpStorage == otp) {
        $("#errorModal").modal('show');
        return;
    }

    let body = JSON.stringify({
        "code": parseInt(otp)
    });

    $.ajax({
        method: 'POST',
        url: '/verifyOtp',
        data: body,
        dataType: 'json',
        headers: {
            "Content-Type": "application/json"
        },
        success: function(data) {
            if (!data.status)
                $("#errorModal").modal('show');
            else {
                localStorage.setItem(OTPKEY, parseInt(otp));
                localStorage.setItem(FORM_ACCESS, true);

                $("#successModal").modal('show');
            }


        },
        error: () => alert('Error occured'),
    });

}