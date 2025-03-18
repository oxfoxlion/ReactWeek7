import { Link, Outlet } from "react-router-dom"

export default function FrontLayout() {
    return (
        <>
            <header>
                <nav className="bg-body-tertiary py-2">
                    <div className="container d-flex justify-content-start align-items-center gap-3">
                            <Link className="h5 link-underline link-underline-opacity-0 text-secondary" to="/">首頁</Link>
                            <Link className="h5 link-underline link-underline-opacity-0 text-secondary" to="/products">產品列表</Link>
                            <Link className="h5 link-underline link-underline-opacity-0 text-secondary" to="/carts">購物車</Link>
                            <Link className="h5 link-underline link-underline-opacity-0 text-secondary" to="/login">管理員登入</Link>
                    </div>
                </nav>
            </header>
            <main>
                <Outlet></Outlet>
            </main>
        </>

    )
}