$(document).ready(function () {
    // $('#ini_table').DataTable();
    var ini_table = $('#ini_table').DataTable( {
        responsive: true,
    } );

    $('.movie-search').click(function(){
        test();
        modalClick();
    });
});

function test() {
    var table = '';
    var movie = [];
    var hasil = [];
    var isi = $("#isi").val()
    // $('#test').html(table)
    $.ajax({
        url: 'https://api.tvmaze.com/search/shows?q='+isi,
        method: 'get',
        dataType: 'json',
        async: false,
        cache: false,
        success: function (response) {
            // debugger;
            console.log(response.length);
            movie = response;
            // hasil2 = movie['feeds']
            // ini_table.clear().draw();
            console.log(response['show']);
            for (var i = 0; i < movie.length; i++) {
                var list = movie[i];
                var index = i+1;
                var images =list['show']['image'];
                var name =list['show']['name'];
                var desc = list['show']['summary'];
                if (images==null || images==undefined){
                    images = '';
                }else{
                    images = images['medium'];
                }
                var genres = list['show']['genres'];
                if (genres==null || genres==undefined || genres==''){
                    genres = '';
                }

                var schedule = list['show']['schedule'];
                if (schedule==null || schedule==undefined || schedule==''){
                    schedule = 'No Schedule';
                }else{
                    var schedule_days = schedule['days'];
                    var schedule_time = schedule['time'];
                    if (schedule_days==null || schedule_days==undefined || schedule_days==''){
                        schedule_days = 'No Day Schedule';
                    }else{
                        for (var j = 0; j < schedule_days.length; j++) {
                            if(j==1){
                                schedule_days +", "+ schedule_days;
                            }
                        }
                    }
                    if (schedule_time==null || schedule_time==undefined || schedule_time==''){
                        schedule_time = 'No Time Schedule';
                    }else{
                        for (var k = 0; k < schedule_time.length; k++) {
                            if(k==1){
                                schedule_time +", "+ schedule_time;
                            }
                        }
                    }
                }   
            // debugger;
                hasil.push([
                    index,//0
                    images,//1
                    name,//2
                    desc,//3
                    list['show']['id'],//4
                    list['score'],//5
                    genres,//6
                    schedule_days,//7
                    schedule_time //8
                ]) ;
            }
            push(hasil);
            // ini_table.rows.add(hasil).draw(false);
        }
    });
}

function push(hasil){
    $('#ini_table').DataTable().clear().draw();
    $.each(hasil, function() {
        $('#ini_table').DataTable().row.add([
            "<p align='center'>"+this[0]+"</p>",
            "<b>"+this[2]+"</b>",
            this[6],
            "<p>"+this[7]+"<br/>"+this[8]+"</p>",
            "<p align='center'><b>"+(parseFloat(this[5]).toFixed(2)/100)*100+"%</b></p>",
            "<button type='button' id='btn-desc' class='btn btn-success' value="+this[4]+">See Description</button>"
        ]).draw(false);
    });
    
}

function modalClick(){
    $("#btn-desc").click(function(){
        $("#myModal").modal();
        var id_mov = $(this).prop("value")
        isi_desc(id_mov);
    });
}

function isi_desc(id_mov){
    $.ajax({
        url: 'http://api.tvmaze.com/shows/'+id_mov,
        method: 'get',
        dataType: 'json',
        async: false,
        cache: false,
        success: function (response) {
           var desc_mov = response;
           var images = desc_mov['image'];
           if (images==null || images==undefined){
                images = '';
            }else{
                images = images['original'];
            }

            var schedule = desc_mov['schedule'];
                if (schedule==null || schedule==undefined || schedule==''){
                    schedule = 'No Schedule';
                }else{
                    var schedule_days = schedule['days'];
                    var schedule_time = schedule['time'];
                    if (schedule_days==null || schedule_days==undefined || schedule_days==''){
                        schedule_days = 'No Day Schedule';
                    }else{
                        for (var j = 0; j < schedule_days.length; j++) {
                            if(j==1){
                                schedule_days +", "+ schedule_days;
                            }
                        }
                    }
                    if (schedule_time==null || schedule_time==undefined || schedule_time==''){
                        schedule_time = 'No Time Schedule';
                    }else{
                        for (var k = 0; k < schedule_time.length; k++) {
                            if(k==1){
                                schedule_time +", "+ schedule_time;
                            }
                        }
                    }
                }

            $('.modal-title').html("<h1>"+desc_mov['name']+"</h1>");

           $('.modal-body').html(
            "<div class='box-img'><img class='img-modal' id='img-modal' align='left' src="+images+"><img></div>"+
            "<div class='desc' style='padding-left: 399px;'>"+
            "<h3>"+desc_mov['name']+"</h3>"+
            "<p>"+schedule_days+"<br/>"+schedule_time+"</p>"+
            "<p>"+desc_mov['summary']+"</p>"+
            "</div>"

            );
           
        }
    });    
}