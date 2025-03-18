import { Link, Outlet } from "react-router-dom"
import Toast from "../components/toast"

export default function AdminLayout() {
    return (
        <>
            <header>
                <nav className="bg-body-tertiary py-2">
                    <div className="container d-flex justify-content-start align-items-center gap-3">
                            <Link className="h5 link-underline link-underline-opacity-0 text-secondary" to="/admin">管理產品</Link>
                            <Link className="h5 link-underline link-underline-opacity-0 text-secondary" to="/admin/orders">管理訂單</Link>
                            <Link className="h5 link-underline link-underline-opacity-0 text-secondary" to="/">回到網站</Link>
                    </div>
                </nav>
            </header>
            <main>
                <Outlet></Outlet>
                <Toast></Toast>
            </main>
        </>

    )
}