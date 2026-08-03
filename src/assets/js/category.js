// Client-side category interactions: sorting, search, and load-more
(function(){
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  if(!window.ADB_CATEGORY) return;
  const state = { items: window.ADB_CATEGORY.items.slice(), shown: 12 };
  const container = document.getElementById('category-books');
  const sortSelect = document.getElementById('sort-select');
  const searchInput = document.getElementById('category-search');

  function render(items){
    container.innerHTML = '';
    items.slice(0, state.shown).forEach(book => {
      const el = document.createElement('article');
      el.className = 'book-card';
      el.innerHTML = `
        <a href="/books/${book.slug}/">
          <img src="${book.cover_image}" alt="Cover of ${escapeHtml(book.title)}" loading="lazy">
        </a>
        <div class="card-body">
          <h3><a href="/books/${book.slug}/">${escapeHtml(book.title)}</a></h3>
          <p class="muted">${escapeHtml((book.authors||[]).join(', '))}</p>
          <p class="card-meta">${escapeHtml(book.short_description || '')}</p>
          <p class="card-ctas"><a class="btn" href="/books/${book.slug}/">View</a> <a class="btn amazon" href="${book.amazon_url||'#'}" target="_blank" rel="noopener noreferrer">Buy on Amazon</a></p>
        </div>`;
      container.appendChild(el);
    });
    // If more items than shown, show load more
    if(state.shown < items.length){
      if(!document.getElementById('loadMoreBtn')){
        const btn = document.createElement('button'); btn.id='loadMoreBtn'; btn.className='btn'; btn.textContent='Load more';
        btn.addEventListener('click',()=>{ state.shown += 12; render(filteredItems()); });
        container.parentNode.appendChild(btn);
      }
    } else {
      const existing = document.getElementById('loadMoreBtn'); if(existing) existing.remove();
    }
  }

  function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c];}); }

  function sortItems(items, mode){
    if(mode === 'az') return items.slice().sort((a,b)=>a.title.localeCompare(b.title));
    if(mode === 'featured') return items.slice().sort((a,b)=> (b.featured?1:0) - (a.featured?1:0));
    // default newest
    return items.slice().sort((a,b)=> new Date(b.publish_date) - new Date(a.publish_date));
  }

  function filteredItems(){
    const q = (searchInput.value||'').toLowerCase().trim();
    let items = state.items.slice();
    if(q){ items = items.filter(b => (b.title + ' ' + (b.short_description||'') + ' ' + (b.tags||[]).join(' ')).toLowerCase().indexOf(q) !== -1 ); }
    items = sortItems(items, sortSelect.value);
    return items;
  }

  sortSelect.addEventListener('change', ()=>{ render(filteredItems()); });
  searchInput.addEventListener('input', ()=>{ state.shown = 12; render(filteredItems()); });

  // initial render
  render(filteredItems());
})();
