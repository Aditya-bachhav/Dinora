import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAsync } from '../../hooks/useAsync';
import { api } from '../../services/api';
import { Page, Loading, Empty, MenuItemCard } from '../../components/Ui';
import { tablePath } from '../../utils/routes';
export default function Menu(){const{tableToken}=useParams();const s=useAsync(api.menu,[]);const[q,setQ]=useState('');if(s.loading)return <Page title="Menu"><Loading/></Page>;const items=(s.data?.items||[]).filter(i=>i.available&&`${i.name} ${i.description||''}`.toLowerCase().includes(q.toLowerCase()));return <Page title="Menu" subtitle="Prices and dishes come directly from the restaurant database"><input className="search" placeholder="Search dishes" value={q} onChange={e=>setQ(e.target.value)}/><div className="chips">{(s.data?.categories||[]).map(c=><Link className="chip" key={c.id} to={tablePath(tableToken,`/menu/${c.slug}`)}>{c.name}</Link>)}</div><div className="menu-list">{items.map(i=><MenuItemCard key={i.id} item={i} token={tableToken}/>)}</div>{!items.length&&<Empty>No available dishes found.</Empty>}</Page>}
