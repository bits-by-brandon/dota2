$(document).ready(function(){

    var currInfo = false;
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
    setClick();

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
        
        //console.log('x = ' + mouse.x + '  |  y = ' + mouse.y);
    });


    
    $('#map').draggable({ containment: "parent" });
        
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
        console.log( key );
        for ( i = 0; i < type.instance.length; i++ ){
            var coordinates = {
                'x' : type.instance[i].x,
                'y' : type.instance[i].y,
            }
            entry = '<div class="matrixItem" data-legend="'+ key +'" data-index="'+ i +'" style=" left:'+ (coordinates.x - 240) +'px; top:'+ ( coordinates.y - 20 ) +'px"></div>';
            $( '#map' ).prepend(entry);
        }

        // create the top tier list item and add to DOM
        entry = " <div id='info"+ count +"' class='infoP'> <img src='"+ type.image +"'> <h1>"+ type.name +"</h1> <p>"+ type.description +"</p> </div> ";
        //$( '#topList' ).append(entry);

        // create the top tier list item and add to DOM
        entry = " <li id='legend"+ count +"' class='legendItem' data-legend='"+ key +"'>"+ type.name +"</li> ";
        $( '#topList' ).append(entry);

    }

    $( '.matrixItem' ).click(function(){
        $this = $( this );
        legend = $this.data( 'legend' );
        console.log( legend );
        var coordinates = {
            'x' : data[legend].instance[ $this.data('index') ].x,
            'y' : data[legend].instance[ $this.data('index') ].y,
        }
        moveMap( coordinates.x, coordinates.y );
    })

    function moveMap(x,y){
        $('#map').stop().animate({
            left: ((x - ($('#map').width() - ($('#mapWindow').width()/2 - 275) )) * -1) + "px",
            top: ((y - ($('#map').height() - ($('#mapWindow').height()/2) )) * -1) + "px",
        }, 500, 'swing');
    }
    
    $( '.legendItem' ).click(function(){
        
        if (currInfo === false){
            //set the current Info pane
            currInfo = $( this ).data( 'legend' );

            activateUI( currInfo );

            //caching corresponding data from json
            instances = data[$(this).data('legend')].instance;
            name = data[$(this).data('legend')].name;
            image = data[$(this).data('legend')].image;
            description = data[$(this).data('legend')].info;

            //injecting info into dom
            entry = '<h1>' + name + '</h1><img id="infoImg" src="'+ image +'" alt="Dota 2 '+ name +'"> <h2 id="locations">Locations</h2><div id="dots"></div><p id="description">'+ description +'</p>';
            $( '#info' ).prepend( entry );

            //creates instances under map
            for( i = 0; i < instances.length; i++){
                instance = '<span class="dot" data-index="'+ i +'" style="-webkit-animation-delay:'+ i * 300 +'ms; animation-delay:'+ i * 300 +'"></span>'
                $( '#dots' ).append( instance );
            }
            setDots();
        }
    });

    function activateUI( legendKey ){
        $( '#legend' ).addClass( 'active' );
        $( '.legendItem' ).addClass( 'deactive' );
        for( i = 0; i < Object.keys(data).length; i++ ){
            console.log( 'legendKey: ' + legendKey + ', data-legend: ' + $('#legend' + i).data( 'legend' ) );
            if( $( '#legend' + i ).data( 'legend' ) === legendKey ){
                $( '#legend' + i ).removeClass( 'deactive' ).addClass('active');
            }
        }
        $( '#info' ).addClass('active');
        $( '#exit' ).addClass('active');
    }

    function deactivateUI(){
        $( '#legend' ).removeClass( 'active' );
        $( '.legendItem' ).removeClass( 'deactive active' );
        $( '#info' ).removeClass('active');
        $( '#exit' ).removeClass('active');

        window.setTimeout(function(){
            $( '#info' ).html('<span id="exit"></span>');
            setClick();
        },300);
    }

    function setDots(){
        $( '.dot' ).click(function(){
            var coordinates = {
                'x' : data[currInfo].instance[ $( this ).data( 'index' ) ].x,
                'y' : data[currInfo].instance[ $( this ).data( 'index' ) ].y,
            }
            moveMap( coordinates.x, coordinates.y );
        });
    }

    function setClick(){
        $( '#exit' ).click(function(){
            currInfo = false;
            deactivateUI();

        })
    };
    
});
