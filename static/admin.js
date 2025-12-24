// Admin dashboard loader 
document.addEventListener('DOMContentLoaded', ()=>{

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', ()=>{
    localStorage.removeItem('token');
    window.location.href = '/login';
  });

  const homepageBtn = document.getElementById('homepageBtn');
  if (homepageBtn) homepageBtn.addEventListener('click', ()=>{
    window.location.href = '/';
  });

  loadDashboard();
});



  // Sidebar active link handler
  try{
    const menuLinks = document.querySelectorAll('.menu a');
    if(menuLinks.length){
      menuLinks.forEach(a=>{
        try{
          const linkPath = new URL(a.href, location.origin).pathname.replace(/\/+$/,'');
          const cur = location.pathname.replace(/\/+$/,'');
          if(cur === linkPath || cur.startsWith(linkPath)) 
            a.classList.add('active'); 
          else 
            a.classList.remove('active');
        }catch(e){}
        
        a.addEventListener('click', ()=>{
          menuLinks.forEach(x=>x.classList.remove('active'));
          a.classList.add('active');
        });
      });
    }
  }catch(e){console.warn('Failed to set active menu', e)}

  loadDashboard();
  
async function loadDashboard(){
  const token = localStorage.getItem('token');
  const authHeader = { 'Authorization': `Bearer ${token}` };

  // Dashboard card refs
  const elTotalUsers = document.getElementById('totalUsers');
  const elTotalSellers = document.getElementById('totalSellers');
  const elTotalProducts = document.getElementById('totalProducts');
  const elTotalOrders = document.getElementById('totalOrders');

  const ordersBody = document.getElementById('ordersTable');

  // Loading placeholders
  if(elTotalUsers) elTotalUsers.innerText = '…';
  if(elTotalSellers) elTotalSellers.innerText = '…';
  if(elTotalProducts) elTotalProducts.innerText = '…';
  if(elTotalOrders) elTotalOrders.innerText = '…';
  if(ordersBody) ordersBody.innerHTML = '<tr><td colspan="5">Loading recent orders…</td></tr>';

  if(!token){
    window.location.href = '/login';
    return;
  }

  try{
    const [usersData, sellersData, productsData, ordersData] = await Promise.all([
      fetch('/users/', { headers: authHeader }),
      fetch('/sellers/', { headers: authHeader }),
      fetch('/products/', { headers: authHeader }),
      fetch('/orders/', { headers: authHeader })
    ]);

    if(usersData.status === 401 || sellersData.status === 401){
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }

    const parse = async r => { try{ return await r.json() } catch(e){ return [] } };
    const users = await parse(usersData);
    const sellers = await parse(sellersData);
    const products = await parse(productsData);
    const orders = await parse(ordersData);

    if(elTotalUsers) elTotalUsers.innerText = users.length;
    if(elTotalSellers) elTotalSellers.innerText = sellers.length;
    if(elTotalProducts) elTotalProducts.innerText = products.length;
    if(elTotalOrders) elTotalOrders.innerText = orders.length;

    if(ordersBody){
      ordersBody.innerHTML = '';
      const recent = orders.slice(-6).reverse();
      if(!recent.length){
        ordersBody.innerHTML = '<tr><td colspan="5">No recent orders</td></tr>';
      } else {
        recent.forEach(order=>{
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${escapeHtml(order.id)}</td>
            <td>${escapeHtml(order.user)}</td>
            <td>${escapeHtml(order.product)}</td>
            <td>${escapeHtml(order.quantity)}</td>
            <td><span class="badge ${order.status.toLowerCase()}">${escapeHtml(order.status)}</span></td>
          `;
          ordersBody.appendChild(tr);
        });
      }
    }

  }catch(err){
    if(ordersBody) ordersBody.innerHTML = '<tr><td colspan="5">Failed to load orders</td></tr>';
  }
}

function escapeHtml(s){
  if(!s) return '';
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}
