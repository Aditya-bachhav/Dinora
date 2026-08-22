import { useParams } from 'react-router-dom';
import { useAsync } from '../../hooks/useAsync';
import { api } from '../../services/api';
import { Page, Card, ErrorBox, Loading, Status } from '../../components/Ui';
import { money } from '../../utils/routes';

export default function OrderDetail(){const{orderId}=useParams();const s=useAsync(()=>api.order(orderId),[orderId]);if(s.loading)return <Page title="Order"><Loading/></Page>;if(s.error)return <Page title="Order"><ErrorBox error={s.error}/></Page>;return <Page title={`Order #${s.data.id}`} subtitle="Automatic kitchen workflow"><Card><div className="stat-grid"><div><span>Table</span><strong>#{s.data.table_number}</strong></div><div><span>Status</span><Status value={s.data.status}/></div><div><span>Total</span><strong>{money(s.data.total_amount)}</strong></div></div><div className="order-items">{s.data.items.map(i=><div className="list-row" key={i.id}><span>{i.name} × {i.quantity}</span><strong>{money(i.line_total)}</strong></div>)}</div></Card></Page>}
