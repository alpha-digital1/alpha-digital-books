// Lightweight Fuse.js-based search overlay
(function(){
  const openBtn = document.getElementById('searchOpenBtn');
  const overlay = document.getElementById('searchOverlay');
  const closeBtn = document.getElementById('searchClose');
  const input = document.getElementById('searchInput');
  const resultsEl = document.getElementById('searchResults');
  const filterListEl = document.getElementById('filterList');

  let indexData = null;
  let fuse = null;
  let categories = [];
  let activeFilters = new Set();

  function openSearch(){
    overlay.style.display = 'block';
    overlay.setAttribute('aria-hidden','false');
    input.focus();
    if(!indexData) loadIndex();
  }
  function closeSearch(){
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden','true');
    input.value = '';
    clearResults();
  }

  openBtn.addEventListener('click', openSearch);
  closeBtn.addEventListener('click', closeSearch);
  overlay.addEventListener('click', function(e){ if(e.target === overlay) closeSearch(); });

  // keyboard shortcut: / to open search
  window.addEventListener('keydown', function(e){
    if(e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA'){
      e.preventDefault(); openSearch();
    }
    if(e.key === 'Escape') closeSearch();
  });

  async function loadIndex(){
    try{
      const resp = await fetch('/books-index.json');
      indexData = await resp.json();
      // extract categories
      const set = new Set(); indexData.forEach(b => (b.categories||[]).forEach(c => set.add(c)));
      categories = Array.from(set).sort();
      renderFilters();
    }catch(e){ console.error('Failed to load search index', e); }
  }

  function renderFilters(){
    filterListEl.innerHTML = '';
    categories.forEach(cat => {
      const id = 'f-'+cat.replace(/\s+/g,'-').toLowerCase();
      const label = document.createElement('label');
      label.innerHTML = `<input type="checkbox" value="${cat}" id="${id}"> ${cat}`;
      filterListEl.appendChild(label);
      label.querySelector('input').addEventListener('change', onFilterChange);
    });
  }

  function onFilterChange(){
    activeFilters = new Set(Array.from(filterListEl.querySelectorAll('input:checked')).map(i=>i.value));
    if(activeFilters.size===0 || activeFilters.has('')){
      // no filters or 'All categories' -> clear
    }
    performSearch(input.value);
  }

  // Lazy-load Fuse from CDN the first time we need it
  async function ensureFuse(){
    if(window.Fuse) return window.Fuse;
    return new Promise((resolve,reject)=>{
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.min.js';
      s.onload = ()=> resolve(window.Fuse);
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  let debounceTimer = null;
  input.addEventListener('input', function(e){
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(()=> performSearch(e.target.value), 150);
  });

  // keyboard navigation
  let focusedIndex = -1;
  window.addEventListener('keydown', function(e){
    const results = resultsEl.querySelectorAll('.result-item');
    if(results.length === 0) return;
    if(e.key === 'ArrowDown'){ e.preventDefault(); focusedIndex = Math.min(focusedIndex+1, results.length-1); setFocus(results, focusedIndex); }
    if(e.key === 'ArrowUp'){ e.preventDefault(); focusedIndex = Math.max(focusedIndex-1, 0); setFocus(results, focusedIndex); }
    if(e.key === 'Enter' && focusedIndex >= 0){ e.preventDefault(); results[focusedIndex].querySelector('a').click(); }
  });

  function setFocus(results, idx){ results.forEach((r,i)=> r.classList.toggle('focused', i===idx)); results[idx].scrollIntoView({block:'nearest'}); }

  function clearResults(){ resultsEl.innerHTML = ''; focusedIndex = -1; }

  function highlight(text, query){
    if(!query) return escapeHtml(text);
    const q = query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const re = new RegExp('('+q+')','ig');
    return escapeHtml(text).replace(re, '<mark>$1</mark>');
  }
  function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c];}); }

  async function performSearch(q){
    clearResults();
    if(!indexData) await loadIndex();
    if(!q || q.trim().length === 0){ return; }
    const FuseLib = await ensureFuse();
    if(!fuse){
      const options = { keys: ['title','authors','categories','tags','short_description','seo_description'], includeMatches:true, threshold:0.35 };
      fuse = new FuseLib(indexData, options);
    }
    let results = fuse.search(q, { limit: 20 }).map(r => r);
    // apply category filters if set
    if(activeFilters.size > 0){ results = results.filter(r => {
      const cats = (r.item.categories || []);
      for(const f of activeFilters){ if(cats.indexOf(f) !== -1) return true; }
      return false;
    }); }

    // render
    results.forEach(r => {
      const b = r.item;
      const matches = r.matches || [];
      const titleMatch = matches.find(m => m.key === 'title');
      const descMatch = matches.find(m => m.key === 'short_description' || m.key === 'seo_description');
      const titleHtml = titleMatch ? highlight(b.title, input.value) : escapeHtml(b.title);
      const descHtml = descMatch ? highlight(b.short_description || b.seo_description || '', input.value) : escapeHtml(b.short_description || b.seo_description || '');

      const item = document.createElement('div');
      item.className = 'result-item';
      item.innerHTML = `
        <a href="/books/${b.slug}/">
          <div class="result-left"><img src="${b.cover_image || ''}" alt="${escapeHtml(b.title)}" loading="lazy"></div>
          <div class="result-body">
            <div class="result-title">${titleHtml}</div>
            <div class="result-meta small muted">${escapeHtml((b.authors||[]).join(', '))} • ${escapeHtml((b.categories||[]).join(', '))}</div>
            <div class="result-desc">${descHtml}</div>
          </div>
        </a>`;
      resultsEl.appendChild(item);
    });
  }

})();
