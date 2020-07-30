const inputQty = 4;

getCodeBoxElement = (index) =>
    document.getElementById('codeBox' + index);

verifier = (value) => this.value ?
    this.value = this.value.replace(/[^0-9]/g, '') : '';

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
    /// TODO: FILL WITH CORRECT PATH
    /// DON'T ALLOW BACK AND FORWAR
    window.location.href = '/path';
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
    if (otp.length != 4) {
        alert("Ingrese un OTP correcto");
        return;
    }

    let body = JSON.stringify({
        "code": parseInt(otp)
    });

    $.ajax({
        method: 'POST',
        url: '/searchOtp',
        data: body,
        dataType: 'json',
        headers: {
            "Content-Type": "application/json"
        },
        success: function(data) {
            if (!data.status)
                $("#errorModal").modal('show');
            else
                $("#successModal").modal('show');


        },
        error: () => alert('Error occured'),
    });

}