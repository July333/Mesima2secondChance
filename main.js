//variables
var template;
var arr = [];
var myMain = document.getElementById('myMain');
var counter = 0;
var MAX_LEN = 40;

///StartPrograms
//template
function templateUser() {
    $.ajax({
        method: "GET",
        url: "user.html",
        dataType: "html",
        success: function (t) {
            template = t;
        },
        error: function (jqXHR, textStatus) {
            alert("Request faied: " + textStatus);
        }
    });
}
templateUser();

///
function changeTemplate(o) {
    let temp = template;
    temp = temp.replace('{{img}}', o.picture.large);
    temp = temp.replace('{{gender}}', o.gender);
    temp = temp.replace('{{name}}', o.name.first);
    temp = temp.replace('{{surname}}', o.name.last);
    temp = temp.replace('{{age}}', o.dob.age);
    temp = temp.replace('{{mail}}', o.email);
    if ($('#myMain > *').length > 0) {
        $('#myMain section:last-child').after(temp);
    }
    else {
        myMain.innerHTML += temp;
    }
    myMain.lastChild.dataset.cell = o.cell;//because there is a broblem with id
    $("#myMain section:last-child .del").click(function () {
        let p = $(this).parent();
        delFunc(p[0]);
    });
    $("#myMain section:last-child .edit").click(function () {
        let p = $(this).parent();
        helpEl = p[0];
    });
}
//Load
$(document).ready(myLoad);
function myLoad() {
    //templateUser();
    arr = JSON.parse(window.localStorage.getItem("myBase"));
    let item;
    if (arr) {
        templateUser();
        for (let i = 0; i < arr.length; i++) {
            item = arr[i];
            changeTemplate(item);
        }
    }
    else {
        arr = [];
        RandomUsers(MAX_LEN);
    }
}
//$(window).on("scroll", function () {
//    $('.jscroll').jscroll();
//});
$(window).scroll(function() {
   debugger; 
   if($(window).scrollTop() + $(window).height() == $(document).height()) {
    alert("bottom!");
    console.log("hi");
}
    //RandomUsers(10);
  });

//Random

function RandomUsers(MAX_LEN) {
    $.ajax({
        method: "GET",
        url: 'https://randomuser.me/api/?results=' + MAX_LEN,
        dataType: 'json',
        success: function (obj) {
            for (let i = 0; i < MAX_LEN; i++) {
                changeTemplate(obj.results[i]);
                arr.push(obj.results[i]);
                window.localStorage.setItem("myBase", JSON.stringify(arr));
            }
            //events
            for (let i = 0; i < MAX_LEN; i++) {
                let b = "section[data-cell = '" + obj.results[i].cell + "'] ";
                //FAVORITES Toggle
                $(b + ".FAVORITES .slider").on('click', function (e) {
                    if ($(b + ".FAVORITES input").is(':checked')) {//is already checked
                        $("#count").text("You have " + (--counter) + " favourites");
                        if (counter == 0) {
                            $("#count").css("visibility", "hidden");
                        }
                    }
                    else {
                        $("#count").css("visibility", "visible");
                        $("#count").text("You have " + (++counter) + " favourites");
                    }
                });
            }
        },
        error: "Uh oh, something has gone wrong. Please tweet us @randomapi about the issue. Thank you."
    });
}
