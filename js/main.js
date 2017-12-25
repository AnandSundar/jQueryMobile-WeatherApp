$(document).ready(function () {
  $('#settingsForm').on('submit', function (e) {
    let settings = {
      city: $('#city').val(),
      state: $('#state').val()
    }

    saveSettings(settings);
    e.preventDefault();
  });
});



//runs before weather page/homepage
$(document).on('pagecontainerbeforeshow', function (event, ui) {
  //check to see which page we are navigating to using the id
  if(ui.toPage[0].id == 'home'){
    getWeather(); //get the weather info from api
  }

  if(ui.toPage[0].id == 'settings'){
    $('#city').val(getLocation().city);
    $('#state').val(getLocation().state);
  }

});

function getWeather(){
  let location = getLocation();

  let city = location.split(' ').join('_');
  let state = location.state;


  $.ajax({
    url: 'http://api.wunderground.com/api/9bf1f7b0f5ca5c27/conditions/q/'+state+'/'+city+'.json'
  }).done(function (response) {
    let weather = response.current_observation;

    let weatherTop = `
      <img src="${weather.icon_url}">
      <h1>${weather.temp_f} F</h1>
      <h2>${weather.display_location.full}</h2>
    `;

    $('#weatherTop').html(weatherTop);

    let weatherList = `
    <li><strong>Weather: </strong>${weather.weather}</li>
    <li><strong>Temp: </strong>${weather.temperature_string}</li>
    <li><strong>Dewpoint: </strong>${weather.dewpoint_string}</li>
    <li><strong>Relative Humidity: </strong>${weather.relative_humidity}</li>
    <li><strong>Windchill: </strong>${weather.windchill_string}</li>
    <li><strong>Visibility: </strong>${weather.visibility_mi}</li>
    `;

    $('#weatherList').html(weatherList).listview('refresh');
  });
}

function getLocation() {
let location;
  if(localStorage.getItem('location') === null){
    location = {city: 'Boston', state: 'MA'};
  }else{
      location = JSON.parse(localStorage.getItem('location'));
  }

  return location;
}

function saveSettings(settings) {
  //validation
  if(settings.city =='' || settings.state == ''){
    alert('Please fill in all fields');
  }else{
    let location = {
      city: settings.city,
      state: settings.state
  }

    //save the settings in localStorage
    localStorage.setItem('location', JSON.stringify(location));
    $.mobile.changePage('#home');
  }
}
