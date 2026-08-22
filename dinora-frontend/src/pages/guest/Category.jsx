import { useParams } from 'react-router-dom';
import { useAsync } from '../../hooks/useAsync';
import { api } from '../../services/api';
import { Page, ErrorBox, Loading, MenuItemCard } from '../../components/Ui';

export default function Category(){const{tableToken,categorySlug}=useParams();const s=useAsync(()=>api.category(categorySlug),[categorySlug]);if(s.loading)return <Page title="Category"><Loading/></Page>;return <Page title={s.data?.name||'Category'} subtitle={`${s.data?.items?.length||0} dishes`}><ErrorBox error={s.error}/><div className="menu-list">{(s.data?.items||[]).filter(x=>x.available).map(i=><MenuItemCard key={i.id} item={i} token={tableToken}/>)}</div></Page>}
