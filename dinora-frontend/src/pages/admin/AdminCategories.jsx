import { useState } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { api } from '../../services/api';
import { Page, Card, Loading } from '../../components/Ui';
export default function AdminCategories(){const s=useAsync(api.categories,[]);const[name,setName]=useState('');const add=async e=>{e.preventDefault();await api.createCategory({name});location.reload()};if(s.loading)return <Page title="Categories"><Loading/></Page>;return <Page title="Categories" subtitle="Create menu categories"><Card><form className="form-grid" onSubmit={add}><label>Category name<input required value={name} onChange={e=>setName(e.target.value)}/></label><button className="btn primary">Add category</button></form></Card><Card>{s.data.map(c=><div className="list-row" key={c.id}><b>{c.name}</b><span className="muted">/{c.slug}</span></div>)}</Card></Page>}
