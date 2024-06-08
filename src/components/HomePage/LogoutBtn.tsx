import Cookies from 'js-cookie';

function LogoutBtn() {
    return (
        <div><button className='btn btn-secondary' onClick={() => {
            Cookies.remove('token');
            window.location.reload();
        }}>Logout</button></div>
    )
}

export default LogoutBtn