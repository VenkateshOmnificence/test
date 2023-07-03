function get(url,queryParam){
    return new Promise((resolve, reject) => {
        $.ajax({
          url: url,
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
}

function getResponseFromAPI(url,queryParam){
    $.ajax(settings).done(function (response) {
        return response;
      });
}