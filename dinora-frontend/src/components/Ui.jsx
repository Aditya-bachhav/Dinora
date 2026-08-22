import {Link} from 'react-router-dom';
import {money, tablePath} from '../utils/routes';
export const Page=({title,subtitle,actions,wide=false,children})=><div className="page"><header className="page-head"><div><h1>{title}</h1>{subtitle&&<p>{subtitle}</p>}</div>{actions&&<div className="actions">{actions}</div>}</header><main className={wide?'wide':''}>{children}</main></div>;
export const Card=({children,className=''})=><section className={`card ${className}`}>{children}</section>;
export const Loading=()=> <div className="loading">Loading…</div>;
export const Empty=({children})=><div className="empty">{children}</div>;
export const ErrorBox=({error})=>error?<div className="error">{error}</div>:null;
export const Status=({value})=><span className={`status ${String(value||'').toLowerCase()}`}>{String(value||'unknown').replaceAll('_',' ')}</span>;
export function MenuItemCard({item,token}){return <Link className="menu-item" to={tablePath(token,`/menu/item/${item.slug}`)}><div className="menu-image-wrap">{item.image_url?<img className="menu-image" src={item.image_url} alt={item.name}/>:<div className="menu-image placeholder">No image</div>}</div><div className="menu-item-body"><div><h3>{item.name}</h3><p>{item.description||'No description'}</p></div><strong>{money(item.price)}</strong></div></Link>}
