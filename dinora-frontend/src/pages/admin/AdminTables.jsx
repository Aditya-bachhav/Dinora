import { useState } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { api, API_BASE_URL } from '../../services/api';
import { Page, Card, ErrorBox, Loading, Status } from '../../components/Ui';
export default function AdminTables(){
  const s=useAsync(api.tables,[]);
  const [form,setForm]=useState({number:'',guestUrl:localStorage.getItem('dinora-guest-url')||import.meta.env.VITE_PUBLIC_APP_URL||window.location.origin});
  const [msg,setMsg]=useState('');
  const guestBase=(localStorage.getItem('dinora-guest-url')||import.meta.env.VITE_PUBLIC_APP_URL||window.location.origin).replace(/\/$/,'');
  const add=async e=>{e.preventDefault();try{await api.createTable({number:Number(form.number),token:`table-${form.number}`});localStorage.setItem('dinora-guest-url',form.guestUrl.replace(/\/$/,''));location.reload()}catch(x){setMsg(x.message)}};
  const qrUrl=t=>`${API_BASE_URL}/api/tables/${encodeURIComponent(t.token)}/qr?guest_url=${encodeURIComponent(guestBase)}`;
  if(s.loading)return <Page title="Tables"><Loading/></Page>;
  return <Page title="Tables & QR codes" subtitle="Create a table, print its QR, then scan it from a phone" wide>
    <Card><h2>Add table</h2><form className="form-grid" onSubmit={add}>
      <label>Table number<input required type="number" min="1" value={form.number} onChange={e=>setForm({...form,number:e.target.value})}/></label>
      <label>Guest app URL<input required value={form.guestUrl} onChange={e=>setForm({...form,guestUrl:e.target.value})} placeholder="https://your-dinora.vercel.app"/><span className="muted small-text">For phone testing on the same Wi-Fi, use your PC LAN URL, for example http://192.168.1.5:5173</span></label>
      <button className="btn primary">Create table + QR</button>
    </form><ErrorBox error={msg}/></Card>
    <div className="qr-grid">{s.data.map(t=>{const url=qrUrl(t);return <Card key={t.id}>
      <div className="qr-card-head"><div><h2>Table #{t.number}</h2><p className="muted">{t.token}</p></div><Status value={t.status}/></div>
      <div className="qr-box"><img src={url} alt={`QR for table ${t.number}`}/></div>
      <p className="small-text muted">Scan target: <b>{guestBase}/t/{t.token}</b></p>
      <div className="button-row"><a className="btn primary" href={url} download={`dinora-table-${t.number}-qr.png`}>Download QR</a><a className="btn secondary" href={`/t/${t.token}`} target="_blank" rel="noreferrer">Test link</a></div>
    </Card>})}</div>
  </Page>
}
