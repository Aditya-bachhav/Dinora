import { Link, useParams } from 'react-router-dom';
import { useAsync } from '../../hooks/useAsync';
import { api } from '../../services/api';
import { Page, Card, ErrorBox, Loading } from '../../components/Ui';
import { tablePath } from '../../utils/routes';
export default function TableHome(){const{tableToken}=useParams();const s=useAsync(()=>api.table(tableToken),[tableToken]);if(s.loading)return <Page title="Table"><Loading/></Page>;if(s.error)return <Page title="Table access"><ErrorBox error={s.error}/><Card><p>This table QR is invalid or the table is not registered.</p><Link className="btn secondary" to="/">Back</Link></Card></Page>;return <div className="table-confirm-page"><div className="table-confirm-brand">DINORA</div><div className="table-icon">♜</div><p className="eyebrow">You’re at table</p><h1>A{s.data.table.number}</h1><p className="table-question">Correct table?</p><p className="table-help">The restaurant will create your table session and let you share the order with your table.</p><Link className="btn primary full" to={tablePath(tableToken,'/menu')}>Yes, Continue</Link><Link className="text-link" to="/">Change Table</Link></div>}
