$(document).ready(function() {
    var checkLen =0;

    // Centering the Form at the middle of screen
    debugger;
    var formHeight = $('.form-main').parent().innerHeight(),
        screenHeight = $('body').innerHeight() + 100,
        screenHeightwelc = $('body.success').innerHeight(),
        jumbHeight = $('.jumbotron').parent().innerHeight();
    if(screenHeight > formHeight) {
        $('.form-main').parent().css('margin-top', (screenHeight-formHeight)/2);
        $('.form-main').parent().css('margin-bottom', (screenHeight-formHeight)/2);
    }
    if(screenHeight > jumbHeight) {
        $('.jumbotron').parent().css('margin-top', (screenHeightwelc-jumbHeight)/2);
        $('body.success').css('height', screenHeightwelc-(screenHeightwelc-jumbHeight)/2);
    }

    // Clear placeholder on focus - Border Effect
    var placeholder;
    $('[placeholder]').on({
       focus: function() {
           placeholder = $(this).attr('placeholder');
           $(this).attr('placeholder', '');
           $(this).next('.effect').css({
               background:'#3498db',
               width:'0'
           }).animate({
               width:'100%',
           },300);
       },
        blur: function() {
           $(this).attr('placeholder', placeholder);
            $(this).next('.effect').animate({
                width:'0%',
            },300).css({
                background:'#3498db',
                width:'0'
            });
        }
    });

    $('.inner-checkbox').on('change',function(){
        // debugger;
        if(checkLen >= 2) {
            if($(this).prop('checked') == false) {
                checkLen--;
                $(this).siblings('.output').html('');
                return;
            } else {
                $(this).prop('checked', false);
                $('.modal').css('display','block');
                return;
            }
        }

        // if($(this).prop('checked') == false && checkLen > 0) {
        //     debugger;
        //     if(checkLen == 1) {
        //         $('.first_choice').val('');
        //     } else {
        //         $('.second_choice').val('');
        //     }
        // }

        if(checkLen === 0 ){
            $(this).siblings('.output').html('First Choice');
            $('.first_choice').val($(this).val());
        } else if(checkLen === 1 ) {
            var found = false;
            for(let i =0; i< $('.output').length; i++) {
                if($('.output').eq(i).html() == 'Second Choice') {
                    $(this).siblings('.output').html('First Choice');
                    $('.first_choice').val($(this).val());
                    found = true;
                }
            }
            if(!found) {
                $(this).siblings('.output').html('Second Choice');
                $('.second_choice').val($(this).val());
            }
        }
        if($(this).prop('checked') == true) {
            checkLen++;
        } else {
            checkLen--;
            $(this).siblings('.output').html('');
        }
    });
// sync the state to the input
    $(".image-checkbox").on("click", function (e) {
        if(checkLen >= 2) {
            if($(this).hasClass('image-checkbox-checked')) {
                $(this).removeClass('image-checkbox-checked');
                $(this).siblings('.sections').addClass('display');
                e.preventDefault();
                $(this).siblings('.sections').children().each(function() {
                    if($(this).find('.inner-checkbox').prop('checked') == true) {
                        $(this).find('.inner-checkbox').prop('checked', false);
                        $(this).find('.output').html('');
                        checkLen--;
                    }
                });
            } else
            {
                $('.modal').css('display','block');
            }
        } else {
            if($(this).hasClass('image-checkbox-checked')) {
                console.log($(this).siblings('.sections').children('.inner-checkbox').length);
            }
            $(this).toggleClass('image-checkbox-checked');
            $(this).siblings('.sections').toggleClass('display');
            e.preventDefault();
        }
    });

    $('[data-toggle="tooltip"]').tooltip({
        boundary: 'window',
        animation: true,
        html: true,
        delay: { "show": 400, "hide": 100 },
    });

    $(".text-input").each(function() {
        if($(this).attr('required')) {
            $(this).parent().append("<span class='position-absolute' style='top:60%; right:10px; color:red;'><strong>*</strong></span>");
        }
    });

    $('.modal-footer button, .modal-header button').on('click', function(){
        $('.modal').css('display','none');
    });

});