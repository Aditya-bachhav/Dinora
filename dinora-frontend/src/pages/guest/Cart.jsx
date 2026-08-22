import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Page, Card, Empty } from '../../components/Ui';
import { money, tablePath } from '../../utils/routes';
import { readCart, writeCart } from '../../features/cart/cart';

export default function Cart(){const{tableToken}=useParams();const[c,setC]=useState(()=>readCart(tableToken));const update=(id,d)=>{const n=c.map(x=>x.id===id?{...x,qty:x.qty+d}:x).filter(x=>x.qty>0);setC(n);writeCart(tableToken,n)};const total=c.reduce((a,x)=>a+x.price*x.qty,0);return <Page title="Cart" subtitle="Your table order"><Card>{c.map(x=><div className="cart-row" key={x.id}><div><b>{x.name}</b><span>{money(x.price)} each</span></div><div className="qty small"><button onClick={()=>update(x.id,-1)}>−</button><strong>{x.qty}</strong><button onClick={()=>update(x.id,1)}>+</button></div><strong>{money(x.price*x.qty)}</strong></div>)}{!c.length&&<Empty>Cart is empty.</Empty>}<div className="total"><span>Total</span><strong>{money(total)}</strong></div><Link className="btn primary full" to={c.length?tablePath(tableToken,'/payment'):tablePath(tableToken,'/menu')}>{c.length?'Review & place order':'Browse menu'}</Link></Card></Page>}
