import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAsync } from '../../hooks/useAsync';
import { api } from '../../services/api';
import { Page, Card, ErrorBox, Loading } from '../../components/Ui';
import { money, tablePath } from '../../utils/routes';
import { readCart, writeCart } from '../../features/cart/cart';

export default function Item(){const{tableToken,itemSlug}=useParams();const s=useAsync(()=>api.item(itemSlug),[itemSlug]);const[qty,setQty]=useState(1);const[added,setAdded]=useState(false);if(s.loading)return <Page title="Dish"><Loading/></Page>;if(s.error)return <Page title="Dish"><ErrorBox error={s.error}/></Page>;const add=()=>{const c=readCart(tableToken);const x=c.find(x=>x.id===s.data.id);if(x)x.qty+=qty;else c.push({...s.data,qty});writeCart(tableToken,c);setAdded(true)};return <Page title={s.data.name} subtitle={s.data.category}><Card><div className="detail-image-wrap">{s.data.image_url?<img className="detail-image" src={s.data.image_url} alt={s.data.name}/>:null}</div><p>{s.data.description}</p><div className="price">{money(s.data.price)}</div><div className="qty"><button onClick={()=>setQty(Math.max(1,qty-1))}>−</button><strong>{qty}</strong><button onClick={()=>setQty(qty+1)}>+</button></div><button className="btn primary full" onClick={add}>{added?'Added to cart':'Add to cart'}</button><Link className="btn secondary full" to={tablePath(tableToken,'/cart')}>View cart</Link></Card></Page>}
