import axios from "axios"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Login() {

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    // 提交表單
    const onSubmit = handleSubmit((data) => {


        const checkoutData = {
            user: {
                username: data.email,
                password: data.password,
            }
        }

        // console.log(checkoutData.user);
        toLogin(checkoutData.user);
        reset();

    });


    const toLogin = async (data) => {
        try {
            const response = await axios.post(`${BASE_URL}/v2/admin/signin`, data);
            const { token, expired } = response.data;

            document.cookie = `shaoToken=${token};expires=${new Date(expired)};`;
            axios.defaults.headers.common.Authorization = `${token}`;

            navigate("/admin");
        } catch (error) {
            alert('登入失敗')
        }
    }

    return (
        <div className="container py-3">
            <h2 className="mb-3 text-bold">登入</h2>
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className={`form-control ${errors.email && 'is-invalid'}`} id="email" name="email" placeholder="請輸入Email"
                        {...register('email', {
                            required: 'email欄位必填',
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: 'email格式錯誤'
                            }
                        })} />
                    {errors.email && <p className="text-danger my-3">{errors.email.message}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className={`form-control ${errors.password && 'is-invalid'}`} id="password" name="password" placeholder="請輸入Password"
                    {...register('password', {
                        required: 'password欄位必填'
                    })}  />
                    {errors.password && <p className="text-danger my-3">{errors.password.message}</p>}
                </div>
                <button type="submit" className="btn btn-primary">登入</button>
            </form>
        </div>
    )
}