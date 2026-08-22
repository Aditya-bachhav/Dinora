import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAsync } from '../../hooks/useAsync';
import { api } from '../../services/api';
import { Page, Card, ErrorBox } from '../../components/Ui';
import { money, tablePath } from '../../utils/routes';
import { cartKey, readCart } from '../../features/cart/cart';

export default function Payment(){const{tableToken}=useParams();const nav=useNavigate();const t=useAsync(()=>api.table(tableToken),[tableToken]);const[c]=useState(()=>readCart(tableToken));const total=c.reduce((a,x)=>a+x.price*x.qty,0);const[busy,setBusy]=useState(false);const[err,setErr]=useState('');const place=async()=>{try{setBusy(true);const o=await api.createOrder({table_id:t.data.table.id,session_id:t.data.session.id,items:c.map(x=>({menu_item_id:x.id,quantity:x.qty}))});localStorage.removeItem(cartKey(tableToken));nav(tablePath(tableToken,`/thank-you?order=${o.id}`))}catch(e){setErr(e.message)}finally{setBusy(false)}};return <Page title="Place order" subtitle="Payment is intentionally deferred to Phase 2"><Card><p className="muted">No payment is collected in Phase 1. This step only confirms the order and sends it to the kitchen.</p><div className="order-items">{c.map(x=><div className="list-row" key={x.id}><span>{x.name} × {x.qty}</span><strong>{money(x.price*x.qty)}</strong></div>)}</div><div className="total"><span>Total</span><strong>{money(total)}</strong></div><ErrorBox error={err}/><button className="btn primary full" disabled={!c.length||busy||!t.data?.session} onClick={place}>{busy?'Placing…':'Place order'}</button></Card></Page>}
