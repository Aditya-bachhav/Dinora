import { Link, useParams } from 'react-router-dom';
import { Page, Card } from '../../components/Ui';
import { tablePath } from '../../utils/routes';

export default function ThankYou(){const{tableToken}=useParams();const q=new URLSearchParams(location.search);return <Page title="Order received"><Card className="center"><div className="success">✓</div><h2>Order #{q.get('order')}</h2><p>The kitchen has received it. Status will move automatically.</p><Link className="btn primary" to={tablePath(tableToken,'/orders')}>Track order</Link></Card></Page>}
