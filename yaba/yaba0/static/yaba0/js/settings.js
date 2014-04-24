if (typeof jQuery == 'undefined') {
    throw new Error("jQuery not loaded")
}

$(document).ready(function() {
    setup()
});

var base_url='/'

function setup () {
    setupVerify()
    setupSave()
}

function setupVerify() {
    var vb = $('#bm_settings_btn_verify')
    if (vb) {
        $(vb).unbind('click').click(function() {
            var email = $('#bm_settings_email').val().trim()
            if (email) {
                data = {
                    email: email,
                    action_send: ''
                }
                $.ajax({
                    url: base_url+'accounts/email/',
                    type: "post",
                    data: data,
                    success: function(d, stat, xhr) {
                        showDialog(
                        {
                            title: 'Email Confirmation Sent',
                            line1: 'An email is sent to the address "'+email+'"',
                            line2: 'Please check your email and confirm your email address'
                        })
                    },
                    error: function(xhr, stat, err) {
                        showDialog({
                            title: 'Failed to send Email Confirmation',
                            line1: 'An error occured while sending an email confirmation message:',
                            line2: '"('+stat+') '+err+'"'
                        })
                    },
                    beforeSend: function(xhr, settings) {
                        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'))
                    },
                });
            }
        })
    }
}

function setupSave() {
    $('#bm_settings_save').unbind('click').click(function(e) {
        e.preventDefault()

        var email = $('#bm_settings_email').val().trim()
        if (email == '') {
            displayEmailError()
        } else {
            var data = {
                paginate_by: (function() {
                    var v = $('#bm_settings_paginate').val()
                    if (v=='nopage') {
                        v = "0"
                    }
                    return v
                    })(),
                email_notify: $('#bm_settings_notify').prop('checked'),
                push_notify: $('#bm_settings_notify').prop('checked'),
                notify_max: "-1",
                notify_current: "0",
                auto_summarize: $('#bm_settings_summarize').prop('checked'),
                email: encodeURI(email),
            }
            $.ajax({
                url: $('#bm_settings_save').attr('href')+'/.json',
                type: "put",
                data: data,
                success: function(d, stat, xhr) {
                    showDialog(
                    {
                        title: 'Settings Updated',
                        line1: 'Settings were updated successfully',
                        line2: ''
                    }, true)
                },
                error: function(xhr, stat, err) {
                    showDialog({
                        title: 'Settings Update Failed',
                        line1: 'An error occured while updating the settings:',
                        line2: (function() {
                            var err = JSON.parse(xhr.responseText)
                            return err.err_msg.join("")
                        })()
                    }, true)
                    
                },
                beforeSend: function(xhr, settings) {
                    xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'))
                },
            });
        }
    })
}

function displayEmailError() {
    var email_input_group = $('#bm_email_input_group')
    var email_verified_span = $('#bm_email_verified_span')
    $(email_input_group).addClass('has-error')
    if (email_verified_span) {
        $(email_verified_span).addClass('glyphicon-remove')
    }
    $(email_input_group).tooltip({title: 'Email address is missing'}).tooltip('show')    
}

function showDialog(msg, reload) {
    $('#resultTitle').text(msg.title)
    $('#resultTextLine1').text(msg.line1)
    $('#resultTextLine2').text(msg.line2)
    $('#result').modal('show')
    $('#result').unbind('hidden.bs.modal').on('hidden.bs.modal', function() {
        if (reload) location.reload()
    })
}

// From Django help pages
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}