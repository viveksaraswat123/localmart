// Admin dashboard loader — robust, defensive, and user-friendly
document.addEventListener('DOMContentLoaded', ()=>{
  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn) logoutBtn.addEventListener('click', ()=>{
    localStorage.removeItem('token');
    window.location.href = '/login';
  });

  // Ensure sidebar links reflect current route
  try{
    const menuLinks = document.querySelectorAll('.menu a');
    if(menuLinks && menuLinks.length){
      menuLinks.forEach(a=>{
        // normalize and compare pathname
        try{
          const linkPath = new URL(a.href, location.origin).pathname.replace(/\/+$/,'');
          const cur = location.pathname.replace(/\/+$/,'');
          if(cur === linkPath || cur.startsWith(linkPath)) a.classList.add('active'); else a.classList.remove('active');
        }catch(e){/* ignore malformed href */}
        a.addEventListener('click', ()=>{
          menuLinks.forEach(x=>x.classList.remove('active'));
          a.classList.add('active');
        });
      });
    }
  }catch(e){console.warn('Failed to set active menu', e)}

  loadDashboard();
});

async function loadDashboard(){
  const token = localStorage.getItem('token');
  const authHeader = token ? { 'Authorization': `Bearer ${token}` } : {};

  // DOM refs (defensive)
  const elTotalUsers = document.getElementById('totalUsers');
  const elTotalSellers = document.getElementById('totalSellers');
  const elTotalProducts = document.getElementById('totalProducts');
  const elTotalOrders = document.getElementById('totalOrders');
  const ordersTable = document.getElementById('ordersTable');

  // show loading placeholders
  if(elTotalUsers) elTotalUsers.innerText = '…';
  if(elTotalSellers) elTotalSellers.innerText = '…';
  if(elTotalProducts) elTotalProducts.innerText = '…';
  if(elTotalOrders) elTotalOrders.innerText = '…';
  if(ordersTable) ordersTable.innerHTML = '<tr><td colspan="5">Loading recent orders…</td></tr>';

  if(!token){
    // not authenticated — redirect
    console.warn('No token found — redirecting to login');
    window.location.href = '/login';
    return;
  }

  try{
    // Attempt to fetch all required endpoints in parallel
    const endpoints = [
      fetch('/users/', { headers: authHeader }),        // list users
      fetch('/sellers/', { headers: authHeader }),      // list sellers
      fetch('/products/', { headers: authHeader }),     // list products
      fetch('/orders/', { headers: authHeader })        // list orders
    ];

    const responses = await Promise.all(endpoints);

    // handle 401/403 globally
    for(const r of responses){
      if(r.status === 401 || r.status === 403){
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
    }

    // parse JSON safely — if parse fails fallback to empty array
    const dataPromises = responses.map(async r => {
      try{ return await r.json(); } catch(e){ return []; }
    });
    const [usersData, sellersData, productsData, ordersData] = await Promise.all(dataPromises);

    // helper to normalize arrays — some APIs return { data: [...] }
    const normalize = v => Array.isArray(v) ? v : (v && Array.isArray(v.data) ? v.data : []);

    const users = normalize(usersData);
    const sellers = normalize(sellersData);
    const products = normalize(productsData);
    const orders = normalize(ordersData);

    if(elTotalUsers) elTotalUsers.innerText = users.length;
    if(elTotalSellers) elTotalSellers.innerText = sellers.length;
    if(elTotalProducts) elTotalProducts.innerText = products.length;
    if(elTotalOrders) elTotalOrders.innerText = orders.length;

    // Render recent orders (most recent first)
    if(ordersTable){
      ordersTable.innerHTML = '';
      const recent = orders.slice(-6).reverse();
      if(recent.length === 0){
        ordersTable.innerHTML = '<tr><td colspan="5">No recent orders</td></tr>';
      } else {
        for(const order of recent){
          const id = order.id ?? order.order_id ?? order._id ?? '';
          const user = order.user_id ?? order.user ?? (order.user && (order.user.name || order.user.email)) ?? '';
          const product = order.product_id ?? order.product ?? order.product_title ?? '';
          const qty = order.quantity ?? order.qty ?? 1;
          const status = order.status ?? '—';

          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${escapeHtml(id)}</td><td>${escapeHtml(user)}</td><td>${escapeHtml(product)}</td><td>${escapeHtml(qty)}</td><td>${escapeHtml(status)}</td>`;
          ordersTable.appendChild(tr);
        }
      }
    }

  }catch(err){
    console.error('Failed loading dashboard', err);
    if(ordersTable) ordersTable.innerHTML = '<tr><td colspan="5">Failed to load recent orders</td></tr>';
    if(elTotalUsers) elTotalUsers.innerText = '—';
    if(elTotalSellers) elTotalSellers.innerText = '—';
    if(elTotalProducts) elTotalProducts.innerText = '—';
    if(elTotalOrders) elTotalOrders.innerText = '—';
  }
}

// small helper to avoid HTML injection from API values (very basic)
function escapeHtml(s){
  if(s === null || s === undefined) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
