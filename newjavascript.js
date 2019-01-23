$(function() {
    
    $("#selection").hide();
    $("#continue").hide();
    $("#play").hide();
    
    //MESSAGES DISPLAY
    var paras = [];
    $("p").each(function(i) {
        paras[i]= $(this);
        
    });
       
    var current = 0;
    
    $("#message").html("<p>" + paras[0].html() + "</p>");
    
    setInterval(function() {
       current++;
       if (current === paras.length)
           current = 0;
       $("#message p").animate({left: 400, opacity: 0}, 300, function() {
           $("#message p").html(paras[current].html());
       });
       $("#message p").animate({left: 0, opacity: 1}, 300);
    }, 2000);
    //-----------------------------------------------------
    
    //FROM START TO SELECTION SCREEN
    $("#start").click(function() {
       $("div#welcomePage").fadeOut(1000);
       $("div#selection").delay(1000).fadeIn(1000);
    });
    
    var images = [];
    var selected = null;
    
    $(".icon").each(function(i){
        images[i] = $(this);
    });
    //------------------------------------------------------
    
    //SELECT A PICTURE
    $(".icon").click(function(){
        $("#continue").show();
        
        for (var i=0; i< images.length; i++){
            if (images[i].hasClass("selected"))
                images[i].removeClass("selected");
        }
        
        $(this).addClass("selected");
        selected = $(this);
    });
    //--------------------------------------------------------
    
    //DISPLAY THE BOARD
    $("#continue").click(function() {
        if (selected !== null) {
            $("div#selection").fadeOut(1000);
            $("div#play").delay(1000).fadeIn(1000);
            
            $(".piece").each(function(i) {
                var id = $(this).attr("id");
                var src = selected.attr('src');
                
                $(this).css("background-image", "url(" + src + ")");

                if (id % 3 === 1) {
                    $(this).css("left", "2px");
                    $(this).css("background-position-x", "0px");
                } else if (id % 3 === 2) {
                    $(this).css("left", "154px");
                    $(this).css("background-position-x", "-150px");
                } else {
                    $(this).css("left", "306px");
                    $(this).css("background-position-x", "-300px");
                }

                if (id == 1 || id == 2 || id == 3) {
                    $(this).css("top", "2px");
                    $(this).css("background-position-y", "0px");
                }
                else if (id == 4 || id == 5 || id == 6) {
                    $(this).css("top", "154px");
                    $(this).css("background-position-y", "-150px");
                }
                else {
                    $(this).css("top", "306px");
                    $(this).css("background-position-y", "-300px");
                }
                
            }); 
        }
    });
    //--------------BOARD INITIALIZED-------------------------------------------
    
    //SELECT OPTION AND SHUFFLE
    $("select").on("change",function(){
        var selected = $(this).children("option:selected").val();
        //alert(selected);
        
        if ($("#shuffle").length === 0)
            $("<input type=\"button\" id=\"shuffle\" class=\"btn\" value=\"SHUFFLE\">").appendTo("div#menu");
        
        $("#shuffle").unbind("click");
        $("#shuffle").click(function() {
            
            
            //REMOVE OBJECTS
            $("div#menu").fadeOut(500, function() {
               $(this).remove(); 
            });
            
            //SHUFFLE ANIMATION STARTS HERE
            shufflePieces(0, selected, -1);
            
            findMovable();
        });
    });
    //---------------------------------------------------------------------------
    
    function shufflePieces(i, selected, prev ) {
        if (i < selected) {
            i++;
            findMovable();
            var movables = [];
            $(".movable").each(function(i) {
                movables[i] = $(this);
            });
            
            do {
                var r = Math.floor(Math.random() * movables.length);
            } while (movables[r].attr("id") === prev);
            prev = movables[r].attr("id");
            
            var eTop = parseInt($(".empty").css("top"));
            var eLeft = parseInt($(".empty").css("left"));
            var rTop = parseInt(movables[r].css("top"));
            var rLeft = parseInt(movables[r].css("left"));
            
            var temp;
            
            if (eTop === rTop) {
                
                temp = eLeft;
                eLeft = rLeft;
                rLeft = temp;
               
                $(".empty").css("left", eLeft + "px");
                movables[r].animate({left: rLeft}, 4000/selected, function() {shufflePieces(i, selected, prev);});
            }
            else if (eLeft === rLeft) {
                
                temp = eTop;
                eTop = rTop;
                rTop = temp;
              
                $(".empty").css("top", eTop + "px");
                movables[r].animate({top: rTop}, 4000/selected, function() {shufflePieces(i, selected, prev);});
            }
        }
        //----------------------------------------------------------------------------------------------------
        //PLAY GAME STARTS HERE
        else {
            findMovable();

            $("<div id=\"playMessage\"><h1 id=\"msgBottom\">SOLVE THE PUZZLE<h1></div>").appendTo("#play");
            
            onDiv = false; //IF MOUSE IS ON THE PUZZLE
            
            //EVENT HANDLERS FOR HIGHLIGHTING MOVABLE PIEECS
            $("#game").hover(function() {
                $(".piece").css("opacity", 0.7);
                $(".movable").css("opacity", 1);
                onDiv = true;
            }, function() {
               $(".piece").css("opacity", 1);
               console.log("testOut");
               onDiv = false;
            }).mousemove( function() {
                $(".piece").css("opacity", 0.7);
                $(".movable").css("opacity", 1);
                onDiv = true;
            }).mouseover(function() {
                $(".piece").css("opacity", 0.7);
                $(".movable").css("opacity", 1);
                onDiv = true;
            });
            
            //MOVING PIECES ON CLICK
            $(".piece").click(function() {
                console.log("ekjfbhsbf");
                if (isMovable($(this))) {
                    var eTop = parseInt($(".empty").css("top"));
                    var eLeft = parseInt($(".empty").css("left"));
                    var rTop = parseInt($(this).css("top"));
                    var rLeft = parseInt($(this).css("left"));

                    var temp;

                    if (eTop === rTop) { //same row

                        temp = eLeft;    //swap left value
                        eLeft = rLeft;
                        rLeft = temp;

                        $(".empty").css("left", eLeft + "px");
                        
                        $(this).animate({left: rLeft}, 500, function() {
                            findMovable();
                            
                            if(onDiv) {
                                $(".piece").css("opacity", 0.7);
                                $(".movable").css("opacity", 1);
                            }
                            
                            //CHECK IF SOLVED
                            checkSolved();
                        });
                        $(this).css("opacity", 1);  //to change opacity at the same time
                    }
                    else if (eLeft === rLeft) {  //same column
                        
                        temp = eTop;            //swap top value
                        eTop = rTop;
                        rTop = temp;

                        $(".empty").css("top", eTop + "px");
                        
                        $(this).animate({top: rTop}, 500, function() {
                            findMovable();
                            
                            if (onDiv) {
                                $(".piece").css("opacity", 0.7);
                                $(".movable").css("opacity", 1);
                            }
                            
                            //CHECK IF SOLVED
                            checkSolved();
                        });
                        $(this).css("opacity", 1);  //to change opacity at the same time
                    }
                }
            });
        }
    }
    
    function isMovable(thisPiece) {
        eTop = parseInt($(".empty").css("top"));
        eLeft = parseInt($(".empty").css("left"));
        myTop = parseInt(thisPiece.css("top"));
        myLeft = parseInt(thisPiece.css("left"));
        if ((myTop === eTop && Math.abs((eLeft - myLeft)) === 152) ||
            (myLeft === eLeft && Math.abs((eTop - myTop)) === 152))
                return true;
        return false;
    }
    
    function checkSolved() {
        if (isSolved()) {
            //alert("congratulajfba");
            $("#msgBottom").fadeOut(1000, function() {
            $(this).text("Press F5 to restart"); 
            }).fadeIn(1000);
            $(".piece").removeClass("movable");
            $("#game").unbind("mouseenter mouseleave");
            $("#game").unbind("mousemove mouseover");
            $(".piece").unbind("click");
            $("#game").css("opacity", 0.4);
            $("<div id=\"end\"><h1>CONGRATULATIONS</h1></div>").appendTo("#play");
            $("#end").hide(0).slideDown(1500);
        }
    }
    
    function findMovable() {

        $(".piece").each(function() {
             eTop = parseInt($(".empty").css("top"));
             eLeft = parseInt($(".empty").css("left"));

             myTop = parseInt($(this).css("top"));
             myLeft = parseInt($(this).css("left"));

             $(this).removeClass("movable");
             if ((myTop === eTop && Math.abs((eLeft - myLeft)) === 152) ||
                 (myLeft === eLeft && Math.abs((eTop - myTop)) === 152)) {
                 $(this).addClass("movable");
             }
        });
        
    }

    function isSolved() {
        
        var id = [];
        $(".piece").each(function(i) {
            id[i] = $(this);
        });    
            
        console.log(id);
        
        for (var j = 0; j < id.length; j++) {
            console.log(id[j].attr("id"));
            if (id[j].attr("id") % 3 == 1) {
                
                if(parseInt(id[j].css("left")) !== 2)
                    return false;
            } else if (id[j].attr("id") % 3 == 2) {
                console.log("check");
                if(parseInt(id[j].css("left")) !== 154)
                    return false;
            } else {
                if(parseInt(id[j].css("left")) !== 306)
                    return false;
            }

            if (id[j].attr("id") == 1 || id[j].attr("id") == 2 || id[j].attr("id") == 3) {
                if(parseInt(id[j].css("top")) !== 2)
                    return false;
            }
            else if (id[j].attr("id") == 4 || id[j].attr("id") == 5 || id[j].attr("id") == 6) {
                if(parseInt(id[j].css("top")) !== 154)
                    return false;
            }
            else {
                if(parseInt(id[j].css("top")) !== 306)
                    return false;
            }
            
        }
        
        return true;
    }
    
});

