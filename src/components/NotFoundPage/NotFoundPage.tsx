import { Link } from "react-router-dom"
function NotFoundPage() {
    return (
        <>
            <center><h1>Page Not Found!</h1></center>
            <Link to="/">Home</Link>
        </>
    )
}

export default NotFoundPage