var apiKey = '1e448e0dfcdbb565f5d329820065b4d2';
var mainArr = [];
var movieDetails = [];
var languages = [];
var watchedList = [];
var currentActivePage = 1;
var totalPages = 0;

$(document).ready(function(){
    $(".loader:eq(0)").addClass('show');
    processMovContAPIResponse(httpGET("https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&page=1&sort_by=popularity.desc"));
    httpGET("https://api.themoviedb.org/3/configuration/languages").then((data)=>{
        languages = data;
    });
    $("#search-submit").click(function(){
        search($("#search").val())
    });
    
});


function addDetailsToMovieObj(ele){
    var movieObj = {};
    movieObj.id = ele.id;
    movieObj.title = ele.title;
    movieObj.description = ele.overview;
    movieObj.rating = ele.vote_average;
    movieObj.language = ele.original_language;
    movieObj.releaseDate = ele.release_date;
    movieObj.keywords = getmovieDetails("https://api.themoviedb.org/3/movie/38322/keywords").responseJSON.keywords;
    var SpecMovRes = getmovieDetails("https://api.themoviedb.org/3/movie/"+ele.id).responseJSON;
    movieObj.genres = SpecMovRes.genres;
    movieObj.imdbID = SpecMovRes.imdb_id;
    mainArr.push(movieObj);
    movieDetails = [...mainArr];
    /*
    httpGET("https://api.themoviedb.org/3/movie/"+ele.id+"/keywords",{include_adult:true,include_video:true,sort_by:"popularity.desc",page: 1,api_key:apiKey})    
    .then((data)=>{
            movieObj.keywords = data.keywords;
            
        }
    );
    */
}

function renderElements(){
    var contentContainer = document.querySelector(".content-lib-container");
    var contentLayout = document.querySelector(".content-layout");
    while($(contentContainer).children().length > 1){
        $(contentContainer).children().not(':first').remove();
    }
    movieDetails.forEach(obj=>{
        var contentItem = contentLayout.cloneNode(true);
        $(contentItem).css("display","block");
        contentItem.querySelector(".card-title").innerHTML = obj.title;
        contentItem.querySelector(".rating").querySelector(".rating-value").innerHTML = obj.rating;
        var genres = "";
        obj.genres.forEach((genre,index)=>{
            if(index == 0)
                genres += genre.name;
            else
                genres += ","+genre.name;
        });
        contentItem.querySelector(".genre").innerHTML = genres;
        contentItem.querySelector(".description").innerHTML = obj.description;
        var footer = $(contentItem.querySelector(".footer"));
        footer.children('a').eq(0).attr("href","https://www.imdb.com/title/"+obj.imdbID);
        var watchBtn = footer.children('div').eq(0).children('div').eq(0).children("div").eq(0);
        watchBtn.attr("target",obj.id);
        if(localStorage.getItem("watchList") != null){
            watchedList = JSON.parse(localStorage.getItem("watchList"));
            var watchStatus = watchedList.find(ele => ele == obj.id);
            if(watchStatus != undefined){
                watchBtn.addClass("checked");
            }
        }
        
        $(contentContainer).append(contentItem);
        createPagination();
    });
    $(".container:eq(0)").addClass("show");
    $(".loader:eq(0)").removeClass('show');
}

function search(searchWord){
    $(".loader:eq(0)").addClass('show');
    var value = $("input[name=searchBy]:checked").val();
   if(value == "Language"){
        var language = languages.find(element => element.english_name.toLowerCase() == searchWord.toLowerCase());
        if(language != undefined || language != null){
            processMovContAPIResponse(httpGET("https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&page=1&sort_by=popularity.desc",{language:language.iso_639_1}));
        };
    }else if(value == "Year"){
        processMovContAPIResponse(httpGET("https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&page=1&sort_by=popularity.desc",{year:searchWord}));
    }else if(value == "Keyword"){
        processMovContAPIResponse(httpGET("https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&page=1&sort_by=popularity.desc",{with_keywords:searchWord}));
    }
}

function processMovContAPIResponse(result){
    result.then((data)=>{
        mainArr = [];
        totalPages = data.total_pages;
        data.results.forEach(element => {
            if(element.id != null){
                addDetailsToMovieObj(element);
            }
        });
        renderElements();
        $(".tick-icon").bind('click', onWatched);
        $(".page-link").bind('click',onPageChange);
    });
}


function httpGET(url,queryParam){
    var response =  new Promise((resolve, reject) => {
        $.ajax({
          url: url.includes("?") ? url+"&api_key="+apiKey : url+"?api_key="+apiKey,
          type: 'GET',
          data: queryParam,
          success: function (data) {
            resolve(data)
          },
          error: function (error) {
            reject(error)
          },
        });
    });
    return response;
}

function getmovieDetails(url,queryParam){
    return $.ajax({
        url: url.includes("?") ? url+"&api_key="+apiKey : url+"?api_key="+apiKey,
        type: 'GET',
        async:false,
        data:queryParam,
        success: function (data) {
            return data;
        },
        error: function (error) {
            return error;
        },
    });
}

function onWatched(element){
    var target = parseInt($(this).attr('target'));
    if(localStorage.getItem("watchList") != null){
        watchedList = JSON.parse(localStorage.getItem("watchList"));
    }
    
    if($(this).hasClass("checked")){
        $(this).removeClass("checked");
        $(this).addClass("unchecked");
        watchedList.splice(watchedList.indexOf(target),1);
    }else{
        $(this).removeClass("unchecked");
        $(this).addClass("checked");
        watchedList.push(target);
    }
    localStorage.setItem("watchList",JSON.stringify(watchedList));
}

function createPagination(){
    var prevBtn = '<li class="page-item"><a class="page-link" href="#">Previous</a></li>';
    var nxtBtn = '<li class="page-item"><a class="page-link" href="#">Next</a></li>';
    var pageNoBtn =  "";

    var counter = 0;
    for(var i = currentActivePage; i < totalPages; i++){
        if(counter > 5)
            break;

        pageNoBtn += `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`;
        counter++;
    }

    $(".pagination:eq(0)").html(prevBtn+pageNoBtn+nxtBtn);
}

function onPageChange(event){
    $(".container:eq(0)").removeClass("show");
    $(".loader:eq(0)").addClass('show');
    if(event.target.innerText == "Previous")
        currentActivePage--;
    else if(event.target.innerText == "Next")
        currentActivePage++;
    else
        currentActivePage = Number(event.target.innerText);

    processMovContAPIResponse(httpGET(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&page=${currentActivePage}&sort_by=popularity.desc`));

}
