import { WHATSAPP_NUMBER } from './store-config.js';

const ARS = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
const grid = document.querySelector('#product-grid');
const bagKey = 'sur-store-bag-v1';
let products = [];
let bag = loadBag();
let activeCategory = 'all';
let activeProduct = null;
let toastTimer;

function loadBag() { try { return JSON.parse(localStorage.getItem(bagKey) || '[]'); } catch { return []; } }
function saveBag() { localStorage.setItem(bagKey, JSON.stringify(bag)); }
function escapeHtml(text='') { return String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function cardTemplate(p) {
  const discount = p.compareAt ? `<span class="discount">-${Math.round((1-p.price/p.compareAt)*100)}%</span>` : '';
  return `<article class="product-card"><button class="product-image" data-open="${escapeHtml(p.id)}" aria-label="Ver ${escapeHtml(p.name)}"><img src="${escapeHtml(p.image)}" data-fallback="${escapeHtml(p.fallbackImage || '')}" onerror="if(this.dataset.fallback){this.onerror=null;this.src=this.dataset.fallback}" alt="${escapeHtml(p.alt || p.name)}" loading="lazy">${p.badge ? `<span class="product-badge">${escapeHtml(p.badge)}</span>` : ''}<span class="quick-add">VER PRENDA <span>↗</span></span></button><div class="product-info"><div><span class="product-type">${escapeHtml(p.type)}</span><h3><button data-open="${escapeHtml(p.id)}">${escapeHtml(p.name)}</button></h3></div><div class="product-prices">${discount}<span class="price">${ARS.format(p.price)}</span>${p.compareAt ? `<span class="compare-price">${ARS.format(p.compareAt)}</span>` : ''}</div><div class="product-swatches"><span class="swatch" style="--swatch:${escapeHtml(p.colorHex)}" title="${escapeHtml(p.color)}"></span><span>${escapeHtml(p.color)}</span></div></div></article>`;
}
function filteredProducts() {
  const query = document.querySelector('#search-input').value.trim().toLocaleLowerCase('es-AR');
  const size = document.querySelector('#size-filter').value;
  const color = document.querySelector('#color-filter').value;
  const sort = document.querySelector('#sort-filter').value;
  let list = products.filter(p => (activeCategory === 'all' || p.category === activeCategory) && (!query || `${p.name} ${p.type} ${p.color} ${p.description}`.toLocaleLowerCase('es-AR').includes(query)) && (!size || p.sizes.includes(size)) && (!color || p.color === color));
  if (sort === 'low') list.sort((a,b) => a.price-b.price);
  if (sort === 'high') list.sort((a,b) => b.price-a.price);
  return list;
}
function renderProducts() {
  const list = filteredProducts();
  grid.innerHTML = list.map(cardTemplate).join('');
  document.querySelector('#result-count').textContent = `${list.length} ${list.length === 1 ? 'prenda' : 'prendas'}`;
  document.querySelector('#empty-state').hidden = list.length > 0;
  grid.hidden = !list.length;
}
function renderBag() {
  const count = bag.reduce((n, item) => n + item.quantity, 0);
  document.querySelectorAll('.bag-count').forEach(el => el.textContent = count);
  const items = document.querySelector('#cart-items');
  items.innerHTML = bag.map(item => {
    const p = products.find(product => product.id === item.id);
    if (!p) return '';
    return `<article class="cart-item"><img src="${escapeHtml(p.image)}" alt=""><div class="cart-item-details"><div class="cart-item-title"><div><strong>${escapeHtml(p.name)}</strong><span>${escapeHtml(p.color)} · Talle ${escapeHtml(item.size)}</span></div><button class="remove-item" data-remove="${escapeHtml(item.id)}" data-size="${escapeHtml(item.size)}" aria-label="Quitar ${escapeHtml(p.name)}">×</button></div><div class="cart-item-bottom"><div class="quantity-control"><button data-qty="-1" data-id="${escapeHtml(item.id)}" data-size="${escapeHtml(item.size)}" aria-label="Restar">−</button><span>${item.quantity}</span><button data-qty="1" data-id="${escapeHtml(item.id)}" data-size="${escapeHtml(item.size)}" aria-label="Sumar">+</button></div><strong>${ARS.format(p.price*item.quantity)}</strong></div></div></article>`;
  }).join('');
  const empty = bag.length === 0;
  document.querySelector('#cart-empty').hidden = !empty;
  document.querySelector('#cart-summary').hidden = empty;
  document.querySelector('#cart-total').textContent = ARS.format(bag.reduce((total,item) => total + (products.find(p=>p.id===item.id)?.price || 0)*item.quantity, 0));
  updateCheckoutLink();
}
function updateCheckoutLink() {
  const lines = bag.map(item => { const p = products.find(x=>x.id===item.id); return p ? `• ${p.name} — talle ${item.size} — ${item.quantity} x ${ARS.format(p.price)}` : ''; }).filter(Boolean);
  const total = bag.reduce((sum,item)=>sum+(products.find(p=>p.id===item.id)?.price||0)*item.quantity,0);
  const message = `Hola, quiero hacer este pedido en sur:\n\n${lines.join('\n')}\n\nTotal de prendas: ${ARS.format(total)}\n\n¿Me pasan opciones de envío y medios de pago?`;
  document.querySelector('#whatsapp-checkout').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
function openCart() { document.querySelector('#cart-drawer').classList.add('open'); document.querySelector('#drawer-backdrop').classList.add('visible'); document.querySelector('#cart-drawer').setAttribute('aria-hidden','false'); document.body.classList.add('locked'); }
function closeCart() { document.querySelector('#cart-drawer').classList.remove('open'); document.querySelector('#drawer-backdrop').classList.remove('visible'); document.querySelector('#cart-drawer').setAttribute('aria-hidden','true'); document.body.classList.remove('locked'); }
function showToast(message) { const toast = document.querySelector('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(()=>toast.classList.remove('show'),2300); }
function openProduct(id) {
  const p = products.find(x=>x.id===id); if (!p) return;
  activeProduct = p;
  document.querySelector('#dialog-content').innerHTML = `<div class="detail-image"><img src="${escapeHtml(p.image)}" data-fallback="${escapeHtml(p.fallbackImage || '')}" onerror="if(this.dataset.fallback){this.onerror=null;this.src=this.dataset.fallback}" alt="${escapeHtml(p.alt || p.name)}"></div><div class="detail-copy"><span class="eyebrow">${escapeHtml(p.type)} · ${escapeHtml(p.category)}</span><h2>${escapeHtml(p.name)}</h2><div class="detail-price">${ARS.format(p.price)} ${p.compareAt ? `<del>${ARS.format(p.compareAt)}</del>` : ''}</div><p>${escapeHtml(p.description)}</p><div class="detail-meta"><span>COLOR</span><strong><i class="swatch" style="--swatch:${escapeHtml(p.colorHex)}"></i>${escapeHtml(p.color)}</strong></div><label class="size-label" for="detail-size">ELEGÍ TU TALLE <button class="size-guide-link" type="button" data-size-guide>Guía de talles</button></label><div class="size-options">${p.sizes.map((size,i)=>`<label><input type="radio" name="detail-size" value="${escapeHtml(size)}" ${i===Math.min(1,p.sizes.length-1)?'checked':''}><span>${escapeHtml(size)}</span></label>`).join('')}</div><label class="quantity-label">CANTIDAD <div class="quantity-control"><button type="button" data-detail-qty="-1">−</button><span id="detail-quantity">1</span><button type="button" data-detail-qty="1">+</button></div></label><button class="button button-dark add-to-bag">AGREGAR A LA BOLSA <span>↗</span></button><p class="detail-shipping">Envíos a todo el país · Cambios fáciles hasta 30 días</p></div>`;
  document.querySelector('#product-dialog').showModal();
}
function addToBag(p,size,quantity=1) {
  const found = bag.find(item=>item.id===p.id&&item.size===size);
  if (found) found.quantity += quantity; else bag.push({id:p.id,size,quantity});
  saveBag(); renderBag(); showToast(`${p.name} se agregó a tu bolsa`);
}
function init() {
  fetch('./products.json').then(response=>{if(!response.ok) throw new Error('No se pudo leer products.json'); return response.json();}).then(data=>{
    products = data; const colors = [...new Set(products.map(p=>p.color))].sort();
    document.querySelector('#color-filter').insertAdjacentHTML('beforeend',colors.map(color=>`<option>${escapeHtml(color)}</option>`).join(''));
    renderProducts(); renderBag();
  }).catch(error=>{grid.innerHTML=`<p class="load-error">No pudimos cargar el catálogo. ${escapeHtml(error.message)}</p>`;});
  document.querySelectorAll('.category-tabs button').forEach(button=>button.addEventListener('click',()=>{document.querySelector('.category-tabs .active').classList.remove('active');button.classList.add('active');activeCategory=button.dataset.category;renderProducts();}));
  ['#search-input','#size-filter','#color-filter','#sort-filter'].forEach(selector=>document.querySelector(selector).addEventListener(selector==='#search-input'?'input':'change',renderProducts));
  grid.addEventListener('click',event=>{const button=event.target.closest('[data-open]');if(button)openProduct(button.dataset.open);});
  document.querySelector('#clear-filters').addEventListener('click',()=>{document.querySelector('#search-input').value='';document.querySelector('#size-filter').value='';document.querySelector('#color-filter').value='';document.querySelector('#sort-filter').value='featured';activeCategory='all';document.querySelectorAll('.category-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.category==='all'));renderProducts();});
  document.querySelector('.cart-trigger').addEventListener('click',openCart);document.querySelector('.close-cart').addEventListener('click',closeCart);document.querySelector('.continue-shopping').addEventListener('click',closeCart);document.querySelector('#drawer-backdrop').addEventListener('click',closeCart);
  document.querySelector('#cart-items').addEventListener('click',event=>{const remove=event.target.closest('[data-remove]');const qty=event.target.closest('[data-qty]');if(remove)bag=bag.filter(i=>!(i.id===remove.dataset.remove&&i.size===remove.dataset.size));else if(qty){const item=bag.find(i=>i.id===qty.dataset.id&&i.size===qty.dataset.size);if(item){item.quantity+=Number(qty.dataset.qty);if(item.quantity<1)bag=bag.filter(i=>i!==item);}}else return;saveBag();renderBag();});
  document.querySelector('#product-dialog').addEventListener('click',event=>{if(event.target===event.currentTarget)event.currentTarget.close();});document.querySelector('.dialog-close').addEventListener('click',()=>document.querySelector('#product-dialog').close());
  document.querySelector('#dialog-content').addEventListener('click',event=>{const step=event.target.closest('[data-detail-qty]');if(step){const qty=document.querySelector('#detail-quantity');qty.textContent=Math.max(1,Number(qty.textContent)+Number(step.dataset.detailQty));}if(event.target.closest('[data-size-guide]')){document.querySelector('#product-dialog').close();document.querySelector('#ayuda details:nth-child(2)').open=true;document.querySelector('#ayuda').scrollIntoView({behavior:'smooth'});}if(event.target.closest('.add-to-bag')){const size=document.querySelector('input[name="detail-size"]:checked')?.value;addToBag(activeProduct,size,Number(document.querySelector('#detail-quantity').textContent));document.querySelector('#product-dialog').close();}});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeCart();});
  document.querySelector('.menu-toggle').addEventListener('click',event=>{const button=event.currentTarget;const nav=document.querySelector('.nav-left');const open=nav.classList.toggle('mobile-open');button.setAttribute('aria-expanded',String(open));});
  document.querySelectorAll('.nav-left a').forEach(link=>link.addEventListener('click',()=>document.querySelector('.nav-left').classList.remove('mobile-open')));
  document.querySelector('.search-toggle').addEventListener('click',()=>{document.querySelector('#productos').scrollIntoView({behavior:'smooth'});document.querySelector('#search-input').focus({preventScroll:true});});
}
init();
