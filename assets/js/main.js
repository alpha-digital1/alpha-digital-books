// Minimal JS: nav toggle and small enhancements
document.addEventListener('DOMContentLoaded',function(){
  var toggle=document.getElementById('navToggle');
  var nav=document.getElementById('siteNav');
  if(toggle && nav){
    toggle.addEventListener('click',function(){
      var expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      if(nav.style.display === 'block') nav.style.display = '';
      else nav.style.display = 'block';
    });
  }
  var y = new Date().getFullYear();
  var el = document.getElementById('year'); if(el) el.textContent = y;
  var ef = document.getElementById('yearFooter'); if(ef) ef.textContent = y;
  var ef2 = document.getElementById('yearFooter2'); if(ef2) ef2.textContent = y;
});
