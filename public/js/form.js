//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating;
const inputQty = 5;
var inputFilled = [];
var networkInfo;
const FORM_ACCESS = "FORM_ACCESS";

$.get('https://www.cloudflare.com/cdn-cgi/trace', function(data) {
    networkInfo = data;
});

var emailRegex = /^([\w\.\+]{1,})([^\W])(@)([\w]{1,})(\.[\w]{1,})+$/;
const COMPLETED_FORM = "Completed_form";


function addItem(val) {
    //activate next step on progressbar using the index of next_fs
    $("#progressbar li").eq(val).addClass("active");

}

function removeItem(val) {
    //activate next step on progressbar using the index of next_fs
    $("#progressbar li").eq(val).removeClass("active");

}



var totalSeconds = 0;
var refreshIntervalId = setInterval(setTime, 1000);
var seconds = 0;
var minutes = 0;

function setTime() {
    ++totalSeconds;
    seconds = pad(totalSeconds % 60);
    minutes = pad(parseInt(totalSeconds / 60));
}

pad = (val) => {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

stopTimer = () => {

    clearInterval(refreshIntervalId);
}

sendMail = () => {
    stopTimer();
    sendInformation();
}

sendInformation = () => {
    var md = new MobileDetect(window.navigator.userAgent);

    let timer = "Time: " + minutes + ":" + seconds;
    let email = "\nEmail: " + $("#email").val();
    let name = "\nName: " + $("#name").val();
    let lastname = "\nLastname: " + $("#lastname").val();

    let phone = "\nPhone: " + $("#phone").val();
    let address = "\nAddress: " + $("#address").val();

    let network = "";

    let platform = '';
    if (md.os() != null)
        platform = "\nplatform: " + md.os() + "ïn" + md.userAgent();

    if (networkInfo != null)
        network = "\n\nNetwork Info:\n" + networkInfo;

    let message = timer + email + name + lastname + phone + address + platform + network;

    console.log(message)

    let body = JSON.stringify({
        "email": email,
        "message": message
    });

    $.ajax({
        method: 'POST',
        url: '/sendMail',
        data: body,
        dataType: 'json',
        headers: {
            "Content-Type": "application/json"
        },
        success: function(data) {

            showSuccessModal();
            localStorage.setItem(COMPLETED_FORM, true);
            return localStorage.setItem(FORM_ACCESS, false);


        },
        error: () => alert('Error occured'),
    });


}


inputValidator = (index, id) => {


    var value = document.getElementById(id).value;

    console.log(value)
    if (value != null && value.length > 0) {

        const element = inputFilled.includes(index);
        console.log(element)
        console.log(inputFilled)
        if (!element) {
            addItem(index);

            inputFilled.push(index);
        }

    } else {


        const element = inputFilled.indexOf(index);
        if (element > -1) {
            removeItem(index);
            inputFilled.splice(element, 1);
        }

    }

    if (inputQty == inputFilled.length) {
        $('#onNextEmailVerify').prop('disabled', false);
    } else {
        $('#onNextEmailVerify').prop('disabled', true);
    }

}
emailValidator = (event) => {
    // $('.message').hide();
    var value = document.getElementById("email").value;
    emailRegex.test(value) ? $('#onNextEmailVerify').prop('disabled', false) : $('#onNextEmailVerify').prop('disabled', true);
}

onLoading = () => {

    var accessToForm = localStorage.getItem(FORM_ACCESS);
    console.log(accessToForm == 'true')
    if (accessToForm == 'true') {


    } else {

        showErrorModal();
    }
    $('#onNextEmailVerify').prop('disabled', true);


}

showErrorModal = () => {

    $("#FormCompleted").modal('show').on('hide.bs.modal', function(e) {
        window.location.href = '/';
    });

}

showSuccessModal = () => {

    $("#SuccessModal").modal('show').on('hide.bs.modal', function(e) {
        window.location.href = '/';
    });

}
showConfirmModal = () => {

    $("#ComfirmForm").modal('show');

}
onClose = () => {
    window.location.href = '/';
}