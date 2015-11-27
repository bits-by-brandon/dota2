$(document).ready(function(){

    var mouse = {
        "x" : 0,
        "y" : 0
    };
    $map = $('#map');
    map = {
        'x' : $map.css('left'),
        'y' : $map.css('top')
    };

    var containerWidth;
    var containerHeight;
    var containerLeft;
    var containerTop;

    windowSize();
    parentSize();

    $(window).resize(function(){
        windowSize();
        parentSize();
    });

    function windowSize(){
        $('#mapWindow').css('width', ( window.innerWidth - 225)+'px');
    }
    
    function parentSize(){        
        containerWidth = ($('#map').width())*2 - $('#mapWindow').width();
        containerHeight =  ($('#map').height())*2 - $('#mapWindow').height();
        containerLeft = ($('#map').width() - $('#mapWindow').width()) * -1 + 'px',
        containerTop =  ($('#map').height() - $('#mapWindow').height()) * -1 +'px',
        
        $('#mapContainer').css({
            'width': containerWidth+'px',
            'height': containerHeight+'px',
            //'left' : ($('#map').width() - $('#mapWindow').width()) * -1 + 'px',
            //'top': ($('#map').height() - $('#mapWindow').height()) * -1 +'px',
            'left' : containerLeft,
            'top': containerTop 
        });
    }

    $('html').mousemove(function( event ){
        map = {
            'x' : parseInt($map.css('left')),
            'y' : parseInt($map.css('top'))
        };

        mouse = {
            "x" : -1 * ( map.x + parseInt( containerLeft ) - event.pageX ),
            "y" : -1 * ( map.y + parseInt( containerTop ) - event.pageY )
        };
        
        console.log(containerWidth);
        console.log('x = ' + mouse.x + '  |  y = ' + mouse.y);
    });


    
    //$('#map').draggable({ containment: "parent" });
        
    $('#mapClick').click(function(){
        //close();
        $('.selected').each(function(){
            $(this).removeClass(' selected ');
        });
        $('.infoP').stop().animate({
            opacity : 0,
                left: '-30px'
            }, 250, 'swing');
    });
    
    function getInfo(number){
        number++;
        //$('.infoP').each(function(){
        //    if( ('#' + this.id) == ('#info'+number)){
            $('.infoP').stop().animate({
                opacity : 0,
                left: '-30px'
            }, 250, 'swing', function(){
                $('#info' + number).stop().animate({
                    opacity: 1,
                    left: '0px'
                }, 250, 'swing');
            });
        //   }
        //});
    }


    var count = 0;
    // ==== Iterating Over data ====
    for( var key in data ){
        if(data.hasOwnProperty(key)){
            var type = data[key];
            createEntry(type, key);
            count++;
        }
    }
    count = 0;

    // ==== Adds a div to the html for every type of data in the document =====
    function createEntry(type, key){
        // create coresponding dots on map
        entry = '<div class="matrixItem" data-matrix="'+ count +'" id="matrix'+ count +'"></div>';
        $( '#map' ).prepend(entry);

        // create the top tier list item and add to DOM
        entry = " <div id='info"+ count +"' class='infoP'> <img src='"+ type.image +"'> <h1>"+ type.name +"</h1> <p>"+ type.description +"</p> </div> ";
        //$( '#topList' ).append(entry);

        // create the top tier list item and add to DOM
        entry = " <li id='legend"+ count +"' class='legendItem' data-legend='"+ key +"'>"+ type[0].name +"</li> ";
        console.log(type);
        $( '#topList' ).append(entry);

    }
    
    $( '.legendItem' ).click(function(){
        foreach( data[$(this).data('legend')][0].instance ){
            console.log("yo");
        }
    });
    
    /*
    for(i=0; i<= matrixArray.length-1; i++){
		$(matrixArray[i]).click(function(){	
            for(i=0; i<= matrixArray.length-1 ;i++){
                $(legendArray[i]).removeClass("selected");
                $(matrixArray[i]).removeClass("selected");
                if('#'+this.id == matrixArray[i]){
                    getInfo(i);
                    open();
                    $(legendArray[i]).addClass("selected");
                    $(matrixArray[i]).addClass("selected");
                    var x = $("#matrix"+ (i+1)).position();
                    $('#map').stop().animate({
                        left: ((x.left - ($('#map').width() - ($('#mapWindow').width()/2) )) * -1) + "px",
                        top: ((x.top - ($('#map').height() - ($('#mapWindow').height()/2) )) * -1) + "px",
                    }, 500, 'swing');
                }
            }
		});
	}
    */
    
    
});
