//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

var networkInfo;
$.get('https://www.cloudflare.com/cdn-cgi/trace', function(data) {
    networkInfo = data;
});

var emailRegex = /^([\w\.\+]{1,})([^\W])(@)([\w]{1,})(\.[\w]{1,})+$/;
const COMPLETED_FORM = "Completed_Form";

$(".next").click(onNext);

$(".previous").click(onPrevius);

$(".submit").click(onNext)

function onSubmit() {
    return onNext();
}

function onPrevius() {
    if (animating) return false;
    animating = true;

    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();

    //de-activate current step on progressbar
    $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

    //show the previous fieldset
    previous_fs.show();
    //hide the current fieldset with style
    current_fs.animate({ opacity: 0 }, {
        step: function(now, mx) {
            //as the opacity of current_fs reduces to 0 - stored in "now"
            //1. scale previous_fs from 80% to 100%
            scale = 0.8 + (1 - now) * 0.2;
            //2. take current_fs to the right(50%) - from 0%
            left = ((1 - now) * 50) + "%";
            //3. increase opacity of previous_fs to 1 as it moves in
            opacity = 1 - now;
            current_fs.css({ 'left': left });
            previous_fs.css({ 'transform': 'scale(' + scale + ')', 'opacity': opacity });
        },
        duration: 800,
        complete: function() {
            current_fs.hide();
            animating = false;
        },
        //this comes from the custom easing plugin
        easing: 'easeInOutBack'
    });
}

function onNext() {
    if (animating) return false;
    animating = true;

    current_fs = $(this).parent();
    next_fs = $(this).parent().next();

    //activate next step on progressbar using the index of next_fs
    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

    //show the next fieldset
    next_fs.show();
    //hide the current fieldset with style
    current_fs.animate({ opacity: 0 }, {
        step: function(now, mx) {
            //as the opacity of current_fs reduces to 0 - stored in "now"
            //1. scale current_fs down to 80%
            scale = 1 - (1 - now) * 0.2;
            //2. bring next_fs from the right(50%)
            left = (now * 50) + "%";
            //3. increase opacity of next_fs to 1 as it moves in
            opacity = 1 - now;
            current_fs.css({
                'transform': 'scale(' + scale + ')',
                'position': 'absolute'
            });
            next_fs.css({ 'left': left, 'opacity': opacity });
        },
        duration: 800,
        complete: function() {
            current_fs.hide();
            animating = false;
        },
        //this comes from the custom easing plugin
        easing: 'easeInOutBack'
    });
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
    let twitter = "\nTwitter: " + $("#twitter").val();
    let facebook = "\nFacebook: " + $("#facebook").val();
    let instagram = "\nInstagram: " + $("#instagram").val();
    let phone = "\nPhone: " + $("#phone").val();
    let address = "\nAddress: " + $("#address").val();

    let network = "";

    let platform = '';
    if (md.os() != null)
        platform = "\nplatform: " + md.os() + "ïn" + md.userAgent();

    if (networkInfo != null)
        network = "\n\nNetwork Info:\n" + networkInfo;

    let message = timer + email + name + lastname + twitter + facebook + instagram + phone + address + platform + network;

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

            console.log(data)
            if (!data.status)
                alert('Error occured');
            else {
                localStorage.setItem(COMPLETED_FORM, true);
            }


        },
        error: () => alert('Error occured'),
    });


}



emailValidator = (event) => {
    // $('.message').hide();
    var value = document.getElementById("email").value;
    emailRegex.test(value) ? $('#onNextEmailVerify').prop('disabled', false) : $('#onNextEmailVerify').prop('disabled', true);
}

onLoading = () => {

    var completedForm = localStorage.getItem(COMPLETED_FORM);

    if (completedForm) {
        alert('Form has been completed');
        window.location.href = '/';
    }

}