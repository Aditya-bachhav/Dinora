import {Routes,Route,Navigate,useLocation,Link} from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout'; import GuestLayout from './layouts/GuestLayout';
import {Landing,TableHome,Menu,Category,Item,Cart,Orders,OrderDetail,Payment,ThankYou,Counter,AdminLogin,AdminRegister,AdminDashboard,AdminOrders,AdminMenu,AdminCategories,AdminTables,NotFound} from './pages/index.js';
function AdminGuard({children}){const loc=useLocation(); return localStorage.getItem('dinora-admin-token')?<>{children}</>:<Navigate to={`/admin/login?next=${encodeURIComponent(loc.pathname)}`} replace/>}
export default function App(){return <Routes>
<Route path="/" element={<Landing/>}/><Route path="/menu" element={<Navigate to="/" replace />} />
<Route path="/t/:tableToken" element={<GuestLayout/>}><Route index element={<TableHome/>}/><Route path="menu" element={<Menu/>}/><Route path="menu/:categorySlug" element={<Category/>}/><Route path="menu/item/:itemSlug" element={<Item/>}/><Route path="cart" element={<Cart/>}/><Route path="orders" element={<Orders/>}/><Route path="orders/:orderId" element={<OrderDetail/>}/><Route path="payment" element={<Payment/>}/><Route path="thank-you" element={<ThankYou/>}/></Route>
<Route path="/admin/login" element={<AdminLogin/>}/><Route path="/admin/register" element={<AdminRegister/>}/>
<Route path="/admin" element={<AdminGuard><AdminLayout/></AdminGuard>}><Route index element={<Navigate to="dashboard" replace/>}/><Route path="dashboard" element={<AdminDashboard/>}/><Route path="orders" element={<AdminOrders/>}/><Route path="menu" element={<AdminMenu/>}/><Route path="categories" element={<AdminCategories/>}/><Route path="tables" element={<AdminTables/>}/></Route>
<Route path="/counter" element={<AdminGuard><Counter/></AdminGuard>}/><Route path="*" element={<NotFound/>}/></Routes>}
