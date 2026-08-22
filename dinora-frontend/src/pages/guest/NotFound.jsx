import { Link } from 'react-router-dom';
import { Page } from '../../components/Ui';

export default function NotFound(){return <Page title="404" subtitle="Route not found"><Link className="btn primary" to="/">Home</Link></Page>}
