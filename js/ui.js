const devicesList = document.querySelector('.devices');

document.addEventListener('DOMContentLoaded', function() {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, {edge: 'right'});
  // add device form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, {edge: 'left'});
});


// remove device from DOM


const error=()=>{
  const html = `<div class="card-panel red lighten-2 pulse error-details">Error occured please try again</div>`;
  devices.innerHTML= html;         


}