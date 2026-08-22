import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAsync } from '../../hooks/useAsync';
import { api } from '../../services/api';
import { Page, Empty, Loading, Status } from '../../components/Ui';
import { money, tablePath } from '../../utils/routes';

export default function Orders(){const{tableToken}=useParams();const t=useAsync(()=>api.table(tableToken),[tableToken]);const[o,setO]=useState([]);useEffect(()=>{if(!t.data?.session?.id)return;const load=()=>api.ordersForSession(t.data.session.id).then(setO);load();const id=setInterval(load,2000);return()=>clearInterval(id)},[t.data?.session?.id]);return <Page title="Orders" subtitle="Kitchen status updates automatically">{!t.data?<Loading/>:o.length?o.map(x=><Link className="order-card" key={x.id} to={tablePath(tableToken,`/orders/${x.id}`)}><div><b>Order #{x.id}</b><span>Table #{x.table_number}</span></div><Status value={x.status}/><strong>{money(x.total_amount)}</strong></Link>):<Empty>No orders yet. Add dishes to the cart and place your first order.</Empty>}</Page>}
