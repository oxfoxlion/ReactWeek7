import { useState, useEffect, useRef } from "react"
import { Modal } from 'bootstrap';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { pushMessage } from "../../slices/toastSlice";


const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalState = { //設定新增產品Modal內的初始資料
    imageUrl: "...",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [""]
};


function DeleteProductModal({ getProducts, closeDeleteProductModal, deleteProductModalRef, tempProduct }) {

    const disPatch = useDispatch();

    // 刪除產品API
    const deleteProduct = async (id) => {
        try {
            const res = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${id}`)
            getProducts();
            disPatch(pushMessage({
                text: '刪除成功',
                status: 'success'
            }))
        }
        catch (error) {

            const { message } = error.response.data;

            disPatch(pushMessage({
                text: message.join('，'),
                status: 'failed'
            }))
        }
    }

    const handleDeleteProduct = (id) => {
        deleteProduct(id);
        closeDeleteProductModal();
    }

    return (
        <div
            className="modal fade"
            id="delProductModal"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            ref={deleteProductModalRef}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">刪除產品</h1>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={closeDeleteProductModal}
                        ></button>
                    </div>
                    <div className="modal-body">
                        你是否要刪除
                        <span className="text-danger fw-bold">{tempProduct.title}</span>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={closeDeleteProductModal}
                        >
                            取消
                        </button>
                        <button type="button" className="btn btn-danger" onClick={() => handleDeleteProduct(tempProduct.id)}>
                            刪除
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Pagination({ pageInfo, getProducts }) {

    // 取得不同頁碼的產品資訊
    const handlePageChange = (e, page) => {
        e.preventDefault();
        getProducts(page);
    }


    return (<div className="d-flex justify-content-center">
        <nav>
            <ul className="pagination">
                <li className="page-item">
                    <a className={`page-link ${pageInfo.has_pre ? '' : 'disabled'}`} href="#" onClick={(e) => handlePageChange(e, pageInfo.current_page - 1)}>
                        上一頁
                    </a>
                </li>

                {Array.from({ length: pageInfo.total_pages }).map((item, index) => (
                    <li className={`page-item ${pageInfo.current_page === index + 1 && 'active'}`} key={index}>
                        <a className="page-link" href="#" onClick={(e) => handlePageChange(e, index + 1)}>
                            {index + 1}
                        </a>
                    </li>
                ))

                }

                <li className="page-item">
                    <a className={`page-link ${pageInfo.has_next ? '' : 'disabled'}`} href="#" onClick={(e) => handlePageChange(e, pageInfo.current_page + 1)}>
                        下一頁
                    </a>
                </li>

            </ul>
        </nav>
    </div>)
}

function ProductModal({ setTempProduct, tempProduct, getProducts, closeProductModal, productModalRef, modalMode }) {

    const disPatch = useDispatch();

    // 表單控制
    const handleModalInputChange = (e) => {
        const { value, name, type, checked } = e.target;

        setTempProduct({
            ...tempProduct, [name]: type === "checkbox" ? checked : value //如果這個input的type是checkbox就回傳checked，否則回傳value
        })
    }

    const handleImageUrlInputChange = (e, index) => {
        const { value } = e.target;

        const newImages = [...tempProduct.imagesUrl]; //把原本的imagesUrl抓出來

        newImages[index] = value; //利用index找到要修改的是第幾個imagesUrl，接著把valuse帶入newImagesUrl

        setTempProduct({
            ...tempProduct, imagesUrl: newImages
        })
    }

    // 新增圖片
    const handleAddImage = () => {
        const newImages = [...tempProduct.imagesUrl, ''];

        setTempProduct({
            ...tempProduct, imagesUrl: newImages
        })
    }
    // 取消圖片
    const handleRemoveImage = () => {
        const newImages = [...tempProduct.imagesUrl];

        newImages.pop();//移除最後一個值

        setTempProduct({
            ...tempProduct, imagesUrl: newImages
        })
    }

    // 新增產品API

    const createProduct = async () => {
        try {

            const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/product`, {
                data: {
                    ...tempProduct,
                    origin_price: Number(tempProduct.origin_price),
                    price: Number(tempProduct.price),
                    is_enabled: tempProduct.is_enabled ? 1 : 0
                }
            })
            disPatch(pushMessage({
                text: '新增產品成功',
                status: 'success'
            }))

            getProducts();

        } catch (error) {
            const { message } = error.response.data;

            disPatch(pushMessage({
                text: message.join('，'),
                status: 'failed'
            }))
        }
    }

    const handleCreateProduct = () => {
        createProduct();
        closeProductModal();
    }

    // 編輯產品API

    const editProduct = async (id) => {
        try {
            const res = await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${id}`, {
                data: {
                    ...tempProduct,
                    origin_price: Number(tempProduct.origin_price),
                    price: Number(tempProduct.price),
                    is_enabled: tempProduct.is_enabled ? 1 : 0
                }
            })

            disPatch(pushMessage({
                text: '更新成功',
                status: 'success'
            }))

            getProducts();
        }
        catch (error) {
            disPatch(pushMessage({
                text: '更新失敗',
                status: 'failed'
            }))
        }
    }

    const handleEditProduct = (id) => {
        editProduct(id);
        closeProductModal();
    }

    // 圖片上傳
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file-to-upload', file);

        try {
            const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/upload`, formData);

            const uploadImageUrl = res.data.imageUrl;
            setTempProduct({ ...tempProduct, imageUrl: uploadImageUrl });
        } catch (error) {
            alert('上傳失敗');
        }
    }


    return (
        <div id="productModal" className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} ref={productModalRef}>
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content border-0 shadow">
                    <div className="modal-header border-bottom">
                        <h5 className="modal-title fs-4">新增產品</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={closeProductModal}></button>
                    </div>

                    <div className="modal-body p-4">
                        <div className="row g-4">
                            <div className="col-md-4">
                                <div className="mb-4">
                                    <div className="mb-5">
                                        <label htmlFor="fileInput" className="form-label"> 圖片上傳 </label>
                                        <input
                                            type="file"
                                            accept=".jpg,.jpeg,.png"
                                            className="form-control"
                                            id="fileInput"
                                            onChange={(e) => handleFileChange(e)}
                                        />
                                    </div>
                                    <label htmlFor="create-primary-image" className="form-label">
                                        主圖
                                    </label>
                                    <div className="input-group">
                                        <input
                                            value={tempProduct.imageUrl}
                                            onChange={handleModalInputChange}
                                            name="imageUrl"
                                            type="text"
                                            id="create-primary-image"
                                            className="form-control"
                                            placeholder="請輸入圖片連結"
                                        />
                                    </div>
                                    <img
                                        src={tempProduct.imageUrl}
                                        alt={tempProduct.title}
                                        className="img-fluid"
                                    />
                                </div>

                                {/* 副圖 */}
                                <div className="border border-2 border-dashed rounded-3 p-3">
                                    {tempProduct.imagesUrl?.map((image, index) => (
                                        <div key={index} className="mb-2">
                                            <label
                                                htmlFor={`create-imagesUrl-${index + 1}`}
                                                className="form-label"
                                            >
                                                副圖 {index + 1}
                                            </label>
                                            <input
                                                value={image}
                                                onChange={(e) => handleImageUrlInputChange(e, index)}
                                                id={`create-imagesUrl-${index + 1}`}
                                                type="text"
                                                placeholder={`圖片網址 ${index + 1}`}
                                                className="form-control mb-2"
                                            />
                                            {image && (
                                                <img
                                                    src={image}
                                                    alt={`副圖 ${index + 1}`}
                                                    className="img-fluid mb-2"
                                                />
                                            )}
                                        </div>
                                    ))}

                                    <div className="btn-group w-100">
                                        {tempProduct.imagesUrl.length < 5 && tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1] !== '' && (<button className="btn btn-outline-primary btn-sm w-100" onClick={handleAddImage}>新增圖片</button>)}
                                        {tempProduct.imagesUrl.length > 1 && (
                                            <button className="btn btn-outline-danger btn-sm w-100" onClick={handleRemoveImage}>取消圖片</button>
                                        )}
                                    </div>

                                </div>
                            </div>

                            <div className="col-md-8">
                                <div className="mb-3">
                                    <label htmlFor="create-title" className="form-label">
                                        標題
                                    </label>
                                    <input
                                        value={tempProduct.title}
                                        onChange={handleModalInputChange}
                                        name="title"
                                        id="create-title"
                                        type="text"
                                        className="form-control"
                                        placeholder="請輸入標題"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="create-category" className="form-label">
                                        分類
                                    </label>
                                    <input
                                        value={tempProduct.category}
                                        onChange={handleModalInputChange}
                                        name="category"
                                        id="create-category"
                                        type="text"
                                        className="form-control"
                                        placeholder="請輸入分類"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="create-unit" className="form-label">
                                        單位
                                    </label>
                                    <input
                                        value={tempProduct.unit}
                                        onChange={handleModalInputChange}
                                        name="unit"
                                        id="create-unit"
                                        type="text"
                                        className="form-control"
                                        placeholder="請輸入單位"
                                    />
                                </div>

                                <div className="row g-3 mb-3">
                                    <div className="col-6">
                                        <label htmlFor="create-origin_price" className="form-label">
                                            原價
                                        </label>
                                        <input
                                            value={tempProduct.origin_price}
                                            onChange={handleModalInputChange}
                                            name="origin_price"
                                            id="create-origin_price"
                                            type="number"
                                            className="form-control"
                                            placeholder="請輸入原價"
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="create-price" className="form-label">
                                            售價
                                        </label>
                                        <input
                                            value={tempProduct.value}
                                            onChange={handleModalInputChange}
                                            name="price"
                                            id="create-price"
                                            type="number"
                                            className="form-control"
                                            placeholder="請輸入售價"
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="create-description" className="form-label">
                                        產品描述
                                    </label>
                                    <textarea
                                        value={tempProduct.description}
                                        onChange={handleModalInputChange}
                                        name="description"
                                        id="create-description"
                                        className="form-control"
                                        rows={4}
                                        placeholder="請輸入產品描述"
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="create-content" className="form-label">
                                        說明內容
                                    </label>
                                    <textarea
                                        value={tempProduct.content}
                                        onChange={handleModalInputChange}
                                        name="content"
                                        id="create-content"
                                        className="form-control"
                                        rows={4}
                                        placeholder="請輸入說明內容"
                                    ></textarea>
                                </div>

                                <div className="form-check">
                                    <input
                                        checked={tempProduct.is_enabled}
                                        onChange={handleModalInputChange}
                                        name="is_enabled"
                                        type="checkbox"
                                        className="form-check-input"
                                        id="create-isEnabled"
                                    />
                                    <label className="form-check-label" htmlFor="create-isEnabled">
                                        是否啟用
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer border-top bg-light">
                        <button type="button" className="btn btn-secondary" onClick={closeProductModal}>
                            取消
                        </button>
                        <button type="button" className="btn btn-primary" onClick={modalMode === 'create' ? handleCreateProduct : () => handleEditProduct(tempProduct.id)}>
                            確認
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function AdminProducts() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [pageInfo, setPageInfo] = useState(''); //用來記錄API回傳的page資訊
    const [modalMode, setModalMode] = useState('');
    const [tempProduct, setTempProduct] = useState(defaultModalState); //紀錄準備要送出的產品資訊
    const productModalRef = useRef(null);
    const deleteProductModalRef = useRef(null);
    const disPatch = useDispatch();

    const getProducts = async (page = 1) => {
        try {
            const res = await axios.get(
                `${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`
            );
            setProducts(res.data.products);
            setPageInfo(res.data.pagination);
        } catch (error) {
            disPatch(pushMessage({
                text: '取得產品列表失敗',
                status: 'failed'
            }))
        }
    };

    useEffect(() => {
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)shaoToken\s*=\s*([^;]*).*$)|^.*$/,
            "$1"
        );
        axios.defaults.headers.common.Authorization = token;

        checkAdmin();
    }, []);

    const checkAdmin = async () => {
        try {
            await axios.post(`${BASE_URL}/api/user/check`);
            getProducts();
        } catch (err) {
            alert('登入驗證失敗');
            navigate("/");
        }
    };

    useEffect(() => {

        new Modal(productModalRef.current, {
            backdrop: false //防止點擊背景時關閉Modal
        });

    }, [])

    useEffect(() => {
        new Modal(deleteProductModalRef.current, {
            backdrop: false //防止點擊背景時關閉Modal
        });

    }, [])

    // 打開刪除產品Modal
    const openDeleteProductModal = (product) => {
        setTempProduct(product)

        const modalInstance = Modal.getInstance(deleteProductModalRef.current);
        modalInstance.show();
    }
    // 關閉刪除產品Modal
    const closeDeleteProductModal = () => {
        const modalInstance = Modal.getInstance(deleteProductModalRef.current);
        modalInstance.hide();
    }

    // 打開Modal
    const openProductModal = (mode, product) => {

        setModalMode(mode);
        setTempProduct(product);

        const modalInstance = Modal.getInstance(productModalRef.current);
        modalInstance.show();
    }
    // 關閉Modal
    const closeProductModal = () => {
        const modalInstance = Modal.getInstance(productModalRef.current);
        modalInstance.hide();
    }

    const handleLogout =async () =>{
        try{
            const response =await axios.post(`${BASE_URL}/v2/logout`);

            navigate('/')
        }catch(error){
            disPatch(pushMessage({
                text: '登出失敗',
                status: 'failed'
            }))
            
        }
    }


    return (
        <>
            <div className="container py-5">
                {/* 登出按鈕 */}
                <div className="row mb-3">
                    <div className="justify-content-end">
                        <button type="button" className="btn btn-secondary" onClick={()=>handleLogout()}>
                            登出
                        </button>
                    </div>
                </div>
                {/* 產品列表 */}
                <div className="row">
                    <div className="col">
                        <div className="d-flex justify-content-between align-items-center">
                            <h2>產品列表</h2>
                            <button type="button" className="btn btn-primary" onClick={() => openProductModal('create', defaultModalState)}>建立新的產品</button>
                        </div>

                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">產品名稱</th>
                                    <th scope="col">原價</th>
                                    <th scope="col">售價</th>
                                    <th scope="col">是否啟用</th>
                                    <th scope="col">編輯</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <th scope="row">{product.title}</th>
                                        <td>{product.origin_price}</td>
                                        <td>{product.price}</td>
                                        {product.is_enabled ? <td className="text-success">已啟用</td> : <td className="text-danger">未啟用</td>}
                                        <td>
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => openProductModal('edit', product)}>編輯</button>
                                                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => openDeleteProductModal(product)}>刪除</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <Pagination pageInfo={pageInfo} getProducts={getProducts}></Pagination>

                    </div>
                </div>
            </div>

            <ProductModal setTempProduct={setTempProduct}
                tempProduct={tempProduct}
                getProducts={getProducts}
                closeProductModal={closeProductModal}
                productModalRef={productModalRef}
                modalMode={modalMode}
            ></ProductModal>

            <DeleteProductModal getProducts={getProducts}
                closeDeleteProductModal={closeDeleteProductModal}
                deleteProductModalRef={deleteProductModalRef}
                tempProduct={tempProduct}
            ></DeleteProductModal>


        </>
    )
}