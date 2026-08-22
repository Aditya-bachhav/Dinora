import {Outlet,useParams} from 'react-router-dom';
import {GuestNav} from '../components/Navigation';
export default function GuestLayout(){const {tableToken}=useParams();return <><GuestNav token={tableToken}/><Outlet/></>}
